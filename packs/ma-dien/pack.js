/* ============================================================
   GÓI MẪU "Mạ điện & Điện phân" — khuôn để làm ứng dụng mới.
   Toàn bộ nội dung một gói có thể nằm trong 1 file như thế này.
   Bật gói: sửa app.config.js → pack: 'ma-dien' (hoặc thêm ?pack=ma-dien vào địa chỉ).
   ============================================================ */
(function () {
  const C = Lab3D.COL;
  const CUSO4 = '#3f8fd8', CUSO4L = '#9cc9ee';
  const PPE = { type: 'ppe', t: 'Trang bị bảo hộ', d: 'Dung dịch CuSO₄ có axit loãng và nguồn điện. Chọn những thứ cần thiết:',
    items: [
      { id: 'goggle', t: '🥽 Kính bảo hộ', need: true }, { id: 'glove', t: '🧤 Găng nitrile', need: true },
      { id: 'vent', t: '🌬️ Nơi thoáng khí', need: true }, { id: 'dry', t: '🔌 Tay khô, nguồn DC điện áp thấp (≤ 12 V)', need: true },
      { id: 'mains', t: '⚡ Cắm thẳng dây vào ổ điện 220 V', need: false }, { id: 'food', t: '🍜 Vừa làm vừa ăn', need: false }
    ] };
  Object.assign(PACK, {
    id: 'ma-dien',
    meta: {
      title: 'Phù thủy Mạ điện', subtitle: 'Gói mẫu: Mạ điện & Điện phân', logo: 'assets/icons/logo.svg', imgBase: 'packs/ma-dien/img/',
      heroKicker: 'Gói mẫu cho khung ứng dụng',
      heroTitle: 'Khoác <span class="au">áo đồng</span> cho đinh sắt bằng <span class="ag">dòng điện</span>',
      heroText: 'Gói mẫu minh hoạ cách dựng một ứng dụng học-mà-chơi mới trên cùng khung: điện phân, mạ đồng, định luật Faraday.',
      heroImgs: [],
      features: [['⚡ 2 nhiệm vụ', 'Mạ đồng lên đinh sắt, điện phân dung dịch CuSO₄.'], ['📖 4 chương', 'Điện phân, định luật Faraday, mạ điện, an toàn.'], ['🧊 3D điện phân', 'Điện cực, nguồn DC hiển thị V/A, bọt khí, lớp mạ đổi màu.'], ['🧩 Khuôn mẫu', 'Sao chép thư mục này để làm gói mới.']],
      quote: ['Hiểu bản chất thì phép nào cũng dễ.', 'Học viện Giả kim'],
      teaser: 'Hoàn thành các nhiệm vụ để nhận <b>Chứng nhận Phù thủy Mạ điện</b>!',
      shareText: 'Thử game học mạ điện và điện phân có mô phỏng 3D này nhé!'
    },
    metrics: { plate: { base: 100, label: 'Chất lượng lớp mạ', unit: '%', dec: 0, span: 100, melt: null } },
    metalName: { plate: 'Mạ điện' },
    ranks: [
      { xp: 0, t: 'Thợ điện Level 0', s: 'Học việc', ic: '🔌' },
      { xp: 120, t: 'Thợ mạ Level 1', s: 'Tập sự', ic: '⚡' },
      { xp: 300, t: 'Phù thủy Mạ điện', s: 'Bậc thầy', ic: '🧙' }
    ],
    grades: { plate: [[95, 'Lớp mạ gương', 'Bóng, đều, bám chắc', 'S'], [85, 'Lớp mạ tốt', 'Đều, hơi mờ', 'A'], [70, 'Lớp mạ khá', 'Có chỗ sần', 'B'], [50, 'Lớp mạ xấu', 'Cháy đen / bong tróc', 'C'], [0, 'Hỏng', 'Làm lại', 'D']] },
    quests: [
      { id: 'm1', lv: 0, metal: 'plate', icon: '🔩', title: 'Đinh sắt khoác áo đồng', sub: 'Mạ đồng từ dung dịch CuSO₄', input: '1 đinh sắt, 200 mL CuSO₄ 0,5 M, 1 lá đồng, nguồn DC', goal: 'Lớp mạ đồng bóng, bám chắc',
        intro: 'Mạ điện: dòng điện kéo ion Cu²⁺ trong dung dịch tới bám lên vật cần mạ (catốt), còn lá đồng (anốt) tan ra để bù lại.',
        steps: [PPE,
          { type: 'choice', t: 'Làm sạch bề mặt', q: 'Đinh sắt dính dầu và gỉ. Chuẩn bị thế nào?', s: { lvl: .6, liq: CUSO4, elec: true, cathode: '#7a6a5a' },
            opts: [{ t: 'Tẩy dầu bằng xà phòng/NaOH ấm → rửa → nhúng HCl loãng tẩy gỉ → rửa nước cất', ok: true, fb: 'Bề mặt sạch thì lớp mạ mới bám. 90% lỗi mạ bắt nguồn từ khâu làm sạch.' },
              { t: 'Lau qua bằng giấy', ok: 'meh', dp: 30, fb: 'Dầu mỡ còn bám, lớp mạ sẽ loang lổ và bong.' }] },
          { type: 'choice', t: 'Nối điện cực', q: 'Nối cực nguồn thế nào?', s: { lvl: .6, liq: CUSO4, elec: true, cathode: '#8a9098' }, eq: 'Catốt (−): Cu^2+ + 2e → Cu ; Anốt (+): Cu → Cu^2+ + 2e',
            opts: [{ t: 'Đinh sắt nối cực ÂM (−), lá đồng nối cực DƯƠNG (+)', ok: true, fb: 'Vật cần mạ luôn là catốt (−), nơi ion kim loại nhận electron.' },
              { t: 'Đinh sắt nối cực DƯƠNG (+)', ok: false, dp: 10, fb: 'Đinh sắt sẽ bị hoà tan thay vì được mạ!' }], th: 'madien' },
          { type: 'choice', t: '⚡ Sự kiện: đinh đỏ ngay khi nhúng', q: 'Vừa nhúng đinh (chưa bật nguồn) đã thấy một lớp đồng đỏ xỉn bám lên. Tốt hay xấu?', s: { lvl: .6, liq: CUSO4, elec: true, cathodeCoat: '#9a5a3a' }, eq: 'Fe + Cu^2+ → Fe^2+ + Cu (xi măng hoá)',
            opts: [{ t: 'Xấu: đồng xi măng hoá bám lỏng lẻo. Nên bật nguồn trước rồi mới nhúng, hoặc mạ lót trước', ok: true, fb: 'Sắt đứng trước đồng trong dãy điện hoá nên tự đẩy đồng ra. Lớp này xốp, làm lớp mạ sau dễ bong. Trong công nghiệp người ta mạ lót (niken, hoặc đồng kiềm) trước.' },
              { t: 'Tốt, đỡ tốn điện', ok: 'meh', dp: 20, fb: 'Lớp đồng tự bám này bám rất kém. Cạo nhẹ là bong.' }], th: 'madien' },
          { type: 'slider', t: 'Chỉnh dòng điện', q: 'Diện tích đinh khoảng 0,1 dm². Đặt dòng bao nhiêu mA?', min: 10, max: 800, def: 400, unit: 'mA',
            eval: n => n <= 300 && n >= 50 ? { ok: true, fb: `${n} mA ≈ ${(n / 1000 / 0.1).toFixed(1)} A/dm²: vừa đẹp. Lớp mạ hồng sáng, mịn.` } : n > 300 ? { ok: 'meh', dp: Math.min(45, (n - 300) / 10), fb: 'Dòng quá lớn: "cháy mạ", lớp đồng sần, nâu đen, xốp, có bọt khí H₂.' } : { ok: 'meh', dp: 10, fb: 'Dòng quá nhỏ: mạ rất chậm.' },
            s: { lvl: .6, liq: CUSO4, elec: true, cathodeCoat: '#c8733f', volts: 1.2, amps: 0.2, bub: .2 }, th: 'faraday' },
          { type: 'choice', t: 'Hoàn thiện', q: 'Sau 20 phút, lấy đinh ra:', s: { lvl: .6, liq: CUSO4L, elec: true, cathodeCoat: '#d98a52', volts: 0, amps: 0 },
            opts: [{ t: 'Rửa nước cất, thấm khô, có thể đánh bóng nhẹ và phủ lớp chống oxy hoá', ok: true, fb: 'Đinh sắt đã khoác áo đồng!' }, { t: 'Để ướt cho khô tự nhiên', ok: 'meh', dp: 8, fb: 'Vết muối khô và oxy hoá làm xỉn màu.' }] }
        ] },
      { id: 'm2', lv: 1, metal: 'plate', icon: '🔋', title: 'Điện phân CuSO₄', sub: 'Điện cực trơ, định luật Faraday', input: '200 mL CuSO₄ 0,5 M, 2 điện cực graphit', goal: 'Tính đúng khối lượng đồng thu được',
        intro: 'Với điện cực trơ, đồng bám ở catốt còn anốt sinh khí oxy. Dung dịch nhạt màu dần và chuyển sang axit.',
        steps: [PPE,
          { type: 'choice', t: 'Dự đoán sản phẩm', q: 'Ở anốt graphit sinh ra gì?', s: { lvl: .6, liq: CUSO4, elec: true, anode: '#333333', cathode: '#333333', volts: 3, amps: .5, bub: .6 }, eq: '2CuSO4 + 2H2O → 2Cu + O2↑ + 2H2SO4',
            opts: [{ t: 'Khí O₂ (nước bị oxy hoá)', ok: true, fb: 'SO₄²⁻ khó bị oxy hoá nên nước bị oxy hoá trước: 2H₂O → O₂ + 4H⁺ + 4e.' }, { t: 'Khí SO₂', ok: false, dp: 10, fb: 'Ion sunfat không bị oxy hoá ở điều kiện này.' }], th: 'dienphan' },
          { type: 'choice', t: 'Định luật Faraday', q: 'Điện phân 0,5 A trong 1 giờ. Khối lượng Cu thu được (lý thuyết)?', s: { lvl: .6, liq: CUSO4L, elec: true, anode: '#333333', cathode: '#333333', cathodeCoat: '#c8733f', volts: 3, amps: .5, bub: .6 }, eq: 'm = M·I·t / (n·F) = 63,55 × 0,5 × 3600 / (2 × 96485)',
            opts: [{ t: '≈ 0,59 g', ok: true, fb: 'Đúng: 63,55 × 0,5 × 3600 / 192970 ≈ 0,593 g.' }, { t: '≈ 1,19 g', ok: false, dp: 15, fb: 'Bạn quên chia cho n = 2 electron.' }, { t: '≈ 0,30 g', ok: false, dp: 15, fb: 'Kiểm tra lại: t phải đổi ra giây (3600 s).' }], th: 'faraday' },
          { type: 'choice', t: 'Dung dịch sau điện phân', q: 'Dung dịch nhạt màu và có tính axit. Xử lý?', s: { lvl: .6, liq: '#cfe3f3', elec: true, anode: '#333333', cathode: '#333333', cathodeCoat: '#c8733f' },
            opts: [{ t: 'Trung hoà bằng soda, thu kết tủa đồng, giao xử lý thải', ok: true, fb: 'Đúng chuẩn phù thủy có tâm.' }, { t: 'Đổ xuống cống', ok: false, ds: 30, fb: 'Đồng độc với sinh vật thuỷ sinh.' }] }
        ] }
    ],
    theory: [
      { id: 'dienphan', ic: '🔋', t: 'Điện phân là gì?', img: [], html: '<p>Điện phân là dùng <b>dòng điện một chiều</b> để gây ra phản ứng oxy hoá–khử không tự xảy ra. <b>Catốt (−)</b> là nơi xảy ra sự khử (cation nhận electron). <b>Anốt (+)</b> là nơi xảy ra sự oxy hoá.</p><div class="eq">Catốt: Cu²⁺ + 2e → Cu   ;   Anốt trơ: 2H₂O → O₂ + 4H⁺ + 4e</div><p>Với anốt tan (lá đồng), chính đồng bị oxy hoá: Cu → Cu²⁺ + 2e, nên nồng độ dung dịch gần như không đổi. Đây là cơ sở của mạ điện và tinh luyện đồng.</p>' },
      { id: 'faraday', ic: '🧮', t: 'Định luật Faraday', img: [], html: '<div class="eq">m = M · I · t / (n · F)</div><p>Trong đó M là khối lượng mol (g/mol), I là cường độ dòng (A), t là thời gian (s), n là số electron trao đổi, F = 96 485 C/mol. Mật độ dòng (A/dm²) quyết định chất lượng lớp mạ: quá cao thì cháy mạ, quá thấp thì chậm.</p>' },
      { id: 'madien', ic: '✨', t: 'Mạ điện: bí quyết lớp mạ đẹp', img: [], html: '<ol><li><b>Làm sạch</b>: tẩy dầu, tẩy gỉ, rửa. Đây là khâu quan trọng nhất.</li><li><b>Mạ lót</b> khi kim loại nền hoạt động mạnh hơn kim loại mạ (sắt so với đồng) để tránh lớp xi măng hoá bám kém.</li><li><b>Mật độ dòng phù hợp</b>, khuấy nhẹ, nhiệt độ ổn định.</li><li><b>Hoàn thiện</b>: rửa, sấy, đánh bóng, phủ bảo vệ.</li></ol>' },
      { id: 'antoan', ic: '⚠️', t: 'An toàn mạ điện', img: [], html: '<ul><li>Chỉ dùng nguồn DC điện áp thấp có giới hạn dòng.</li><li>CuSO₄ độc khi nuốt và kích ứng da, mắt. Đeo kính và găng.</li><li>Khí H₂ sinh ra ở catốt khi dòng lớn: để xa lửa.</li><li>Không đổ dung dịch đồng ra cống.</li></ul>' }
    ],
    quiz: [
      { q: 'Vật cần mạ được nối với cực nào?', a: ['Cực dương (+)', 'Cực âm (−)', 'Cực nào cũng được', 'Nối đất'], c: 1, e: 'Vật mạ là catốt, nơi ion kim loại nhận electron.' },
      { q: 'Dòng điện quá lớn khi mạ gây ra gì?', a: ['Lớp mạ bóng hơn', 'Cháy mạ: sần, đen, xốp', 'Không ảnh hưởng', 'Mạ nhanh và đẹp hơn'], c: 1, e: 'Mật độ dòng quá cao làm ion không kịp tới bề mặt, sinh H₂ và lớp xốp.' },
      { q: 'Điện phân CuSO₄ với điện cực trơ, anốt sinh ra?', a: ['Cu', 'H₂', 'O₂', 'SO₂'], c: 2, e: 'Nước bị oxy hoá thành O₂.' },
      { q: 'Hằng số Faraday xấp xỉ?', a: ['96 485 C/mol', '6,02·10²³', '8,314 J/mol·K', '1,6·10⁻¹⁹ C'], c: 0, e: 'F = điện tích của 1 mol electron.' }
    ],
    gallery: [],
    procs: {
      plate: { name: 'Mạ đồng lên đinh sắt', steps: [
        ['Chuẩn bị', 'Dung dịch CuSO₄, lá đồng (+), đinh sắt (−).', '', { lvl: .6, liq: CUSO4, elec: true }],
        ['Bật nguồn', 'Khoảng 1 V, 0,2 A.', 'Cu^2+ + 2e → Cu', { lvl: .6, liq: CUSO4, elec: true, volts: 1.0, amps: .2, cathodeCoat: '#c8733f', anodeS: .85, bub: .1 }],
        ['Dòng quá lớn', 'Cháy mạ, sủi H₂.', '2H2O + 2e → H2 + 2OH^-', { lvl: .6, liq: CUSO4, elec: true, volts: 4, amps: 1.2, cathodeCoat: '#4a2f22', bub: 1 }],
        ['Hoàn thành', 'Lớp đồng hồng sáng.', '', { lvl: .6, liq: CUSO4L, elec: true, cathodeCoat: '#d98a52', anodeS: .7 }]] },
      electro: { name: 'Điện phân CuSO₄ (điện cực trơ)', steps: [
        ['Ban đầu', 'Dung dịch xanh lam.', '', { lvl: .6, liq: CUSO4, elec: true, anode: '#333333', cathode: '#333333' }],
        ['Điện phân', 'O₂ ở anốt, Cu bám catốt.', '2CuSO4 + 2H2O → 2Cu + O2 + 2H2SO4', { lvl: .6, liq: CUSO4L, elec: true, anode: '#333333', cathode: '#333333', cathodeCoat: '#c8733f', volts: 3, amps: .5, bub: .7 }],
        ['Kết thúc', 'Dung dịch gần như không màu, có axit.', '', { lvl: .6, liq: '#dbe9f3', elec: true, anode: '#333333', cathode: '#333333', cathodeCoat: '#c8733f' }]] }
    },
    finale: { title: 'Phù thủy Mạ điện', pdf: '', lockedText: 'Hoàn thành tất cả nhiệm vụ để nhận chứng nhận.', message: 'Chúc mừng bạn đã trở thành <b>Phù thủy Mạ điện</b>!' },
    credits: [{ role: 'Phát triển ứng dụng', name: 'Nguyễn Đức Dũng', note: 'Gói mẫu minh hoạ khung ứng dụng.', ic: '👨‍💻' }],
    pages: {
      safety: '<h2 class="sec">⚠️ An toàn</h2><div class="callout danger">Chỉ dùng nguồn DC điện áp thấp. Không dùng điện lưới 220 V trực tiếp.</div><div class="card"><ul><li>Kính, găng nitrile.</li><li>CuSO₄ độc khi nuốt, kích ứng da và mắt.</li><li>Khí H₂: tránh lửa.</li><li>Dung dịch thải: trung hoà, thu hồi đồng, giao đơn vị xử lý.</li></ul></div>',
      disclaimer: '<h2 class="sec">⚖️ Miễn trừ trách nhiệm</h2><div class="card legal"><p>Nội dung chỉ nhằm mục đích giáo dục. Người dùng tự chịu trách nhiệm khi thực hành; người dưới 18 tuổi phải có người lớn giám sát. Tác giả không chịu trách nhiệm về thương tích hay thiệt hại phát sinh.</p></div>'
    }
  });
})();
