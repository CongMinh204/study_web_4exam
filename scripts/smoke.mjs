// Smoke test end-to-end các luồng chính (dev server phải đang chạy): npm run smoke
// Chụp thêm ảnh các trạng thái giữa chừng vào screenshots/flow-*.png
import { chromium } from "playwright-core";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = resolve(import.meta.dirname, "..", "screenshots");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "msedge" });
const errors = [];
let failed = 0;

async function step(name, fn) {
  try {
    await fn();
    console.log(`✔ ${name}`);
  } catch (e) {
    failed++;
    console.log(`✖ ${name}\n  ${e.message.split("\n")[0]}`);
  }
}

function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
]) {
  console.log(`\n— ${vp.name}`);
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${vp.name}] ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`[${vp.name}] ${m.text()}`));
  const shot = (n) => page.screenshot({ path: resolve(OUT, `flow-${n}-${vp.name}.png`) });

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });

  await step("Trang chủ hiển thị 7 môn học (5 mẫu + Triết học + MLN111 FE retake)", async () => {
    expect((await page.locator(".subject-card").count()) === 7, "số môn học khác 7");
  });

  await step("Tìm kiếm môn học (bỏ dấu)", async () => {
    await page.fill("#subject-search", "sinh hoc");
    expect((await page.locator(".subject-card").count()) === 1, "lọc không ra 1 môn");
    await page.fill("#subject-search", "");
  });

  if (vp.isMobile) {
    await step("Menu mobile mở/đóng", async () => {
      await page.click(".nav__toggle");
      expect(await page.locator(".drawer.is-open").isVisible(), "drawer không mở");
      await shot("drawer");
      await page.click(".nav__toggle");
    });
  }

  await step("Tạo môn học qua modal", async () => {
    await page.click('#subjects [data-action="new-subject"]');
    await page.fill("#sub-name", "Vật lý");
    await page.click('[data-icon="atom"]');
    await shot("subject-modal");
    await page.click(".modal__foot .btn-primary");
    await page.waitForTimeout(300);
    expect((await page.locator(".subject-card").count()) === 8, "chưa có 8 môn");
  });

  await step("Tạo học phần bằng trình soạn + nhập nhanh", async () => {
    await page.locator(".subject-card", { hasText: "Vật lý" }).locator(".subject-card__link").click();
    await page.waitForURL(/subject\.html/);
    await page.click('a:has-text("Tạo học phần")');
    await page.waitForURL(/edit\.html/);
    await page.fill("#set-title", "Đơn vị đo");
    await page.click('[data-act="import"]');
    await page.fill("#imp-text", "Newton\tlực\nJoule\tnăng lượng\nWatt\tcông suất\nPascal\táp suất\nHertz\ttần số");
    await page.click(".modal__foot .btn-primary");
    await page.waitForTimeout(300);
    await page.click('button[type="submit"]');
    await page.waitForURL(/set\.html/);
    expect((await page.locator(".term").count()) === 5, "học phần không có 5 thẻ");
  });

  const setUrl = page.url();
  const setId = new URL(setUrl).searchParams.get("id");

  await step("Gắn sao một thẻ", async () => {
    await page.locator("[data-star]").first().click();
    expect((await page.locator('[data-filter="starred"]').textContent()).includes("(1)"), "đếm sao sai");
  });

  await step("Flashcards: lật, đánh dấu, màn hình kết thúc", async () => {
    await page.goto(`${BASE}/flashcards.html?set=${setId}`);
    await page.click("#fc");
    await page.waitForTimeout(600);
    expect(await page.locator("#fc.is-flipped").count(), "thẻ không lật");
    await shot("flashcard-flipped");
    for (let i = 0; i < 5; i++) await page.click(i % 2 ? "#btn-unknown" : "#btn-know");
    expect(await page.locator(".done").isVisible(), "không có màn hình kết thúc");
    await shot("flashcard-done");
  });

  await step("Học: trả lời trắc nghiệm, hiện phản hồi", async () => {
    await page.goto(`${BASE}/learn.html?set=${setId}`);
    await page.locator("[data-choice]").first().click();
    expect(await page.locator(".feedback").isVisible(), "không có phản hồi");
    await shot("learn-feedback");
    await page.click("#continue");
    expect(await page.locator(".question").isVisible(), "không sang câu tiếp");
  });

  await step("Học: tự luận + ghi đè đáp án", async () => {
    // Đẩy mọi thẻ lên hộp 2 để nhận câu tự luận
    await page.evaluate(() => App.store.cards(new URLSearchParams(location.search).get("set")).forEach((c) => App.store.setProgress(c.id, { box: 2 })));
    await page.reload();
    await page.fill("#answer", "sai hoàn toàn");
    await page.click('#answer-form button[type="submit"]');
    expect(await page.locator("#override").isVisible(), "không có nút ghi đè");
    await shot("learn-written");
    await page.click("#override");
  });

  await step("Kiểm tra: làm bài, nộp, xem kết quả", async () => {
    await page.goto(`${BASE}/test.html?set=${setId}`);
    await page.click('#setup button[type="submit"]');
    const qs = page.locator("[data-q]");
    const n = await qs.count();
    for (let i = 0; i < n; i++) {
      const q = qs.nth(i);
      if (await q.locator("input").count()) await q.locator("input").fill("lực");
      else await q.locator("[data-value]").first().click();
    }
    await shot("test-taking");
    await page.click("#submit");
    await page.waitForSelector(".score");
    await shot("test-result");
    expect((await page.locator(".review__item").count()) === n, "thiếu mục xem lại");
  });

  await step("Ghép thẻ: hoàn thành và lưu kỷ lục", async () => {
    await page.goto(`${BASE}/match.html?set=${setId}`);
    await page.click("#start");
    const tiles = await page.evaluate(() =>
      [...document.querySelectorAll("[data-tile]")].map((t) => ({ id: t.dataset.tile, card: t.dataset.tile.split(":")[0] }))
    );
    await shot("match-board");
    const byCard = {};
    tiles.forEach((t) => (byCard[t.card] ||= []).push(t.id));
    for (const [a, b] of Object.values(byCard)) {
      await page.click(`[data-tile="${a}"]`);
      await page.click(`[data-tile="${b}"]`);
    }
    await page.waitForSelector(".done h2");
    expect((await page.textContent(".done h2")).includes("Kỷ lục"), "không ghi kỷ lục");
  });

  await step("Trang học phần hiển thị kết quả kiểm tra", async () => {
    await page.goto(setUrl);
    expect((await page.locator(".result-row").count()) === 1, "không có kết quả kiểm tra");
    await page.screenshot({ path: resolve(OUT, `flow-set-after-${vp.name}.png`), fullPage: true });
  });

  await step("Xóa học phần", async () => {
    await page.click('[data-act="more"]');
    await page.click('.menu button:has-text("Xóa học phần")');
    await page.click(".modal__foot .btn-danger");
    await page.waitForURL(/subject\.html/);
    expect(await page.locator(".empty").isVisible(), "học phần chưa bị xóa");
  });

  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  if (sw > vp.width) errors.push(`[${vp.name}] tràn ngang: ${sw}px`);
  await ctx.close();
}

await browser.close();
if (errors.length) console.log("\nLỗi console/tràn ngang:\n" + errors.map((e) => "  " + e).join("\n"));
console.log(failed || errors.length ? `\n${failed} bước lỗi, ${errors.length} lỗi console` : "\nTất cả bước đều đạt");
process.exit(failed || errors.length ? 1 : 0);
