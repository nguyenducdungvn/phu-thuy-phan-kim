#!/usr/bin/env python3
"""Tạo lại sw.js (danh sách file chạy offline). Chạy mỗi khi thêm/xoá file:
       python tools/build-sw.py
Phiên bản cache lấy từ app.config.js (version) + dấu thời gian, nên người dùng sẽ nhận bản mới."""
import os, json, re, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', 'tools', 'docs', 'node_modules', '.github'}
SKIP_EXT = {'.md', '.py', '.txt', '.zip', '.svgfrag'}
files = ['./']
for d, dirs, fs in os.walk(ROOT):
    dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS and not x.startswith('.'))
    for f in sorted(fs):
        if f.startswith('.') or os.path.splitext(f)[1].lower() in SKIP_EXT or f == 'sw.js':
            continue
        files.append(os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, '/'))
cfg = open(os.path.join(ROOT, 'app.config.js'), encoding='utf-8').read()
ver = (re.search(r"version:\s*'([^']+)'", cfg) or [None, '0'])[1]
cache = f"hocvien-{ver}-{time.strftime('%Y%m%d%H%M')}"
sw = rf"""/* Service worker — TỰ SINH bởi tools/build-sw.py, đừng sửa tay */
const CACHE = '{cache}';
const FILES = {json.dumps(files, ensure_ascii=False, indent=1)};
self.addEventListener('install', e => {{ e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting())); }});
self.addEventListener('activate', e => {{ e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', e => {{
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {{ // tài nguyên ngoài (nếu có): thử mạng, lỗi thì bỏ qua
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {{ const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return res; }}).catch(() => new Response('', {{ status: 504 }}))));
    return;
  }}
  const isCode = e.request.mode === 'navigate' || /\.(html|js|css|webmanifest|json)$/.test(url.pathname) || url.pathname.endsWith('/');
  const save = res => {{ if (res && res.ok) {{ const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }} return res; }};
  if (isCode) {{ // mã & trang: ưu tiên bản mới trên mạng, mất mạng thì dùng bản đã lưu
    e.respondWith(fetch(e.request).then(save).catch(() => caches.match(e.request, {{ ignoreSearch: true }}).then(r => r || caches.match('index.html'))));
    return;
  }}
  // ảnh, font, PDF: ưu tiên bản đã lưu (nhanh, đỡ tốn mạng)
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then(r => r || fetch(e.request).then(save)));
}});
"""
open(os.path.join(ROOT, 'sw.js'), 'w', encoding='utf-8').write(sw)
print(f'sw.js: {len(files)} file, cache = {cache}')
