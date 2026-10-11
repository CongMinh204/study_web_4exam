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

test("formatDuration", () => {
  assert.equal(study.formatDuration(12345), "12.3s");
  assert.equal(study.formatDuration(83400), "1:23.4");
});
