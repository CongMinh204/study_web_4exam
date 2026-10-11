// Soạn học phần: tạo mới (?subject=ID) hoặc sửa (?set=ID).
(function () {
  const { store, study, icon } = App;
  const { esc, param, reveal, modal, toast, notFound } = App.ui;

  let cards = [];
  let dirty = false;

  document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const set = param("set") ? store.set(param("set")) : null;
    const subjects = store.subjects();
    const subjectId = set ? set.subjectId : param("subject") || subjects[0]?.id;

    if (param("set") && !set) {
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    if (!subjects.length) {
      notFound(app, { title: "Chưa có môn học", message: "Hãy tạo một môn học trước khi thêm học phần.", href: "index.html#subjects", label: "Tạo môn học" });
      return;
    }

    cards = set ? store.cards(set.id).map((c) => ({ ...c })) : [blank(), blank(), blank()];
    document.title = `${set ? "Sửa" : "Tạo"} học phần — Recall`;
    const back = set ? `set.html?id=${set.id}` : `subject.html?id=${subjectId}`;

    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb" data-reveal>
        <a href="index.html#subjects">Môn học</a>${icon("chevron-right")}
        <a href="${back}">${esc(set ? set.title : store.subject(subjectId)?.name || "Môn học")}</a>${icon("chevron-right")}
        <span aria-current="page">${set ? "Sửa thẻ" : "Học phần mới"}</span>
      </nav>
      <div class="page-head">
        <h1 class="h2" data-reveal>${set ? "Sửa học phần" : "Tạo học phần mới"}</h1>
        <div class="page-head__actions" data-reveal>
          <button class="btn btn-secondary" type="button" data-act="import">${icon("upload")}Nhập nhanh</button>
        </div>
      </div>

      <form id="editor" novalidate>
        <div class="editor-meta" data-reveal>
          <div class="field">
            <label for="set-title">Tên học phần</label>
            <input class="input" id="set-title" maxlength="80" required placeholder="Ví dụ: Từ vựng Unit 3 — Môi trường" value="${esc(set?.title || "")}" />
          </div>
          <div class="field">
            <label for="set-subject">Môn học</label>
            <select class="select" id="set-subject">${subjects.map((s) => `<option value="${s.id}" ${s.id === subjectId ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select>
          </div>
          <div class="field field--full">
            <label for="set-desc">Mô tả <span class="subtle">(không bắt buộc)</span></label>
            <input class="input" id="set-desc" maxlength="140" placeholder="Học phần này dùng để ôn gì?" value="${esc(set?.description || "")}" />
          </div>
        </div>

        <div class="block" style="margin-top:40px">
          <div class="block__head">
            <h2 class="block__title">Thẻ <span class="subtle" id="card-count"></span></h2>
            <span class="subtle hide-touch" style="font-size:13px">Nhấn Tab ở ô định nghĩa cuối để thêm thẻ</span>
          </div>
          <div class="editor-cards" id="cards"></div>
          <button class="editor-add" type="button" data-act="add">${icon("plus")}Thêm thẻ</button>
        </div>

        <div class="savebar">
          <a class="btn btn-secondary btn-lg" href="${back}">Hủy</a>
          <button class="btn btn-primary btn-lg" type="submit">${set ? "Lưu thay đổi" : "Tạo học phần"}</button>
        </div>
      </form>`;

    renderCards();
    reveal(app);

    const form = document.getElementById("editor");
    form.addEventListener("input", (e) => {
      dirty = true;
      const field = e.target.closest("[data-field]");
      if (!field) return;
      cards[Number(field.dataset.index)][field.dataset.field] = field.value;
      field.classList.remove("is-invalid");
      field.style.borderColor = "";
    });
    form.addEventListener("click", (e) => {
      const del = e.target.closest("[data-del]");
      if (del) {
        cards.splice(Number(del.dataset.del), 1);
        if (!cards.length) cards.push(blank());
        dirty = true;
        renderCards();
      }
      if (e.target.closest('[data-act="add"]')) addCard();
    });
    form.addEventListener("keydown", (e) => {
      const f = e.target.closest('[data-field="definition"]');
      if (e.key === "Tab" && !e.shiftKey && f && Number(f.dataset.index) === cards.length - 1) {
        e.preventDefault();
        addCard();
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      save(set);
    });
    app.querySelector('[data-act="import"]').addEventListener("click", importDialog);
    window.addEventListener("beforeunload", (e) => {
      if (dirty) e.preventDefault();
    });
  });

  const blank = () => ({ term: "", definition: "" });

  function renderCards() {
    const host = document.getElementById("cards");
    host.innerHTML = cards
      .map(
        (c, i) => `
      <div class="editor-card">
        <div class="editor-card__head">
          <span>${i + 1}</span>
          <button class="icon-btn" type="button" data-del="${i}" aria-label="Xóa thẻ ${i + 1}">${icon("trash")}</button>
        </div>
        <div class="editor-card__fields">
          <div class="field"><label for="t-${i}">Thuật ngữ</label><textarea class="textarea" rows="1" id="t-${i}" data-field="term" data-index="${i}" placeholder="Nhập thuật ngữ">${esc(c.term)}</textarea></div>
          <div class="field"><label for="d-${i}">Định nghĩa</label><textarea class="textarea" rows="1" id="d-${i}" data-field="definition" data-index="${i}" placeholder="Nhập định nghĩa">${esc(c.definition)}</textarea></div>
        </div>
      </div>`
      )
      .join("");
    document.getElementById("card-count").textContent = `(${cards.length})`;
  }

  function addCard(list) {
    const start = cards.length;
    cards.push(...(list || [blank()]));
    dirty = true;
    renderCards();
    const el = document.getElementById(`t-${start}`);
    el.focus();
    el.closest(".editor-card").scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function save(existing) {
    const title = document.getElementById("set-title");
    if (!title.value.trim()) {
      title.style.borderColor = "var(--danger)";
      title.focus();
      toast("Học phần cần có tên");
      return;
    }
    // Thẻ chỉ có một mặt là lỗi; thẻ trống hoàn toàn thì bỏ qua
    const half = cards.findIndex((c) => !!c.term.trim() !== !!c.definition.trim());
    if (half >= 0) {
      const field = document.getElementById(cards[half].term.trim() ? `d-${half}` : `t-${half}`);
      field.style.borderColor = "var(--danger)";
      field.focus();
      toast(`Thẻ ${half + 1} còn thiếu ${cards[half].term.trim() ? "định nghĩa" : "thuật ngữ"}`);
      return;
    }
    const filled = cards.filter((c) => c.term.trim() && c.definition.trim());
    if (!filled.length) {
      document.getElementById("t-0").focus();
      toast("Thêm ít nhất một thẻ");
      return;
    }
    const data = { title: title.value, description: document.getElementById("set-desc").value, subjectId: document.getElementById("set-subject").value };
    let id;
    if (existing) {
      store.updateSet(existing.id, { title: data.title.trim(), description: data.description.trim(), subjectId: data.subjectId });
      store.replaceCards(existing.id, filled);
      id = existing.id;
    } else {
      id = store.createSet(data, filled).id;
    }
    dirty = false;
    location.href = `set.html?id=${id}`;
  }

  function importDialog() {
    modal({
      title: "Nhập nhanh",
      sub: "Dán danh sách từ Excel, Google Sheets hoặc Ghi chú. Mỗi dòng là một thẻ.",
      wide: true,
      body: `
        <div class="field">
          <label for="imp-sep">Dấu phân cách giữa thuật ngữ và định nghĩa</label>
          <select class="select" id="imp-sep">
            <option value="auto">Tự nhận dạng (Tab, “ - ”, “:”, “,”)</option>
            <option value="\t">Tab</option>
            <option value=" - ">Gạch ngang ( - )</option>
            <option value=":">Dấu hai chấm (:)</option>
            <option value=",">Dấu phẩy (,)</option>
            <option value=";">Dấu chấm phẩy (;)</option>
          </select>
        </div>
        <div class="field">
          <label for="imp-text">Nội dung</label>
          <textarea class="textarea" id="imp-text" rows="8" style="font-family:ui-monospace,Consolas,monospace;tab-size:16" placeholder="mitochondria&#9;ti thể&#10;chloroplast&#9;lục lạp"></textarea>
        </div>
        <p class="muted" style="margin:0;font-size:13px" id="imp-info">0 thẻ được nhận dạng</p>`,
      onOpen(panel) {
        const text = panel.querySelector("#imp-text");
        const sep = panel.querySelector("#imp-sep");
        const info = panel.querySelector("#imp-info");
        const update = () => (info.textContent = `${study.parseImport(text.value, { separator: sep.value }).length} thẻ được nhận dạng`);
        text.addEventListener("input", update);
        sep.addEventListener("change", update);
        text.addEventListener("keydown", (e) => {
          if (e.key !== "Tab" || e.shiftKey) return;
          e.preventDefault();
          const { selectionStart: a, selectionEnd: b, value } = text;
          text.value = value.slice(0, a) + "\t" + value.slice(b);
          text.selectionStart = text.selectionEnd = a + 1;
          update();
        });
      },
      actions: [
        { label: "Hủy", onClick: (close) => close() },
        {
          label: "Thêm thẻ",
          variant: "btn-primary",
          onClick: (close, panel) => {
            const list = study.parseImport(panel.querySelector("#imp-text").value, { separator: panel.querySelector("#imp-sep").value });
            if (!list.length) return panel.querySelector("#imp-text").focus();
            // Bỏ các thẻ trống đang có trước khi thêm
            cards = cards.filter((c) => c.term.trim() || c.definition.trim());
            close();
            addCard(list);
            toast(`Đã thêm ${list.length} thẻ`);
          },
        },
      ],
    });
  }
})();
