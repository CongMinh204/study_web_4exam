// Trang chủ: thư viện môn học, biểu đồ hoạt động, demo nhập nhanh, CTA tạo môn học.
(function () {
  const { store, study, icon } = App;
  const { esc, reveal, menu, confirm, toast, subjectDialog, modal, subjectIcon } = App.ui;

  document.addEventListener("DOMContentLoaded", () => {
    renderSubjects();
    renderActivity();
    wireModeLinks();
    wireImportDemo();
    wireCta();

    document.getElementById("subject-search").addEventListener("input", (e) => renderSubjects(e.target.value));
    document.addEventListener("click", async (e) => {
      if (e.target.closest('[data-action="new-subject"]')) {
        const s = await subjectDialog();
        if (s) {
          toast(`Đã tạo môn "${s.name}"`);
          renderSubjects();
        }
      }
    });
  });

  // ---------- Lưới môn học ----------
  function renderSubjects(query = "") {
    const host = document.getElementById("subject-grid");
    const q = study.normalizeAnswer(query, { ignoreDiacritics: true });
    const all = store.subjects();
    const list = q ? all.filter((s) => study.normalizeAnswer(`${s.name} ${s.description}`, { ignoreDiacritics: true }).includes(q)) : all;

    if (!all.length) {
      host.innerHTML = `
        <div class="empty" data-reveal>
          ${icon("book")}
          <h3 class="h3">Chưa có môn học nào</h3>
          <p>Tạo môn học đầu tiên, sau đó thêm học phần thẻ nhớ để bắt đầu ôn tập.</p>
          <button class="btn btn-primary" type="button" data-action="new-subject">${icon("plus")}Thêm môn học</button>
        </div>`;
      reveal(host);
      return;
    }
    if (!list.length) {
      host.innerHTML = `<div class="empty">${icon("search")}<p>Không tìm thấy môn học nào khớp với “${esc(query)}”.</p></div>`;
      return;
    }

    host.innerHTML = `<div class="subjects" data-stagger>${list.map((s, i) => card(s, i === 0 && !q && list.length > 1)).join("")}
      <button class="add-card" type="button" data-action="new-subject">${icon("plus")}Thêm môn học</button></div>`;

    host.querySelectorAll("[data-menu]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const subject = store.subject(btn.dataset.menu);
        menu(btn, [
          { label: "Sửa môn học", icon: "pencil", onClick: async () => (await subjectDialog(subject)) && renderSubjects(query) },
          {
            label: "Xóa môn học",
            icon: "trash",
            danger: true,
            onClick: async () => {
              const ok = await confirm({ title: `Xóa "${subject.name}"?`, message: "Tất cả học phần, thẻ và tiến độ trong môn này sẽ bị xóa vĩnh viễn.", confirmLabel: "Xóa môn học", danger: true });
              if (!ok) return;
              store.deleteSubject(subject.id);
              toast("Đã xóa môn học");
              renderSubjects(query);
            },
          },
        ]);
      })
    );
    reveal(host);
  }

  function card(s, featured) {
    const st = store.subjectStats(s.id);
    const sets = store.sets(s.id);
    const main = `
      <div class="subject-card__top">
        ${subjectIcon(s)}
        <button class="icon-btn subject-card__menu" type="button" data-menu="${s.id}" aria-label="Tùy chọn cho ${esc(s.name)}">${icon("more")}</button>
      </div>
      <div class="subject-card__body">
        <h3 class="subject-card__name">${esc(s.name)}</h3>
        ${s.description ? `<p class="subject-card__desc">${esc(s.description)}</p>` : ""}
        <div class="subject-card__meta"><span>${st.sets} học phần · ${st.cards} thẻ</span><span>Đã thuộc ${st.percent}%</span></div>
        <div class="bar"><i style="width:${st.percent}%"></i></div>
      </div>`;
    const link = `<a class="subject-card__link" href="subject.html?id=${s.id}" aria-label="Mở môn ${esc(s.name)}"></a>`;
    const arrow = `<span class="subject-card__arrow">${icon("arrow-up-right")}</span>`;

    if (featured) {
      const items = sets.length
        ? sets
            .slice(0, 4)
            .map((t) => `<a href="set.html?id=${t.id}"><span>${esc(t.title)}</span><span>${store.cards(t.id).length} thẻ</span></a>`)
            .join("")
        : `<p class="muted" style="margin:0;font-size:14px">Chưa có học phần nào.</p>`;
      return `<article class="subject-card subject-card--featured">${link}<div class="subject-card__main">${main}</div><div class="subject-card__sets">${items}</div></article>`;
    }
    return `<article class="subject-card">${link}${main}${arrow}</article>`;
  }

  // ---------- Liên kết "Thử ngay" tới học phần đầu tiên ----------
  function wireModeLinks() {
    const first = store.sets()[0];
    if (!first) return;
    document.querySelectorAll("[data-mode-link]").forEach((a) => {
      a.href = `${a.dataset.modeLink}.html?set=${first.id}`;
    });
  }

  // ---------- Biểu đồ hoạt động 14 ngày ----------
  function renderActivity() {
    const svg = document.getElementById("activity-chart");
    const data = store.activity(14);
    const real = data.some((d) => d.count > 0);
    const values = real ? data.map((d) => d.count) : [6, 9, 7, 14, 12, 18, 15, 22, 19, 28, 24, 31, 27, 36];
    if (!real) document.getElementById("activity-desc").textContent = "Ví dụ minh họa — số lượt ôn mỗi ngày của bạn sẽ hiện ở đây khi bạn bắt đầu học.";

    const W = 1000;
    const H = 260;
    const top = 24;
    const bottom = 16;
    const max = Math.max(...values, 1);
    const pts = values.map((v, i) => [(i / (values.length - 1)) * W, top + (1 - v / max) * (H - top - bottom)]);

    // Đường cong mượt (Catmull-Rom → Bézier)
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
    }
    const grid = [0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${W}" y1="${top + f * (H - top - bottom)}" y2="${top + f * (H - top - bottom)}" stroke="rgba(255,255,255,0.06)" vector-effect="non-scaling-stroke"/>`).join("");
    svg.innerHTML = `
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#0099ff" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#0099ff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${grid}
      <path d="${d} L${W},${H} L0,${H} Z" fill="url(#area)"/>
      <path d="${d}" fill="none" stroke="#0099ff" stroke-width="2.5" vector-effect="non-scaling-stroke" style="filter: drop-shadow(0 0 8px rgba(0,153,255,.7))"/>`;
  }

  // ---------- Demo nhập nhanh ----------
  function wireImportDemo() {
    const input = document.getElementById("import-text");
    const out = document.getElementById("import-preview");
    const count = document.getElementById("import-count");
    const update = () => {
      const cards = study.parseImport(input.value);
      count.textContent = `${cards.length} thẻ`;
      out.innerHTML = cards.length
        ? cards
            .map((c, i) => `<div class="preview-item"><span>${String(i + 1).padStart(2, "0")}</span><b>${esc(c.term)}</b><span>${esc(c.definition) || '<em class="subtle">(chưa có định nghĩa)</em>'}</span></div>`)
            .join("")
        : `<p class="muted" style="margin:0;font-size:14px">Dán danh sách vào ô bên trái để xem trước.</p>`;
    };
    input.addEventListener("input", update);
    input.addEventListener("keydown", (e) => {
      // Cho phép gõ Tab trong ô nhập để làm dấu phân cách
      if (e.key !== "Tab" || e.shiftKey) return;
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b, value } = input;
      input.value = value.slice(0, a) + "\t" + value.slice(b);
      input.selectionStart = input.selectionEnd = a + 1;
      update();
    });
    update();

    document.querySelector('[data-action="import-save"]').addEventListener("click", () => {
      const cards = study.parseImport(input.value);
      if (!cards.length) {
        toast("Chưa có thẻ nào để lưu");
        input.focus();
        return;
      }
      saveImportDialog(cards);
    });
  }

  function saveImportDialog(cards) {
    const subjects = store.subjects();
    const options = subjects.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("") + `<option value="__new">+ Môn học mới…</option>`;
    modal({
      title: "Lưu thành học phần",
      sub: `${cards.length} thẻ sẽ được thêm vào học phần mới.`,
      body: `
        <div class="field"><label for="imp-title">Tên học phần</label><input class="input" id="imp-title" maxlength="80" placeholder="Ví dụ: Từ vựng Sinh học" /></div>
        <div class="field"><label for="imp-subject">Môn học</label><select class="select" id="imp-subject">${options}</select></div>
        <div class="field" id="imp-new-wrap" hidden><label for="imp-new">Tên môn học mới</label><input class="input" id="imp-new" maxlength="60" /></div>`,
      onOpen(panel) {
        const sel = panel.querySelector("#imp-subject");
        const toggle = () => (panel.querySelector("#imp-new-wrap").hidden = sel.value !== "__new");
        sel.addEventListener("change", toggle);
        toggle();
      },
      actions: [
        { label: "Hủy", onClick: (close) => close() },
        {
          label: "Lưu học phần",
          variant: "btn-primary",
          onClick: (close, panel) => {
            const title = panel.querySelector("#imp-title");
            if (!title.value.trim()) return title.focus();
            let subjectId = panel.querySelector("#imp-subject").value;
            if (subjectId === "__new") {
              const name = panel.querySelector("#imp-new");
              if (!name.value.trim()) return name.focus();
              subjectId = store.createSubject({ name: name.value, icon: "book", color: "#0099ff" }).id;
            }
            const set = store.createSet({ subjectId, title: title.value }, cards);
            close();
            location.href = `set.html?id=${set.id}`;
          },
        },
      ],
    });
  }

  // ---------- CTA: tạo môn học nhanh ----------
  function wireCta() {
    const form = document.getElementById("cta-form");
    const input = document.getElementById("cta-input");
    const send = form.querySelector(".prompt__send");
    const sync = () => (send.disabled = !input.value.trim());
    input.addEventListener("input", sync);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      const s = store.createSubject({ name, icon: "book", color: "#0099ff" });
      location.href = `subject.html?id=${s.id}&new=1`;
    });
    document.querySelectorAll(".suggestion").forEach((b) =>
      b.addEventListener("click", () => {
        input.value = b.textContent;
        sync();
        input.focus();
      })
    );
  }
})();
