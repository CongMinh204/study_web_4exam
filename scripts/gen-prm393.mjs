// Sinh assets/data/prm393.js từ scripts/src/PRM393_SU26_FE.md và PRM392_2025_cau_on_PRM393.md (không sửa tay file đầu ra).
// Gói đầu: đề SU26 FE không chia chương nên chỉ có một học phần, cả đề câu 1 → 50.
// Gói thứ hai: các câu PRM392 2025 dùng được để ôn PRM393, nối vào môn PRM393 theo chủ đề.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { questionNo } from "./lib/exam-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = "PRM393_SU26_FE.md";
const EXPECTED = 50;

const SUBJECT = { name: "PRM393", description: `PRM393 · Đề SU26 FE, ${EXPECTED} câu trắc nghiệm Flutter`, icon: "code", color: "#38bdf8" };

const lines = readFileSync(join(root, "scripts/src", FILE), "utf8").split(/\r?\n/);
const cards = [];
let q = null;

const flush = () => {
  if (!q) return;
  const m = q.answer.match(/^([A-F](?:\s*,\s*[A-F])*)$/);
  if (!m) throw new Error(`${q.title}: đáp án "${q.answer}" không đọc được`);
  if (q.options.length < 2) throw new Error(`${q.title}: thiếu phương án`);
  const back = m[1]
    .split(/\s*,\s*/)
    .map((l) => {
      const opt = q.options.find((o) => o.key === l);
      if (!opt) throw new Error(`${q.title}: không có phương án ${l}`);
      return `${l}. ${opt.text}`;
    })
    .join("\n");
  const front = `${q.title}\n\n${q.options.map((o) => `${o.key}. ${o.text}`).join("\n")}`;
  cards.push([front, q.notes.length ? `${back}\n\nGhi chú: ${q.notes.join(" ")}` : back]);
  q = null;
};

for (const line of lines) {
  let m;
  if ((m = line.match(/^## Câu (\d+)$/))) {
    flush();
    q = { no: m[1], text: "", options: [], answer: "", notes: [], title: `Câu ${m[1]}` };
  } else if (!q) continue;
  else if ((m = line.match(/^- ([A-F])\. (.+)$/))) q.options.push({ key: m[1], text: m[2] });
  else if ((m = line.match(/^\*\*Đáp án: (.+)\*\*$/))) q.answer = m[1];
  else if ((m = line.match(/^> Lưu ý: (.+)$/))) q.notes.push(m[1]);
  else if (line.trim() && !q.options.length && !q.text) {
    q.text = line.trim();
    q.title = `Câu ${q.no}. ${q.text}`;
  }
}
flush();

const nos = cards.map(([front]) => questionNo(front));
console.log(`${FILE}: ${cards.length} câu`);
if (cards.length !== EXPECTED || nos.some((n, i) => n !== i + 1)) throw new Error(`các câu phải liền mạch 1–${EXPECTED}`);
if (cards.some(([front]) => !/^Câu \d+\. .+\n\nA\. /s.test(front))) throw new Error("có câu thiếu nội dung câu hỏi");

const note = "đáp án theo đa số bình luận của sinh viên, không phải đáp án chính thức.";
const pack = {
  id: "prm393-v1",
  subject: SUBJECT,
  sets: [{ title: `Đề SU26 FE · Tổng hợp ${EXPECTED} câu`, description: `Cả đề PRM393 SU26 FE, câu 1–${EXPECTED} · ${note}`, cards }],
};

// Gói đầu đã phát hành nên không đổi id/nội dung; gói bổ sung dùng "extends".
const TOPIC_FILE = "PRM392_2025_cau_on_PRM393.md";
const TOPIC_EXPECTED = [2, 1, 1, 5, 2];
const topicNote = "câu hỏi từ đề PRM392 SU25/SP25 FE, chọn lọc phần dùng được cho Flutter · đáp án theo bình luận cộng đồng, không chính thức.";

function parseTopics() {
  const sets = [];
  let t = null;
  const flushTopic = () => {
    if (!t) return;
    const m = t.answer.match(/^([A-F])$/);
    const opt = m && t.options.find((o) => o.key === m[1]);
    if (!opt || t.options.length < 2 || !t.text) throw new Error(`${t.label}: câu hỏi/đáp án không đọc được`);
    const no = sets.at(-1).cards.length + 1;
    const front = `Câu ${no}. ${t.text}\n\n${t.options.map((o) => `${o.key}. ${o.text}`).join("\n")}`;
    const notes = [`Nguồn: ${t.label}.`, ...(t.flutter ? [`Liên hệ Flutter: ${t.flutter}`] : [])];
    sets.at(-1).cards.push([front, `${opt.key}. ${opt.text}\n\nGhi chú: ${notes.join(" ")}`]);
    t = null;
  };
  for (const line of readFileSync(join(root, "scripts/src", TOPIC_FILE), "utf8").split(/\r?\n/)) {
    let m;
    if ((m = line.match(/^## \d+\. (.+)$/))) {
      flushTopic();
      sets.push({ title: `PRM392 · ${m[1].replace(/\s*\(.*\)$/, "")}`, description: topicNote, cards: [] });
    } else if (line.startsWith("## ")) {
      flushTopic();
      sets.push(null);
    } else if (!sets.at(-1)) continue;
    else if ((m = line.match(/^### (PRM392 [A-Z0-9]+ FE - Câu \d+)/))) {
      flushTopic();
      t = { label: m[1], text: "", options: [], answer: "", flutter: "" };
    } else if (!t) continue;
    else if ((m = line.match(/^- ([A-F])\. (.+)$/))) t.options.push({ key: m[1], text: m[2] });
    else if ((m = line.match(/^\*\*Đáp án: (.+)\*\*$/))) t.answer = m[1];
    else if ((m = line.match(/^Liên hệ Flutter: (.+)$/))) t.flutter = m[1];
    else if (line.trim() && !t.options.length && !t.text) t.text = line.trim();
  }
  flushTopic();
  return sets.filter((x) => x && x.cards.length);
}

const topicSets = parseTopics();
const counts = topicSets.map((x) => x.cards.length);
console.log(`${TOPIC_FILE}: ${counts.join(" + ")} = ${counts.reduce((a, b) => a + b, 0)} câu`);
if (JSON.stringify(counts) !== JSON.stringify(TOPIC_EXPECTED)) throw new Error(`số câu mỗi chủ đề ${counts} khác mong đợi ${TOPIC_EXPECTED}`);

const packs = [pack, { id: "prm393-topics-v1", extends: pack.id, subject: SUBJECT, sets: topicSets }];

const out = `// Bộ thẻ có sẵn: PRM393, sinh từ scripts/src/PRM393_SU26_FE.md và PRM392_2025_cau_on_PRM393.md bằng scripts/gen-prm393.mjs.
// Mặt trước: câu hỏi kèm các phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${packs.map((p) => JSON.stringify(p, null, 1)).join(",\n")}
);
`;
writeFileSync(join(root, "assets/data/prm393.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
