// Tiện ích UI dùng chung: navbar/footer, scroll reveal, modal, menu, toast, phát âm.
(function () {
  document.documentElement.classList.add("js");
  const { icon } = App;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const param = (name) => new URLSearchParams(location.search).get(name);

  const LOGO = `<svg class="logo__mark" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="7" width="14" height="14" rx="3.5" fill="#fff" opacity=".35"/><rect x="7.5" y="3" width="14" height="14" rx="3.5" fill="#fff"/></svg>`;

  const NAV_LINKS = [
    ["Môn học", "index.html#subjects"],
    ["Chế độ học", "index.html#features"],
    ["Tính năng", "index.html#platform"],
    ["Phương pháp", "index.html#methods"],
    ["Nhập nhanh", "index.html#import"],
  ];

  function renderNav() {
    const host = document.querySelector("[data-nav]");
    if (!host) return;
    host.className = "nav";
    host.innerHTML = `
      <div class="container nav__inner">
        <a class="logo" href="index.html" aria-label="Recall — trang chủ">${LOGO}<span>Recall</span></a>
        <ul class="nav__links">${NAV_LINKS.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>
        <div class="nav__actions">
          <a class="btn btn-ghost" href="index.html#import">Nhập thẻ</a>
          <a class="btn btn-primary" href="index.html#subjects">Bắt đầu học</a>
          <button class="nav__toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="drawer">${icon("menu")}</button>
        </div>
      </div>`;

    const drawer = document.createElement("nav");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.setAttribute("aria-label", "Menu chính");
    drawer.innerHTML =
      NAV_LINKS.map(([t, h]) => `<a href="${h}">${t}</a>`).join("") +
      `<a class="btn btn-primary btn-lg" href="index.html#subjects">Bắt đầu học</a>`;
    host.after(drawer);

    const toggle = host.querySelector(".nav__toggle");
    const setOpen = (open) => {
      drawer.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
      toggle.innerHTML = icon(open ? "x" : "menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setOpen(!drawer.classList.contains("is-open")));
    drawer.addEventListener("click", (e) => e.target.closest("a") && setOpen(false));
    document.addEventListener("keydown", (e) => e.key === "Escape" && drawer.classList.contains("is-open") && setOpen(false));

    const onScroll = () => host.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function renderFooter() {
    const host = document.querySelector("[data-footer]");
    if (!host) return;
    const cols = [
      ["Chế độ học", [["Flashcards", "index.html#features"], ["Học thích ứng", "index.html#features"], ["Kiểm tra", "index.html#features"], ["Ghép thẻ", "index.html#features"]]],
      ["Thư viện", [["Môn học", "index.html#subjects"], ["Thêm môn học", "index.html#subjects"], ["Nhập nhanh", "index.html#import"]]],
      ["Tính năng", [["Tiến độ", "index.html#platform"], ["Phát âm", "index.html#platform"], ["Phím tắt", "index.html#platform"], ["Thống kê", "index.html#platform"]]],
      ["Phương pháp", [["Chủ động nhớ lại", "index.html#methods"], ["Lặp lại ngắt quãng", "index.html#methods"], ["Tự kiểm tra", "index.html#methods"]]],
      ["Phím tắt", [["Space — lật thẻ", null], ["← → — chuyển thẻ", null], ["1–4 — chọn đáp án", null], ["Enter — tiếp tục", null]]],
      ["Dữ liệu", [["Xuất bản sao lưu", "export"], ["Nhập bản sao lưu", "import"], ["Khôi phục dữ liệu mẫu", "reset"]]],
    ];
    host.className = "footer";
    host.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          ${cols
            .map(
              ([title, links]) => `
            <div class="footer__col">
              <h4>${title}</h4>
              <ul>${links
                .map(([t, h]) =>
                  h === null
                    ? `<li><span class="footer__note">${t}</span></li>`
                    : /\.html/.test(h)
                      ? `<li><a href="${h}">${t}</a></li>`
                      : `<li><button type="button" data-data-action="${h}">${t}</button></li>`
                )
                .join("")}</ul>
            </div>`
            )
            .join("")}
        </div>
        <div class="footer__bottom">
          <a class="logo" href="index.html">${LOGO}<span>Recall</span></a>
          <span class="status-dot">${App.store.isPersistent() ? "Dữ liệu được lưu trên thiết bị này" : "Chế độ tạm thời — dữ liệu sẽ mất khi đóng trang"}</span>
        </div>
      </div>`;

    host.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-data-action]");
      if (!btn) return;
      const action = btn.dataset.dataAction;
      if (action === "export") {
        downloadJSON(`recall-backup-${new Date().toISOString().slice(0, 10)}.json`, App.store.exportData());
        toast("Đã tải xuống bản sao lưu");
      } else if (action === "import") {
        try {
          const data = await pickJSONFile();
          if (!data) return;
          const ok = await confirmDialog({ title: "Nhập bản sao lưu?", message: "Toàn bộ dữ liệu hiện tại sẽ được thay bằng dữ liệu trong tệp.", confirmLabel: "Nhập dữ liệu", danger: true });
          if (!ok) return;
          App.store.importData(data);
          toast("Đã nhập dữ liệu");
          setTimeout(() => location.reload(), 500);
        } catch (err) {
          toast(err.message || "Không đọc được tệp");
        }
      } else if (action === "reset") {
        const ok = await confirmDialog({ title: "Khôi phục dữ liệu mẫu?", message: "Mọi môn học, thẻ và tiến độ hiện tại sẽ bị xóa và thay bằng dữ liệu mẫu.", confirmLabel: "Khôi phục", danger: true });
        if (!ok) return;
        App.store.resetToSample();
        location.href = "index.html";
      }
    });
  }

  // ---------- Scroll reveal ----------
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer = null;

  function prepare(el) {
    if (el.matches("[data-stagger]")) {
      const step = Number(el.dataset.stagger) || 60;
      [...el.children].forEach((child, i) => child.style.setProperty("--delay", `${Math.min(i, 12) * step}ms`));
    }
    if (el.matches(".lines")) {
      el.querySelectorAll(":scope > .line > span").forEach((span, i) => span.style.setProperty("--line-delay", `${i * 90}ms`));
    }
  }

  function reveal(root = document) {
    const targets = [];
    if (root.matches && root.matches("[data-reveal], [data-stagger]")) targets.push(root);
    root.querySelectorAll("[data-reveal], [data-stagger]").forEach((el) => targets.push(el));
    targets.forEach(prepare);

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 }
      );
    }
    targets.forEach((el) => !el.classList.contains("is-visible") && observer.observe(el));
  }

  // ---------- Toast ----------
  function toast(message) {
    let host = document.querySelector(".toasts");
    if (!host) {
      host = document.createElement("div");
      host.className = "toasts";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.append(host);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    host.append(el);
    setTimeout(() => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    }, 2400);
  }

  // ---------- Modal ----------
  function modal({ title, sub = "", body = "", wide = false, actions = [], onOpen } = {}) {
    const previous = document.activeElement;
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = `
      <div class="modal__panel ${wide ? "modal__panel--wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__head">
          <div>
            <h2 class="modal__title" id="modal-title">${esc(title)}</h2>
            ${sub ? `<p class="modal__sub">${esc(sub)}</p>` : ""}
          </div>
          <button class="icon-btn" type="button" data-close aria-label="Đóng">${icon("x")}</button>
        </div>
        <div class="modal__body">${body}</div>
        ${actions.length ? `<div class="modal__foot"></div>` : ""}
      </div>`;
    const panel = wrap.querySelector(".modal__panel");
    const foot = wrap.querySelector(".modal__foot");

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      wrap.classList.remove("is-open");
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      setTimeout(() => wrap.remove(), 250);
      previous && previous.focus && previous.focus();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const focusable = [...panel.querySelectorAll("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])")].filter((n) => !n.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    actions.forEach((a) => {
      const b = document.createElement("button");
      b.type = a.submit ? "submit" : "button";
      b.className = `btn ${a.variant || "btn-secondary"}`;
      b.textContent = a.label;
      b.addEventListener("click", () => a.onClick && a.onClick(close, panel));
      foot.append(b);
    });

    wrap.addEventListener("mousedown", (e) => e.target === wrap && close());
    wrap.querySelector("[data-close]").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.append(wrap);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => wrap.classList.add("is-open"));
    onOpen && onOpen(panel, close);
    const firstField = panel.querySelector("input, textarea, select");
    (firstField || panel.querySelector(".modal__foot .btn:last-child") || panel.querySelector("[data-close]")).focus();
    return { close, panel };
  }

  function confirmDialog({ title, message = "", confirmLabel = "Xác nhận", danger = false }) {
    return new Promise((resolve) => {
      let answered = false;
      const m = modal({
        title,
        body: message ? `<p class="muted" style="margin:0">${esc(message)}</p>` : "",
        actions: [
          { label: "Hủy", onClick: (close) => close() },
          { label: confirmLabel, variant: danger ? "btn-danger" : "btn-primary", onClick: (close) => ((answered = true), resolve(true), close()) },
        ],
      });
      const obs = new MutationObserver(() => {
        if (!document.body.contains(m.panel)) {
          obs.disconnect();
          if (!answered) resolve(false);
        }
      });
      obs.observe(document.body, { childList: true });
    });
  }

  // ---------- Dropdown menu ----------
  function menu(anchor, items) {
    document.querySelectorAll(".menu").forEach((m) => m.remove());
    const el = document.createElement("div");
    el.className = "menu";
    el.setAttribute("role", "menu");
    items.forEach((item) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "menuitem");
      if (item.danger) b.className = "is-danger";
      b.innerHTML = `${icon(item.icon)}<span>${esc(item.label)}</span>`;
      b.addEventListener("click", () => {
        close();
        item.onClick();
      });
      el.append(b);
    });
    document.body.append(el);
    const r = anchor.getBoundingClientRect();
    const w = el.offsetWidth;
    el.style.top = `${r.bottom + window.scrollY + 6}px`;
    el.style.left = `${Math.max(8, Math.min(r.right + window.scrollX - w, window.innerWidth - w - 8))}px`;
    el.querySelector("button").focus();

    function close() {
      el.remove();
      document.removeEventListener("mousedown", outside, true);
      document.removeEventListener("keydown", onKey);
    }
    function outside(e) {
      if (!el.contains(e.target) && e.target !== anchor && !anchor.contains(e.target)) close();
    }
    function onKey(e) {
      if (e.key === "Escape") {
        close();
        anchor.focus();
      }
    }
    setTimeout(() => {
      document.addEventListener("mousedown", outside, true);
      document.addEventListener("keydown", onKey);
    });
    return close;
  }

  // ---------- Form môn học (dùng ở trang chủ và trang môn học) ----------
  const COLORS = ["#ffffff", "#0099ff", "#8855ff", "#22c55e", "#f5a524", "#f43f5e", "#22d3ee"];

  function subjectDialog(subject) {
    return new Promise((resolve) => {
      let picked = { icon: subject?.icon || "book", color: subject?.color || "#0099ff" };
      let done = false;
      const body = `
        <div class="field">
          <label for="sub-name">Tên môn học</label>
          <input class="input" id="sub-name" maxlength="60" placeholder="Ví dụ: Tiếng Anh, Sinh học 10…" value="${esc(subject?.name || "")}" required />
        </div>
        <div class="field">
          <label for="sub-desc">Mô tả <span class="subtle">(không bắt buộc)</span></label>
          <input class="input" id="sub-desc" maxlength="120" placeholder="Bạn đang ôn gì trong môn này?" value="${esc(subject?.description || "")}" />
        </div>
        <div class="field">
          <span class="label">Biểu tượng</span>
          <div class="icon-picker">${App.SUBJECT_ICONS.map((n) => `<button type="button" data-icon="${n}" aria-label="${n}" aria-pressed="${n === picked.icon}">${icon(n)}</button>`).join("")}</div>
        </div>
        <div class="field">
          <span class="label">Màu nhấn</span>
          <div class="color-picker">${COLORS.map((c) => `<button type="button" data-color="${c}" style="--c:${c}" aria-label="Màu ${c}" aria-pressed="${c === picked.color}"></button>`).join("")}</div>
        </div>`;
      const submit = (close, panel) => {
        const name = panel.querySelector("#sub-name");
        if (!name.value.trim()) {
          name.focus();
          name.style.borderColor = "var(--danger)";
          return;
        }
        const data = { name: name.value.trim(), description: panel.querySelector("#sub-desc").value.trim(), ...picked };
        const result = subject ? App.store.updateSubject(subject.id, data) : App.store.createSubject(data);
        done = true;
        resolve(result);
        close();
      };
      const m = modal({
        title: subject ? "Sửa môn học" : "Thêm môn học",
        sub: subject ? "" : "Mỗi môn học chứa nhiều học phần thẻ nhớ.",
        body,
        actions: [
          { label: "Hủy", onClick: (close) => close() },
          { label: subject ? "Lưu thay đổi" : "Tạo môn học", variant: "btn-primary", onClick: submit },
        ],
        onOpen(panel, close) {
          panel.addEventListener("click", (e) => {
            const ib = e.target.closest("[data-icon]");
            const cb = e.target.closest("[data-color]");
            if (ib) {
              picked.icon = ib.dataset.icon;
              panel.querySelectorAll("[data-icon]").forEach((b) => b.setAttribute("aria-pressed", String(b === ib)));
            }
            if (cb) {
              picked.color = cb.dataset.color;
              panel.querySelectorAll("[data-color]").forEach((b) => b.setAttribute("aria-pressed", String(b === cb)));
            }
          });
          panel.addEventListener("keydown", (e) => e.key === "Enter" && e.target.matches("input") && submit(close, panel));
        },
      });
      const obs = new MutationObserver(() => {
        if (!document.body.contains(m.panel)) {
          obs.disconnect();
          if (!done) resolve(null);
        }
      });
      obs.observe(document.body, { childList: true });
    });
  }

  // ---------- Phát âm ----------
  const VI_CHARS = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
  function speak(text) {
    if (!("speechSynthesis" in window) || !text) {
      toast("Trình duyệt không hỗ trợ phát âm");
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VI_CHARS.test(text) ? "vi-VN" : "en-US";
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }

  // ---------- Tệp ----------
  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function pickJSONFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json,.json";
      input.addEventListener("change", async () => {
        const file = input.files[0];
        if (!file) return resolve(null);
        try {
          resolve(JSON.parse(await file.text()));
        } catch {
          reject(new Error("Tệp JSON không hợp lệ"));
        }
      });
      input.click();
    });
  }

  function subjectIcon(subject, extra = "") {
    return `<span class="subject-icon ${extra}" style="--tint:${esc(subject?.color || "#fff")}">${icon(subject?.icon || "book")}</span>`;
  }

  const plural = (n, word) => `${n} ${word}`;

  // ---------- Thanh trên cùng của các chế độ học ----------
  const MODES = [
    { key: "flashcards", label: "Flashcards", icon: "layers", desc: "Lật thẻ, đánh dấu thẻ đã thuộc" },
    { key: "learn", label: "Học", icon: "sparkles", desc: "Trắc nghiệm rồi tự gõ đáp án" },
    { key: "test", label: "Kiểm tra", icon: "clipboard", desc: "Tạo đề, chấm điểm tức thì" },
    { key: "match", label: "Ghép thẻ", icon: "grid", desc: "Ghép cặp nhanh nhất có thể" },
  ];

  function studyBar({ mode, set, actions = "" }) {
    const m = MODES.find((x) => x.key === mode);
    const host = document.querySelector("[data-study-bar]");
    host.outerHTML = `
      <header class="study-bar">
        <div class="study-bar__left">
          <a class="icon-btn" href="set.html?id=${set.id}" aria-label="Thoát về học phần">${icon("x")}</a>
          <button class="btn btn-ghost study-bar__mode" type="button" id="mode-switch" aria-haspopup="menu">${icon(m.icon)}${m.label}${icon("chevron-down")}</button>
          <span class="study-bar__set">${esc(set.title)}</span>
        </div>
        <div class="study-bar__count" id="study-count" aria-live="polite"></div>
        <div class="study-bar__right">${actions}</div>
      </header>
      <div class="study-progress" role="progressbar" aria-label="Tiến độ" aria-valuemin="0" aria-valuemax="100"><i id="study-progress"></i></div>`;
    const btn = document.getElementById("mode-switch");
    btn.addEventListener("click", () =>
      menu(
        btn,
        MODES.filter((x) => x.key !== mode).map((x) => ({ label: x.label, icon: x.icon, onClick: () => (location.href = `${x.key}.html?set=${set.id}`) }))
      )
    );
    const countEl = document.getElementById("study-count");
    const bar = document.getElementById("study-progress");
    return {
      setCount: (text) => (countEl.textContent = text),
      setProgress: (ratio) => {
        const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100);
        bar.style.width = `${pct}%`;
        bar.parentElement.setAttribute("aria-valuenow", String(pct));
      },
    };
  }

  // Trang lỗi khi không tìm thấy dữ liệu
  function notFound(host, { title, message, href = "index.html", label = "Về trang chủ" }) {
    host.innerHTML = `<div class="empty" style="margin-top:24px">${icon("search")}<h1 class="h3">${esc(title)}</h1><p>${esc(message)}</p><a class="btn btn-primary" href="${href}">${esc(label)}</a></div>`;
  }

  window.App.ui = { esc, param, reveal, toast, modal, confirm: confirmDialog, menu, subjectDialog, speak, subjectIcon, plural, studyBar, notFound, MODES, LOGO };

  // Thay <span data-icon="x"> bằng SVG; data-icon-before="x" chèn icon vào đầu phần tử.
  function hydrateIcons(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => {
      // Phần tử chỉ mang data-icon thì thay hẳn bằng SVG; có class/thuộc tính khác thì giữ vỏ, chèn SVG vào trong.
      if (el.attributes.length === 1) el.outerHTML = icon(el.dataset.icon);
      else {
        el.innerHTML = icon(el.dataset.icon);
        el.removeAttribute("data-icon");
      }
    });
    root.querySelectorAll("[data-icon-before]").forEach((el) => {
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.iconBefore));
      el.removeAttribute("data-icon-before");
    });
  }

  window.App.ui.hydrateIcons = hydrateIcons;

  document.addEventListener("DOMContentLoaded", () => {
    hydrateIcons();
    renderNav();
    renderFooter();
    reveal();
  });
})();
