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
const pages = readdirSync(root).filter((f) => f.endsWith(".html"));
const built = [];
for (const page of pages) {
  const file = join(root, page);
  const html = readFileSync(file, "utf8");
  const next = html.replace(/(src|href)="(assets\/[^"?]+\.(?:js|css))(?:\?v=[^"]*)?"/g, (_, attr, path) => `${attr}="${path}?v=${hashOf(path)}"`);
  if (next !== html) {
    writeFileSync(file, next);
    changed++;
  }
  built.push(next.replace(/\r\n/g, "\n"));
}

// sw.js đổi nội dung khi bất kỳ trang/asset nào đổi (trang đã chứa ?v=hash của asset) để trình duyệt cài lại
// service worker và lưu bản mới cho chế độ offline.
const manifest = readFileSync(join(root, "manifest.webmanifest"), "utf8").replace(/\r\n/g, "\n");
const build = createHash("sha1").update(built.join("\0") + manifest).digest("hex").slice(0, 8);
const swFile = join(root, "sw.js");
const sw = readFileSync(swFile, "utf8");
const swNext = sw.replace(/const BUILD = "[^"]*";/, `const BUILD = "${build}";`);
if (swNext !== sw) writeFileSync(swFile, swNext);

console.log(`version-assets: cập nhật ${changed} trang, ${hashes.size} file, sw.js build ${build}`);
