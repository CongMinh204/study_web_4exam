// Sinh assets/data/mln122.js từ các đề trong scripts/src/MLN122_*.md (không sửa tay file đầu ra).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SUBJECT = { name: "MLN122 FE", description: "MLN122 · Kinh tế chính trị Mác–Lênin · Đề FE SU26 (RE, FE C1), 60 câu theo chương", icon: "landmark", color: "#06b6d4" };

const CHAPTER_TITLES = {
  1: "Đối tượng, phương pháp nghiên cứu và chức năng của KTCT Mác–Lênin",
  2: "Hàng hóa, thị trường và vai trò của các chủ thể tham gia thị trường",
  3: "Giá trị thặng dư trong nền kinh tế thị trường",
  4: "Cạnh tranh và độc quyền trong nền kinh tế thị trường",
  5: "Kinh tế thị trường định hướng XHCN và các quan hệ lợi ích kinh tế ở Việt Nam",
  6: "Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam",
};

// Mỗi đề là gói riêng đã phát hành nên không được đổi id/nội dung (đổi thì cài lại cho mọi người dùng).
// Đề đầu tạo môn; các đề sau dùng "extends" để nối học phần vào môn đó.
const EXAMS = [
  { file: "MLN122_SU26_RE.md", code: "RE", prefix: "", id: "mln122-v1", fullId: "mln122-full-v1", fullTitlePrefix: "Đề RE · " },
  { file: "MLN122_SU26_FE_C1.md", code: "FE C1", prefix: "Đề FE C1 · ", id: "mln122-fec1-v1", extends: "mln122-v1", withFull: true },
];

function parseExam({ file, code, prefix }) {
  const lines = readFileSync(join(root, "scripts/src", file), "utf8").split(/\r?\n/);
  const chapters = [];
  let q = null;

  // Đáp án là chữ cái (có thể nhiều chữ) thì ghi nội dung phương án ở mặt sau, mỗi đáp án một dòng; câu không có
  // phương án (ảnh đề bị cắt) giữ đáp án dạng văn bản. Ghi chú (trong ngoặc hoặc dòng "> Lưu ý") nằm cuối mặt sau.
  const flush = () => {
    if (!q) return;
    const m = q.answer.match(/^([A-F](?:\s*,\s*[A-F])*)\s*(?:\((.+)\))?$/);
    let back;
    const notes = [...q.notes];
    if (m && q.options.length) {
      back = m[1]
        .split(/\s*,\s*/)
        .map((l) => {
          const opt = q.options.find((o) => o.key === l);
          if (!opt) throw new Error(`${file} ${q.title}: không có phương án ${l}`);
          return `${l}. ${opt.text}`;
        })
        .join("\n");
      if (m[2]) notes.unshift(m[2]);
    } else if (!q.options.length && q.answer && !m) {
      back = q.answer;
    } else {
      throw new Error(`${file} ${q.title}: đáp án "${q.answer}" không khớp phương án`);
    }
    const front = q.options.length ? `${q.title}\n\n${q.options.map((o) => `${o.key}. ${o.text}`).join("\n")}` : q.title;
    chapters.at(-1).cards.push([front, notes.length ? `${back}\n\nGhi chú: ${notes.join(" ")}` : back]);
    q = null;
  };

  for (const line of lines) {
    let m;
    if ((m = line.match(/^## CHƯƠNG (\d+):/))) {
      flush();
      chapters.push({
        title: `${prefix}Chương ${m[1]}: ${CHAPTER_TITLES[m[1]]}`,
        description: `Đề MLN122 SU26 ${code} · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.`,
        cards: [],
      });
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

  const total = chapters.reduce((n, c) => n + c.cards.length, 0);
  console.log(`${code}: ${chapters.map((c) => c.cards.length).join(" + ")} = ${total} câu`);
  if (total !== 60) throw new Error(`${file}: cần 60 câu, đọc được ${total}`);
  return chapters;
}

// Học phần tổng hợp: cả đề theo đúng thứ tự câu gốc (trong học phần theo chương, các câu cuối đề nằm rải ở các chương).
const questionNo = ([front]) => Number(front.match(/^Câu (\d+)\./)[1]);
function fullSet(exam, chapters) {
  const cards = chapters.flatMap((c) => c.cards).sort((a, b) => questionNo(a) - questionNo(b));
  if (!cards.every((c, i) => questionNo(c) === i + 1)) throw new Error(`${exam.file}: các câu không liền mạch từ 1 đến ${cards.length}`);
  return {
    title: `Đề ${exam.code} · Tổng hợp ${cards.length} câu`,
    description: `Cả đề MLN122 SU26 ${exam.code}, câu 1–${cards.length} không chia chương · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.`,
    cards,
  };
}

const packs = [];
for (const exam of EXAMS) {
  const chapters = parseExam(exam);
  const base = { subject: SUBJECT, ...(exam.extends && { extends: exam.extends }) };
  if (exam.withFull) {
    packs.push({ id: exam.id, ...base, sets: [...chapters, fullSet(exam, chapters)] });
  } else {
    // Đề RE đã phát hành thành 2 gói: các chương, rồi học phần tổng hợp (gói riêng).
    packs.push({ id: exam.id, ...base, sets: chapters });
    packs.push({ id: exam.fullId, subject: SUBJECT, extends: exam.id, sets: [fullSet(exam, chapters)] });
  }
}

const out = `// Bộ thẻ có sẵn: MLN122 FE (Kinh tế chính trị Mác–Lênin), sinh từ scripts/src/MLN122_*.md bằng scripts/gen-mln122.mjs.
// Mặt trước: câu hỏi kèm 4 phương án. Mặt sau: đáp án (câu chọn nhiều đáp án ghi mỗi đáp án một dòng). Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${packs.map((p) => JSON.stringify(p, null, 1)).join(",\n")}
);
`;
writeFileSync(join(root, "assets/data/mln122.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
