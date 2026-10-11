// Chế độ Ghép thẻ: ghép thuật ngữ với định nghĩa nhanh nhất có thể. Ghép sai cộng 1 giây.
(function () {
  const { store, study, icon } = App;
  const { esc, param, studyBar, notFound } = App.ui;

  const PAIRS = 6;
  const PENALTY = 1000;

  let set;
  let cards = [];
  let bar;
  let tiles = [];
  let selected = null;
  let matched = 0;
  let pairs = 0;
  let startAt = 0;
  let penalty = 0;
  let raf = 0;
  let locked = false;

  document.addEventListener("DOMContentLoaded", () => {
    set = store.set(param("set"));
    const app = document.getElementById("app");
    if (!set) {
      document.querySelector("[data-study-bar]").remove();
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    document.title = `Ghép thẻ · ${set.title} — Recall`;
    cards = store.cards(set.id);
    bar = studyBar({ mode: "match", set });
    if (cards.length < 2) {
      app.innerHTML = `<div class="done">${icon("grid")}<h2>Cần ít nhất 2 thẻ</h2><p>Thêm thẻ vào học phần để chơi ghép thẻ.</p><div class="done__actions"><a class="btn btn-primary" href="edit.html?set=${set.id}">Thêm thẻ</a></div></div>`;
      return;
    }
    intro();
  });

  const best = () => store.pref(`match:${set.id}`, null);

  function intro() {
    const app = document.getElementById("app");
    bar.setCount("");
    bar.setProgress(0);
    app.innerHTML = `
      <div class="done">
        ${icon("timer")}
        <h2>Sẵn sàng ghép thẻ?</h2>
        <p>Ghép ${Math.min(PAIRS, cards.length)} thuật ngữ với định nghĩa của chúng nhanh nhất có thể. Mỗi lần ghép sai bị cộng thêm 1 giây.</p>
        ${best() ? `<div class="done__stats"><div class="done__stat"><b>${study.formatDuration(best())}</b><span>Kỷ lục của bạn</span></div></div>` : ""}
        <div class="done__actions"><button class="btn btn-primary btn-lg" type="button" id="start">${icon("play")}Bắt đầu</button></div>
      </div>`;
    document.getElementById("start").addEventListener("click", play);
  }

  // Thẻ trắc nghiệm: ghép câu hỏi với nội dung đáp án. Đáp án kiểu "Cả a, b và c" vô nghĩa khi
  // tách khỏi phương án nên bỏ qua (trừ khi không đủ thẻ khác).
  const VAGUE = /^(cả|tất cả|phương án|[a-d] và|không có)/i;
  function pairOf(c) {
    const quiz = study.parseQuiz(c);
    if (!quiz) return { term: c.term, definition: c.definition, vague: false };
    return { term: quiz.question, definition: quiz.answer.text, vague: VAGUE.test(quiz.answer.text) };
  }

  function play() {
    const all = study.shuffle(cards).map((c) => ({ card: c, ...pairOf(c) }));
    const clear = all.filter((x) => !x.vague);
    const picked = (clear.length >= Math.min(PAIRS, all.length) ? clear : all).slice(0, PAIRS);
    pairs = picked.length;
    tiles = study.shuffle(
      picked.flatMap((x) => [
        { id: `${x.card.id}:t`, cardId: x.card.id, text: x.term },
        { id: `${x.card.id}:d`, cardId: x.card.id, text: x.definition },
      ])
    );
    selected = null;
    matched = 0;
    penalty = 0;
    locked = false;

    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="match-head">
        <span class="muted" id="match-left">Còn ${pairs} cặp</span>
        <span class="timer" id="timer" aria-live="off">0.0s</span>
      </div>
      <div class="match-grid">${tiles.map((t) => `<button class="tile" type="button" data-tile="${t.id}">${esc(t.text)}</button>`).join("")}</div>`;
    app.querySelectorAll("[data-tile]").forEach((el) => el.addEventListener("click", () => pick(el)));
    startAt = performance.now();
    tick();
  }

  function elapsed() {
    return performance.now() - startAt + penalty;
  }

  function tick() {
    const t = document.getElementById("timer");
    if (!t) return;
    t.textContent = study.formatDuration(elapsed());
    raf = requestAnimationFrame(tick);
  }

  function pick(el) {
    if (locked || el.classList.contains("is-matched")) return;
    const tile = tiles.find((t) => t.id === el.dataset.tile);
    if (!selected) {
      selected = { el, tile };
      el.classList.add("is-selected");
      return;
    }
    if (selected.el === el) {
      el.classList.remove("is-selected");
      selected = null;
      return;
    }
    const a = selected;
    selected = null;
    if (a.tile.cardId === tile.cardId) {
      a.el.classList.remove("is-selected");
      [a.el, el].forEach((x) => {
        x.classList.add("is-matched");
        x.disabled = true;
      });
      matched++;
      bar.setProgress(matched / pairs);
      bar.setCount(`${matched} / ${pairs} cặp`);
      document.getElementById("match-left").textContent = matched === pairs ? "Hoàn thành!" : `Còn ${pairs - matched} cặp`;
      if (matched === pairs) setTimeout(finish, 350);
    } else {
      penalty += PENALTY;
      locked = true;
      a.el.classList.remove("is-selected");
      [a.el, el].forEach((x) => x.classList.add("is-wrong"));
      setTimeout(() => {
        [a.el, el].forEach((x) => x.classList.remove("is-wrong"));
        locked = false;
      }, 450);
    }
  }

  function finish() {
    cancelAnimationFrame(raf);
    const time = elapsed();
    const prev = best();
    const record = !prev || time < prev;
    if (record) store.setPref(`match:${set.id}`, Math.round(time));
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="done">
        ${icon(record ? "sparkles" : "circle-check")}
        <h2>${record ? "Kỷ lục mới!" : "Hoàn thành!"}</h2>
        <p>${record && prev ? `Nhanh hơn kỷ lục cũ ${study.formatDuration(prev - time)}.` : record ? "Đây là lần đầu bạn hoàn thành ghép thẻ của học phần này." : `Kỷ lục hiện tại là ${study.formatDuration(prev)}. Thử lại để phá kỷ lục nhé!`}</p>
        <div class="done__stats">
          <div class="done__stat"><b>${study.formatDuration(time)}</b><span>Thời gian</span></div>
          <div class="done__stat"><b>${penalty / 1000}s</b><span>Thời gian phạt</span></div>
        </div>
        <div class="done__actions">
          <button class="btn btn-primary btn-lg" type="button" id="again">${icon("rotate")}Chơi lại</button>
          <a class="btn btn-secondary btn-lg" href="learn.html?set=${set.id}">${icon("sparkles")}Chuyển sang Học</a>
        </div>
      </div>`;
    document.getElementById("again").addEventListener("click", play);
    document.getElementById("again").focus();
  }
})();
