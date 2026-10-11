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

  function seed() {
    const now = Date.now();
    const state = { version: VERSION, subjects: [], sets: [], cards: [], progress: {}, results: [], activity: {}, prefs: {} };
    const data = [
      {
        name: "Tiếng Anh",
        description: "Từ vựng và cụm động từ cho kỳ thi IELTS",
        icon: "languages",
        color: "#0099ff",
        sets: [
          {
            title: "IELTS: Chủ đề Môi trường",
            description: "Từ vựng thường gặp trong Writing Task 2 và Speaking",
            cards: [
              ["sustainable", "bền vững"],
              ["pollution", "sự ô nhiễm"],
              ["biodiversity", "đa dạng sinh học"],
              ["deforestation", "nạn phá rừng"],
              ["renewable energy", "năng lượng tái tạo"],
              ["emission", "khí thải; sự phát thải"],
              ["endangered species", "loài có nguy cơ tuyệt chủng"],
              ["conservation", "sự bảo tồn"],
              ["climate change", "biến đổi khí hậu"],
              ["carbon footprint", "lượng khí thải carbon (dấu chân carbon)"],
              ["habitat", "môi trường sống"],
              ["recycle", "tái chế"],
            ],
          },
          {
            title: "Phrasal verbs thông dụng",
            description: "Cụm động từ hay dùng trong giao tiếp",
            cards: [
              ["give up", "từ bỏ"],
              ["look after", "chăm sóc"],
              ["put off", "trì hoãn"],
              ["run out of", "hết, cạn kiệt"],
              ["come up with", "nghĩ ra (ý tưởng, giải pháp)"],
              ["carry on", "tiếp tục"],
              ["figure out", "hiểu ra, tìm ra"],
              ["turn down", "từ chối; vặn nhỏ"],
            ],
          },
        ],
      },
      {
        name: "Sinh học",
        description: "Cấu trúc tế bào và chức năng của các bào quan",
        icon: "leaf",
        color: "#22c55e",
        sets: [
          {
            title: "Tế bào học",
            description: "Sinh học 10 — cấu trúc tế bào nhân thực",
            cards: [
              ["Ti thể", "Bào quan thực hiện hô hấp tế bào, tạo ra năng lượng ATP"],
              ["Lục lạp", "Bào quan thực hiện quang hợp ở tế bào thực vật"],
              ["Ribôxôm", "Bào quan tổng hợp prôtêin"],
              ["Nhân tế bào", "Nơi chứa vật chất di truyền (ADN), điều khiển mọi hoạt động của tế bào"],
              ["Màng sinh chất", "Lớp màng bao bọc tế bào, kiểm soát sự vận chuyển các chất ra vào"],
              ["Bộ máy Gôngi", "Bào quan lắp ráp, đóng gói và phân phối các sản phẩm của tế bào"],
              ["Lưới nội chất hạt", "Hệ thống màng có gắn ribôxôm, tổng hợp prôtêin để tiết ra ngoài hoặc cấu tạo màng"],
              ["Không bào", "Bào quan chứa nước, chất dự trữ hoặc chất thải; đặc biệt lớn ở tế bào thực vật"],
              ["Lizôxôm", "Bào quan chứa enzim thủy phân, phân hủy tế bào và bào quan già, hỏng"],
            ],
          },
        ],
      },
      {
        name: "Lịch sử",
        description: "Các mốc sự kiện Việt Nam giai đoạn 1945–1975",
        icon: "landmark",
        color: "#f5a524",
        sets: [
          {
            title: "Lịch sử Việt Nam 1945–1975",
            description: "Ngày tháng và sự kiện quan trọng",
            cards: [
              ["19/8/1945", "Tổng khởi nghĩa giành chính quyền thắng lợi ở Hà Nội"],
              ["2/9/1945", "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hòa"],
              ["19/12/1946", "Chủ tịch Hồ Chí Minh ra Lời kêu gọi toàn quốc kháng chiến"],
              ["7/5/1954", "Chiến thắng Điện Biên Phủ"],
              ["21/7/1954", "Ký Hiệp định Giơnevơ về Đông Dương"],
              ["20/12/1960", "Mặt trận Dân tộc Giải phóng miền Nam Việt Nam ra đời"],
              ["27/1/1973", "Ký Hiệp định Pari về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam"],
              ["30/4/1975", "Chiến dịch Hồ Chí Minh toàn thắng, giải phóng hoàn toàn miền Nam"],
            ],
          },
        ],
      },
      {
        name: "Lập trình",
        description: "Khái niệm JavaScript nền tảng",
        icon: "code",
        color: "#8855ff",
        sets: [
          {
            title: "JavaScript cơ bản",
            description: "Biến, toán tử, mảng và bất đồng bộ",
            cards: [
              ["const", "Khai báo hằng: không thể gán lại, có phạm vi khối"],
              ["let", "Khai báo biến có phạm vi khối, có thể gán lại"],
              ["===", "So sánh bằng nghiêm ngặt: so cả giá trị và kiểu dữ liệu"],
              ["Array.prototype.map()", "Tạo mảng mới bằng cách áp dụng một hàm cho từng phần tử"],
              ["Array.prototype.filter()", "Tạo mảng mới gồm các phần tử thỏa điều kiện"],
              ["Promise", "Đối tượng đại diện cho kết quả thành công hoặc thất bại của một thao tác bất đồng bộ"],
              ["await", "Từ khóa tạm dừng hàm async cho đến khi Promise hoàn tất"],
              ["typeof null", 'Trả về "object" — một lỗi lịch sử của JavaScript'],
            ],
          },
        ],
      },
      {
        name: "Hóa học",
        description: "Ký hiệu và tên các nguyên tố thường gặp",
        icon: "flask",
        color: "#22d3ee",
        sets: [
          {
            title: "Nguyên tố hóa học thường gặp",
            description: "Ký hiệu hóa học → tên nguyên tố",
            cards: [
              ["H", "Hiđro"],
              ["O", "Oxi"],
              ["C", "Cacbon"],
              ["N", "Nitơ"],
              ["Na", "Natri"],
              ["K", "Kali"],
              ["Ca", "Canxi"],
              ["Cl", "Clo"],
              ["Fe", "Sắt"],
              ["Cu", "Đồng"],
              ["Ag", "Bạc"],
              ["Au", "Vàng"],
            ],
          },
        ],
      },
    ];

    data.forEach((s, si) => {
      const subject = { id: uid(), name: s.name, description: s.description, icon: s.icon, color: s.color, createdAt: now + si, updatedAt: now + si };
      state.subjects.push(subject);
      s.sets.forEach((set, ti) => {
        const studySet = { id: uid(), subjectId: subject.id, title: set.title, description: set.description, createdAt: now + si * 10 + ti, updatedAt: now + si * 10 + ti };
        state.sets.push(studySet);
        set.cards.forEach(([term, definition], order) => state.cards.push({ id: uid(), setId: studySet.id, term, definition, order }));
      });
    });
    return state;
  }

  let memoryOnly = false;
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === VERSION) return normalize(parsed);
      }
    } catch {
      memoryOnly = true;
    }
    const fresh = seed();
    persist(fresh);
    return fresh;
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
      commit();
    },
    resetToSample() {
      state = seed();
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
