// Service worker: cho app chạy offline. Chiến lược "mạng trước, mất mạng mới dùng bản đã lưu" để không bao giờ
// kẹt ở bản cũ (bộ thẻ mới luôn đến ngay khi có mạng). Dữ liệu học nằm ở localStorage nên không đi qua đây.
// BUILD do scripts/version-assets.mjs ghi lại mỗi khi nội dung assets đổi: sw.js đổi byte thì trình duyệt cài lại
// và dọn cache cũ.
const BUILD = "0e317e52";
const CACHE = `recall-${BUILD}`;
const NETWORK_TIMEOUT = 4000; // mạng chập chờn: quá 4 giây thì dùng bản đã lưu

const PAGES = ["index.html", "subject.html", "set.html", "edit.html", "flashcards.html", "learn.html", "test.html", "match.html"];
const SHELL = ["./", "manifest.webmanifest", "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // Lưu sẵn mọi trang và các file assets mà trang đó nạp (URL có ?v=hash), để lần đầu mở offline vẫn đủ file.
      const assets = new Set();
      for (const page of PAGES) {
        const res = await fetch(page, { cache: "reload" });
        if (!res.ok) continue;
        await cache.put(page, res.clone());
        const html = await res.text();
        for (const m of html.matchAll(/(?:src|href)="(assets\/[^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)) assets.add(m[1]);
      }
      await Promise.all([...assets].map((url) => cache.add(url).catch(() => {})));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith("recall-") && key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })()
  );
});

function fetchWithTimeout(request) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT);
    fetch(request).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Font Google: cache để offline vẫn đúng chữ (trả bản cache trước, làm mới ngầm)
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !isFont) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (isFont) {
        const cached = await cache.match(request);
        const refresh = fetch(request).then((res) => (res.ok || res.type === "opaque" ? cache.put(request, res.clone()).then(() => res) : res)).catch(() => null);
        return cached || (await refresh) || Response.error();
      }
      try {
        const res = await fetchWithTimeout(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      } catch {
        // Trang có tham số (subject.html?id=…) dùng chung một bản HTML đã lưu nên bỏ qua query khi tra cache
        const hit = await cache.match(request, { ignoreSearch: request.mode === "navigate" });
        if (hit) return hit;
        if (request.mode === "navigate") return (await cache.match("index.html")) || Response.error();
        return Response.error();
      }
    })()
  );
});
