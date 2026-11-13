// Sinh assets/data/sap341.js từ các đề trong scripts/src/SAP341_*.md (không sửa tay file đầu ra).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SUBJECT = { name: "SAP341", description: "SAP341 · Đề FA2023 B10W RE, 50 câu theo mảng kiến thức", icon: "code", color: "#a3e635" };

// Đề đầu (FA2023) tạo môn và 8 học phần theo mảng. Các đề sau nối câu vào đúng học phần mảng đó
// (bỏ câu trùng giống hệt) và thêm một học phần tổng hợp riêng. Gói đã phát hành không được đổi id/nội dung.
const BASE = { file: "SAP341_FA2023_B10W_RE.md", code: "FA2023 B10W RE", expected: [9, 9, 3, 4, 3, 5, 6, 11] };
const BASE_PACK = "sap341-v1";
const BASE_FULL_PACK = "sap341-full-v1";
const LATER = [
  { file: "SAP341_SU2024_FE.md", code: "SU2024 FE", expected: [3, 9, 2, 10, 3, 6, 4, 13], id: "sap341-su24fe-v1" },
  { file: "SAP341_SU2024_RE.md", code: "SU2024 RE", expected: [5, 5, 4, 9, 4, 6, 4, 13], id: "sap341-su24re-v1" },
];

const noteText = "đáp án theo bình luận diễn đàn, không phải đáp án chính thức.";

function parseExam({ file, code, expected }) {
  const lines = readFileSync(join(root, "scripts/src", file), "utf8").split(/\r?\n/);
  const sets = [];
  let q = null;

  const flush = () => {
    if (!q) return;
    const m = q.answer.match(/^([A-F](?:\s*,\s*[A-F])*)$/);
    if (!m) throw new Error(`${code} ${q.title}: đáp án "${q.answer}" không đọc được`);
    const back = m[1]
      .split(/\s*,\s*/)
      .map((l) => {
        const opt = q.options.find((o) => o.key === l);
        if (!opt) throw new Error(`${code} ${q.title}: không có phương án ${l}`);
        return `${l}. ${opt.text}`;
      })
      .join("\n");
    const front = `${q.title}\n\n${q.options.map((o) => `${o.key}. ${o.text}`).join("\n")}`;
    sets.at(-1).cards.push([front, q.notes.length ? `${back}\n\nGhi chú: ${q.notes.join(" ")}` : back]);
    q = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^## (Mảng \d+: .+)$/))) {
      flush();
      sets.push({ title: m[1], cards: [] });
    } else if ((m = line.match(/^### (Câu \d+\..+)$/))) {
      flush();
      q = { title: m[1], options: [], answer: "", notes: [] };
    } else if (q && (m = line.match(/^- ([A-F])\. (.+)$/))) {
      q.options.push({ key: m[1], text: m[2] });
    } else if (q && (m = line.match(/^\*\*Đáp án: (.+)\*\*$/))) {
      q.answer = m[1];
    } else if (q && (m = line.match(/^> Lưu ý: (.+)$/))) {
      q.notes.push(m[1]);
    } else if (q && (m = line.match(/^> Kiểm lại: (.+)$/))) {
      q.notes.push(`Kiểm lại: ${m[1]}`);
    }
  }
  flush();

  const counts = sets.map((s) => s.cards.length);
  const nos = sets.flatMap((s) => s.cards.map(([front]) => questionNo(front)));
  console.log(`${code}: ${counts.join(" + ")} = ${nos.length} câu`);
  if (JSON.stringify(counts) !== JSON.stringify(expected)) throw new Error(`${code}: số câu mỗi mảng ${counts} khác mong đợi ${expected}`);
  if (new Set(nos).size !== 50 || Math.min(...nos) !== 1 || Math.max(...nos) !== 50) throw new Error(`${code}: các câu gốc phải là 1–50, không trùng`);
  return sets;
}

const questionNo = (front) => Number(front.match(/^Câu (\d+)\./)[1]);

// Khóa so khớp "giống hệt": nội dung câu hỏi + tập phương án + đáp án đúng (bỏ qua chữ cái và thứ tự phương án).
const norm = (t) => t.toLowerCase().replace(/\s+/g, " ").trim();
function keyOf([front, back]) {
  const [head, ...rest] = front.split("\n\n");
  const question = head.replace(/^Câu \d+\.\s*/, "");
  const optionTexts = rest.join("\n\n").split("\n").map((l) => l.replace(/^[A-F]\.\s*/, ""));
  const answerTexts = back.split("\n\n")[0].split("\n").map((l) => l.replace(/^[A-F]\.\s*/, ""));
  const sorted = (xs) => xs.map(norm).sort().join("|");
  return `${norm(question)}||${sorted(optionTexts)}||${sorted(answerTexts)}`;
}

// Học phần tổng hợp: cả đề theo đúng thứ tự câu gốc 1 → 50 (kể cả câu trùng với đề khác).
function fullSet(code, sets) {
  const cards = sets.flatMap((s) => s.cards).sort((a, b) => questionNo(a[0]) - questionNo(b[0]));
  return {
    title: `Đề ${code} · Tổng hợp ${cards.length} câu`,
    description: `Cả đề SAP341 ${code}, câu 1–${cards.length} không chia mảng · ${noteText}`,
    cards,
  };
}

const baseSets = parseExam(BASE).map((s) => ({ ...s, description: `Đề SAP341 ${BASE.code} · ${noteText}` }));
const packs = [
  { id: BASE_PACK, subject: SUBJECT, sets: baseSets },
  { id: BASE_FULL_PACK, extends: BASE_PACK, subject: SUBJECT, sets: [fullSet(BASE.code, baseSets)] },
];

// Thẻ đã có trong môn (để phát hiện câu trùng giữa các đề), kèm nhãn nguồn để báo cáo.
const seen = new Map();
for (const s of baseSets) for (const c of s.cards) seen.set(keyOf(c), `${BASE.code} ${c[0].split("\n")[0].match(/^Câu \d+/)[0]}`);

const examNames = [BASE.code];
for (const exam of LATER) {
  const sets = parseExam(exam);
  if (sets.length !== baseSets.length) throw new Error(`${exam.code}: cần ${baseSets.length} mảng`);
  examNames.push(exam.code);
  const dups = [];
  const into = [];
  sets.forEach((s, i) => {
    const fresh = [];
    for (const c of s.cards) {
      const k = keyOf(c);
      const label = `${exam.code} ${c[0].match(/^Câu \d+/)[0]}`;
      if (seen.has(k)) dups.push(`${label} = ${seen.get(k)}`);
      else {
        seen.set(k, label);
        fresh.push(c);
      }
    }
    // Nối vào học phần mảng cùng số của đề gốc; tên học phần không đổi để tiến độ và học phần cũ giữ nguyên.
    if (fresh.length) into.push({ into: baseSets[i].title, description: `Đề SAP341 ${examNames.join(", ")} · ${noteText}`, cards: fresh });
  });
  console.log(`  bỏ ${dups.length} câu trùng giống hệt, thêm ${into.reduce((n, s) => n + s.cards.length, 0)} câu vào các mảng`);
  dups.forEach((d) => console.log(`    - ${d}`));
  packs.push({ id: exam.id, extends: BASE_PACK, subject: SUBJECT, sets: [...into, fullSet(exam.code, sets)] });
}

const out = `// Bộ thẻ có sẵn: SAP341, sinh từ scripts/src/SAP341_*.md bằng scripts/gen-sap341.mjs.
// Mặt trước: câu hỏi kèm các phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${packs.map((p) => JSON.stringify(p, null, 1)).join(",\n")}
);
`;
writeFileSync(join(root, "assets/data/sap341.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
