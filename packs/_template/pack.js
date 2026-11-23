/* ============================================================
   KHUÔN GÓI TRỐNG — sao chép thư mục này thành packs/<ten-goi>/
   rồi khai báo trong app.config.js:
       packs: { '<ten-goi>': ['pack.js'] },  pack: '<ten-goi>'
   Mọi trường dưới đây đều được engine (core/engine.js) đọc.
   ============================================================ */
(function () {
  const C = Lab3D.COL, P = Lab3D.PREC;   // bảng màu sẵn cho cảnh 3D
  Object.assign(PACK, {
    id: 'ten-goi',
    meta: {
      title: 'Tên ứng dụng', subtitle: 'Dòng phụ', logo: 'assets/icons/logo.svg', imgBase: 'packs/ten-goi/img/',
      heroKicker: 'Dòng nhỏ phía trên tiêu đề', heroTitle: 'Tiêu đề lớn (được dùng <span class="au">HTML</span>)', heroText: 'Đoạn giới thiệu.',
      heroImgs: [],                                   // tên ảnh (không đuôi .jpg) trong imgBase
      features: [['🧪 Tính năng 1', 'Mô tả'], ['📖 Tính năng 2', 'Mô tả']],
      quote: ['Câu trích dẫn', 'Tác giả'],
      teaser: 'Lời mời hoàn thành game để nhận phần thưởng.',
      shareText: 'Câu chữ khi chia sẻ.'
    },
    /* Chỉ số chấm điểm theo "metal" của nhiệm vụ: base = điểm khởi đầu, span = biên độ thanh hiển thị,
       melt = 'ag' | 'au' | null (cảnh kết thúc 3D), bySafety = chấm theo điểm an toàn */
    metrics: { main: { base: 100, label: 'Chất lượng', unit: '%', dec: 0, span: 100, melt: null } },
    metalName: { main: 'Chủ đề' },
    ranks: [{ xp: 0, t: 'Level 0', s: 'Học việc', ic: '🧹' }, { xp: 100, t: 'Level 1', s: 'Bậc thầy', ic: '🧙' }],
    /* Hạng: [ngưỡng điểm, tên, mô tả, ký hiệu S/A/B/C/D] — xếp từ cao xuống thấp */
    grades: { main: [[90, 'Xuất sắc', 'Mô tả', 'S'], [70, 'Khá', 'Mô tả', 'B'], [0, 'Làm lại', 'Mô tả', 'D']] },
    quests: [{
      id: 'x1', lv: 0, metal: 'main', icon: '⚗️', title: 'Nhiệm vụ đầu tiên', sub: 'Mô tả ngắn', input: 'Đầu vào', goal: 'Mục tiêu', intro: 'Lời dẫn.',
      steps: [
        /* type 'choice': ok true | 'meh' | false; dp: trừ chất lượng; dy: trừ thu hồi; ds: trừ an toàn;
           s: trạng thái 3D sau khi chọn đúng (xem DEF trong core/lab3d.js); eq: phương trình (H2O, Fe^2+); th: id chương lý thuyết; tip: lời dặn */
        { type: 'choice', t: 'Tên bước', q: 'Câu hỏi?', s: { lvl: .5, liq: C.blueL }, eq: 'A + B → C', th: 'c1',
          opts: [{ t: 'Đáp án đúng', ok: true, fb: 'Giải thích.' }, { t: 'Đáp án sai', ok: false, ds: 10, fb: 'Vì sao sai.' }] },
        /* type 'slider': eval(n) trả về {ok, fb, dp?, dy?, ds?} */
        { type: 'slider', t: 'Chỉnh thông số', q: 'Chọn giá trị?', min: 0, max: 10, def: 2, unit: 'lần', eval: n => n >= 5 ? { ok: true, fb: 'Tốt' } : { ok: 'meh', dp: 10, fb: 'Chưa đủ' } }
      ]
    }],
    theory: [{ id: 'c1', ic: '📘', t: 'Chương 1', img: [], html: '<p>Nội dung HTML.</p>' }],
    quiz: [{ q: 'Câu hỏi?', a: ['A', 'B', 'C', 'D'], c: 0, e: 'Giải thích.' }],
    gallery: [],                                     // [['ten-anh', 'chú thích'], ...]
    procs: { p1: { name: 'Quy trình 3D', steps: [['Bước 1', 'Mô tả', 'Phương trình', { lvl: .5, liq: C.clear }]] } },
    finale: { title: 'Bậc thầy', pdf: '', pdfLabel: '📜 Tải tài liệu', lockedText: 'Hoàn thành tất cả để mở khoá.', message: 'Chúc mừng!' },
    credits: [{ role: 'Phát triển', name: 'Tên bạn', note: 'Ghi chú', ic: '👨‍💻' }],
    pages: { safety: '<h2 class="sec">An toàn</h2><p>…</p>', disclaimer: '<h2 class="sec">Miễn trừ</h2><p>…</p>' }
    /* views: { calc: { nav: '🧮 Công cụ', html: '<div class="wrap">…</div>', init() { … } } }  — trang riêng (tuỳ chọn) */
  });
})();
