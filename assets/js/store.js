// Repository dữ liệu. Mọi truy cập dữ liệu phải đi qua App.store — UI không chạm localStorage trực tiếp.
// MVP lưu trong localStorage; muốn thay bằng backend chỉ cần viết lại file này với cùng API.
(function () {
  const KEY = "recall.v1";
  const VERSION = 1;

  const uid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

  const today = () => new Date().toISOString().slice(0, 10);

  // Không còn môn mẫu: người dùng mới bắt đầu từ dữ liệu trống, chỉ có các bộ thẻ có sẵn (installPacks).
  function seed() {
    return { version: VERSION, subjects: [], sets: [], cards: [], progress: {}, results: [], activity: {}, prefs: {} };
  }

  // Dọn 5 môn mẫu cũ khỏi dữ liệu đã lưu, đúng một lần. Chỉ xóa môn còn nguyên mô tả gốc
  // (người dùng đã sửa mô tả thì coi là môn của họ và giữ lại).
  const OLD_SAMPLES = {
    "Tiếng Anh": "Từ vựng và cụm động từ cho kỳ thi IELTS",
    "Sinh học": "Cấu trúc tế bào và chức năng của các bào quan",
    "Lịch sử": "Các mốc sự kiện Việt Nam giai đoạn 1945–1975",
    "Lập trình": "Khái niệm JavaScript nền tảng",
    "Hóa học": "Ký hiệu và tên các nguyên tố thường gặp",
  };
  function removeOldSamples(s) {
    if (s.prefs.sampleRemoved) return false;
    s.prefs.sampleRemoved = true;
    const drop = new Set(s.subjects.filter((x) => OLD_SAMPLES[x.name] === x.description).map((x) => x.id));
    if (!drop.size) return true;
    const setIds = new Set(s.sets.filter((t) => drop.has(t.subjectId)).map((t) => t.id));
    s.cards.filter((c) => setIds.has(c.setId)).forEach((c) => delete s.progress[c.id]);
    s.cards = s.cards.filter((c) => !setIds.has(c.setId));
    s.results = s.results.filter((r) => !setIds.has(r.setId));
    s.sets = s.sets.filter((t) => !setIds.has(t.id));
    s.subjects = s.subjects.filter((x) => !drop.has(x.id));
    return true;
  }

  // Gói có "replaces": { packs, dropSets } thay cấu trúc học phần của các gói cũ đã phát hành (ví dụ gộp đề vào chương):
  // - học phần cùng tên được giữ, thẻ đối chiếu lại theo mặt trước (thẻ còn trong gói giữ nguyên id nên giữ tiến độ,
  //   thẻ không còn thì bị xóa, thẻ mới được thêm);
  // - học phần trong dropSets bị xóa, tiến độ của thẻ được chuyển sang thẻ cùng mặt trước ở học phần mới.
  // Trả về false nếu người dùng chưa từng cài gói cũ (cài như gói thường); đã xóa môn thì bỏ qua, không tạo lại.
  function migratePack(s, pack, packSubjects, installed, nextTick) {
    const { packs: oldIds, dropSets = [] } = pack.replaces;
    if (!oldIds.some((id) => installed.includes(id))) return false;
    const subject = oldIds.map((id) => s.subjects.find((x) => x.id === packSubjects[id])).find(Boolean) || s.subjects.find((x) => x.name === pack.subject.name);
    if (!subject) return true;

    const cardsOf = (setId) => s.cards.filter((c) => c.setId === setId);
    const own = s.sets.filter((t) => t.subjectId === subject.id);
    const dropped = own.filter((t) => dropSets.includes(t.title));
    // Tiến độ theo mặt trước của thẻ; trùng thì lấy bản học tốt hơn
    const byTerm = new Map();
    dropped.forEach((t) =>
      cardsOf(t.id).forEach((c) => {
        const p = s.progress[c.id];
        if (p && (!byTerm.has(c.term) || p.box > byTerm.get(c.term).box)) byTerm.set(c.term, p);
      })
    );

    // Mốc thời gian xuất phát từ học phần cũ sớm nhất của gói, để học phần người dùng tự tạo sau đó vẫn nằm sau
    const packTitles = new Set([...dropSets, ...pack.sets.map((x) => x.title)]);
    const base = Math.min(nextTick(), ...own.filter((t) => packTitles.has(t.title)).map((t) => t.createdAt));
    pack.sets.forEach((set, index) => {
      const at = base + index;
      let target = own.find((t) => t.title === set.title && !dropSets.includes(t.title));
      if (!target) {
        target = { id: uid(), subjectId: subject.id, title: set.title, description: "", createdAt: at, updatedAt: at };
        s.sets.push(target);
      }
      const existing = new Map(cardsOf(target.id).map((c) => [c.term, c]));
      const keep = new Set();
      set.cards.forEach(([term, definition], order) => {
        let card = existing.get(term);
        if (card) {
          card.definition = definition;
          card.order = order;
        } else {
          card = { id: uid(), setId: target.id, term, definition, order };
          s.cards.push(card);
          if (byTerm.has(term)) s.progress[card.id] = { ...byTerm.get(term), cardId: card.id };
        }
        keep.add(card.id);
      });
      cardsOf(target.id).filter((c) => !keep.has(c.id)).forEach((c) => delete s.progress[c.id]);
      s.cards = s.cards.filter((c) => c.setId !== target.id || keep.has(c.id));
      // Gán lại mốc thời gian theo thứ tự trong gói để danh sách học phần đúng thứ tự mới
      Object.assign(target, { description: set.description || "", createdAt: at, updatedAt: at });
    });

    const dropIds = new Set(dropped.map((t) => t.id));
    dropped.forEach((t) => cardsOf(t.id).forEach((c) => delete s.progress[c.id]));
    s.cards = s.cards.filter((c) => !dropIds.has(c.setId));
    s.results = s.results.filter((r) => !dropIds.has(r.setId));
    s.sets = s.sets.filter((t) => !dropIds.has(t.id));
    subject.updatedAt = nextTick();
    packSubjects[pack.id] = subject.id;
    return true;
  }

  // Bộ thẻ có sẵn (assets/data/*.js) được thêm đúng một lần cho mỗi người dùng;
  // ghi id vào prefs.installedPacks để môn đã bị xóa không tự xuất hiện lại.
  // Gói có "extends" nối học phần vào môn của gói gốc thay vì tạo môn mới.
  // Học phần có "into": <tiêu đề> thì nối thẻ vào học phần cùng tên đã có trong môn (giữ nguyên tiến độ các thẻ cũ);
  // người dùng đã xóa học phần đó thì bỏ qua, không tạo lại.
  function installPacks(s) {
    const packs = (window.App && App.PACKS) || [];
    const installed = (s.prefs.installedPacks = s.prefs.installedPacks || []);
    const packSubjects = (s.prefs.packSubjects = s.prefs.packSubjects || {});
    let changed = false;
    // Mốc thời gian tăng dần qua mọi gói để học phần của gói sau luôn xếp sau, không trùng createdAt.
    let tick = Date.now();
    packs.forEach((pack) => {
      if (installed.includes(pack.id)) return;
      if (pack.replaces && migratePack(s, pack, packSubjects, installed, () => tick++)) {
        installed.push(pack.id);
        changed = true;
        return;
      }
      const now = tick++;
      let subject = null;
      if (pack.extends) {
        // Gói cài trước khi có packSubjects thì tìm môn theo tên.
        subject = s.subjects.find((x) => x.id === packSubjects[pack.extends]) || s.subjects.find((x) => x.name === pack.subject.name);
        // Người dùng đã xóa môn gốc: tôn trọng, không tạo lại.
        if (!subject && installed.includes(pack.extends)) {
          installed.push(pack.id);
          changed = true;
          return;
        }
        if (subject) subject.updatedAt = now;
      }
      if (!subject) {
        subject = { id: uid(), ...pack.subject, createdAt: now, updatedAt: now };
        s.subjects.push(subject);
      }
      packSubjects[pack.id] = subject.id;
      pack.sets.forEach((set) => {
        const at = tick++;
        if (set.into) {
          const target = s.sets.find((t) => t.subjectId === subject.id && t.title === set.into);
          if (!target) return;
          const next = s.cards.filter((c) => c.setId === target.id).reduce((n, c) => Math.max(n, c.order + 1), 0);
          set.cards.forEach(([term, definition], i) => s.cards.push({ id: uid(), setId: target.id, term, definition, order: next + i }));
          if (set.description) target.description = set.description;
          target.updatedAt = at;
          return;
        }
        const studySet = { id: uid(), subjectId: subject.id, title: set.title, description: set.description || "", createdAt: at, updatedAt: at };
        s.sets.push(studySet);
        set.cards.forEach(([term, definition], order) => s.cards.push({ id: uid(), setId: studySet.id, term, definition, order }));
      });
      installed.push(pack.id);
      changed = true;
    });
    return changed;
  }

  let memoryOnly = false;
  let state = load();

  function load() {
    let s = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === VERSION) s = normalize(parsed);
      }
    } catch {
      memoryOnly = true;
    }
    const fresh = !s;
    if (fresh) s = seed();
    // Môn mẫu cũ phải bị dọn trước khi cài gói, để gói "extends" không nối nhầm vào môn mẫu trùng tên.
    const cleaned = removeOldSamples(s);
    if (installPacks(s) || cleaned || fresh) persist(s);
    return s;
  }

  function normalize(s) {
    return { subjects: [], sets: [], cards: [], progress: {}, results: [], activity: {}, prefs: {}, ...s };
  }

  function persist(s) {
    if (memoryOnly) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      memoryOnly = true;
    }
  }

  const listeners = new Set();
  function commit() {
    persist(state);
    listeners.forEach((fn) => fn());
  }

  // Đồng bộ khi dữ liệu thay đổi ở tab khác
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    state = load();
    listeners.forEach((fn) => fn());
  });

  const byOrder = (a, b) => a.order - b.order;
  const byCreated = (a, b) => a.createdAt - b.createdAt;

  const store = {
    uid,
    isPersistent: () => !memoryOnly,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    // ---- Môn học ----
    subjects: () => state.subjects.slice().sort(byCreated),
    subject: (id) => state.subjects.find((s) => s.id === id) || null,
    createSubject({ name, description = "", icon = "book", color = "#ffffff" }) {
      const now = Date.now();
      const subject = { id: uid(), name: name.trim(), description: description.trim(), icon, color, createdAt: now, updatedAt: now };
      state.subjects.push(subject);
      commit();
      return subject;
    },
    updateSubject(id, patch) {
      const s = store.subject(id);
      if (!s) return null;
      Object.assign(s, patch, { updatedAt: Date.now() });
      commit();
      return s;
    },
    deleteSubject(id) {
      state.sets.filter((t) => t.subjectId === id).forEach((t) => removeSet(t.id));
      state.subjects = state.subjects.filter((s) => s.id !== id);
      commit();
    },

    // ---- Học phần ----
    sets: (subjectId) => state.sets.filter((t) => !subjectId || t.subjectId === subjectId).sort(byCreated),
    set: (id) => state.sets.find((t) => t.id === id) || null,
    createSet({ subjectId, title, description = "" }, cards = []) {
      const now = Date.now();
      const set = { id: uid(), subjectId, title: title.trim(), description: description.trim(), createdAt: now, updatedAt: now };
      state.sets.push(set);
      store.replaceCards(set.id, cards, { silent: true });
      commit();
      return set;
    },
    updateSet(id, patch) {
      const t = store.set(id);
      if (!t) return null;
      Object.assign(t, patch, { updatedAt: Date.now() });
      commit();
      return t;
    },
    deleteSet(id) {
      removeSet(id);
      commit();
    },

    // ---- Thẻ ----
    cards: (setId) => state.cards.filter((c) => c.setId === setId).sort(byOrder),
    card: (id) => state.cards.find((c) => c.id === id) || null,
    // Giữ nguyên id của thẻ cũ để không mất tiến độ học.
    replaceCards(setId, list, { silent = false } = {}) {
      const keepIds = new Set();
      const next = list
        .filter((c) => (c.term || "").trim() || (c.definition || "").trim())
        .map((c, order) => {
          const id = c.id && state.cards.some((x) => x.id === c.id) ? c.id : uid();
          keepIds.add(id);
          return { id, setId, term: (c.term || "").trim(), definition: (c.definition || "").trim(), order };
        });
      state.cards
        .filter((c) => c.setId === setId && !keepIds.has(c.id))
        .forEach((c) => delete state.progress[c.id]);
      state.cards = state.cards.filter((c) => c.setId !== setId).concat(next);
      const set = store.set(setId);
      if (set) set.updatedAt = Date.now();
      if (!silent) commit();
      return next;
    },

    // ---- Tiến độ ----
    progress: (cardId) => ({ box: 0, correctStreak: 0, starred: false, ...(state.progress[cardId] || {}) }),
    setProgress(cardId, patch) {
      state.progress[cardId] = { ...store.progress(cardId), ...patch, cardId };
      commit();
    },
    // Ghi kết quả một lần trả lời theo hệ Leitner
    recordAnswer(cardId, correct) {
      const p = store.progress(cardId);
      state.progress[cardId] = {
        ...p,
        cardId,
        box: App.study.nextBox(p.box, correct),
        correctStreak: correct ? p.correctStreak + 1 : 0,
        lastReviewedAt: Date.now(),
      };
      const d = today();
      state.activity[d] = (state.activity[d] || 0) + 1;
      commit();
    },
    toggleStar(cardId) {
      const starred = !store.progress(cardId).starred;
      store.setProgress(cardId, { starred });
      return starred;
    },
    resetProgress(setId) {
      store.cards(setId).forEach((c) => {
        const starred = store.progress(c.id).starred;
        state.progress[c.id] = { cardId: c.id, box: 0, correctStreak: 0, starred };
      });
      commit();
    },
    setStats(setId) {
      const cards = store.cards(setId);
      const counts = { new: 0, learning: 0, mastered: 0 };
      cards.forEach((c) => counts[App.study.masteryOf(store.progress(c.id).box)]++);
      return { total: cards.length, ...counts, percent: cards.length ? Math.round((counts.mastered / cards.length) * 100) : 0 };
    },
    subjectStats(subjectId) {
      const sets = store.sets(subjectId);
      let total = 0;
      let mastered = 0;
      let learning = 0;
      sets.forEach((t) => {
        const s = store.setStats(t.id);
        total += s.total;
        mastered += s.mastered;
        learning += s.learning;
      });
      return { sets: sets.length, cards: total, mastered, learning, percent: total ? Math.round((mastered / total) * 100) : 0 };
    },
    activity(days = 14) {
      const out = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
        out.push({ date: d, count: state.activity[d] || 0 });
      }
      return out;
    },

    // ---- Kết quả kiểm tra ----
    results: (setId) => state.results.filter((r) => r.setId === setId).sort((a, b) => b.takenAt - a.takenAt),
    addResult(result) {
      const r = { id: uid(), takenAt: Date.now(), ...result };
      state.results.push(r);
      commit();
      return r;
    },

    // ---- Tùy chọn ----
    pref: (key, fallback = null) => (key in state.prefs ? state.prefs[key] : fallback),
    setPref(key, value) {
      state.prefs[key] = value;
      commit();
    },

    // ---- Sao lưu ----
    exportData: () => JSON.parse(JSON.stringify(state)),
    importData(data) {
      if (!data || data.version !== VERSION || !Array.isArray(data.subjects) || !Array.isArray(data.sets) || !Array.isArray(data.cards)) {
        throw new Error("Tệp không đúng định dạng dữ liệu của Recall");
      }
      state = normalize(data);
      installPacks(state);
      commit();
    },
    resetToSample() {
      state = seed();
      removeOldSamples(state);
      installPacks(state);
      commit();
    },
  };

  function removeSet(setId) {
    state.cards.filter((c) => c.setId === setId).forEach((c) => delete state.progress[c.id]);
    state.cards = state.cards.filter((c) => c.setId !== setId);
    state.results = state.results.filter((r) => r.setId !== setId);
    state.sets = state.sets.filter((t) => t.id !== setId);
  }

  window.App = window.App || {};
  App.store = store;
})();
