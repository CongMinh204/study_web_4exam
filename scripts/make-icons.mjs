// Sinh bộ icon PWA vào assets/icons/ từ logo Recall (hai thẻ chồng nhau, giống navbar). Chạy: node scripts/make-icons.mjs
// Dùng Microsoft Edge qua playwright-core để vẽ SVG ra PNG, không cần thư viện xử lý ảnh khác.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "assets/icons");
mkdirSync(dir, { recursive: true });

// Logo chiếm ~62% cạnh icon, nằm gọn trong vùng an toàn 80% của icon "maskable" (Android cắt bo tròn tùy máy).
// Nền đặc kín, không bo góc: iOS tự bo góc, Android tự cắt theo maskable.
const svg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="#000"/>
  <g transform="translate(12 12) scale(0.62) translate(-12 -12)">
    <rect x="2.5" y="7" width="14" height="14" rx="3.5" fill="#fff" opacity=".35"/>
    <rect x="7.5" y="3" width="14" height="14" rx="3.5" fill="#fff"/>
  </g>
</svg>`;

writeFileSync(join(dir, "icon.svg"), svg(512).replace(' width="512" height="512"', ""));

const OUT = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
];

const browser = await chromium.launch({ channel: "msedge" });
for (const [name, size] of OUT) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<body style="margin:0;background:#000">${svg(size)}</body>`);
  await page.screenshot({ path: join(dir, name), clip: { x: 0, y: 0, width: size, height: size } });
  await page.close();
  console.log(`assets/icons/${name} (${size}×${size})`);
}
await browser.close();
