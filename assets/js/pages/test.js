// Chế độ Kiểm tra: thiết lập đề → làm bài → chấm điểm và xem lại.
(function () {
  const { store, study, icon } = App;
  const { esc, param, studyBar, notFound, confirm } = App.ui;

  const TYPE_LABEL = { mc: "Trắc nghiệm", tf: "Đúng / Sai", written: "Tự luận ngắn" };
  const SIDE_LABEL = { term: "Thuật ngữ", definition: "Định nghĩa" };

  let set;
  let cards = [];
  let bar;
  let questions = [];
  let answers = {};
  const opts = { count: 10, types: ["mc", "tf", "written"], direction: "term", ignoreDiacritics: false };

  document.addEventListener("DOMContentLoaded", () => {
    set = store.set(param("set"));
    const app = document.getElementById("app");
    if (!set) {
      document.querySelector("[data-study-bar]").remove();
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    document.title = `Kiểm tra · ${set.title} — Recall`;
    Object.assign(opts, store.pref("test", {}));
    cards = store.cards(set.id);
    bar = studyBar({ mode: "test", set });
    if (cards.length < 2) {
      app.innerHTML = `<div class="done">${icon("clipboard")}<h2>Cần ít nhất 2 thẻ</h2><p>Thêm thẻ vào học phần để tạo bài kiểm tra.</p><div class="done__actions"><a class="btn btn-primary" href="edit.html?set=${set.id}">Thêm thẻ</a></div></div>`;
      return;
    }
    setup();
  });

  // ---------- Thiết lập ----------
  function setup() {
    const app = document.getElementById("app");
    const count = Math.min(opts.count, cards.length);
    bar.setCount("Thiết lập bài kiểm tra");
    bar.setProgress(0);
    window.scrollTo({ top: 0 });
    app.innerHTML = `
      <h1 class="h2" style="margin-bottom:24px">Tạo bài kiểm tra</h1>
      <form class="setup" id="setup">
        <div class="setup__row">
          <div><b>Số câu hỏi</b><span>Tối đa ${cards.length} câu</span></div>
          <div class="range-wrap">
            <input type="range" id="opt-count" min="1" max="${cards.length}" value="${count}" aria-label="Số câu hỏi" />
            <output id="count-out" for="opt-count">${count}</output>
          </div>
        </div>
        <div class="setup__row">
          <div><b>Câu hỏi hiển thị</b><span>Mặt thẻ được dùng làm đề bài</span></div>
          <div class="segmented" role="group" aria-label="Hướng hỏi">
            <button type="button" data-dir="term" aria-pressed="${opts.direction === "term"}">Thuật ngữ</button>
            <button type="button" data-dir="definition" aria-pressed="${opts.direction === "definition"}">Định nghĩa</button>
            <button type="button" data-dir="both" aria-pressed="${opts.direction === "both"}">Cả hai</button>
          </div>
        </div>
        <div>
          <div class="setup__row" style="margin-bottom:8px"><div><b>Dạng câu hỏi</b><span>Chọn ít nhất một dạng</span></div></div>
          ${Object.entries(TYPE_LABEL)
            .map(([k, v]) => `<label class="check"><input type="checkbox" name="type" value="${k}" ${opts.types.includes(k) ? "checked" : ""} /> ${v}</label>`)
            .join("")}
          <label class="check"><input type="checkbox" id="opt-diacritics" ${opts.ignoreDiacritics ? "checked" : ""} /> Bỏ qua dấu tiếng Việt khi chấm tự luận</label>
        </div>
        <div class="setup__row" style="justify-content:flex-end">
          <button class="btn btn-primary btn-lg" type="submit">Bắt đầu làm bài ${icon("arrow-right")}</button>
        </div>
      </form>`;

    const range = document.getElementById("opt-count");
    range.addEventListener("input", () => (document.getElementById("count-out").textContent = range.value));
    app.querySelectorAll("[data-dir]").forEach((b) =>
      b.addEventListener("click", () => app.querySelectorAll("[data-dir]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))))
    );
    document.getElementById("setup").addEventListener("submit", (e) => {
      e.preventDefault();
      const types = [...app.querySelectorAll('input[name="type"]:checked')].map((i) => i.value);
      if (!types.length) {
        App.ui.toast("Chọn ít nhất một dạng câu hỏi");
        return;
      }
      Object.assign(opts, {
        count: Number(range.value),
        types,
        direction: app.querySelector('[data-dir][aria-pressed="true"]').dataset.dir,
        ignoreDiacritics: document.getElementById("opt-diacritics").checked,
      });
      store.setPref("test", opts);
      begin();
    });
  }

  // ---------- Làm bài ----------
  function begin() {
    questions = study.buildTest(cards, opts);
    answers = {};
    const app = document.getElementById("app");
    window.scrollTo({ top: 0 });
    app.innerHTML = `
      <div class="test-list">${questions.map(questionHtml).join("")}</div>
      <div class="done" style="padding:40px 0 0">
        <p>Bạn đã trả lời <b id="answered-count" style="color:#fff">0</b> / ${questions.length} câu.</p>
        <button class="btn btn-primary btn-lg" type="button" id="submit">Nộp bài</button>
      </div>`;
    updateProgress();

    app.querySelectorAll("[data-q]").forEach((el) => {
      const q = questions.find((x) => x.id === el.dataset.q);
      el.querySelectorAll("[data-value]").forEach((b) =>
        b.addEventListener("click", () => {
          answers[q.id] = b.dataset.value;
          el.querySelectorAll("[data-value]").forEach((x) => {
            x.classList.toggle("is-selected", x === b);
            x.setAttribute("aria-pressed", String(x === b));
          });
          updateProgress();
        })
      );
      const input = el.querySelector("input");
      input &&
        input.addEventListener("input", () => {
          answers[q.id] = input.value;
          updateProgress();
        });
      input &&
        input.addEventListener("keydown", (e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const next = el.nextElementSibling;
          if (next) {
            next.scrollIntoView({ block: "center", behavior: "smooth" });
            const ni = next.querySelector("input, button");
            ni && ni.focus({ preventScroll: true });
          }
        });
    });
    document.getElementById("submit").addEventListener("click", submit);
  }

  function questionHtml(q, i) {
    const askLabel = q.quiz ? "Câu hỏi" : SIDE_LABEL[q.ask];
    const answerLabel = q.quiz ? "Đáp án" : SIDE_LABEL[q.ask === "term" ? "definition" : "term"];
    let body;
    if (q.type === "mc") {
      body = `<div class="question__ask">Chọn ${answerLabel.toLowerCase()} đúng</div>
        <div class="options">${q.choices
          .map((c, k) => `<button class="option" type="button" data-value="${esc(c)}" aria-pressed="false"><span class="option__key">${"ABCD"[k]}</span><span class="option__text">${esc(c)}</span></button>`)
          .join("")}</div>`;
    } else if (q.type === "tf") {
      body = `<div class="tf__pair"><small>${answerLabel}</small><div>${esc(q.shown)}</div></div>
        <div class="question__ask">${q.quiz ? "Đây có phải đáp án đúng không?" : "Cặp thẻ này có đúng không?"}</div>
        <div class="tf">
          <button class="option" type="button" data-value="true" aria-pressed="false"><span class="option__key">${icon("check")}</span><span class="option__text">Đúng</span></button>
          <button class="option" type="button" data-value="false" aria-pressed="false"><span class="option__key">${icon("x")}</span><span class="option__text">Sai</span></button>
        </div>`;
    } else {
      body = `<label class="question__ask" for="in-${q.id}">${q.quiz ? "Gõ chữ cái hoặc nội dung đáp án" : `Gõ ${answerLabel.toLowerCase()}`}</label>
        <div class="answer-row"><input class="input" id="in-${q.id}" placeholder="${q.quiz ? "Ví dụ: C" : "Nhập đáp án"}" autocomplete="off" autocapitalize="off" spellcheck="false" /></div>`;
    }
    return `
      <article class="question" data-q="${q.id}" aria-label="Câu ${i + 1}">
        <div class="question__head"><span>${askLabel} · ${TYPE_LABEL[q.type]}</span><span>${i + 1} / ${questions.length}</span></div>
        <div class="question__prompt${q.quiz ? " question__prompt--quiz" : ""}">${esc(q.prompt)}</div>
        ${body}
      </article>`;
  }

  function answeredCount() {
    return questions.filter((q) => String(answers[q.id] ?? "").trim() !== "").length;
  }

  function updateProgress() {
    const n = answeredCount();
    bar.setProgress(n / questions.length);
    bar.setCount(`${n} / ${questions.length} câu`);
    const el = document.getElementById("answered-count");
    if (el) el.textContent = n;
  }

  async function submit() {
    const missing = questions.length - answeredCount();
    if (missing) {
      const ok = await confirm({ title: `Còn ${missing} câu chưa trả lời`, message: "Các câu bỏ trống sẽ được tính là sai. Bạn vẫn muốn nộp bài?", confirmLabel: "Nộp bài" });
      if (!ok) return;
    }
    const graded = study.gradeTest(questions, answers, { ignoreDiacritics: opts.ignoreDiacritics });
    graded.results.forEach((r) => store.recordAnswer(r.question.cardId, r.correct));
    store.addResult({
      setId: set.id,
      score: graded.score,
      total: graded.total,
      correctCount: graded.correctCount,
      answers: graded.results.map((r) => ({ cardId: r.question.cardId, given: r.given, correct: r.correct })),
    });
    results(graded);
  }

  // ---------- Kết quả ----------
  function results(graded) {
    const app = document.getElementById("app");
    const wrong = graded.results.filter((r) => !r.correct);
    const C = 2 * Math.PI * 56;
    const color = graded.score >= 80 ? "var(--success)" : graded.score >= 50 ? "#ffb547" : "var(--danger)";
    bar.setProgress(1);
    bar.setCount(`Kết quả: ${graded.score}%`);
    window.scrollTo({ top: 0 });

    const given = (r) => {
      if (r.question.type === "tf") return r.given === "" ? "" : r.given === "true" ? "Đúng" : "Sai";
      return r.given;
    };
    const expected = (r) => (r.question.type === "tf" ? (r.question.isTrue ? "Đúng" : `Sai — đáp án đúng là: ${r.question.answer}`) : r.question.answer);

    app.innerHTML = `
      <div class="score">
        <svg class="ring" viewBox="0 0 132 132" role="img" aria-label="Điểm ${graded.score}%">
          <circle class="ring__track" cx="66" cy="66" r="56" />
          <circle class="ring__value" cx="66" cy="66" r="56" style="stroke:${color}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - graded.score / 100)}" />
          <text x="66" y="75" text-anchor="middle">${graded.score}%</text>
        </svg>
        <div class="score__text">
          <h2>${graded.score >= 80 ? "Xuất sắc!" : graded.score >= 50 ? "Khá tốt, cố thêm chút nữa" : "Cần ôn thêm"}</h2>
          <p>Đúng ${graded.correctCount} / ${graded.total} câu${wrong.length ? ` · ${wrong.length} câu cần ôn lại` : ""}.</p>
          <div class="score__actions">
            ${wrong.length ? `<a class="btn btn-primary" href="flashcards.html?set=${set.id}&cards=${[...new Set(wrong.map((r) => r.question.cardId))].join(",")}">${icon("layers")}Ôn lại câu sai</a>` : ""}
            <button class="btn ${wrong.length ? "btn-secondary" : "btn-primary"}" type="button" id="again">${icon("rotate")}Làm bài mới</button>
            <a class="btn btn-secondary" href="set.html?id=${set.id}">Về học phần</a>
          </div>
        </div>
      </div>
      <div class="review">
        ${graded.results
          .map(
            (r, i) => `
          <div class="review__item ${r.correct ? "is-ok" : "is-bad"}">
            ${icon(r.correct ? "circle-check" : "circle-x")}
            <div>
              <div class="review__q">${i + 1}. ${esc(r.question.prompt)}${r.question.type === "tf" ? ` <span class="subtle">→ ${esc(r.question.shown)}</span>` : ""}</div>
              <div class="review__a">
                ${r.correct ? `Bạn trả lời: <b>${esc(given(r))}</b>` : `${given(r) ? `Bạn trả lời: <s>${esc(given(r))}</s> · ` : "Bỏ trống · "}Đáp án: <b>${esc(expected(r))}</b>`}
              </div>
            </div>
          </div>`
          )
          .join("")}
      </div>`;
    document.getElementById("again").addEventListener("click", setup);
  }
})();
