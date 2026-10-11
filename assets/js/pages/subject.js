// Trang môn học: thông tin môn, thống kê, danh sách học phần.
(function () {
  const { store, icon } = App;
  const { esc, param, reveal, menu, confirm, toast, subjectDialog, subjectIcon, notFound, MODES } = App.ui;

  document.addEventListener("DOMContentLoaded", () => {
    if (param("new")) {
      toast("Đã tạo môn học — thêm học phần đầu tiên nhé");
      history.replaceState(null, "", `subject.html?id=${param("id")}`);
    }
    render();
  });

  function render() {
    const app = document.getElementById("app");
    const subject = store.subject(param("id"));
    if (!subject) {
      notFound(app, { title: "Không tìm thấy môn học", message: "Môn học này không tồn tại hoặc đã bị xóa." });
      return;
    }
    document.title = `${subject.name} — Recall`;
    const st = store.subjectStats(subject.id);
    const sets = store.sets(subject.id);

    app.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb" data-reveal>
        <a href="index.html#subjects">Môn học</a>${icon("chevron-right")}<span aria-current="page">${esc(subject.name)}</span>
      </nav>
      <div class="page-head">
        <div data-reveal>
          <div class="page-head__title">
            ${subjectIcon(subject)}
            <h1 class="h2">${esc(subject.name)}</h1>
          </div>
          ${subject.description ? `<p class="lede" style="margin-top:14px">${esc(subject.description)}</p>` : ""}
        </div>
        <div class="page-head__actions" data-reveal style="--delay:100ms">
          <a class="btn btn-primary" href="edit.html?subject=${subject.id}">${icon("plus")}Tạo học phần</a>
          <button class="btn btn-secondary" type="button" data-act="edit">${icon("pencil")}Sửa</button>
          <button class="btn btn-secondary btn-icon" type="button" data-act="more" aria-label="Tùy chọn khác">${icon("more")}</button>
        </div>
      </div>

      <div class="stats" data-stagger>
        <div class="stat"><b>${st.sets}</b><span>Học phần</span></div>
        <div class="stat"><b>${st.cards}</b><span>Thẻ</span></div>
        <div class="stat"><b>${st.learning}</b><span>Đang học</span></div>
        <div class="stat"><b>${st.percent}%</b><span>Đã thuộc</span></div>
      </div>

      <section class="block" aria-labelledby="sets-title">
        <div class="block__head" data-reveal>
          <h2 class="block__title" id="sets-title">Học phần</h2>
          <span class="muted" style="font-size:13px">${sets.length} học phần</span>
        </div>
        ${sets.length ? `<div class="set-list" data-stagger>${sets.map(setRow).join("")}</div>` : emptySets(subject)}
      </section>`;

    app.querySelector('[data-act="edit"]').addEventListener("click", async () => {
      if (await subjectDialog(subject)) render();
    });
    const more = app.querySelector('[data-act="more"]');
    more.addEventListener("click", () =>
      menu(more, [
        {
          label: "Xóa môn học",
          icon: "trash",
          danger: true,
          onClick: async () => {
            const ok = await confirm({ title: `Xóa "${subject.name}"?`, message: "Tất cả học phần, thẻ và tiến độ trong môn này sẽ bị xóa vĩnh viễn.", confirmLabel: "Xóa môn học", danger: true });
            if (!ok) return;
            store.deleteSubject(subject.id);
            location.href = "index.html#subjects";
          },
        },
      ])
    );
    reveal(app);
  }

  function setRow(t) {
    const st = store.setStats(t.id);
    const disabled = st.total === 0;
    const modes = MODES.map((m) => {
      const off = disabled || ((m.key === "match" || m.key === "test") && st.total < 2);
      return `<a class="btn btn-secondary btn-sm" ${off ? 'aria-disabled="true" tabindex="-1" style="opacity:.4;pointer-events:none"' : ""} href="${m.key}.html?set=${t.id}">${icon(m.icon)}${m.label}</a>`;
    }).join("");
    return `
      <article class="set-row">
        <a class="subject-card__link" href="set.html?id=${t.id}" aria-label="Mở học phần ${esc(t.title)}"></a>
        <div>
          <h3 class="set-row__title">${esc(t.title)}</h3>
          <div class="set-row__meta">${st.total} thẻ${t.description ? ` · ${esc(t.description)}` : ""}</div>
        </div>
        <div class="set-row__progress">
          <span>Đã thuộc ${st.mastered}/${st.total}</span>
          <div class="bar"><i style="width:${st.percent}%"></i></div>
        </div>
        <div class="set-row__modes">${modes}</div>
      </article>`;
  }

  function emptySets(subject) {
    return `
      <div class="empty" data-reveal>
        ${icon("layers")}
        <h3 class="h3">Chưa có học phần nào</h3>
        <p>Học phần là một bộ thẻ nhớ, ví dụ “Từ vựng Unit 1” hay “Công thức chương 2”. Tạo học phần rồi bắt đầu ôn ngay.</p>
        <a class="btn btn-primary" href="edit.html?subject=${subject.id}">${icon("plus")}Tạo học phần</a>
      </div>`;
  }
})();
