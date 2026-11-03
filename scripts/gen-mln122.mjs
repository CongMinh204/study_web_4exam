// Sinh assets/data/mln122.js từ scripts/src/MLN122_SU26_RE.md (không sửa tay file đầu ra).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lines = readFileSync(join(root, "scripts/src/MLN122_SU26_RE.md"), "utf8").split(/\r?\n/);

const CHAPTER_TITLES = {
  1: "Đối tượng, phương pháp nghiên cứu và chức năng của KTCT Mác–Lênin",
  2: "Hàng hóa, thị trường và vai trò của các chủ thể tham gia thị trường",
  3: "Giá trị thặng dư trong nền kinh tế thị trường",
  4: "Cạnh tranh và độc quyền trong nền kinh tế thị trường",
  5: "Kinh tế thị trường định hướng XHCN và các quan hệ lợi ích kinh tế ở Việt Nam",
  6: "Công nghiệp hóa, hiện đại hóa và hội nhập kinh tế quốc tế của Việt Nam",
};

const chapters = [];
let q = null;

// Đáp án là chữ cái (có thể nhiều chữ) thì ghi nội dung phương án ở mặt sau; câu không có phương án
// (ảnh đề bị cắt) thì giữ đáp án dạng văn bản. Ghi chú (trong ngoặc hoặc dòng "> Lưu ý") nằm cuối mặt sau.
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
        if (!opt) throw new Error(`${q.title}: không có phương án ${l}`);
        return `${l}. ${opt.text}`;
      })
      .join("\n");
    if (m[2]) notes.unshift(m[2]);
  } else if (!q.options.length && q.answer && !m) {
    back = q.answer;
  } else {
    throw new Error(`${q.title}: đáp án "${q.answer}" không khớp phương án`);
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
      title: `Chương ${m[1]}: ${CHAPTER_TITLES[m[1]]}`,
      description: "Đề MLN122 SU26 RE · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.",
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
console.log(chapters.map((c) => `${c.title.slice(0, 12)}: ${c.cards.length}`).join(" | "), `= ${total} câu`);
if (total !== 60) throw new Error(`Cần 60 câu, đọc được ${total}`);

const subject = { name: "MLN122 FE", description: "MLN122 · Kinh tế chính trị Mác–Lênin · Đề FE SU26 RE, 60 câu theo chương", icon: "landmark", color: "#06b6d4" };

// Học phần tổng hợp: cả đề theo đúng thứ tự câu gốc (trong học phần theo chương, các câu cuối đề nằm rải ở các chương).
// Gói riêng nối vào môn của gói đầu, vì gói đầu đã phát hành và không được cài lại.
const questionNo = ([front]) => Number(front.match(/^Câu (\d+)\./)[1]);
const fullCards = chapters.flatMap((c) => c.cards).sort((a, b) => questionNo(a) - questionNo(b));
if (!fullCards.every((c, i) => questionNo(c) === i + 1)) throw new Error("Các câu không liền mạch từ 1 đến 60");

const packs = [
  { id: "mln122-v1", subject, sets: chapters },
  {
    id: "mln122-full-v1",
    extends: "mln122-v1",
    subject,
    sets: [
      {
        title: `Đề RE · Tổng hợp ${fullCards.length} câu`,
        description: `Cả đề MLN122 SU26 RE, câu 1–${fullCards.length} không chia chương · đáp án theo bình luận diễn đàn, không phải đáp án chính thức.`,
        cards: fullCards,
      },
    ],
  },
];

const out = `// Bộ thẻ có sẵn: MLN122 FE (Kinh tế chính trị Mác–Lênin), sinh từ scripts/src/MLN122_SU26_RE.md bằng scripts/gen-mln122.mjs.
// Mặt trước: câu hỏi kèm 4 phương án. Mặt sau: đáp án. Được thêm một lần vào dữ liệu người dùng (store.js).
(window.App = window.App || {}).PACKS = (window.App.PACKS || []).concat(
${packs.map((p) => JSON.stringify(p, null, 1)).join(",\n")}
);
`;
writeFileSync(join(root, "assets/data/mln122.js"), out);

// Đổi URL file dữ liệu trong các trang để trình duyệt không dùng bản cũ trong cache.
await import("./version-assets.mjs");
