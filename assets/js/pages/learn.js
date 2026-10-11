// Chế độ Học: hệ Leitner theo vòng. Thẻ mới/đang học hỏi trắc nghiệm, thẻ đã quen hỏi tự luận.
// Trả lời sai → thẻ quay lại cuối vòng hiện tại. Phiên kết thúc khi mọi thẻ đạt "Đã thuộc".
(function () {
  const { store, study, icon } = App;
  const { esc, param, modal, speak, studyBar, notFound, confirm } = App.ui;

  const ROUND_SIZE = 7;
  const opts = { direction: "auto", ignoreDiacritics: false };

  let set;
  let all = [];
  let queue = [];
  let roundCards = [];
  let round = 0;
  let bar;
  let current = null; // { card, type, ask, answerField, prevBox, requeued, answered }
  let advanceTimer = null;
  const requeueCount = new Map();

  document.addEventListener("DOMContentLoaded", () => {
    set = store.set(param("set"));
    const app = document.getElementById("app");
    if (!set) {
      document.querySelector("[data-study-bar]").remove();
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    document.title = `Học · ${set.title} — Recall`;
    Object.assign(opts, store.pref("learn", {}));
    const only = (param("cards") || "").split(",").filter(Boolean);
    all = store.cards(set.id).filter((c) => !only.length || only.includes(c.id));

    bar = studyBar({ mode: "learn", set, actions: `<button class="icon-btn" type="button" id="btn-settings" aria-label="Tùy chọn">${icon("settings")}</button>` });
    document.getElementById("btn-settings").addEventListener("click", settings);
    document.addEventListener("keydown", onKey);

    if (!all.length) {
      app.innerHTML = `<div class="done">${icon("layers")}<h2>Học phần chưa có thẻ</h2><p>Thêm thẻ để bắt đầu học.</p><div class="done__actions"><a class="btn btn-primary" href="edit.html?set=${set.id}">Thêm thẻ</a></div></div>`;
      return;
    }
    startSession();
  });

  const boxOf = (c) => store.progress(c.id).box;
  const remaining = () => all.filter((c) => boxOf(c) < study.MAX_BOX);

  function startSession() {
    round = 0;
    if (!remaining().length) return finished(true);
    nextRound();
  }

  function nextRound() {
    round++;
    requeueCount.clear();
    // Ưu tiên thẻ đang học (box thấp) trước thẻ mới, giữ ngẫu nhiên trong cùng mức
    const pool = study.shuffle(remaining()).sort((a, b) => {
      const pa = boxOf(a) === 0 ? 1.5 : boxOf(a);
      const pb = boxOf(b) === 0 ? 1.5 : boxOf(b);
      return pa - pb;
    });
    roundCards = pool.slice(0, ROUND_SIZE);
    queue = roundCards.slice();
    ask();
  }

  function updateMeter() {
    const counts = { new: 0, learning: 0, mastered: 0 };
    all.forEach((c) => counts[study.masteryOf(boxOf(c))]++);
    bar.setProgress(counts.mastered / all.length);
    bar.setCount(`Vòng ${round} · ${counts.mastered}/${all.length} đã thuộc`);
    const pct = (n) => `${(n / all.length) * 100}%`;
    return `
      <div class="learn-meter" aria-label="Tiến độ học">
        <div class="learn-meter__item"><span>Chưa học <b>${counts.new}</b></span><div class="bar bar--muted"><i style="width:${pct(counts.new)}"></i></div></div>
        <div class="learn-meter__item"><span>Đang học <b>${counts.learning}</b></span><div class="bar bar--amber"><i style="width:${pct(counts.learning)}"></i></div></div>
        <div class="learn-meter__item"><span>Đã thuộc <b>${counts.mastered}</b></span><div class="bar"><i style="width:${pct(counts.mastered)}"></i></div></div>
      </div>`;
  }

  function ask() {
    clearTimeout(advanceTimer);
    if (!queue.length) return remaining().length ? roundDone() : finished(false);
    const card = queue.shift();
    const box = boxOf(card);
    const type = box < 2 && all.length >= 2 ? "mc" : "written";
    let askField;
    if (opts.direction === "auto") askField = type === "mc" ? "term" : "definition";
    else askField = opts.direction;
    const answerField = askField === "term" ? "definition" : "term";
    current = { card, type, askField, answerField, prevBox: box, answered: false, requeued: false };

    const label = { term: "Thuật ngữ", definition: "Định nghĩa" };
    const app = document.getElementById("app");
    const head = `
      <div class="question__head">
        <span>${label[askField]}</span>
        <span style="display:flex;gap:2px">
          <button class="icon-btn" type="button" id="q-speak" aria-label="Phát âm">${icon("volume")}</button>
        </span>
      </div>
      <div class="question__prompt">${esc(card[askField])}</div>`;

    let body;
    if (type === "mc") {
      current.choices = study.buildChoices(card, all, answerField, 4);
      body = `
        <div class="question__ask">Chọn ${label[answerField].toLowerCase()} đúng</div>
        <div class="options">${current.choices
          .map((c, i) => `<button class="option" type="button" data-choice="${i}"><span class="option__key">${i + 1}</span><span class="option__text">${esc(c)}</span></button>`)
          .join("")}</div>`;
    } else {
      body = `
        <label class="question__ask" for="answer">Gõ ${label[answerField].toLowerCase()}</label>
        <form class="answer-row" id="answer-form" autocomplete="off">
          <input class="input" id="answer" placeholder="Nhập đáp án của bạn" autocapitalize="off" spellcheck="false" />
          <button class="btn btn-primary btn-lg" type="submit">Trả lời</button>
        </form>
        <button class="btn btn-ghost btn-sm" type="button" id="dont-know" style="margin-top:10px;padding-left:0">Không biết?</button>`;
    }

    app.innerHTML = `${updateMeter()}<div class="question is-entering">${head}${body}<div id="feedback"></div></div>`;
    document.getElementById("q-speak").addEventListener("click", () => speak(card[askField]));

    if (type === "mc") {
      app.querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => answerMc(Number(b.dataset.choice))));
    } else {
      const input = document.getElementById("answer");
      input.focus();
      document.getElementById("answer-form").addEventListener("submit", (e) => {
        e.preventDefault();
        if (!current.answered && input.value.trim()) answerWritten(input.value);
      });
      document.getElementById("dont-know").addEventListener("click", () => !current.answered && answerWritten(""));
    }
  }

  function answerMc(i) {
    if (current.answered) return;
    current.answered = true;
    const chosen = current.choices[i];
    const correct = chosen === current.card[current.answerField];
    document.querySelectorAll("[data-choice]").forEach((b, idx) => {
      b.disabled = true;
      const isAnswer = current.choices[idx] === current.card[current.answerField];
      if (isAnswer) b.classList.add("is-correct");
      else if (idx === i) b.classList.add("is-wrong");
      else b.classList.add("is-dim");
    });
    record(correct);
    feedback(correct, { given: chosen });
  }

  function answerWritten(given) {
    current.answered = true;
    const result = study.checkAnswer(given, current.card[current.answerField], { ignoreDiacritics: opts.ignoreDiacritics });
    const input = document.getElementById("answer");
    input.readOnly = true;
    input.classList.add(result.correct ? "is-correct" : "is-wrong");
    document.querySelector("#answer-form .btn").disabled = true;
    document.getElementById("dont-know").hidden = true;
    record(result.correct);
    feedback(result.correct, { given, close: result.close, written: true });
  }

  function record(correct) {
    store.recordAnswer(current.card.id, correct);
    if (!correct) requeue();
  }

  function requeue() {
    const n = requeueCount.get(current.card.id) || 0;
    if (n >= 2) return;
    requeueCount.set(current.card.id, n + 1);
    queue.push(current.card);
    current.requeued = true;
  }

  function feedback(correct, { given, close, written }) {
    const host = document.getElementById("feedback");
    const answer = current.card[current.answerField];
    if (correct) {
      host.innerHTML = `
        <div class="feedback feedback--ok">
          <div class="feedback__msg"><b>${icon("circle-check")}Chính xác!</b><span class="muted">${boxOf(current.card) >= study.MAX_BOX ? "Thẻ này đã được đánh dấu là đã thuộc." : "Thẻ sẽ quay lại ở vòng sau dưới dạng tự luận."}</span></div>
          <div class="feedback__actions"><button class="btn btn-primary" type="button" id="continue">Tiếp tục <span class="kbd" style="margin-left:4px">Enter</span></button></div>
        </div>`;
      advanceTimer = setTimeout(ask, 1100);
    } else {
      host.innerHTML = `
        <div class="feedback feedback--bad">
          <div class="feedback__msg">
            <b>${icon("circle-x")}${close ? "Gần đúng rồi!" : given ? "Chưa đúng" : "Không sao, hãy ghi nhớ đáp án"}</b>
            <span class="muted">Đáp án đúng: <span style="color:#fff">${esc(answer)}</span></span>
          </div>
          <div class="feedback__actions">
            ${written && given ? `<button class="btn btn-secondary" type="button" id="override">Tôi đã trả lời đúng</button>` : ""}
            <button class="btn btn-primary" type="button" id="continue">Tiếp tục</button>
          </div>
        </div>`;
      const ov = document.getElementById("override");
      ov &&
        ov.addEventListener("click", () => {
          // Ghi đè: khôi phục mức trước đó rồi tính như trả lời đúng
          store.setProgress(current.card.id, { box: study.nextBox(current.prevBox, true) });
          if (current.requeued) {
            const idx = queue.lastIndexOf(current.card);
            if (idx >= 0) queue.splice(idx, 1);
          }
          ask();
        });
    }
    document.getElementById("continue").addEventListener("click", ask);
    document.getElementById("continue").focus({ preventScroll: true });
  }

  function roundDone() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${updateMeter()}
      <div class="question is-entering">
        <div class="question__head"><span>Hết vòng ${round}</span><span>${roundCards.length} thẻ</span></div>
        <div class="question__prompt">Làm tốt lắm! Nghỉ một chút rồi tiếp tục nhé.</div>
        <div class="term-list">
          ${roundCards
            .map((c) => {
              const m = study.masteryOf(boxOf(c));
              return `<div class="term"><div class="term__term">${esc(c.term)}</div><div class="term__def">${esc(c.definition)}</div><span class="chip chip--${m}">${study.MASTERY_LABEL[m]}</span></div>`;
            })
            .join("")}
        </div>
        <div class="feedback" style="margin-top:24px">
          <div class="feedback__msg"><b>Còn ${remaining().length} thẻ chưa thuộc</b></div>
          <div class="feedback__actions"><button class="btn btn-primary" type="button" id="continue">Tiếp tục vòng ${round + 1}</button></div>
        </div>
      </div>`;
    current = null;
    document.getElementById("continue").addEventListener("click", nextRound);
    document.getElementById("continue").focus({ preventScroll: true });
  }

  function finished(alreadyDone) {
    const app = document.getElementById("app");
    current = null;
    bar.setProgress(1);
    bar.setCount(`${all.length}/${all.length} đã thuộc`);
    app.innerHTML = `
      <div class="done">
        ${icon("sparkles")}
        <h2>${alreadyDone ? "Bạn đã thuộc toàn bộ học phần" : "Hoàn thành! Bạn đã thuộc tất cả thẻ"}</h2>
        <p>${all.length} thẻ đều ở mức “Đã thuộc”. Làm bài kiểm tra để chắc chắn, hoặc học lại từ đầu để củng cố.</p>
        <div class="done__actions">
          <a class="btn btn-primary btn-lg" href="test.html?set=${set.id}">${icon("clipboard")}Làm bài kiểm tra</a>
          <button class="btn btn-secondary btn-lg" type="button" id="restart">${icon("rotate")}Học lại từ đầu</button>
          <a class="btn btn-secondary btn-lg" href="set.html?id=${set.id}">Về học phần</a>
        </div>
      </div>`;
    document.getElementById("restart").addEventListener("click", async () => {
      const ok = await confirm({ title: "Học lại từ đầu?", message: "Tiến độ của các thẻ trong phiên này sẽ được đặt lại về “Chưa học”.", confirmLabel: "Học lại" });
      if (!ok) return;
      all.forEach((c) => store.setProgress(c.id, { box: 0, correctStreak: 0 }));
      startSession();
    });
  }

  function onKey(e) {
    if (document.querySelector(".modal")) return;
    if (e.key === "Enter" && document.getElementById("continue") && !e.target.matches("button")) {
      e.preventDefault();
      document.getElementById("continue").click();
      return;
    }
    if (current && current.type === "mc" && !current.answered && /^[1-4]$/.test(e.key)) {
      const i = Number(e.key) - 1;
      if (i < current.choices.length) answerMc(i);
    }
  }

  function settings() {
    modal({
      title: "Tùy chọn Học",
      body: `
        <div class="field">
          <span class="label">Hỏi bằng</span>
          <div class="segmented" role="group" aria-label="Hướng hỏi">
            <button type="button" data-dir="auto" aria-pressed="${opts.direction === "auto"}">Tự động</button>
            <button type="button" data-dir="term" aria-pressed="${opts.direction === "term"}">Thuật ngữ</button>
            <button type="button" data-dir="definition" aria-pressed="${opts.direction === "definition"}">Định nghĩa</button>
          </div>
          <span class="subtle" style="font-size:13px">Tự động: trắc nghiệm hỏi thuật ngữ, tự luận hỏi định nghĩa để bạn gõ thuật ngữ.</span>
        </div>
        <label class="check"><input type="checkbox" id="opt-diacritics" ${opts.ignoreDiacritics ? "checked" : ""} /> Bỏ qua dấu tiếng Việt khi chấm tự luận</label>`,
      onOpen(panel) {
        panel.querySelectorAll("[data-dir]").forEach((b) =>
          b.addEventListener("click", () => panel.querySelectorAll("[data-dir]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))))
        );
      },
      actions: [
        { label: "Hủy", onClick: (close) => close() },
        {
          label: "Áp dụng",
          variant: "btn-primary",
          onClick: (close, panel) => {
            opts.direction = panel.querySelector('[data-dir][aria-pressed="true"]').dataset.dir;
            opts.ignoreDiacritics = panel.querySelector("#opt-diacritics").checked;
            store.setPref("learn", opts);
            close();
            if (current && !current.answered) {
              queue.unshift(current.card);
              ask();
            }
          },
        },
      ],
    });
  }
})();
