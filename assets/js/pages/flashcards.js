// Chế độ Flashcards: lật thẻ, chuyển thẻ, đánh dấu đã thuộc / chưa thuộc.
(function () {
  const { store, study, icon } = App;
  const { esc, param, modal, speak, studyBar, notFound } = App.ui;

  let set;
  let all = []; // toàn bộ thẻ được chọn cho phiên
  let deck = []; // thứ tự hiện tại
  let index = 0;
  let flipped = false;
  let known = new Set();
  let unknown = new Set();
  let bar;
  const opts = { shuffle: false, front: "term", starredOnly: false };

  document.addEventListener("DOMContentLoaded", () => {
    set = store.set(param("set"));
    const app = document.getElementById("app");
    if (!set) {
      document.querySelector("[data-study-bar]").remove();
      notFound(app, { title: "Không tìm thấy học phần", message: "Học phần này không tồn tại hoặc đã bị xóa." });
      return;
    }
    document.title = `Flashcards · ${set.title} — Recall`;
    Object.assign(opts, store.pref("flashcards", {}));

    const only = (param("cards") || "").split(",").filter(Boolean);
    all = store.cards(set.id).filter((c) => !only.length || only.includes(c.id));

    bar = studyBar({
      mode: "flashcards",
      set,
      actions: `
        <button class="icon-btn" type="button" id="btn-shuffle" aria-pressed="${opts.shuffle}" aria-label="Trộn thẻ">${icon("shuffle")}</button>
        <button class="icon-btn" type="button" id="btn-settings" aria-label="Tùy chọn">${icon("settings")}</button>`,
    });
    syncShuffleBtn();
    document.getElementById("btn-shuffle").addEventListener("click", () => {
      opts.shuffle = !opts.shuffle;
      store.setPref("flashcards", opts);
      syncShuffleBtn();
      start();
    });
    document.getElementById("btn-settings").addEventListener("click", settings);
    document.addEventListener("keydown", onKey);
    start();
  });

  function syncShuffleBtn() {
    const b = document.getElementById("btn-shuffle");
    b.setAttribute("aria-pressed", String(opts.shuffle));
    b.style.color = opts.shuffle ? "var(--accent)" : "";
  }

  function start(list) {
    let pool = list || all;
    if (opts.starredOnly && !list) pool = pool.filter((c) => store.progress(c.id).starred);
    deck = opts.shuffle ? study.shuffle(pool) : pool.slice();
    index = 0;
    flipped = false;
    known = new Set();
    unknown = new Set();
    if (!deck.length) return empty();
    renderCard("next");
  }

  function empty() {
    const app = document.getElementById("app");
    bar.setCount("");
    bar.setProgress(0);
    app.innerHTML = opts.starredOnly
      ? `<div class="done">${icon("star")}<h2>Chưa có thẻ gắn sao</h2><p>Tắt tùy chọn “Chỉ học thẻ gắn sao” hoặc gắn sao cho thẻ khó trong học phần.</p><div class="done__actions"><button class="btn btn-primary" type="button" id="all">Học tất cả thẻ</button></div></div>`
      : `<div class="done">${icon("layers")}<h2>Học phần chưa có thẻ</h2><p>Thêm thẻ để bắt đầu học.</p><div class="done__actions"><a class="btn btn-primary" href="edit.html?set=${set.id}">Thêm thẻ</a></div></div>`;
    const b = document.getElementById("all");
    b &&
      b.addEventListener("click", () => {
        opts.starredOnly = false;
        store.setPref("flashcards", opts);
        start();
      });
  }

  function renderCard(direction) {
    const app = document.getElementById("app");
    const card = deck[index];
    const p = store.progress(card.id);
    const frontField = opts.front;
    const backField = frontField === "term" ? "definition" : "term";
    const label = { term: "Thuật ngữ", definition: "Định nghĩa" };
    const long = (t) => (t.length > 80 ? "fc__text fc__text--long" : "fc__text");
    flipped = false;

    app.innerHTML = `
      <div class="fc-scene">
        <div class="fc ${direction === "prev" ? "is-entering-back" : "is-entering"}" id="fc" role="button" tabindex="0" aria-label="Thẻ ${index + 1}. Nhấn để lật">
          <div class="fc__face">
            <span class="fc__label">${label[frontField]}</span>
            ${tools(card, p)}
            <div class="${long(card[frontField])}">${esc(card[frontField])}</div>
            <span class="fc__hint"><span class="hide-touch">Nhấn hoặc <span class="kbd">Space</span> để lật</span><span class="show-touch">Chạm để lật · vuốt để chuyển thẻ</span></span>
          </div>
          <div class="fc__face fc__face--back" aria-hidden="true">
            <span class="fc__label">${label[backField]}</span>
            ${tools(card, p)}
            <div class="${long(card[backField])}">${esc(card[backField])}</div>
          </div>
        </div>
      </div>
      <div class="fc-controls">
        <button class="btn btn-secondary btn-lg btn-unknown" type="button" id="btn-unknown">${icon("x")}Chưa thuộc <span class="count-badge"><span>${unknown.size}</span></span></button>
        <div class="fc-controls__nav">
          <button class="btn btn-secondary btn-icon btn-lg" type="button" id="btn-prev" aria-label="Thẻ trước" ${index === 0 ? "disabled" : ""}>${icon("arrow-left")}</button>
          <button class="btn btn-secondary btn-icon btn-lg" type="button" id="btn-next" aria-label="Thẻ sau">${icon("arrow-right")}</button>
        </div>
        <button class="btn btn-secondary btn-lg btn-know" type="button" id="btn-know">${icon("check")}Đã thuộc <span class="count-badge"><span>${known.size}</span></span></button>
      </div>
      <div class="study-tips">
        <span><span class="kbd">Space</span> Lật thẻ</span>
        <span><span class="kbd">←</span><span class="kbd">→</span> Chuyển thẻ</span>
        <span><span class="kbd">1</span> Chưa thuộc</span>
        <span><span class="kbd">2</span> Đã thuộc</span>
        <span><span class="kbd">S</span> Gắn sao</span>
      </div>`;

    bar.setCount(`${index + 1} / ${deck.length}`);
    bar.setProgress(index / deck.length);

    const fc = document.getElementById("fc");
    fc.addEventListener("click", (e) => {
      if (e.target.closest("[data-tool]")) return;
      flip();
    });
    fc.addEventListener("keydown", (e) => e.key === "Enter" && flip());
    app.querySelectorAll('[data-tool="speak"]').forEach((b) => b.addEventListener("click", () => speak(flipped ? card[backField] : card[frontField])));
    app.querySelectorAll('[data-tool="star"]').forEach((b) => b.addEventListener("click", () => toggleStar(card)));
    document.getElementById("btn-prev").addEventListener("click", () => go(-1));
    document.getElementById("btn-next").addEventListener("click", () => go(1));
    document.getElementById("btn-know").addEventListener("click", () => mark(true));
    document.getElementById("btn-unknown").addEventListener("click", () => mark(false));
    swipe(fc);
  }

  function tools(card, p) {
    return `<div class="fc__tools">
      <button class="icon-btn" type="button" data-tool="speak" aria-label="Phát âm">${icon("volume")}</button>
      <button class="icon-btn ${p.starred ? "is-active" : ""}" type="button" data-tool="star" aria-pressed="${p.starred}" aria-label="Gắn sao">${icon("star")}</button>
    </div>`;
  }

  function toggleStar(card) {
    const on = store.toggleStar(card.id);
    document.querySelectorAll('[data-tool="star"]').forEach((b) => {
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  }

  function flip() {
    const fc = document.getElementById("fc");
    if (!fc) return;
    flipped = !flipped;
    fc.classList.remove("is-entering", "is-entering-back");
    fc.classList.toggle("is-flipped", flipped);
    const [front, back] = fc.querySelectorAll(".fc__face");
    front.setAttribute("aria-hidden", String(flipped));
    back.setAttribute("aria-hidden", String(!flipped));
  }

  function go(step) {
    const next = index + step;
    if (next < 0) return;
    if (next >= deck.length) return done();
    index = next;
    renderCard(step > 0 ? "next" : "prev");
  }

  function mark(isKnown) {
    const card = deck[index];
    known.delete(card.id);
    unknown.delete(card.id);
    (isKnown ? known : unknown).add(card.id);
    store.recordAnswer(card.id, isKnown);
    go(1);
  }

  function done() {
    const app = document.getElementById("app");
    bar.setProgress(1);
    bar.setCount(`${deck.length} / ${deck.length}`);
    const unknownList = deck.filter((c) => unknown.has(c.id));
    app.innerHTML = `
      <div class="done">
        ${icon("circle-check", "")}
        <h2>${unknownList.length ? "Hoàn thành một lượt!" : "Tuyệt vời, bạn đã xem hết thẻ!"}</h2>
        <p>${unknownList.length ? `Còn ${unknownList.length} thẻ bạn chưa thuộc. Ôn lại ngay để ghi nhớ tốt hơn.` : "Chuyển sang chế độ Học hoặc Kiểm tra để chắc chắn bạn đã nhớ."}</p>
        <div class="done__stats">
          <div class="done__stat"><b style="color:var(--success)">${known.size}</b><span>Đã thuộc</span></div>
          <div class="done__stat"><b style="color:var(--danger)">${unknown.size}</b><span>Chưa thuộc</span></div>
          <div class="done__stat"><b>${deck.length - known.size - unknown.size}</b><span>Bỏ qua</span></div>
        </div>
        <div class="done__actions">
          ${unknownList.length ? `<button class="btn btn-primary btn-lg" type="button" id="again-unknown">Ôn lại ${unknownList.length} thẻ chưa thuộc</button>` : ""}
          <button class="btn ${unknownList.length ? "btn-secondary" : "btn-primary"} btn-lg" type="button" id="again">${icon("rotate")}Học lại từ đầu</button>
          <a class="btn btn-secondary btn-lg" href="learn.html?set=${set.id}">${icon("sparkles")}Chuyển sang Học</a>
        </div>
      </div>`;
    document.getElementById("again").addEventListener("click", () => start());
    const au = document.getElementById("again-unknown");
    au && au.addEventListener("click", () => start(unknownList));
  }

  function onKey(e) {
    if (document.querySelector(".modal") || e.target.matches("input, textarea, select")) return;
    if (!document.getElementById("fc")) return;
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      flip();
    } else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "1") mark(false);
    else if (e.key === "2") mark(true);
    else if (e.key.toLowerCase() === "s") toggleStar(deck[index]);
  }

  // Vuốt trái → thẻ sau, vuốt phải → thẻ trước
  function swipe(el) {
    let x0 = null;
    let y0 = null;
    el.addEventListener("touchstart", (e) => ([x0, y0] = [e.touches[0].clientX, e.touches[0].clientY]), { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    });
  }

  function settings() {
    modal({
      title: "Tùy chọn Flashcards",
      body: `
        <div class="field">
          <span class="label">Mặt trước của thẻ</span>
          <div class="segmented" role="group" aria-label="Mặt trước">
            <button type="button" data-front="term" aria-pressed="${opts.front === "term"}">Thuật ngữ</button>
            <button type="button" data-front="definition" aria-pressed="${opts.front === "definition"}">Định nghĩa</button>
          </div>
        </div>
        <label class="check"><input type="checkbox" id="opt-star" ${opts.starredOnly ? "checked" : ""} /> Chỉ học thẻ gắn sao</label>
        <label class="check"><input type="checkbox" id="opt-shuffle" ${opts.shuffle ? "checked" : ""} /> Trộn thứ tự thẻ</label>`,
      onOpen(panel) {
        panel.querySelectorAll("[data-front]").forEach((b) =>
          b.addEventListener("click", () => panel.querySelectorAll("[data-front]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))))
        );
      },
      actions: [
        { label: "Hủy", onClick: (close) => close() },
        {
          label: "Áp dụng",
          variant: "btn-primary",
          onClick: (close, panel) => {
            opts.front = panel.querySelector('[data-front][aria-pressed="true"]').dataset.front;
            opts.starredOnly = panel.querySelector("#opt-star").checked;
            opts.shuffle = panel.querySelector("#opt-shuffle").checked;
            store.setPref("flashcards", opts);
            syncShuffleBtn();
            close();
            start();
          },
        },
      ],
    });
  }
})();
