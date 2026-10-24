// Gắn ?v=<hash nội dung> vào mọi file assets/*.js|css trong các trang .html ở thư mục gốc.
// Hosting tĩnh (GitHub Pages) cho trình duyệt giữ file cũ tới 10 phút; đổi URL khi nội dung đổi
// để người dùng nhận ngay bộ thẻ / code mới. Chạy lại sau mỗi lần sửa file trong assets/.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const hashes = new Map();
// Bỏ qua khác biệt CRLF/LF để hash giống nhau trên mọi máy.
const hashOf = (path) => {
  if (!hashes.has(path)) {
    const text = readFileSync(join(root, path), "utf8").replace(/\r\n/g, "\n");
    hashes.set(path, createHash("sha1").update(text).digest("hex").slice(0, 8));
  }
  return hashes.get(path);
};

let changed = 0;
for (const page of readdirSync(root).filter((f) => f.endsWith(".html"))) {
  const file = join(root, page);
  const html = readFileSync(file, "utf8");
  const next = html.replace(/(src|href)="(assets\/[^"?]+\.(?:js|css))(?:\?v=[^"]*)?"/g, (_, attr, path) => `${attr}="${path}?v=${hashOf(path)}"`);
  if (next !== html) {
    writeFileSync(file, next);
    changed++;
  }
}
console.log(`version-assets: cập nhật ${changed} trang, ${hashes.size} file`);
