// Sinh assets/data/mln111-retake.js từ các đề trong scripts/src/ (không sửa tay file đầu ra).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SUBJECT = { name: "MLN111 FE retake", description: "MLN111 · Đề FE retake SU26 (C2FE, RE, C1FE) theo chương", icon: "brain", color: "#f59e0b" };

const CHAPTER_TITLES = {
  1: "Khái luận về triết học và triết học Mác–Lênin",
  2: "Chủ nghĩa duy vật biện chứng",
  3: "Chủ nghĩa duy vật lịch sử",
};

// Mỗi đề là một gói riêng. Đề thêm sau dùng "extends" để nối học phần vào môn của gói đầu,
// vì gói đầu đã được cài cho người dùng cũ và không cài lại.
// withFull: học phần tổng hợp nằm ngay trong gói của đề (đề C2FE, RE có tổng hợp ở gói riêng, thêm sau).
const EXAMS = [
  { id: "mln111-retake-v1", file: "MLN111_SU26_C2FE.md", code: "C2FE", prefix: "" },
  { id: "mln111-retake-re-v1", file: "MLN111_SU26_RE.md", code: "RE", prefix: "Đề RE · ", extends: "mln111-retake-v1" },
  { id: "mln111-retake-c1fe-v1", file: "MLN111_SU26_C1FE.md", code: "C1FE", prefix: "Đề C1FE · ", extends: "mln111-retake-v1", withFull: true },
];

function parseExam({ file, code, prefix }) {
  const lines = readFileSync(join(root, "scripts/src", file), "utf8").split(/\r?\n/);
  const chapters = [];
  let q = null;

  // Đáp án nhiều chữ cái (câu "chọn nhiều đáp án") ghi thành nhiều dòng; ghi chú (nếu có) ở cuối mặt sau.
  const flush = () => {
    if (!q) return;
    const m = q.answer.match(/^([A-F](?:\s*,\s*[A-F])*)\s*(?:\((.+)\))?$/);
    if (!m) throw new Error(`${file}: không đọc được đáp án "${q.answer}" của ${q.title}`);
    const back = m[1]
      .split(/\s*,\s*/)
      .map((l) => {
        const opt = q.options.find((o) => o.key === l);
        if (!opt) throw new Error(`${file}: ${q.title} không có phương án ${l}`);
        return `${l}. ${opt.text}`;
      })
      .join("\n");
    const front = `${q.title}\n\n${q.options.map((o) => `${o.key}. ${o.text}`).join("\n")}`;
    chapters.at(-1).cards.push([front, m[2] ? `${back}\n\nGhi chú: ${m[2]}` : back]);
    q = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^## CHƯƠNG (\d+):/))) {
      flush();
      chapters.push({
        title: `${prefix}Chương ${m[1]}: ${CHAPTER_TITLES[m[1]]}`,
        description: `Đề MLN111 SU26 ${code} · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.`,
        cards: [],
      });
    } else if ((m = line.match(/^### (Câu \d+\..+)$/))) {
      flush();
      q = { title: m[1], options: [], answer: "" };
    } else if (q && (m = line.match(/^- ([A-F])\. (.+)$/))) {
      q.options.push({ key: m[1], text: m[2] });
    } else if (q && (m = line.match(/^\*\*Đáp án: (.+)\*\*$/))) {
      q.answer = m[1];
    }
  }
  flush();
  return chapters;
}

const parsed = EXAMS.map((exam) => ({ exam, sets: parseExam(exam) }));

// Học phần tổng hợp: cả đề theo đúng thứ tự câu gốc (trong học phần theo chương, các câu cuối đề nằm rải ở các chương).
const questionNo = ([front]) => Number(front.match(/^Câu (\d+)\./)[1]);
const fullSet = ({ exam, sets }) => {
  const cards = sets.flatMap((s) => s.cards).sort((a, b) => questionNo(a) - questionNo(b));
  console.log(`${exam.code} tổng hợp: ${cards.length} câu`);
  return {
    title: `Đề ${exam.code} · Tổng hợp ${cards.length} câu`,
    description: `Cả đề MLN111 SU26 ${exam.code}, câu 1–${cards.length} không chia chương · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.`,
    cards,
  };
};

const packs = parsed.map((entry) => {
  const { exam, sets } = entry;
  console.log(`${exam.code}: ${sets.map((s) => s.cards.length).join(" + ")} = ${sets.reduce((n, s) => n + s.cards.length, 0)} câu`);
  return { id: exam.id, ...(exam.extends && { extends: exam.extends }), subject: SUBJECT, sets: exam.withFull ? [...sets, fullSet(entry)] : sets };
});

// Giữ nguyên vị trí gói tổng hợp C2FE + RE (ngay sau 2 đề đó) như khi đã phát hành.
packs.splice(2, 0, {
  id: "mln111-retake-full-v1",
  extends: "mln111-retake-v1",
  subject: SUBJECT,
  sets: parsed.filter(({ exam }) => !exam.withFull).map(fullSet),
});

const out = `// Bộ thẻ có sẵn: MLN111 FE retake, sinh từ scripts/src/MLN111_SU26_*.md bằng scripts/gen-mln111-retake.mjs.
// Mặt trước: câu hỏi kèm 4 phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${packs.map((p) => JSON.stringify(p, null, 1)).join(",\n")}
);
`;
writeFileSync(join(root, "assets/data/mln111-retake.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
