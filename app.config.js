/* ============================================================
   CẤU HÌNH ỨNG DỤNG — sửa file này khi triển khai
   ============================================================ */
window.APP_CONFIG = {
  version: '2.1.2',

  /* Gói nội dung đang dùng (thư mục trong packs/).
     Đổi thành 'ma-dien' để chạy gói mẫu Mạ điện & Điện phân.
     Khi chạy qua http(s) có thể thử nhanh bằng ?pack=ma-dien trên địa chỉ. */
  pack: 'phan-kim',

  /* Danh sách file của từng gói (nạp theo thứ tự). Thêm gói mới thì khai báo ở đây. */
  packs: {
    'phan-kim': ['pack.js', 'quests.js', 'theory.js', 'calc.js'],
    'ma-dien': ['pack.js']
  },

  /* Địa chỉ chính thức của app trên GitHub Pages — dùng cho nút chia sẻ và mã QR.
     Để trống: khi chạy trên GitHub Pages app tự lấy đúng địa chỉ đang mở.
     Nên điền sau khi xuất bản, vd: 'https://phankim.hlvsuckhoe.com/' */
  siteUrl: 'https://phankim.hlvsuckhoe.com/',

  /* Nơi người chơi gửi kết quả / khó khăn khi làm thực tế (Facebook, Zalo, Google Form, email…).
     Để trống thì dùng repoUrl + '/issues'. */
  feedbackUrl: '',
  feedbackLabel: 'Gửi kết quả & khó khăn cho tác giả',

  /* ☕ MỜI CÀ PHÊ BẰNG CHUYỂN KHOẢN — chọn MỘT trong hai cách:
     Cách 1 (chắc chắn nhất): lưu ảnh mã QR từ app ngân hàng của bạn vào assets/donate/qr.png rồi điền qrImage.
     Cách 2: điền bankBin + accountNo + accountName, app tự tạo mã VietQR (quét được bằng mọi app ngân hàng VN).
     Để trống tất cả thì mục chuyển khoản tự ẩn. */
  donate: {
    qrImage: 'assets/donate/qr.jpg',
    bankBin: '970418',            // mã BIN ngân hàng, vd: '970436' (Vietcombank) — xem danh sách trong core/vietqr.js
    bankName: 'BIDV',           // vd: 'Vietcombank'
    accountNo: '3210256468',          // số tài khoản
    accountName: 'NGUYEN DUC DUNG',        // tên chủ tài khoản (IN HOA, không dấu)
    amount: 0,              // số tiền gợi ý (0 = người chuyển tự nhập)
    note: 'Cafe Phu thuy Phan kim'   // nội dung chuyển khoản (không dấu, ≤ 25 ký tự)
  },

  /* 🎓 HỌC TRỰC TIẾP VỚI CÔ GIÁO PHÙ THỦY HÀI LÊ */
  teacher: {
    name: 'Cô giáo phù thủy Hài Lê',
    facebookUrl: 'https://www.facebook.com/haile1980',
    otherUrl: '',           // (tuỳ chọn) TikTok / YouTube / Zalo của cô
    otherLabel: 'Kênh video của cô'
  },

  /* Repository GitHub (không bắt buộc) */
  repoUrl: 'https://github.com/nguyenducdungvn/phu-thuy-phan-kim',

  /* Thông tin tác giả hiển thị ở trang Giới thiệu & chứng nhận */
  developer: 'Nguyễn Đức Dũng',
  year: 2026
};

/* ---- Bộ nạp gói (không cần sửa) ---- */
(function () {
  var C = window.APP_CONFIG, p = C.pack;
  try { var q = new URLSearchParams(location.search).get('pack'); if (q && C.packs[q]) p = q; } catch (e) { }
  C.activePack = p;
  window.PACK = { id: p, views: {} };
  C.packs[p].forEach(function (f) { document.write('<script src="packs/' + p + '/' + f + '"><\/script>'); });
})();
