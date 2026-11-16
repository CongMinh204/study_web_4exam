// Hàm dùng chung cho các script sinh gói đề thi (gen-sap341.mjs, gen-mln122.mjs).
// Thẻ có dạng [mặt trước, mặt sau]: mặt trước "Câu N. câu hỏi\n\nA. …\nB. …", mặt sau "A. …" (+ "\n\nGhi chú: …").

export const questionNo = (front) => Number(front.match(/^Câu (\d+)\./)[1]);

// Khóa so khớp "giống hệt": nội dung câu hỏi + tập phương án + đáp án đúng (bỏ qua chữ cái và thứ tự phương án).
const norm = (t) => t.toLowerCase().replace(/\s+/g, " ").trim();
export function keyOf([front, back]) {
  const [head, ...rest] = front.split("\n\n");
  const question = head.replace(/^Câu \d+\.\s*/, "");
  const optionTexts = rest.join("\n\n").split("\n").map((l) => l.replace(/^[A-F]\.\s*/, ""));
  const answerTexts = back.split("\n\n")[0].split("\n").map((l) => l.replace(/^[A-F]\.\s*/, ""));
  const sorted = (xs) => xs.map(norm).sort().join("|");
  return `${norm(question)}||${sorted(optionTexts)}||${sorted(answerTexts)}`;
}

// Câu hỏi nhãn gọn để báo cáo, ví dụ "SU2024 FE Câu 26".
export const labelOf = (code, front) => `${code} ${front.match(/^Câu \d+/)[0]}`;
