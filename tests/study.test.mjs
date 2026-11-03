// Unit test cho logic học tập thuần (assets/js/study.js). Chạy: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const study = createRequire(import.meta.url)("../assets/js/study.js");

// Bộ sinh số giả ngẫu nhiên có seed để test lặp lại được
function seeded(seed = 1) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

const cards = [
  { id: "a", term: "sustainable", definition: "bền vững" },
  { id: "b", term: "pollution", definition: "sự ô nhiễm" },
  { id: "c", term: "habitat", definition: "môi trường sống" },
  { id: "d", term: "recycle", definition: "tái chế" },
  { id: "e", term: "emission", definition: "khí thải; sự phát thải" },
];

test("shuffle giữ nguyên phần tử và không đổi mảng gốc", () => {
  const src = [1, 2, 3, 4, 5, 6];
  const out = study.shuffle(src, seeded(7));
  assert.deepEqual([...out].sort(), [...src].sort());
  assert.deepEqual(src, [1, 2, 3, 4, 5, 6]);
});

test("normalizeAnswer bỏ hoa/thường, khoảng trắng thừa, dấu câu cuối", () => {
  assert.equal(study.normalizeAnswer("  Bền   Vững. "), "bền vững");
  assert.equal(study.normalizeAnswer("Đường", { ignoreDiacritics: true }), "duong");
});

test("checkAnswer chấp nhận một trong các phương án cách nhau bởi ; hoặc /", () => {
  assert.equal(study.checkAnswer("khí thải", "khí thải; sự phát thải").correct, true);
  assert.equal(study.checkAnswer("sự phát thải", "khí thải; sự phát thải").correct, true);
  assert.equal(study.checkAnswer("tái chế", "bền vững").correct, false);
  assert.equal(study.checkAnswer("", "bền vững").correct, false);
});

test("checkAnswer đánh dấu gần đúng khi sai một ký tự", () => {
  const r = study.checkAnswer("polution", "pollution");
  assert.equal(r.correct, false);
  assert.equal(r.close, true);
});

test("checkAnswer có tùy chọn bỏ qua dấu tiếng Việt", () => {
  assert.equal(study.checkAnswer("ben vung", "bền vững").correct, false);
  assert.equal(study.checkAnswer("ben vung", "bền vững", { ignoreDiacritics: true }).correct, true);
});

test("buildChoices có đáp án đúng, không trùng, tối đa 4 phương án", () => {
  const choices = study.buildChoices(cards[0], cards, "definition", 4, seeded(3));
  assert.equal(choices.length, 4);
  assert.ok(choices.includes("bền vững"));
  assert.equal(new Set(choices).size, 4);
});

test("buildChoices giảm số phương án khi học phần ít thẻ", () => {
  assert.equal(study.buildChoices(cards[0], cards.slice(0, 2), "definition", 4).length, 2);
});

test("Leitner: đúng lên hộp, sai về hộp 1, tối đa MAX_BOX", () => {
  assert.equal(study.nextBox(0, true), 2);
  assert.equal(study.nextBox(2, true), 3);
  assert.equal(study.nextBox(study.MAX_BOX, true), study.MAX_BOX);
  assert.equal(study.nextBox(3, false), 1);
  assert.equal(study.masteryOf(0), "new");
  assert.equal(study.masteryOf(1), "learning");
  assert.equal(study.masteryOf(study.MAX_BOX), "mastered");
});

test("parseImport tự nhận dạng Tab, gạch ngang, dấu hai chấm", () => {
  const out = study.parseImport("a\tb\nc - d\n\ne: f g\nchỉ có thuật ngữ");
  assert.deepEqual(out, [
    { term: "a", definition: "b" },
    { term: "c", definition: "d" },
    { term: "e", definition: "f g" },
    { term: "chỉ có thuật ngữ", definition: "" },
  ]);
});

test("parseImport với dấu phân cách chỉ định", () => {
  assert.deepEqual(study.parseImport("x;y", { separator: ";" }), [{ term: "x", definition: "y" }]);
});

test("buildTest tạo đúng số câu và luân phiên các dạng", () => {
  const qs = study.buildTest(cards, { count: 5, types: ["mc", "tf", "written"], direction: "term" }, seeded(5));
  assert.equal(qs.length, 5);
  assert.deepEqual(qs.map((q) => q.type), ["mc", "tf", "written", "mc", "tf"]);
  for (const q of qs) {
    const card = cards.find((c) => c.id === q.cardId);
    assert.equal(q.prompt, card.term);
    assert.equal(q.answer, card.definition);
    if (q.type === "mc") assert.ok(q.choices.includes(q.answer));
    if (q.type === "tf") assert.equal(q.isTrue, q.shown === card.definition);
  }
});

test("gradeTest chấm điểm theo phần trăm", () => {
  const qs = study.buildTest(cards, { count: 4, types: ["written"], direction: "definition" }, seeded(9));
  const answers = Object.fromEntries(qs.map((q, i) => [q.id, i < 3 ? q.answer : "sai"]));
  const g = study.gradeTest(qs, answers);
  assert.equal(g.correctCount, 3);
  assert.equal(g.score, 75);
});

const quizCard = {
  id: "q",
  term: "Câu 1. Triết học ra đời do đâu?\n\nA. Do ý muốn chủ quan\nB. Do lý tính thế giới\nC. Do nhu cầu của thực tiễn.\nD. Cả a, b và c",
  definition: "C. Do nhu cầu của thực tiễn.",
};

test("parseQuiz tách câu hỏi, phương án và đáp án", () => {
  const q = study.parseQuiz(quizCard);
  assert.equal(q.question, "Câu 1. Triết học ra đời do đâu?");
  assert.deepEqual(q.options.map((o) => o.key), ["A", "B", "C", "D"]);
  assert.equal(q.answer.key, "C");
  assert.equal(study.parseQuiz(cards[0]), null);
  assert.equal(study.parseQuiz({ term: quizCard.term, definition: "E. không có" }), null);
});

test("checkAnswer với đáp án dạng 'C. nội dung' nhận chữ cái hoặc nội dung", () => {
  assert.equal(study.checkAnswer("c", quizCard.definition).correct, true);
  assert.equal(study.checkAnswer("Do nhu cầu của thực tiễn", quizCard.definition).correct, true);
  assert.equal(study.checkAnswer("b", quizCard.definition).correct, false);
});

test("buildTest với thẻ trắc nghiệm dùng chính các phương án, giữ thứ tự A–D", () => {
  const pool = [quizCard, { ...quizCard, id: "q2" }];
  const [mc, tf] = study.buildTest(pool, { count: 2, types: ["mc", "tf"] }, seeded(4));
  assert.equal(mc.quiz, true);
  assert.equal(mc.prompt, "Câu 1. Triết học ra đời do đâu?");
  assert.deepEqual(mc.choices, ["Do ý muốn chủ quan", "Do lý tính thế giới", "Do nhu cầu của thực tiễn.", "Cả a, b và c"]);
  assert.equal(study.gradeQuestion(mc, "Do nhu cầu của thực tiễn."), true);
  assert.equal(tf.isTrue, tf.shown.startsWith("C."));
});

const multiCard = {
  id: "m",
  term: "Câu 55. Mục đích là gì? (chọn ba đáp án)\n\nA. Giàu có\nB. Vị thế kinh tế\nC. Cơ sở khoa học\nD. Phát triển toàn diện",
  definition: "A. Giàu có\nC. Cơ sở khoa học\nD. Phát triển toàn diện\n\nGhi chú: theo bình luận.",
};

test("parseQuiz đọc nhiều đáp án đúng và bỏ qua ghi chú", () => {
  const q = study.parseQuiz(multiCard);
  assert.equal(q.multi, true);
  assert.deepEqual(q.answers.map((o) => o.key), ["A", "C", "D"]);
  assert.equal(q.answer.key, "A");
  assert.equal(study.parseQuiz(quizCard).multi, false);
  // Ghi chú sau dòng trống không làm hỏng câu một đáp án
  assert.equal(study.parseQuiz({ ...quizCard, definition: "C. Do nhu cầu của thực tiễn.\n\nGhi chú: x" }).answers.length, 1);
  assert.equal(study.parseQuiz({ ...multiCard, definition: "A. Giàu có\nE. không có" }), null);
});

test("câu chọn nhiều đáp án: trắc nghiệm chấm theo tập đáp án, không phụ thuộc thứ tự", () => {
  const [mc] = study.buildTest([multiCard, { ...multiCard, id: "m2" }], { count: 1, types: ["mc"] }, seeded(2));
  assert.equal(mc.multi, true);
  assert.deepEqual(mc.answers, ["Giàu có", "Cơ sở khoa học", "Phát triển toàn diện"]);
  const pick = (...xs) => JSON.stringify(xs);
  assert.equal(study.gradeQuestion(mc, pick("Phát triển toàn diện", "Giàu có", "Cơ sở khoa học")), true);
  assert.equal(study.gradeQuestion(mc, pick("Giàu có", "Cơ sở khoa học")), false);
  assert.equal(study.gradeQuestion(mc, pick("Giàu có", "Cơ sở khoa học", "Phát triển toàn diện", "Vị thế kinh tế")), false);
  assert.equal(study.gradeQuestion(mc, "Giàu có"), false);
  assert.deepEqual(study.selectionOf(pick("a", "b")), ["a", "b"]);
  assert.deepEqual(study.selectionOf("không phải JSON"), []);
});

test("câu chọn nhiều đáp án: tự luận gõ các chữ cái, đúng/sai theo từng đáp án", () => {
  const [w] = study.buildTest([multiCard, { ...multiCard, id: "m2" }], { count: 1, types: ["written"] }, seeded(2));
  assert.equal(study.gradeQuestion(w, "A, C, D"), true);
  assert.equal(study.gradeQuestion(w, "dca"), true);
  assert.equal(study.gradeQuestion(w, "A, C"), false);
  assert.equal(study.gradeQuestion(w, "A, B, C, D"), false);
  assert.equal(study.gradeQuestion(w, "Giàu có"), false);
  for (let s = 1; s <= 12; s++) {
    const [tf] = study.buildTest([multiCard, { ...multiCard, id: "m2" }], { count: 1, types: ["tf"] }, seeded(s));
    assert.equal(tf.isTrue, ["A.", "C.", "D."].some((k) => tf.shown.startsWith(k)));
  }
});

test("formatDuration", () => {
  assert.equal(study.formatDuration(12345), "12.3s");
  assert.equal(study.formatDuration(83400), "1:23.4");
});
