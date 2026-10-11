// Logic học tập thuần: không đụng DOM hay storage, dùng được cả trong trình duyệt lẫn Node (unit test).
(function (root) {
  // Leitner: 0 = chưa học, 1 = đang học (vừa sai), 2 = quen (trắc nghiệm đúng), 3 = đã thuộc.
  const MAX_BOX = 3;

  function shuffle(list, rand = Math.random) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function stripDiacritics(s) {
    return s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  function normalizeAnswer(s, { ignoreDiacritics = false } = {}) {
    let out = String(s ?? "")
      .normalize("NFC")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.,;:!?…]+$/u, "")
      .trim();
    if (ignoreDiacritics) out = stripDiacritics(out);
    return out;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // Đáp án có thể ghi nhiều phương án cách nhau bởi "/" hoặc ";" — khớp một phương án là đúng.
  function checkAnswer(given, expected, opts = {}) {
    const g = normalizeAnswer(given, opts);
    if (!g) return { correct: false, close: false };
    const variants = [expected, ...String(expected).split(/\s*[/;]\s*/)]
      .map((v) => normalizeAnswer(v, opts))
      .filter(Boolean);
    if (variants.includes(g)) return { correct: true, close: false };
    const close = variants.some((v) => v.length >= 4 && levenshtein(g, v) <= (v.length >= 10 ? 2 : 1));
    return { correct: false, close };
  }

  // Tạo phương án trắc nghiệm: đáp án đúng + đáp án nhiễu lấy từ thẻ khác trong cùng học phần.
  function buildChoices(card, pool, field, count = 4, rand = Math.random) {
    const correct = card[field];
    const seen = new Set([normalizeAnswer(correct)]);
    const distractors = [];
    for (const other of shuffle(pool, rand)) {
      if (other.id === card.id) continue;
      const key = normalizeAnswer(other[field]);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      distractors.push(other[field]);
      if (distractors.length >= count - 1) break;
    }
    return shuffle([correct, ...distractors], rand);
  }

  function nextBox(box, correct) {
    if (!correct) return 1;
    if (box <= 0) return 2;
    return Math.min(box + 1, MAX_BOX);
  }

  function masteryOf(box) {
    if (!box) return "new";
    return box >= MAX_BOX ? "mastered" : "learning";
  }

  const MASTERY_LABEL = { new: "Chưa học", learning: "Đang học", mastered: "Đã thuộc" };

  // Nhập nhanh: mỗi dòng một thẻ. "auto" thử lần lượt Tab, " - ", " – ", ":", ",".
  function parseImport(text, { separator = "auto" } = {}) {
    const AUTO = ["\t", " - ", " – ", " — ", ":", ","];
    const cards = [];
    for (const raw of String(text || "").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line) continue;
      const seps = separator === "auto" ? AUTO : [separator];
      let term = line;
      let definition = "";
      for (const sep of seps) {
        const idx = line.indexOf(sep);
        if (idx > 0) {
          term = line.slice(0, idx).trim();
          definition = line.slice(idx + sep.length).trim();
          break;
        }
      }
      if (term) cards.push({ term, definition });
    }
    return cards;
  }

  function sideFor(direction, rand) {
    if (direction === "both") return rand() < 0.5 ? "term" : "definition";
    return direction;
  }

  // Bài kiểm tra. direction = mặt được hiển thị làm câu hỏi: "term" | "definition" | "both".
  function buildTest(cards, { count, types = ["mc"], direction = "term" } = {}, rand = Math.random) {
    const picked = shuffle(cards, rand).slice(0, Math.max(1, Math.min(count || cards.length, cards.length)));
    const usable = types.filter((t) => t !== "mc" || cards.length >= 2).filter((t) => t !== "tf" || cards.length >= 2);
    const typeList = usable.length ? usable : ["written"];
    return picked.map((card, i) => {
      const type = typeList[i % typeList.length];
      const ask = sideFor(direction, rand);
      const answerField = ask === "term" ? "definition" : "term";
      const q = { id: `q${i + 1}`, cardId: card.id, type, ask, prompt: card[ask], answer: card[answerField] };
      if (type === "mc") q.choices = buildChoices(card, cards, answerField, 4, rand);
      if (type === "tf") {
        const isTrue = rand() < 0.5;
        const others = cards.filter((c) => c.id !== card.id && normalizeAnswer(c[answerField]) !== normalizeAnswer(card[answerField]));
        q.shown = isTrue || !others.length ? card[answerField] : others[Math.floor(rand() * others.length)][answerField];
        q.isTrue = q.shown === card[answerField];
      }
      return q;
    });
  }

  function gradeQuestion(q, given, opts) {
    if (given == null || given === "") return false;
    if (q.type === "mc") return given === q.answer;
    if (q.type === "tf") return (given === "true") === q.isTrue;
    return checkAnswer(given, q.answer, opts).correct;
  }

  function gradeTest(questions, answers, opts = {}) {
    const results = questions.map((q) => ({ question: q, given: answers[q.id] ?? "", correct: gradeQuestion(q, answers[q.id], opts) }));
    const correctCount = results.filter((r) => r.correct).length;
    return {
      results,
      correctCount,
      total: questions.length,
      score: questions.length ? Math.round((correctCount / questions.length) * 100) : 0,
    };
  }

  function formatDuration(ms) {
    const total = Math.max(0, ms) / 1000;
    const m = Math.floor(total / 60);
    const s = (total % 60).toFixed(1).padStart(4, "0");
    return m ? `${m}:${s}` : `${(total % 60).toFixed(1)}s`;
  }

  const api = {
    MAX_BOX,
    MASTERY_LABEL,
    shuffle,
    stripDiacritics,
    normalizeAnswer,
    levenshtein,
    checkAnswer,
    buildChoices,
    nextBox,
    masteryOf,
    parseImport,
    buildTest,
    gradeQuestion,
    gradeTest,
    formatDuration,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else {
    root.App = root.App || {};
    root.App.study = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
