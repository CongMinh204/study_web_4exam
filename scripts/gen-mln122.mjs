// Sinh assets/data/mln122.js từ các đề trong scripts/src/MLN122_*.md (không sửa tay file đầu ra).
// Mỗi chương là MỘT học phần chứa câu của mọi đề (bỏ câu trùng giống hệt) + mỗi đề có một học phần tổng hợp.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { questionNo, keyOf, labelOf } from "./lib/exam-cards.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SUBJECT = { name: "MLN122 FE", description: "MLN122 · Kinh tế chính trị Mác–Lênin · Đề FE SU26 (RE, FE C1) theo chương", icon: "landmark", color: "#06b6d4" };

const CHAPTER_TITLES = {
  1: "Đối tượng, phương pháp nghiên cứu và chức năng của KTCT Mác–Lênin",
  2: "Hàng hóa, thị trường và vai trò của các chủ thể tham gia thị trường",
  3: "Giá trị thặng dư trong nền kinh tế thị trường",
  4: "Cạnh tranh và độc quyền trong nền kinh tế thị trường",
  5: "Kinh tế thị trường định hướng XHCN và các quan hệ lợi ích kinh tế ở Việt Nam",
  6: "Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam",
};
const chapterTitle = (n) => `Chương ${n}: ${CHAPTER_TITLES[n]}`;

// Thứ tự đề = thứ tự câu trong mỗi chương. `missing`: câu cố ý bỏ khỏi đề (ảnh đề mất phương án, chỉ làm được thẻ tự luận).
const EXAMS = [
  { file: "MLN122_SU26_RE.md", code: "RE", expected: [10, 10, 9, 7, 7, 15], missing: [6, 14] },
  { file: "MLN122_SU26_FE_C1.md", code: "FE C1", expected: [9, 12, 9, 12, 12, 6], missing: [] },
];

// Gói cũ đã phát hành (tách riêng từng đề thành các học phần "Chương N" lặp lại): gói mới thay thế bằng bước chuyển đổi
// trong store.js, giữ tiến độ học theo nội dung câu hỏi. Học phần cùng tên được giữ lại; học phần dưới đây bị xóa.
const OLD_PACKS = ["mln122-v1", "mln122-full-v1", "mln122-fec1-v1"];
const OLD_DROP_SETS = [
  ...[1, 2, 3, 4, 5, 6].map((n) => `Đề FE C1 · ${chapterTitle(n)}`),
  "Đề RE · Tổng hợp 60 câu",
];

const noteText = "đáp án theo bình luận diễn đàn, không phải đáp án chính thức.";

function parseExam({ file, code, expected, missing }) {
  const lines = readFileSync(join(root, "scripts/src", file), "utf8").split(/\r?\n/);
  const chapters = [];
  let q = null;

  // Đáp án là chữ cái (có thể nhiều chữ) thì ghi nội dung phương án ở mặt sau, mỗi đáp án một dòng.
  // Ghi chú (trong ngoặc hoặc dòng "> Lưu ý") nằm cuối mặt sau. Câu không có phương án bị từ chối: app sẽ coi là thẻ tự luận.
  const flush = () => {
    if (!q) return;
    if (!q.options.length) throw new Error(`${code} ${q.title}: câu không có phương án A–D (sẽ thành thẻ tự luận), hãy bỏ khỏi đề`);
    const m = q.answer.match(/^([A-F](?:\s*,\s*[A-F])*)\s*(?:\((.+)\))?$/);
    if (!m) throw new Error(`${code} ${q.title}: đáp án "${q.answer}" không khớp phương án`);
    const notes = [...q.notes];
    const back = m[1]
      .split(/\s*,\s*/)
      .map((l) => {
        const opt = q.options.find((o) => o.key === l);
        if (!opt) throw new Error(`${code} ${q.title}: không có phương án ${l}`);
        return `${l}. ${opt.text}`;
      })
      .join("\n");
    if (m[2]) notes.unshift(m[2]);
    const front = `${q.title}\n\n${q.options.map((o) => `${o.key}. ${o.text}`).join("\n")}`;
    chapters.at(-1).cards.push([front, notes.length ? `${back}\n\nGhi chú: ${notes.join(" ")}` : back]);
    q = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^## CHƯƠNG (\d+):/))) {
      flush();
      chapters.push({ no: Number(m[1]), cards: [] });
    } else if ((m = line.match(/^### (Câu \d+\..+)$/))) {
      flush();
      q = { title: m[1], options: [], answer: "", notes: [] };
    } else if (q && (m = line.match(/^- ([A-F])\. (.+)$/))) {
      q.options.push({ key: m[1], text: m[2] });
    } else if (q && (m = line.match(/^\*\*Đáp án: (.+)\*\*$/))) {
      q.answer = m[1];
    } else if (q && (m = line.match(/^> Lưu ý: (.+)$/))) {
      q.notes.push(m[1]);
    }
  }
  flush();

  const counts = chapters.map((c) => c.cards.length);
  const nos = chapters.flatMap((c) => c.cards.map(([front]) => questionNo(front)));
  console.log(`${code}: ${counts.join(" + ")} = ${nos.length} câu`);
  if (JSON.stringify(counts) !== JSON.stringify(expected)) throw new Error(`${code}: số câu mỗi chương ${counts} khác mong đợi ${expected}`);
  const want = Array.from({ length: 60 }, (_, i) => i + 1).filter((n) => !missing.includes(n));
  if (JSON.stringify([...nos].sort((a, b) => a - b)) !== JSON.stringify(want)) throw new Error(`${code}: các câu gốc phải là 1–60 (trừ ${missing}), không trùng`);
  return chapters;
}

// Học phần tổng hợp: cả đề theo đúng thứ tự câu gốc (trong học phần theo chương, các câu cuối đề nằm rải ở các chương).
function fullSet(code, chapters) {
  const cards = chapters.flatMap((c) => c.cards).sort((a, b) => questionNo(a[0]) - questionNo(b[0]));
  return {
    title: `Đề ${code} · Tổng hợp ${cards.length} câu`,
    description: `Cả đề MLN122 SU26 ${code}, câu 1–60 không chia chương · ${noteText}`,
    cards,
  };
}

const parsed = EXAMS.map((exam) => ({ exam, chapters: parseExam(exam) }));

// Các học phần theo chương: câu của đề đầu trước, đề sau nối tiếp (bỏ câu trùng giống hệt với câu đã có).
const seen = new Map();
const merged = [1, 2, 3, 4, 5, 6].map((n) => ({ title: chapterTitle(n), description: `Đề MLN122 SU26 ${EXAMS.map((e) => e.code).join(", ")} · ${noteText}`, cards: [] }));
for (const { exam, chapters } of parsed) {
  const dups = [];
  chapters.forEach((c, i) => {
    for (const card of c.cards) {
      const k = keyOf(card);
      if (seen.has(k)) dups.push(`${labelOf(exam.code, card[0])} = ${seen.get(k)}`);
      else {
        seen.set(k, labelOf(exam.code, card[0]));
        merged[i].cards.push(card);
      }
    }
  });
  if (dups.length) console.log(`  bỏ ${dups.length} câu trùng giống hệt của đề ${exam.code}:\n${dups.map((d) => `    - ${d}`).join("\n")}`);
}
console.log(`Học phần theo chương: ${merged.map((s) => s.cards.length).join(" + ")} = ${merged.reduce((n, s) => n + s.cards.length, 0)} câu`);

const pack = {
  id: "mln122-v2",
  replaces: { packs: OLD_PACKS, dropSets: OLD_DROP_SETS },
  subject: SUBJECT,
  sets: [...merged, ...parsed.map(({ exam, chapters }) => fullSet(exam.code, chapters))],
};

const out = `// Bộ thẻ có sẵn: MLN122 FE (Kinh tế chính trị Mác–Lênin), sinh từ scripts/src/MLN122_*.md bằng scripts/gen-mln122.mjs.
// Mặt trước: câu hỏi kèm các phương án. Mặt sau: đáp án (câu chọn nhiều đáp án ghi mỗi đáp án một dòng).
// Được thêm một lần vào dữ liệu người dùng (store.js); "replaces" chuyển đổi cấu trúc của các gói mln122 cũ, giữ tiến độ học.
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${JSON.stringify(pack, null, 1)}
);
`;
writeFileSync(join(root, "assets/data/mln122.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
