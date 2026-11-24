# ⚗️ Phù thủy Phân kim — Học viện Giả kim Vàng & Bạc (v2.1.1)

Trò chơi giáo dục tiếng Việt: người chơi nhập vai **phù thủy** đi từ *Level 0 (Học việc)* lên *Đại pháp sư 9999*, vừa học hoá học thật của nghề phân kim vừa "biến" nguyên liệu thô (bạc 925, vàng tây, ve chai điện tử, nước hãm ảnh…) thành **vàng và bạc ở nhiều mức tinh khiết**. Hoàn thành mọi cấp độ sẽ nhận **chứng nhận** và (nếu đủ 18 tuổi) **📜 Bí kíp phân kim** dạng PDF.

> ⚠️ Ứng dụng giáo dục — không phải hướng dẫn tự làm tại nhà. Xem mục **Miễn trừ** trong app.

## Tính năng chính

| | |
|---|---|
| 🧪 Nhiệm vụ | 7 nhiệm vụ nhập vai, chấm điểm độ tinh khiết / thu hồi / an toàn, thỏi hạng S–D |
| 📖 Sách phép | 20 chương lý thuyết có ảnh thực tế |
| 🧊 Phòng 3D | Mô phỏng Three.js: dung dịch, khí, kết tủa, đinh sắt, kẽm lá, điện cực, nấu chảy |
| 🧮 Bàn tính | Ước tính hoá chất cho 14 loại nguyên liệu |
| ❓ Thử thách | 12 câu trắc nghiệm |
| 📜 Bí kíp | Lễ phong Đại pháp sư, chứng nhận có tên, PDF 21 trang (cần xác nhận ≥ 18 tuổi) |
| ☕ Cà phê | **Mã QR chuyển khoản** (VietQR), chia sẻ qua điện thoại, Facebook, Zalo, mã QR link; thẻ **Học trực tiếp với Cô giáo phù thủy Hài Lê** |
| ℹ️ Giới thiệu | Bà giáo phù thủy Hài Lê (hình ảnh & kiến thức), Nguyễn Đức Dũng (phát triển) |
| 📲 Cài đặt | Hướng dẫn cài ra màn hình Android/iPhone, nút cài nhanh, **chạy offline** |

## Chạy thử

- Mở thẳng `index.html` bằng Chrome/Edge: chơi được, nhưng **không** cài hay offline được.
- Máy chủ tĩnh: `python -m http.server 8000` → mở `http://localhost:8000`.
- Thử gói mẫu Mạ điện: `http://localhost:8000/?pack=ma-dien`.

## Đưa lên GitHub Pages

👉 Hướng dẫn chi tiết từng bước cho người không biết lập trình: **[HUONG-DAN-DUA-LEN-GITHUB.md](HUONG-DAN-DUA-LEN-GITHUB.md)**

1. Tạo repository (ví dụ `phu-thuy-phan-kim`), tải **toàn bộ nội dung thư mục này** lên (kéo thả qua *Add file → Upload files*, hoặc dùng git).
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
3. Sau vài phút: `https://nguyenducdungvn.github.io/phu-thuy-phan-kim/`. Bản chính thức chạy ở tên miền riêng **https://phankim.hlvsuckhoe.com/** (tệp `CNAME`; bản ghi CNAME `phankim` trên Cloudflare trỏ về `nguyenducdungvn.github.io`; link github.io tự chuyển về).
4. Mở `app.config.js`, điền:
   - `siteUrl`: link ở bước 3 (cho mã QR và nút chia sẻ),
   - `feedbackUrl`: Facebook / Zalo / Google Form để người chơi gửi kết quả thực tế,
   - `repoUrl`: link repository (tuỳ chọn),
   - `donate`: thông tin chuyển khoản mời cà phê — **ảnh QR** (`assets/donate/qr.png`) hoặc `bankBin` + `accountNo` + `accountName` để app tự tạo VietQR,
   - `teacher.facebookUrl`: link Facebook của Cô giáo phù thủy Hài Lê.
5. Chạy `python tools/build-sw.py` mỗi khi thêm, xoá hoặc sửa file, để người dùng offline nhận bản mới.

```bash
git init && git add . && git commit -m "Phù thủy Phân kim v2.0"
git branch -M main
git remote add origin https://github.com/nguyenducdungvn/phu-thuy-phan-kim.git
git push -u origin main
```

## Cài ra màn hình điện thoại (offline)

- **Android (Chrome):** mở link → menu ⋮ → *Cài đặt ứng dụng* / *Thêm vào màn hình chính*, hoặc bấm nút 📲 trong trang **Cài đặt** của app.
- **iPhone (Safari):** mở link → nút **Chia sẻ** → *Thêm vào MH chính*.
- Mở app một lần khi có mạng; trang **Cài đặt** sẽ báo "Đã sẵn sàng chạy offline".

## Cấu trúc

```
index.html              khung trang (không chứa nội dung chủ đề)
app.config.js           ⚙️ cấu hình + bộ nạp gói
core/engine.js          engine: điều hướng, game, sách, 3D, đố, bí kíp, chia sẻ, cài đặt
core/lab3d.js           bộ mô phỏng 3D (cốc, khí, kết tủa, đinh, kẽm, điện cực, nấu chảy)
core/style.css          giao diện (font đóng gói sẵn trong vendor/fonts)
packs/phan-kim/         gói Phân kim: pack.js, quests.js, theory.js, calc.js, img/, bi-kip/
packs/ma-dien/          gói mẫu Mạ điện & Điện phân (1 file)
packs/_template/        khuôn gói trống có chú thích
assets/icons/           logo SVG + bộ biểu tượng PWA
vendor/                 three.js r128, qrcode-generator, fonts (đều giấy phép mở)
tools/build-sw.py       tạo lại sw.js (danh sách file offline)
tools/build_pdf.py      dựng lại PDF Bí kíp (Python + reportlab)
manifest.webmanifest, sw.js   PWA
HANDOVER.md             📘 tài liệu bàn giao cho người phát triển tiếp
```

## Giấy phép

Mã nguồn: MIT (`LICENSE`). Three.js, qrcode-generator: MIT. Font Be Vietnam Pro, Playfair Display: SIL OFL 1.1. Ảnh trong `packs/*/img/`: thuộc quyền chủ sở hữu, **không** theo MIT.
