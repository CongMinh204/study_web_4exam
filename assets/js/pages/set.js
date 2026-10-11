// Trang học phần: chọn chế độ học, tiến độ, danh sách thẻ, kết quả kiểm tra.
(function () {
  const { store, study, icon } = App;
  const { esc, param, reveal, menu, confirm, toast, speak, notFound, MODES } = App.ui;

  let filter = "all";
  let current = null; // { set, cards } của lần render gần nhất

  document.addEventListener("DOMContentLoaded", () => {
    render();
    bindDelegated(document.getElementById("app"));
  });

  function render() {
    const app = document.getElementById("app");
    const set = store.set(param("id"));
    if (!set) {
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    const subject = store.subject(set.subjectId);
    document.title = `${set.title} — Recall`;
    const cards = store.cards(set.id);
    const st = store.setStats(set.id);
    const results = store.results(set.id).slice(0, 5);

    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb" data-reveal>
        <a href="index.html#subjects">Môn học</a>${icon("chevron-right")}
        ${subject ? `<a href="subject.html?id=${subject.id}">${esc(subject.name)}</a>${icon("chevron-right")}` : ""}
        <span aria-current="page">${esc(set.title)}</span>
      </nav>
      <div class="page-head">
        <div data-reveal>
          <h1 class="h2">${esc(set.title)}</h1>
          <p class="lede" style="margin-top:12px">${set.description ? esc(set.description) + " · " : ""}${cards.length} thẻ</p>
        </div>
        <div class="page-head__actions" data-reveal style="--delay:100ms">
          <a class="btn btn-secondary" href="edit.html?set=${set.id}">${icon("pencil")}Sửa thẻ</a>
          <button class="btn btn-secondary btn-icon" type="button" data-act="more" aria-label="Tùy chọn khác">${icon("more")}</button>
        </div>
      </div>

      <div class="modes" data-stagger>
        ${MODES.map((m) => {
          const off = !cards.length || ((m.key === "match" || m.key === "test") && cards.length < 2);
          return `<a class="mode ${off ? "is-disabled" : ""}" href="${m.key}.html?set=${set.id}" ${off ? 'aria-disabled="true" tabindex="-1"' : ""}>
            <span class="subject-icon">${icon(m.icon)}</span>
            <span><span class="mode__name">${m.label}</span><br /><span class="mode__desc">${m.desc}</span></span>
          </a>`;
        }).join("")}
      </div>

      ${
        cards.length
          ? `
      <section class="block" aria-labelledby="progress-title">
        <div class="block__head" data-reveal>
          <h2 class="block__title" id="progress-title">Tiến độ</h2>
          <button class="btn btn-ghost btn-sm" type="button" data-act="reset">${icon("rotate")}Đặt lại</button>
        </div>
        <div class="mastery" data-stagger>
          <div class="mastery__item"><b>${st.new}</b><span class="chip chip--new">Chưa học</span></div>
          <div class="mastery__item"><b>${st.learning}</b><span class="chip chip--learning">Đang học</span></div>
          <div class="mastery__item"><b>${st.mastered}</b><span class="chip chip--mastered">Đã thuộc</span></div>
        </div>
        <div class="bar" style="margin-top:16px" data-reveal><i style="width:${st.percent}%"></i></div>
      </section>`
          : ""
      }

      <section class="block" aria-labelledby="cards-title">
        <div class="block__head" data-reveal>
          <h2 class="block__title" id="cards-title">Thẻ trong học phần</h2>
          ${
            cards.length
              ? `<div class="segmented" role="group" aria-label="Lọc thẻ">
            <button type="button" data-filter="all" aria-pressed="${filter === "all"}">Tất cả (${cards.length})</button>
            <button type="button" data-filter="starred" aria-pressed="${filter === "starred"}">Gắn sao (${cards.filter((c) => store.progress(c.id).starred).length})</button>
          </div>`
              : ""
          }
        </div>
        <div id="term-list"></div>
      </section>

      ${
        results.length
          ? `
      <section class="block" aria-labelledby="results-title">
        <div class="block__head" data-reveal><h2 class="block__title" id="results-title">Kết quả kiểm tra gần đây</h2></div>
        <div class="results" data-stagger>
          ${results
            .map(
              (r) => `<div class="result-row"><span>${new Date(r.takenAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</span>
              <span class="muted">${r.correctCount}/${r.total} câu đúng</span><b style="color:${r.score >= 80 ? "var(--success)" : r.score >= 50 ? "#ffb547" : "var(--danger)"}">${r.score}%</b></div>`
            )
            .join("")}
        </div>
      </section>`
          : ""
      }`;

    current = { set, cards };
    renderTerms(set, cards);
    wire(app, set, cards);
    reveal(app);
  }

  function renderTerms(set, cards) {
    const host = document.getElementById("term-list");
    if (!cards.length) {
      host.innerHTML = `<div class="empty">${icon("layers")}<p>Học phần chưa có thẻ nào. Thêm thẻ để bắt đầu ôn tập.</p><a class="btn btn-primary" href="edit.html?set=${set.id}">${icon("plus")}Thêm thẻ</a></div>`;
      return;
    }
    const list = filter === "starred" ? cards.filter((c) => store.progress(c.id).starred) : cards;
    if (!list.length) {
      host.innerHTML = `<div class="empty">${icon("star")}<p>Chưa có thẻ gắn sao. Nhấn biểu tượng ngôi sao ở mỗi thẻ để đánh dấu thẻ khó.</p></div>`;
      return;
    }
    host.innerHTML = `<div class="term-list" data-stagger="40">${list
      .map((c) => {
        const p = store.progress(c.id);
        const m = study.masteryOf(p.box);
        return `<div class="term">
          <div class="term__term">${esc(c.term)}<div style="margin-top:8px"><span class="chip chip--${m}">${study.MASTERY_LABEL[m]}</span></div></div>
          <div class="term__def">${esc(c.definition)}</div>
          <div class="term__actions">
            <button class="icon-btn" type="button" data-speak="${c.id}" aria-label="Phát âm ${esc(c.term)}">${icon("volume")}</button>
            <button class="icon-btn ${p.starred ? "is-active" : ""}" type="button" data-star="${c.id}" aria-pressed="${p.starred}" aria-label="Gắn sao">${icon("star")}</button>
          </div>
        </div>`;
      })
      .join("")}</div>`;
    reveal(host);
  }

  // Gắn một lần cho các nút sinh động trong danh sách thẻ
  function bindDelegated(app) {
    app.addEventListener("click", (e) => {
      if (!current) return;
      const { set, cards } = current;
      const sp = e.target.closest("[data-speak]");
      if (sp) speak(store.card(sp.dataset.speak).term);
      const star = e.target.closest("[data-star]");
      if (star) {
        const on = store.toggleStar(star.dataset.star);
        star.classList.toggle("is-active", on);
        star.setAttribute("aria-pressed", String(on));
        const btn = app.querySelector('[data-filter="starred"]');
        btn.textContent = `Gắn sao (${cards.filter((c) => store.progress(c.id).starred).length})`;
        if (filter === "starred") renderTerms(set, cards);
      }
      const f = e.target.closest("[data-filter]");
      if (f) {
        filter = f.dataset.filter;
        app.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === f)));
        renderTerms(set, cards);
      }
    });
  }

  function wire(app, set, cards) {
    const reset = app.querySelector('[data-act="reset"]');
    reset &&
      reset.addEventListener("click", async () => {
        const ok = await confirm({ title: "Đặt lại tiến độ?", message: "Mọi thẻ sẽ trở về trạng thái “Chưa học”. Thẻ gắn sao vẫn được giữ.", confirmLabel: "Đặt lại", danger: true });
        if (!ok) return;
        store.resetProgress(set.id);
        toast("Đã đặt lại tiến độ");
        render();
      });

    const more = app.querySelector('[data-act="more"]');
    more.addEventListener("click", () =>
      menu(more, [
        {
          label: "Sao chép dạng văn bản",
          icon: "file",
          onClick: async () => {
            const text = cards.map((c) => `${c.term}\t${c.definition}`).join("\n");
            try {
              await navigator.clipboard.writeText(text);
              toast("Đã sao chép — dán vào Nhập nhanh để chia sẻ");
            } catch {
              toast("Không thể truy cập bộ nhớ tạm");
            }
          },
        },
        {
          label: "Xóa học phần",
          icon: "trash",
          danger: true,
          onClick: async () => {
            const ok = await confirm({ title: `Xóa "${set.title}"?`, message: "Tất cả thẻ, tiến độ và kết quả kiểm tra của học phần sẽ bị xóa vĩnh viễn.", confirmLabel: "Xóa học phần", danger: true });
            if (!ok) return;
            store.deleteSet(set.id);
            location.href = `subject.html?id=${set.subjectId}`;
          },
        },
      ])
    );
  }
})();
