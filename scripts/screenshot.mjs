// Full-page screenshots at desktop + mobile widths.
// Usage: npm run screenshot -- /subject.html?id=xyz   (dev server must be running)
// Output: screenshots/<name>-desktop.png, screenshots/<name>-mobile.png
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const arg = process.argv[2] || "/";
const target = arg.startsWith("/") ? arg : "/" + arg;
const OUT = resolve(import.meta.dirname, "..", "screenshots");

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
];

const slug =
  target.replace(/^\/+/, "").replace(/\.html.*$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "index";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "msedge" });

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    deviceScaleFactor: vp.deviceScaleFactor || 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // Dữ liệu mẫu sinh id ngẫu nhiên cho mỗi trình duyệt mới, nên đường dẫn có thể dùng
  // {subject} / {set} để thay bằng id của môn học / học phần đầu tiên.
  let url = target;
  // {set:7} = học phần thứ 8 (đếm từ 0) theo thứ tự lưu.
  if (/\{(subject|set)(:\d+)?\}/.test(url)) {
    await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });
    const ids = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("recall.v1"));
      return { subject: s.subjects.map((x) => x.id), set: s.sets.map((x) => x.id) };
    });
    url = url.replace(/\{(subject|set)(?::(\d+))?\}/g, (_, kind, i) => ids[kind][Number(i || 0)]);
  }
  await page.goto(BASE + url, { waitUntil: "networkidle" });

  // Scroll through the page so every scroll-reveal section gets triggered.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(900);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const file = resolve(OUT, `${slug}-${vp.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`${vp.name}: ${file}`);
  if (scrollWidth > vp.width) console.warn(`  ⚠ horizontal overflow: scrollWidth ${scrollWidth}px > ${vp.width}px`);
  for (const e of errors) console.warn(`  ⚠ console error: ${e}`);
  await context.close();
}

await browser.close();
