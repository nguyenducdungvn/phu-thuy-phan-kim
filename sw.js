/* Service worker — TỰ SINH bởi tools/build-sw.py, đừng sửa tay */
const CACHE = 'hocvien-2.1.2-202611230941';
const FILES = [
 "./",
 "LICENSE",
 "app.config.js",
 "index.html",
 "manifest.webmanifest",
 "assets/donate/qr.jpg",
 "assets/icons/apple-touch-icon.png",
 "assets/icons/favicon-32.png",
 "assets/icons/icon-192.png",
 "assets/icons/icon-512.png",
 "assets/icons/icon-maskable-192.png",
 "assets/icons/icon-maskable-512.png",
 "assets/icons/logo-1024-transparent.png",
 "assets/icons/logo-maskable.svg",
 "assets/icons/logo-transparent.svg",
 "assets/icons/logo.svg",
 "core/engine.js",
 "core/lab3d.js",
 "core/style.css",
 "core/vietqr.js",
 "packs/_template/pack.js",
 "packs/ma-dien/pack.js",
 "packs/phan-kim/calc.js",
 "packs/phan-kim/pack.js",
 "packs/phan-kim/quests.js",
 "packs/phan-kim/theory.js",
 "packs/phan-kim/bi-kip/Bi-kip-phan-kim.pdf",
 "packs/phan-kim/img/agcl-duoi-dung-dich-dong.jpg",
 "packs/phan-kim/img/agcl-khuay.jpg",
 "packs/phan-kim/img/agcl-trang.jpg",
 "packs/phan-kim/img/bac-bot-1.jpg",
 "packs/phan-kim/img/bac-bot-2.jpg",
 "packs/phan-kim/img/banner-quy-trinh.jpg",
 "packs/phan-kim/img/bun-den-chua-vang.jpg",
 "packs/phan-kim/img/bun-thai-chua-vang.jpg",
 "packs/phan-kim/img/can-mong-nguyen-lieu.jpg",
 "packs/phan-kim/img/can-mong.jpg",
 "packs/phan-kim/img/cuc-vang-nho.jpg",
 "packs/phan-kim/img/dinh-sat.jpg",
 "packs/phan-kim/img/dung-dich-vang.jpg",
 "packs/phan-kim/img/duong-tinh-luyen.jpg",
 "packs/phan-kim/img/duong.jpg",
 "packs/phan-kim/img/giot-vang.jpg",
 "packs/phan-kim/img/ha-tuoi.jpg",
 "packs/phan-kim/img/ket-qua-bac-1.jpg",
 "packs/phan-kim/img/ket-qua-bac-2.jpg",
 "packs/phan-kim/img/ket-qua-bac.jpg",
 "packs/phan-kim/img/ket-qua-vang-1.jpg",
 "packs/phan-kim/img/ket-qua-vang-2.jpg",
 "packs/phan-kim/img/ket-qua-vang-3.jpg",
 "packs/phan-kim/img/ket-qua-vang-4.jpg",
 "packs/phan-kim/img/ket-qua-vang-5.jpg",
 "packs/phan-kim/img/ket-qua-vang.jpg",
 "packs/phan-kim/img/kho-kien-thuc.jpg",
 "packs/phan-kim/img/la-kem.jpg",
 "packs/phan-kim/img/loc-hut-chan-khong.jpg",
 "packs/phan-kim/img/muoi-bien.jpg",
 "packs/phan-kim/img/nguyen-lieu-tho-1.jpg",
 "packs/phan-kim/img/nguyen-lieu-tho-3.jpg",
 "packs/phan-kim/img/nguyen-lieu-tho-4.jpg",
 "packs/phan-kim/img/nguyen-lieu-tho.jpg",
 "packs/phan-kim/img/phe-lieu-bo-mach.jpg",
 "packs/phan-kim/img/phe-lieu-cap-mem.jpg",
 "packs/phan-kim/img/phe-lieu-dien-thoai.jpg",
 "packs/phan-kim/img/phe-lieu-mainboard.jpg",
 "packs/phan-kim/img/phe-lieu-sim.jpg",
 "packs/phan-kim/img/phe-lieu-trang-suc.jpg",
 "packs/phan-kim/img/pho-kiem-tra-vang.jpg",
 "packs/phan-kim/img/poster-an-toan.jpg",
 "packs/phan-kim/img/so-che-bot-xam.jpg",
 "packs/phan-kim/img/so-che-bun.jpg",
 "packs/phan-kim/img/so-che-cui-chay.jpg",
 "packs/phan-kim/img/so-do-thu-hoi-bac.jpg",
 "packs/phan-kim/img/thoi-bac-tren-can.jpg",
 "packs/phan-kim/img/thoi-bac.jpg",
 "packs/phan-kim/img/thoi-vang.jpg",
 "packs/phan-kim/img/vang-bot-nau-1.jpg",
 "packs/phan-kim/img/vang-bot-nau-2.jpg",
 "packs/phan-kim/img/vang-bot-nau-3.jpg",
 "packs/phan-kim/img/vang-bot-say-1.jpg",
 "packs/phan-kim/img/vang-bot-say-2.jpg",
 "packs/phan-kim/img/vang-bot.jpg",
 "packs/phan-kim/img/wonfram-1.jpg",
 "packs/phan-kim/img/wonfram-2.jpg",
 "vendor/qrcode.js",
 "vendor/three.min.js",
 "vendor/fonts/BeVietnamPro_400Regular.woff2",
 "vendor/fonts/BeVietnamPro_600SemiBold.woff2",
 "vendor/fonts/BeVietnamPro_700Bold.woff2",
 "vendor/fonts/BeVietnamPro_800ExtraBold.woff2",
 "vendor/fonts/PlayfairDisplay_700Bold.woff2",
 "vendor/fonts/PlayfairDisplay_800ExtraBold.woff2"
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) { // tài nguyên ngoài (nếu có): thử mạng, lỗi thì bỏ qua
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }).catch(() => new Response('', { status: 504 }))));
    return;
  }
  const isCode = e.request.mode === 'navigate' || /\.(html|js|css|webmanifest|json)$/.test(url.pathname) || url.pathname.endsWith('/');
  const save = res => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; };
  if (isCode) { // mã & trang: ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu
    e.respondWith(fetch(e.request).then(save).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
    return;
  }
  // ảnh, font, PDF: ưu tiên bản đã lưu (nhanh, đỡ tốn mạng)
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(save)));
});
