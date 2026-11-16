// Test cài gói thẻ có sẵn trong store.js, đặc biệt bước chuyển đổi "replaces" (đụng vào dữ liệu người dùng).
// store.js là script trình duyệt nên chạy trong vm với localStorage giả.
import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const SRC = readFileSync(new URL("../assets/js/store.js", import.meta.url), "utf8");

function makeStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => void (data[k] = String(v)), removeItem: (k) => void delete data[k] };
}

// Mỗi lần "mở trang" là một vm mới nạp store.js với danh sách gói hiện hành, dùng chung localStorage.
function boot(packs, storage) {
  const sandbox = { localStorage: storage, crypto: globalThis.crypto, console, Date, JSON, Math };
  sandbox.window = sandbox;
  sandbox.addEventListener = () => {};
  sandbox.App = { PACKS: packs };
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox);
  return sandbox.App.store;
}

const card = (term, definition = "đ") => [term, definition];

// Cấu trúc cũ: mỗi đề một nhóm học phần "Chương" riêng, học phần tổng hợp kèm câu tự luận Q6.
const OLD = [
  { id: "old-re", subject: { name: "M" }, sets: [{ title: "Ch 1", cards: [card("Q1"), card("Q2"), card("Q6")] }, { title: "Ch 2", cards: [card("Q3")] }] },
  { id: "old-fe", extends: "old-re", subject: { name: "M" }, sets: [{ title: "FE Ch 1", cards: [card("F1"), card("F2")] }, { title: "FE Ch 2", cards: [card("F3")] }] },
  { id: "old-full", extends: "old-re", subject: { name: "M" }, sets: [{ title: "RE Full 3", cards: [card("Q1"), card("Q2"), card("Q3"), card("Q6")] }] },
];

// Cấu trúc mới: gộp đề vào chương, bỏ Q6, hai học phần tổng hợp.
const NEW = {
  id: "new-v2",
  replaces: { packs: ["old-re", "old-fe", "old-full"], dropSets: ["FE Ch 1", "FE Ch 2", "RE Full 3"] },
  subject: { name: "M" },
  sets: [
    { title: "Ch 1", description: "mới", cards: [card("Q1", "a2"), card("Q2"), card("F1"), card("F2")] },
    { title: "Ch 2", cards: [card("Q3"), card("F3")] },
    { title: "RE Full 2", cards: [card("Q1"), card("Q2"), card("Q3")] },
    { title: "FE Full", cards: [card("F1"), card("F2"), card("F3")] },
  ],
};

const subjectOf = (store, name = "M") => store.subjects().filter((s) => s.name === name);
// Dữ liệu từ vm có Array khác realm nên chuyển sang mảng thường trước khi so sánh sâu
const plain = (x) => JSON.parse(JSON.stringify(x));
const titles = (store, subject) => plain(store.sets(subject.id).map((t) => t.title));
const setByTitle = (store, subject, title) => store.sets(subject.id).find((t) => t.title === title);
const cardByTerm = (store, set, term) => store.cards(set.id).find((c) => c.term === term);

// Người dùng cũ: đã cài 3 gói cũ, đã học một số thẻ, có kết quả kiểm tra.
function existingUser() {
  const storage = makeStorage();
  const s1 = boot(OLD, storage);
  const subject = subjectOf(s1)[0];
  const ch1 = setByTitle(s1, subject, "Ch 1");
  const feCh1 = setByTitle(s1, subject, "FE Ch 1");
  const full = setByTitle(s1, subject, "RE Full 3");
  s1.setProgress(cardByTerm(s1, ch1, "Q1").id, { box: 3, correctStreak: 3 });
  s1.setProgress(cardByTerm(s1, ch1, "Q6").id, { box: 2 });
  s1.setProgress(cardByTerm(s1, feCh1, "F1").id, { box: 2, starred: true });
  s1.setProgress(cardByTerm(s1, full, "Q1").id, { box: 1 });
  s1.addResult({ setId: ch1.id, score: 80, total: 3, correctCount: 2, answers: [] });
  s1.addResult({ setId: feCh1.id, score: 50, total: 2, correctCount: 1, answers: [] });
  return { storage, ids: { subject: subject.id, ch1: ch1.id, q1: cardByTerm(s1, ch1, "Q1").id, q6: cardByTerm(s1, ch1, "Q6").id, feCh1: feCh1.id } };
}

test("người dùng mới chỉ nhận cấu trúc mới, không chạy chuyển đổi", () => {
  const store = boot([NEW], makeStorage());
  const [subject] = subjectOf(store);
  assert.deepEqual(titles(store, subject), ["Ch 1", "Ch 2", "RE Full 2", "FE Full"]);
  assert.equal(store.cards(setByTitle(store, subject, "Ch 1").id).length, 4);
});

test("chuyển đổi: học phần mới đúng thứ tự, học phần cũ bị gộp/xóa", () => {
  const { storage, ids } = existingUser();
  const store = boot([NEW], storage);
  const subject = subjectOf(store);
  assert.equal(subject.length, 1, "không tạo môn trùng");
  assert.equal(subject[0].id, ids.subject, "giữ nguyên môn cũ");
  assert.deepEqual(titles(store, subject[0]), ["Ch 1", "Ch 2", "RE Full 2", "FE Full"]);
  assert.equal(store.set(ids.feCh1), null, "học phần cũ trong dropSets bị xóa");
  const ch1 = setByTitle(store, subject[0], "Ch 1");
  assert.equal(ch1.id, ids.ch1, "học phần cùng tên giữ nguyên id (giữ kết quả kiểm tra)");
  assert.equal(ch1.description, "mới");
  assert.deepEqual(plain(store.cards(ch1.id).map((c) => c.term)), ["Q1", "Q2", "F1", "F2"]);
  assert.equal(cardByTerm(store, ch1, "Q1").definition, "a2", "nội dung thẻ được cập nhật");
});

test("chuyển đổi giữ tiến độ: thẻ còn lại giữ nguyên, thẻ chuyển chương kế thừa theo mặt trước", () => {
  const { storage, ids } = existingUser();
  const store = boot([NEW], storage);
  const subject = subjectOf(store)[0];
  const ch1 = setByTitle(store, subject, "Ch 1");
  const q1 = cardByTerm(store, ch1, "Q1");
  assert.equal(q1.id, ids.q1, "thẻ giữ nguyên id");
  assert.equal(store.progress(q1.id).box, 3);
  assert.equal(store.progress(q1.id).correctStreak, 3);
  const f1 = cardByTerm(store, ch1, "F1");
  assert.equal(store.progress(f1.id).box, 2, "F1 chuyển từ học phần FE cũ sang Ch 1");
  assert.equal(store.progress(f1.id).starred, true);
  // học phần tổng hợp mới thay học phần tổng hợp cũ: Q1 kế thừa tiến độ từ bản cũ
  const full = setByTitle(store, subject, "RE Full 2");
  assert.equal(store.progress(cardByTerm(store, full, "Q1").id).box, 1);
  assert.equal(store.progress(cardByTerm(store, full, "Q2").id).box, 0, "thẻ chưa học vẫn chưa học");
});

test("chuyển đổi xóa thẻ không còn trong gói (cả tiến độ) và dọn kết quả của học phần bị xóa", () => {
  const { storage, ids } = existingUser();
  const store = boot([NEW], storage);
  const data = store.exportData();
  assert.equal(data.cards.some((c) => c.term === "Q6"), false, "câu tự luận đã bỏ");
  assert.equal(data.progress[ids.q6], undefined, "tiến độ của thẻ bị xóa cũng bị xóa");
  assert.equal(store.results(ids.ch1).length, 1, "kết quả của học phần được giữ lại giữ");
  assert.equal(store.results(ids.feCh1).length, 0, "kết quả của học phần bị xóa được dọn");
  assert.ok(data.cards.every((c) => data.sets.some((t) => t.id === c.setId)), "không còn thẻ mồ côi");
  assert.ok(Object.keys(data.progress).every((id) => data.cards.some((c) => c.id === id)), "không còn tiến độ mồ côi");
});

test("chuyển đổi chỉ chạy một lần và không đụng học phần do người dùng tự tạo", () => {
  const { storage, ids } = existingUser();
  const s1 = boot(OLD, storage);
  const mine = s1.createSet({ subjectId: ids.subject, title: "Của tôi" }, [{ term: "T", definition: "D" }]);
  s1.updateSet(mine.id, { createdAt: Date.now() + 60_000 }); // người dùng tạo học phần này sau khi gói cũ đã cài
  boot([NEW], storage);
  const store = boot([NEW], storage); // mở lại lần nữa
  const subject = subjectOf(store)[0];
  assert.deepEqual(titles(store, subject), ["Ch 1", "Ch 2", "RE Full 2", "FE Full", "Của tôi"]);
  assert.equal(store.cards(mine.id).length, 1);
  assert.equal(store.cards(setByTitle(store, subject, "Ch 1").id).length, 4, "lần mở sau không nhân đôi thẻ");
});

test("người dùng đã xóa môn thì không bị tạo lại khi chuyển đổi", () => {
  const { storage, ids } = existingUser();
  const s1 = boot(OLD, storage);
  s1.deleteSubject(ids.subject);
  const store = boot([NEW], storage);
  assert.equal(subjectOf(store).length, 0);
});

test("người dùng đã xóa một học phần giữ lại thì học phần đó được tạo mới theo gói (không mất dữ liệu khác)", () => {
  const { storage, ids } = existingUser();
  const s1 = boot(OLD, storage);
  const subject = subjectOf(s1)[0];
  s1.deleteSet(setByTitle(s1, subject, "Ch 2").id);
  const store = boot([NEW], storage);
  const sub = subjectOf(store)[0];
  assert.deepEqual(titles(store, sub), ["Ch 1", "Ch 2", "RE Full 2", "FE Full"]);
  assert.equal(setByTitle(store, sub, "Ch 1").id, ids.ch1);
});
