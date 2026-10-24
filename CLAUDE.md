# CLAUDE.md

Hướng dẫn cho Claude khi làm việc trong dự án này. Đọc kỹ trước khi viết code.

## ⚠️ Quy tắc bắt buộc

Ba quy tắc dưới đây **không được bỏ qua**. Một thay đổi chưa đáp ứng đủ thì chưa được coi là hoàn thành.

### 1. Chụp screenshot và so sánh với design gốc sau mỗi thay đổi lớn

"Thay đổi lớn" là: thêm/sửa một trang, một section, một component UI dùng chung, hoặc thay đổi design tokens/layout.

Quy trình:
1. Chạy dev server (`npm run dev`).
2. Chạy `npm run screenshot -- <đường-dẫn>` (ví dụ `npm run screenshot -- /` hoặc `npm run screenshot -- "/set.html?id={set}"`). Script Playwright (`scripts/screenshot.mjs`, dùng Microsoft Edge có sẵn qua `playwright-core`) cuộn hết trang để kích hoạt scroll-reveal rồi chụp **full page** ở 2 kích thước:
   - Desktop: `1440 × 900`
   - Mobile: `390 × 844`

   Ảnh lưu vào `screenshots/<tên-trang>-desktop.png` và `screenshots/<tên-trang>-mobile.png` (thư mục này nằm trong `.gitignore`). Script cảnh báo `⚠` khi có lỗi console hoặc trang tràn ngang — cảnh báo nào cũng phải được xử lý.
   - Dữ liệu mẫu sinh id ngẫu nhiên cho mỗi trình duyệt mới, nên dùng placeholder `{subject}` / `{set}` để chỉ môn học / học phần đầu tiên.
   - Trong Git Bash, đặt `MSYS_NO_PATHCONV=1` trước lệnh để đường dẫn `/` không bị đổi thành đường dẫn Windows.
   - Ảnh full page rất cao: khi xem, cắt thành từng đoạn ~1400px để thấy rõ chi tiết.
3. Dùng tool Read để mở ảnh vừa chụp và ảnh gốc `anhmau.png`, so sánh trực tiếp:
   - Màu nền, màu chữ, cách dùng màu nhấn
   - Typography: cỡ chữ, độ đậm, letter-spacing của tiêu đề
   - Khoảng cách giữa các section, độ rộng container
   - Card: viền, bo góc, không đổ bóng
   - Nút: dạng pill, trắng/đen
4. Liệt kê các điểm lệch so với design gốc, sửa, rồi chụp lại cho đến khi khớp.
5. Khi báo cáo, nêu ngắn gọn đã so sánh những gì và còn điểm nào chưa khớp (nếu có).

### 2. Website phải mobile friendly

- Kiểm tra mọi bố cục ở các breakpoint trong `styles.css`: `≤ 767px` (mobile), `≤ 860px` (navbar thu gọn), `≤ 1024px` (tablet).
- Không được có cuộn ngang ở bất kỳ độ rộng nào từ **360px** trở lên.
- Vùng chạm (nút, link, đáp án) tối thiểu **44 × 44px**.
- Navbar trên mobile thu gọn thành nút menu (hamburger) mở drawer/sheet.
- Bento grid và các lưới nhiều cột chuyển về 1 cột trên mobile.
- Chữ body không nhỏ hơn `14px`; input không nhỏ hơn `16px` để iOS không tự zoom.
- Flashcard hỗ trợ vuốt trái/phải; các nút điều khiển chế độ học đặt trong tầm ngón cái (phía dưới màn hình) trên mobile.
- Mỗi lần chụp screenshot (quy tắc 1) **luôn kiểm tra cả ảnh mobile**, không chỉ desktop.

### 3. Mọi section phải có animation khi scroll

- Mọi section và mọi khối nội dung chính xuất hiện khi cuộn tới, dùng hệ thống reveal dùng chung trong `assets/js/ui.js` (IntersectionObserver) + CSS trong `styles.css`. Không tự viết lại logic animation ở từng nơi.
  - `data-reveal` → khối hiện dần: `opacity 0 → 1`, `translateY(24px) → 0`, `0.6s`, easing `cubic-bezier(0.22, 1, 0.36, 1)`, chỉ chạy một lần. Trễ thêm bằng `style="--delay: 100ms"`.
  - `data-stagger` (hoặc `data-stagger="90"` để đổi bước ms) → các phần tử con xuất hiện lần lượt, mặc định cách nhau 60ms.
  - Tiêu đề lớn hiện từng dòng (mask + trượt lên) như ảnh mẫu: `<h2 class="h2 lines" data-reveal>` với mỗi dòng là `<span class="line"><span>…</span></span>`. Trên mobile các dòng tự xuống dòng và cả khối hiện dần.
- Nội dung render bằng JS sau khi trang tải phải gọi `App.ui.reveal(container)` để được quan sát.
- Animation phải tinh tế, không nảy, không xoay, không phóng to quá mức. Chỉ animate `opacity` và `transform` để giữ 60fps trên mobile.
- Khi người dùng bật `prefers-reduced-motion`: bỏ chuyển động (cả animation lẫn transition), nội dung hiện ngay.
- Trong các màn hình học (Flashcards, Learn, Test), phần nội dung câu hỏi không dùng scroll-reveal; chỉ dùng animation chuyển thẻ/chuyển câu.

## Tổng quan dự án

**Study Web** — website ôn tập nhiều môn học theo phong cách Quizlet.

- Trang chủ hiển thị danh sách **môn học / chủ đề** đang học.
- Nhấn vào một môn → vào trang môn học, chứa các **học phần (set)** thẻ nhớ.
- Mỗi học phần có các chế độ học:
  1. **Flashcards** — lật thẻ, chuyển thẻ, trộn thẻ, đánh dấu "đã thuộc / chưa thuộc".
  2. **Học (Learn)** — học thích ứng: hỏi lặp lại các thẻ trả lời sai cho đến khi thuộc, kết hợp trắc nghiệm và tự gõ đáp án.
  3. **Kiểm tra (Test)** — tạo bài kiểm tra tùy chỉnh (số câu, loại câu: trắc nghiệm / đúng-sai / tự luận ngắn), chấm điểm và xem lại câu sai.
  4. **Ghép thẻ (Match)** — trò chơi ghép thuật ngữ với định nghĩa, tính thời gian, lưu kỷ lục.
- CRUD đầy đủ cho môn học, học phần và thẻ (thuật ngữ / định nghĩa).
- Nhập nhanh thẻ từ văn bản (mỗi dòng `thuật ngữ<TAB>định nghĩa` hoặc dấu phân cách tùy chọn), giống tính năng Import của Quizlet.

Ngôn ngữ giao diện: **Tiếng Việt**. Tên biến, hàm, file, commit: **Tiếng Anh**.

## Tech stack

Website tĩnh **HTML/CSS/JS thuần, không có bước build** — mở trực tiếp file `.html` hoặc qua dev server đều chạy.

| Hạng mục | Lựa chọn |
|---|---|
| Trang | Mỗi màn hình là một file `.html` ở thư mục gốc |
| Styling | Một file `assets/css/styles.css`, design tokens bằng CSS variables trên `:root` |
| JavaScript | Script thường (không dùng ES module để vẫn chạy được qua `file://`), gom vào namespace `window.App` |
| Animation | CSS transition/keyframes + IntersectionObserver (`App.ui.reveal`) |
| Dữ liệu | `localStorage` qua repository `App.store` (`assets/js/store.js`) |
| Icon | SVG inline (đường vẽ lấy từ lucide) trong `assets/js/icons.js` |
| Font | Inter (Google Fonts, trục `opsz` để tiêu đề lớn trông như Inter Display) |
| Kiểm thử | `node:test` cho logic thuần, Playwright (`playwright-core` + Edge) cho screenshot và smoke test |

Mọi truy cập dữ liệu **phải đi qua `App.store`** để sau này có thể thay bằng backend (Supabase/Postgres) mà không sửa UI.

## Lệnh thường dùng

```bash
npm install                       # cài playwright-core (chỉ dùng cho screenshot / smoke test)
npm run dev                       # dev server tĩnh: http://localhost:3000
npm test                          # unit test logic học tập (tests/*.test.mjs)
npm run screenshot -- <đường-dẫn> # chụp desktop + mobile (cần dev server đang chạy)
npm run smoke                     # chạy thử end-to-end mọi luồng chính trên desktop + mobile
npm run assets:version            # gắn ?v=<hash> cho JS/CSS trong mọi trang .html
```

Sau khi sửa bất kỳ file nào trong `assets/`, chạy `npm run assets:version` trước khi commit: hosting tĩnh cho trình duyệt giữ file cũ tới 10 phút, nên URL phải đổi khi nội dung đổi.

Trước khi báo hoàn thành một tính năng: chạy `npm test` và `npm run smoke` (cần dev server), đảm bảo không lỗi, rồi chụp screenshot theo quy tắc 1.

## Cấu trúc thư mục

```
index.html                         # Landing + thư viện môn học (#subjects), nhập nhanh (#import), CTA tạo môn
subject.html?id=                   # Trang môn học: thống kê + danh sách học phần
set.html?id=                       # Trang học phần: chọn chế độ, tiến độ, danh sách thẻ, kết quả kiểm tra
edit.html?set= | ?subject=         # Soạn / tạo học phần, nhập nhanh
flashcards.html?set=[&cards=id,id] # Các chế độ học dùng "study shell": thanh trên + nội dung, không navbar/footer
learn.html?set=
test.html?set=
match.html?set=
assets/
  css/styles.css      # tokens, component, landing, app pages, study modes, responsive
  js/icons.js         # App.icon(name), App.SUBJECT_ICONS
  js/study.js         # App.study — logic thuần (cũng export CommonJS cho unit test)
  js/store.js         # App.store — repository localStorage + dữ liệu mẫu
  js/ui.js            # App.ui — navbar, footer, reveal, modal, menu, toast, phát âm, study bar
  js/pages/*.js       # logic riêng cho từng trang
  data/*.js           # bộ thẻ có sẵn (App.PACKS), ví dụ mln111.js — Triết học Mác – Lê-nin
scripts/              # serve.mjs, screenshot.mjs, smoke.mjs
tests/                # unit test (node:test)
```

Thứ tự nạp script trong mọi trang: `icons.js` → `study.js` → `data/*.js` → `store.js` → `ui.js` → `pages/<trang>.js`.

**Bộ thẻ có sẵn**: mỗi file `assets/data/*.js` nối một gói `{ id, subject, sets: [{ title, description, cards: [[term, definition]] }] }` vào `App.PACKS`. `store.js` thêm gói vào dữ liệu người dùng đúng một lần (ghi `id` vào `prefs.installedPacks`), nên người dùng xóa môn thì môn không tự quay lại. Sửa nội dung một gói đã phát hành thì đổi `id` (ví dụ `mln111-v2`). Gói được sinh bằng script từ file nguồn, không sửa tay.

## Mô hình dữ liệu

Lưu trong `localStorage["recall.v1"]` dạng `{ version, subjects, sets, cards, progress, results, activity, prefs }`. Đổi cấu trúc thì tăng `version` trong `store.js`.

```ts
type Subject = {
  id: string;
  name: string;           // "Tiếng Anh", "Sinh học"...
  description?: string;
  icon: string;           // tên icon trong App.SUBJECT_ICONS
  color?: string;         // màu nhấn nhỏ cho icon/thẻ môn, không dùng làm nền lớn
  createdAt: number;
  updatedAt: number;
};

type StudySet = {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

type Card = {
  id: string;
  setId: string;
  term: string;
  definition: string;
  order: number;
};

type CardProgress = {
  cardId: string;
  box: number;            // Leitner 0 = chưa học, 1 = đang học (vừa sai), 2 = quen, 3 = đã thuộc
  correctStreak: number;
  lastReviewedAt?: number;
  starred: boolean;
};

type TestResult = {
  id: string;
  setId: string;
  score: number;          // 0..100
  total: number;
  correctCount: number;
  answers: { cardId: string; given: string; correct: boolean }[];
  takenAt: number;
};
```

## Quy tắc logic học tập

- Logic học (`assets/js/study.js`) là **hàm thuần**, không đụng DOM hay storage, và phải có unit test trong `tests/`.
- **Leitner** (`study.nextBox`): đúng ở box 0 → box 2, đúng ở box khác → +1 (tối đa 3); sai → box 1. "Đã thuộc" = box 3. Flashcards, Học và Kiểm tra đều ghi kết quả qua `store.recordAnswer`.
- **Learn**: mỗi vòng tối đa 7 thẻ chưa thuộc. Box < 2 hỏi trắc nghiệm, box 2 hỏi tự luận. Sai → thẻ quay lại cuối vòng (tối đa 2 lần). Có nút "Tôi đã trả lời đúng" để ghi đè khi chấm tự luận quá khắt khe.
- **Trắc nghiệm**: 4 phương án, đáp án nhiễu lấy ngẫu nhiên từ định nghĩa khác trong cùng học phần. Học phần < 4 thẻ thì giảm số phương án tương ứng.
- **So khớp đáp án tự gõ**: bỏ qua hoa/thường, khoảng trắng thừa và dấu câu cuối; có tùy chọn bỏ qua dấu tiếng Việt. Đáp án ghi nhiều phương án cách nhau bởi `;` hoặc `/` thì khớp một phương án là đúng. Sai 1–2 ký tự được báo "Gần đúng" (vẫn tính sai).
- Cho phép chọn hướng hỏi: thuật ngữ → định nghĩa, định nghĩa → thuật ngữ, hoặc cả hai.
- **Thẻ trắc nghiệm** (`study.parseQuiz`): mặt trước là câu hỏi rồi các dòng `A. …`–`D. …`, mặt sau bắt đầu bằng chữ cái đáp án (`C. …`). Flashcards hiện câu hỏi + danh sách phương án; Học luôn hỏi trắc nghiệm bằng chính các phương án (không trộn thứ tự vì có phương án kiểu "Cả a, b và c"); Kiểm tra dùng phương án gốc và chấm tự luận nhận cả chữ cái lẫn nội dung; Ghép thẻ ghép câu hỏi với nội dung đáp án.
- Trộn ngẫu nhiên dùng Fisher–Yates; nhận `seed`/random fn làm tham số để test được.

## Design system

Phong cách tham chiếu: `anhmau.png` (landing page kiểu Framer). **Tối giản, hiện đại, chuyên nghiệp, nền tối.** Khi phân vân, chọn phương án ít trang trí hơn.

### Màu sắc (CSS variables trong `assets/css/styles.css`)

```css
--bg:            #000000;   /* nền trang */
--surface:       #0A0A0A;   /* card, panel */
--surface-2:     #141414;   /* hover, input, khối lồng */
--surface-3:     #1C1C1C;
--border:        rgba(255,255,255,0.08);
--border-strong: rgba(255,255,255,0.16);
--text:          #FFFFFF;
--text-muted:    #A1A1A1;
--text-subtle:   #6B6B6B;
--accent:        #0099FF;   /* xanh điện — dùng tiết chế */
--accent-glow:   rgba(0,153,255,0.35);
--success:       #22C55E;
--danger:        #EF4444;
```

- Gần như toàn bộ giao diện là **đen / trắng / xám**. Màu `--accent` chỉ dùng cho: link, trạng thái focus, progress, điểm nhấn hero (viền phát sáng xanh như ảnh mẫu).
- Không gradient sặc sỡ, không nền màu lớn. Được phép một vệt glow xanh mờ ở hero hoặc phía sau thẻ đang học.
- `--violet` (#8855FF) chỉ dùng như ảnh mẫu: khung minh họa Ghép thẻ và vạch chú thích trong biểu đồ — không dùng cho nút hay chữ.
- Đúng/sai dùng `--success`/`--danger` ở dạng viền hoặc chữ, không tô nền đặc.

### Typography

- Font: **Inter**. Tiêu đề lớn, đậm (600–700), `letter-spacing` âm (`-0.02em` đến `-0.04em`), `line-height` chặt (1.05–1.15).
- Thang chữ: `.display` (hero, 40–64px), `.h2` (tiêu đề section, 32–52px), `.h3` (20px), body 15px, chú thích 12–13px màu `--text-muted`. Tiêu đề dùng `text-wrap: balance`.
- Tiêu đề section ngắn, có thể chia 2 dòng như ảnh mẫu ("Not just vibes, / a full platform").

### Thành phần

- **Button chính** `.btn .btn-primary`: nền trắng, chữ đen, dạng pill, cao 36px (`.btn-lg` 44px, `.btn-sm` 30px).
- **Button phụ** `.btn .btn-secondary`: nền `--surface-2`, viền `--border`, chữ trắng, dạng pill.
- **Card**: nền `--surface`, viền 1px `--border`, bo 12–20px, không đổ bóng; hover chỉ đổi viền sang `--border-strong`.
- **Navbar**: mảnh, cố định trên cùng, nền đen hơi trong suốt + `backdrop-blur`, logo trái, link giữa, nút phải.
- **Footer**: nhiều cột link nhỏ, chữ `--text-muted`, giống phần cuối ảnh mẫu.
- **Input**: nền `--surface-2`, viền `--border`, focus viền `--accent`.
- Lưới môn học dạng **bento grid**: các card có kích thước khác nhau, khoảng cách đều (`gap-3`/`gap-4`).
- Khoảng trắng rộng rãi giữa các section (`.section`: 120px desktop, 80px mobile), container tối đa `1200px` + gutter 24px (16px trên mobile).

### Chuyển động

- Nhẹ nhàng: fade + trượt lên 16–24px khi xuất hiện, `duration` 0.3–0.6s, easing `var(--ease)` = `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animation trượt ngang (chuyển thẻ) không được làm trang tràn ngang trên mobile — vùng chứa dùng `overflow-x: clip`.
- Flashcard lật bằng xoay 3D trục Y (`rotateY` + `backface-visibility: hidden`).
- Tôn trọng `prefers-reduced-motion`: tắt chuyển động không cần thiết.

### Không được làm

- Không dùng emoji làm icon trong UI; dùng `App.icon(name)` (thêm icon mới bằng đường vẽ lucide vào `icons.js`).
- Không đổ bóng đậm, không bo góc quá lớn cho phần tử nhỏ, không nhiều màu nhấn cùng lúc.
- Không thêm framework hay thư viện UI (React, Tailwind, MUI…) khi chưa được đồng ý — dự án cố ý giữ dạng tĩnh, không build.

## Trải nghiệm người dùng

- **Phím tắt** trong chế độ học: `Space` lật thẻ, `←`/`→` chuyển thẻ, `1–4` chọn đáp án, `Enter` xác nhận/tiếp tục.
- Luôn hiển thị tiến độ (thanh progress mảnh màu `--accent`, ví dụ "12 / 40").
- Màn hình kết quả: điểm số, số câu đúng/sai, danh sách câu sai để ôn lại, nút "Học lại các thẻ sai".
- Trạng thái rỗng (chưa có môn / chưa có thẻ) phải có hướng dẫn và nút tạo mới.
- Responsive từ 360px trở lên; trên mobile, vuốt trái/phải để chuyển flashcard.
- Accessibility: điều hướng bằng bàn phím, `aria-label` cho nút chỉ có icon, độ tương phản chữ đạt WCAG AA.

## Quy ước code

- Mỗi file JS bọc trong IIFE, chỉ lộ ra qua `window.App` (`App.icon`, `App.study`, `App.store`, `App.ui`). Trang mới: tạo `xxx.html` + `assets/js/pages/xxx.js`.
- Mọi chuỗi do người dùng nhập phải qua `App.ui.esc()` trước khi chèn vào HTML.
- Không viết màu hex trực tiếp trong CSS component — dùng token `var(--…)`.
- ID sinh bằng `App.store.uid()` (`crypto.randomUUID()`).
- Không truy cập `localStorage` ngoài `store.js`; tùy chọn của từng chế độ lưu qua `store.pref` / `store.setPref`.
- Hộp thoại dùng `App.ui.modal` / `App.ui.confirm`, không dùng `alert`/`confirm` của trình duyệt.
- Comment bằng tiếng Việt, ngắn gọn, chỉ giải thích "tại sao".

## Lộ trình

Đã xong: landing + thư viện môn học, CRUD môn học → học phần → thẻ, nhập nhanh, Flashcards, Học (Leitner), Kiểm tra + lịch sử, Ghép thẻ + kỷ lục, xuất/nhập bản sao lưu JSON (ở footer).

Tiếp theo (gợi ý):
1. Ảnh minh họa trên thẻ.
2. Lặp lại ngắt quãng theo ngày (hạn ôn cho từng hộp Leitner).
3. Kéo thả sắp xếp thẻ trong trình soạn.
4. (Tùy chọn) Backend + đăng nhập để đồng bộ nhiều thiết bị.
