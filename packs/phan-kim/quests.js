/* Gói Phân kim — nhiệm vụ, cấp bậc, hạng thỏi */
(function () {
  const C = Lab3D.COL, P = Lab3D.PREC;
  const PPE = { type: 'ppe', t: 'Trang bị phép hộ thân', d: 'Trước khi mở lọ axit, phù thủy phải mặc đủ đồ bảo hộ. Chọn tất cả những thứ BẮT BUỘC.',
    items: [
      { id: 'mask', t: '😷 Mặt nạ phin lọc khí axit / NOx', need: true },
      { id: 'goggle', t: '🥽 Kính bảo hộ kín', need: true },
      { id: 'glove', t: '🧤 Găng nitrile / neoprene dày', need: true },
      { id: 'vent', t: '🌬️ Làm ngoài trời thoáng hoặc tủ hút', need: true },
      { id: 'apron', t: '🦺 Tạp dề chống hoá chất', need: true },
      { id: 'soda', t: '🧂 Xô nước + baking soda để trung hoà khi đổ tràn', need: true },
      { id: 'phone', t: '📱 Quay TikTok cận mặt cốc axit', need: false },
      { id: 'kitchen', t: '🍳 Làm trong bếp nhà cho tiện', need: false }
    ] };

  /* Mỗi bước: type 'choice' | 'slider' | 'ppe' | 'info'
     option: {t, ok:true|false|'meh', fb, dp (trừ độ tinh khiết, điểm %), dy (trừ thu hồi %), ds (trừ an toàn)}
     s: trạng thái cảnh 3D sau khi làm đúng; eq: phương trình; tip: lời dặn bà giáo; th: id chương lý thuyết liên quan */
  const QUESTS = [
    {
      id: 'q1', lv: 0, metal: 'ag', icon: '🥄', title: 'Thỏi bạc đầu tiên',
      sub: 'Bạc 925 phế → AgCl → đường + xút', input: '100 g bạc 925 (dây chuyền, nhẫn cũ)', goal: 'Bạc ≥ 99,9%',
      intro: 'Phù thủy level 0 nào cũng bắt đầu từ đây. Nguyên liệu chỉ cần axit nitric, muối biển, xút và đường. "Nghề nói phân kim cho sang cái mồm chứ mình dùng toàn đường, muối biển, xút để thu bạc thôi."',
      steps: [
        PPE,
        { type: 'choice', t: 'Sơ chế nguyên liệu', q: '100 g bạc 925 gồm dây chuyền và nhẫn. Bạn sơ chế thế nào?', s: { chunk: 'ag', chunkS: 1 },
          opts: [
            { t: 'Cán mỏng / cắt nhỏ, tẩy sạch dầu mỡ', ok: true, fb: 'Diện tích bề mặt càng lớn thì axit hoà tan càng nhanh và đều, đỡ phải đun lâu.' },
            { t: 'Để nguyên cục, thả vào axit cho nhanh', ok: 'meh', dp: 0, dy: 0.3, fb: 'Vẫn tan, nhưng rất chậm. Phải đun lâu hơn, tốn axit hơn và sinh nhiều khí NO₂ hơn.' }
          ], th: 'canmong' },
        { type: 'choice', t: 'Hoà tan bạc', q: 'Dùng phép nào để hoà tan bạc?', s: { lvl: .45, liq: C.blueL, chunk: 'ag', chunkS: .15, bub: 1, fume: 'no2', heat: true }, eq: '3Ag + 4HNO3 → 3AgNO3 + NO↑ + 2H2O',
          opts: [
            { t: 'HNO₃ pha loãng 1:1 với nước cất, đun nhẹ 50–70 °C, không đậy nắp', ok: true, fb: 'Chuẩn! Axit loãng tốn ít HNO₃ hơn axit đặc. Đồng trong bạc 925 cũng tan theo nên dung dịch có màu xanh lam.' },
            { t: 'HCl đặc', ok: false, dp: 0, ds: 0, fb: 'Bạc không tan trong HCl. Bề mặt chỉ phủ một lớp AgCl trắng rồi dừng lại.' },
            { t: 'Nước cường toan', ok: false, ds: 5, fb: 'Bạc sẽ tạo lớp vỏ AgCl bọc kín, không tan tiếp. Nước cường toan dành cho vàng.' },
            { t: 'HNO₃, đậy kín nắp cho đỡ mùi', ok: false, ds: 30, fb: 'CỰC NGUY HIỂM! Khí NO/NO₂ sinh ra làm tăng áp suất, bình có thể vỡ hoặc nổ và phun axit. Không bao giờ đậy kín.' }
          ], th: 'hoatanbac' },
        { type: 'choice', t: 'Lọc dung dịch', q: 'Bạc đã tan hết. Dung dịch màu xanh lam, đáy cốc còn ít cặn đen. Làm gì tiếp?', s: { lvl: .7, liq: C.blueL, funnel: true },
          opts: [
            { t: 'Pha loãng bằng nước cất, lọc. Giữ riêng cặn đen', ok: true, fb: 'Cặn đen thường có vàng, thiếc oxit hoặc bụi bẩn. Giữ lại vì đó có thể là "vàng trong bùn".' },
            { t: 'Không lọc, làm luôn bước tiếp', ok: 'meh', dp: 0.4, fb: 'Cặn sẽ lẫn vào kết tủa AgCl và làm bạc kém sạch.' },
            { t: 'Lọc rồi đổ cặn đen đi', ok: 'meh', dy: 0.5, fb: 'Bạc không giảm, nhưng bạn có thể vừa đổ đi một ít vàng.' }
          ], th: 'loc' },
        { type: 'choice', t: 'Tách bạc khỏi đồng', q: 'Trong dung dịch có cả AgNO₃ và Cu(NO₃)₂. Phép nào tách được bạc riêng ra?', s: { lvl: .8, liq: C.blueL, prec: P.white, precN: .8 }, eq: 'AgNO3 + NaCl → AgCl↓ + NaNO3',
          opts: [
            { t: 'Đổ từ từ nước muối biển (NaCl) bão hoà', ok: true, fb: 'Chỉ bạc tạo kết tủa AgCl trắng như sữa đông. Đồng vẫn tan nên lọc là bỏ được. "Không khử đồng vẫn thu đủ bạc" là vì vậy.' },
            { t: 'Thả đinh sắt vào thẳng dung dịch nitrat', ok: 'meh', dp: 3, fb: 'Sắt khử cả bạc lẫn đồng, nên bạc ra lẫn nhiều đồng. Muốn sạch thì phải tách qua AgCl.' },
            { t: 'Đổ đường vào ngay', ok: false, fb: 'Đường không khử được Ag⁺ trong môi trường axit nitric, còn có thể phản ứng với HNO₃ sinh khí độc.', ds: 10 }
          ], th: 'agcl', tip: 'Thế này nó mới phê á! Kết tủa AgCl bằng muối ăn!' },
        { type: 'slider', t: 'Rửa AgCl', q: 'Gạn bỏ nước xanh, rửa AgCl bằng nước nóng. Bạn rửa bao nhiêu lần?', min: 0, max: 8, def: 2, unit: 'lần',
          eval: n => n >= 5 ? { ok: true, fb: 'Nước rửa đã trong suốt, hết màu xanh. AgCl sạch thì bạc mới sạch.' } : { ok: 'meh', dp: (5 - n) * 0.35, fb: `Mới rửa ${n} lần, nước còn ánh xanh. Đồng còn sót sẽ đi vào bạc. Nên rửa 5–6 lần.` },
          s: { lvl: .5, liq: C.clear, prec: P.white, precN: .8 }, th: 'agcl' },
        { type: 'choice', t: 'Biến AgCl thành bạc', q: 'Dùng phép khử nào?', s: { lvl: .6, liq: C.sugar, prec: P.ag, precN: .65, heat: true, bub: .25 }, eq: '2AgCl + 2NaOH → Ag2O + 2NaCl + H2O ; Ag2O + C6H12O6 → 2Ag↓ + C6H12O7',
          opts: [
            { t: 'Thêm NaOH (kết tủa chuyển nâu đen), đun 60–80 °C, cho glucose/mạch nha vào từ từ', ok: true, fb: 'Đúng phép "tráng gương nhưng không phải tráng gương". Nhóm –CHO của glucose khử Ag₂O thành bạc bột xám.' },
            { t: 'NaOH + đường kính đã đun với nước cốt chanh', ok: true, fb: 'Cũng được! Chanh thuỷ phân saccarozơ thành glucose + fructose, đều là đường khử.' },
            { t: 'Rắc đường kính khô vào AgCl, để nguội', ok: false, dp: 0, fb: 'Saccarozơ không có nhóm khử, lại thiếu kiềm và nhiệt. Không có gì xảy ra.' }
          ], th: 'duong', tip: 'Học trò giỏi nhất dùng đường để thu bạc!' },
        { type: 'choice', t: 'Rửa bạc bột', q: 'Bạc bột xám đã lắng. Tiếp theo?', s: { lvl: .35, liq: C.clear, prec: P.ag, precN: .6 },
          opts: [
            { t: 'Rửa nước nóng đến khi giấy pH trung tính, hết nhờn đường', ok: true, fb: 'Bột sạch thì lúc nấu ít xỉ, ít khói, bạc sáng.' },
            { t: 'Nấu luôn cho nhanh', ok: 'meh', dp: 0.4, dy: 0.5, fb: 'Đường và kiềm còn sót sẽ cháy, sôi trào, tạo xỉ và làm hao bạc.' }
          ] },
        { type: 'choice', t: 'Nấu chảy', q: 'Phép cuối: biến bột thành thỏi.', s: { melt: 'ag' }, eq: 'Ag (bột) → Ag (lỏng, 962 °C) → thỏi',
          opts: [
            { t: '"Hầm" bột cho thật khô và kết khối, rồi khò với chút hàn the', ok: true, fb: 'Bí kíp bạc nhanh chảy, ít hao: bột hầm khô thì không bị ngọn lửa thổi bay, không bắn.' },
            { t: 'Khò thẳng bột còn ướt', ok: false, ds: 15, dy: 1, fb: 'Hơi nước bốc mạnh làm bột bắn tung ra. Vừa hao bạc vừa nguy hiểm.' },
            { t: 'Nấu trong nồi nhôm', ok: false, ds: 10, fb: 'Nhôm nóng chảy ở 660 °C, thấp hơn bạc (962 °C). Nồi sẽ thủng!' }
          ], th: 'nauchay', tip: 'Bạc bột hầm lên như này rồi nấu, thế là nấu nhanh và hao ít.' }
      ]
    },
    {
      id: 'q2', lv: 0, metal: 'ag', icon: '🔩', title: 'Đinh sắt thần kỳ',
      sub: 'AgCl → bạc bằng đinh sắt (hoặc kẽm lá)', input: '200 g AgCl ướt (≈ 150 g bạc)', goal: 'Bạc ≥ 99,5%',
      intro: 'Không có đường? Một nắm đinh sắt cũng biến được AgCl thành bạc. Bí mật nằm ở dãy điện hoá: sắt nhường electron dễ hơn bạc nhiều.',
      steps: [
        PPE,
        { type: 'choice', t: 'Chọn "đũa phép" kim loại', q: 'Chọn kim loại để khử AgCl:', s: { lvl: .55, liq: C.clear, prec: P.white, precN: .75 },
          opts: [
            { t: 'Đinh sắt đen, không mạ kẽm, đã tẩy gỉ và dầu', ok: true, fb: 'Chuẩn. Sắt sạch phản ứng đều, không đưa tạp chất lạ vào.' },
            { t: 'Kẽm lá sạch', ok: true, fb: 'Cũng rất tốt! Kẽm hoạt động mạnh hơn sắt, phản ứng nhanh hơn, dễ gắp ra nhờ dạng lá. Nhớ rửa HCl loãng để hoà kẽm dư.' },
            { t: 'Đinh mạ kẽm gỉ sét', ok: 'meh', dp: 0.8, fb: 'Gỉ sắt và lớp mạ sẽ đưa thêm oxit, kẽm và bẩn vào bạc.' },
            { t: 'Thanh đồng', ok: false, fb: 'Đồng khử được Ag⁺ trong dung dịch AgNO₃, nhưng với AgCl rắn thì rất chậm và kém hiệu quả.' }
          ], th: 'xmanghoa' },
        { type: 'choice', t: 'Môi trường phản ứng', q: 'Ngâm AgCl trong gì?', s: { lvl: .6, liq: C.fe2, prec: P.ag, precN: .7, nail: true, nailS: .75, coat: '#9aa0a6', bub: .35 }, eq: '2AgCl + Fe → 2Ag↓ + FeCl2',
          opts: [
            { t: 'Nước cất + chút H₂SO₄/HCl loãng (pH 1–2), khuấy thường xuyên', ok: true, fb: 'Axit loãng giữ bề mặt sắt luôn sạch. Phản ứng lan từ chỗ tiếp xúc ra cả khối, màu trắng chuyển xám.' },
            { t: 'Nước máy, không khuấy', ok: 'meh', dp: 0.3, fb: 'Rất chậm, sắt bị gỉ phủ, phản ứng không hết.' },
            { t: 'HNO₃', ok: false, ds: 10, fb: 'HNO₃ sẽ hoà tan cả sắt lẫn bạc vừa tạo ra. Phí công!' }
          ], th: 'xmanghoa' },
        { type: 'slider', t: 'Thời gian và khuấy', q: 'Ngâm và khuấy bao lâu?', min: 1, max: 24, def: 3, unit: 'giờ',
          eval: n => n >= 8 ? { ok: true, fb: 'Không còn hạt trắng. Lấy một ít cho vào amoniac loãng thấy không tan thêm, vậy là AgCl đã chuyển hết.' } : { ok: 'meh', dy: (8 - n) * 0.6, fb: `Sau ${n} giờ vẫn còn hạt AgCl trắng chưa phản ứng. Chúng sẽ thành xỉ khi nấu và làm hao bạc.` },
          s: { lvl: .6, liq: C.fe2, prec: P.ag, precN: .7, nail: true, nailS: .6, coat: '#9aa0a6', bub: .2 } },
        { type: 'choice', t: 'Làm sạch bạc', q: 'Gắp đinh ra. Bột bạc còn lẫn vụn sắt. Làm gì?', s: { lvl: .4, liq: C.clear, prec: P.ag, precN: .62 }, eq: 'Fe + 2HCl → FeCl2 + H2↑',
          opts: [
            { t: 'Rửa HCl loãng ấm, rồi nước cất nhiều lần', ok: true, fb: 'HCl loãng hoà sắt và kẽm vụn nhưng không đụng tới bạc.' },
            { t: 'Hút nam châm là đủ', ok: 'meh', dp: 0.6, fb: 'Nam châm chỉ hút được mảnh lớn. Bụi sắt mịn vẫn còn.' }
          ] },
        { type: 'choice', t: 'Nấu chảy', q: 'Nấu thành thỏi:', s: { melt: 'ag' },
          opts: [
            { t: 'Hầm khô bột, khò với hàn the', ok: true, fb: 'Thỏi bạc sáng! Bạc khử bằng sắt thường đạt 99–99,5%.' },
            { t: 'Khò bột ướt', ok: false, ds: 15, dy: 1, fb: 'Bắn tung bột nóng. Nguy hiểm và hao bạc.' }
          ], th: 'nauchay' }
      ]
    },
    {
      id: 'q3', lv: 1, metal: 'ag', icon: '🩻', title: 'Vét bạc từ nước hãm ảnh',
      sub: 'Dung dịch fixer / phim X-quang → bùi nhùi thép', input: '20 L dung dịch hãm ảnh (~4 g Ag/L)', goal: 'Bạc ≥ 99%',
      intro: 'Phòng X-quang thải ra dung dịch hãm ảnh chứa bạc ở dạng phức thiosunfat. Phù thủy thả một nắm bùi nhùi thép vào là bạc tự bám ra.',
      steps: [
        PPE,
        { type: 'choice', t: 'Thu bạc từ dung dịch', q: 'Cách nào kéo bạc ra khỏi 20 L dung dịch hãm ảnh?', s: { lvl: .75, liq: C.amber, wool: true, coat: P.black, prec: P.black, precN: .35 }, eq: '2[Ag(S2O3)2]^3- + Fe → 2Ag↓ + Fe^2+ + 4S2O3^2-',
          opts: [
            { t: 'Thả bùi nhùi thép (loại không xà phòng), để 1–3 ngày', ok: true, fb: 'Bạc bám thành bùn đen trên thép và lắng đáy. Mùi lưu huỳnh nhẹ là bình thường.' },
            { t: 'Thêm muối ăn để kết tủa AgCl', ok: false, fb: 'Bạc đang nằm trong phức thiosunfat rất bền nên muối ăn không kéo ra được.' },
            { t: 'Đun sôi cho bay hơi hết', ok: false, ds: 15, fb: 'Thiosunfat bị phân huỷ sinh SO₂ và H₂S rất độc. Không làm!' }
          ], th: 'xmanghoa' },
        { type: 'choice', t: 'Tinh chế bùn', q: 'Bùn đen gồm bạc, sắt và lưu huỳnh. Tinh chế thế nào?', s: { lvl: .5, liq: '#e9e2c9', bub: .9, fume: 'no2', heat: true, prec: P.black, precN: .08 },
          opts: [
            { t: 'Lọc, sấy, hoà bằng HNO₃ loãng, lọc bỏ cặn lưu huỳnh', ok: true, fb: 'Bạc và sắt tan vào dung dịch, lưu huỳnh ở lại trên giấy lọc.' },
            { t: 'Nấu thẳng bùn', ok: 'meh', dp: 4, fb: 'Bạc ra lẫn sắt và lưu huỳnh, giòn và xỉn màu.' }
          ], th: 'hoatanbac' },
        { type: 'choice', t: 'Kết tủa và khử', q: 'Dung dịch có AgNO₃ và Fe(NO₃)₃. Tiếp?', s: { lvl: .6, liq: C.sugar, prec: P.ag, precN: .4, heat: true, bub: .2 },
          opts: [
            { t: 'Nước muối → AgCl → rửa kỹ → NaOH + glucose', ok: true, fb: 'Quy trình chuẩn của phù thủy bạc!' },
            { t: 'Thả đinh sắt luôn vào dung dịch nitrat', ok: 'meh', dp: 1.5, fb: 'Được bạc, nhưng sắt nitrat và oxit dễ lẫn vào.' }
          ], th: 'agcl' },
        { type: 'choice', t: 'Nấu chảy', q: 'Nấu:', s: { melt: 'ag' }, opts: [{ t: 'Hầm khô, khò với hàn the', ok: true, fb: 'Thỏi bạc từ "nước thải"!' }] }
      ]
    },
    {
      id: 'q4', lv: 2, metal: 'au', icon: '💍', title: 'Vàng trắng 18K → 9999',
      sub: 'Nước cường toan → urê → lọc → FeSO₄ từ đinh sắt', input: '50 g vàng trắng 18K (75% Au, có Ni, Pd)', goal: 'Vàng ≥ 99,99%',
      intro: 'Nhiệm vụ của phù thủy vàng. Sẽ có những "sự kiện lạ": nước màu khác thường, cặn wonfram, vàng nổi. Hiểu bản chất thì không hoảng.',
      steps: [
        PPE,
        { type: 'choice', t: 'Chuẩn bị chất khử từ đinh sắt', q: 'Làm dung dịch FeSO₄ để lát nữa kết tủa vàng:', s: { lvl: .5, liq: C.fe2, nail: true, nailS: .45, bub: 1, heat: true }, eq: 'Fe + H2SO4 → FeSO4 + H2↑',
          opts: [
            { t: 'Rót H₂SO₄ vào nước thành dung dịch ~20%, ngâm đinh sắt, đun ấm, lọc lấy nước xanh lục', ok: true, fb: 'Đúng thứ tự: AXIT VÀO NƯỚC. Có sinh khí hydro dễ cháy nên để xa lửa.' },
            { t: 'Đổ nước vào axit sunfuric đặc', ok: false, ds: 25, fb: 'Nước sôi tức thì, bắn axit đặc ra ngoài. Luôn rót axit vào nước!' },
            { t: 'Làm sẵn từ tuần trước', ok: 'meh', dy: 0, dp: 0.3, fb: 'Fe²⁺ để lâu bị không khí oxy hoá thành Fe³⁺ (vàng nâu) và mất tính khử. Nên làm trong ngày.' }
          ], th: 'fe2' },
        { type: 'choice', t: 'Cán mỏng hay hạ tuổi?', q: 'Vàng 18K. Sơ chế thế nào?', s: { chunk: 'wau', chunkS: 1 },
          opts: [
            { t: 'Cán mỏng, cắt nhỏ', ok: true, fb: 'Với 18K, cán mỏng là đủ để cường toan hoà tan tốt. Đỡ tốn hoá chất.' },
            { t: 'Hạ tuổi: nấu thêm 3 lần bạc', ok: 'meh', ds: 5, fb: 'Không cần cho 18K. Sẽ tốn rất nhiều axit và sinh nhiều NO₂.' }
          ], th: 'canmong' },
        { type: 'choice', t: 'Hoà tan vàng', q: 'Pha nước cường toan thế nào?', s: { lvl: .4, liq: C.gold, chunk: 'wau', chunkS: .1, bub: 1, fume: 'no2', heat: true, prec: P.white, precN: .08 }, eq: 'Au + HNO3 + 4HCl → HAuCl4 + NO↑ + 2H2O',
          opts: [
            { t: 'HCl vào trước, đun ấm, thêm HNO₃ từng ít đến khi vừa tan hết', ok: true, fb: 'Thêm HNO₃ từng ít thì ít dư, bước sau đỡ vất vả.' },
            { t: 'Pha sẵn 1 lít cường toan, đậy kín để dành', ok: false, ds: 25, fb: 'Nước cường toan tự phân huỷ sinh Cl₂ và NOCl. Bình kín có thể nổ!' },
            { t: 'Chỉ dùng HNO₃ đặc', ok: false, fb: 'Vàng không tan trong HNO₃ đơn lẻ. Cần ion Cl⁻ để tạo phức [AuCl₄]⁻.' }
          ], th: 'cuongtoan' },
        { type: 'choice', t: '⚡ Sự kiện: nước màu lạ', q: 'Dung dịch ánh xanh lục chứ không vàng cam như mọi khi. Có phải mẻ này hao vàng?', s: { lvl: .42, liq: '#c9c25a', heat: true, prec: P.white, precN: .08 },
          opts: [
            { t: 'Không. Màu do kim loại "hội" (Ni, Cu, Pd) chứ không do vàng', ok: true, fb: 'Đúng! Vàng trắng, vàng hồng ra màu nước khác nhau nhưng không ảnh hưởng tỷ lệ thu hồi. Hàm lượng vàng đủ là ổn.' },
            { t: 'Hỏng rồi, đổ đi làm lại', ok: false, dy: 30, fb: 'Bạn vừa đổ đi 30% số vàng! Màu nước không quyết định lượng vàng.' }
          ], th: 'mau', tip: 'Làm vàng trắng hao lắm có đúng không? Không nhé!' },
        { type: 'choice', t: 'Đuổi HNO₃ dư', q: 'Trước khi kết tủa vàng cần làm gì?', s: { lvl: .42, liq: C.gold, bub: .8, heat: true, prec: P.white, precN: .08 }, eq: '6HNO3 + 5CO(NH2)2 → 8N2↑ + 5CO2↑ + 13H2O',
          opts: [
            { t: 'Rắc urê từng nhúm đến khi hết sủi', ok: true, fb: 'HNO₃ dư mà còn thì vàng vừa kết tủa sẽ bị hoà tan trở lại.' },
            { t: 'Kết tủa luôn cho nhanh', ok: 'meh', dy: 6, fb: 'Một phần vàng bị hoà tan trở lại và mất theo nước gạn.' }
          ], th: 'ure' },
        { type: 'slider', t: 'Pha loãng và để lắng', q: 'Pha loãng 3–4 lần rồi để lắng bao lâu trước khi lọc?', min: 0, max: 12, def: 1, unit: 'giờ',
          eval: n => n >= 6 ? { ok: true, fb: 'Để qua đêm thì AgCl và cặn mịn lắng hết, lọc được nước trong vắt.' } : { ok: 'meh', dp: (6 - n) * 0.002, fb: `Mới ${n} giờ. Cặn mịn chưa lắng hết, dễ lọt qua giấy lọc.` },
          s: { lvl: .75, liq: C.goldL, prec: P.white, precN: .08 } },
        { type: 'choice', t: '⚡ Sự kiện: cặn xám lạ trên giấy lọc', q: 'Trên giấy lọc có ít sợi cặn xám, trông ít nhưng khó chịu. Đây là gì, xử lý sao?', s: { lvl: .75, liq: C.goldL, funnel: true },
          opts: [
            { t: 'Có thể là wonfram (W) không tan. Lọc lại thật kỹ, tốt nhất bằng lọc hút chân không', ok: true, fb: 'Nhìn ít nhưng nếu lọt vào thì tạo "điểm cứng" trong vàng, ảnh hưởng nghiêm trọng tới trang sức cao cấp.' },
            { t: 'Kệ nó, có tí xíu', ok: 'meh', dp: 0.03, fb: 'Hạt wonfram lọt vào vàng gây điểm cứng, đánh bóng bị xước. Thợ kim hoàn sẽ trả hàng!' }
          ], th: 'wonfram', tip: 'Lọc là bước vô cùng quan trọng. Muốn nhanh thì dùng máy lọc hút chân không.' },
        { type: 'choice', t: 'Kết tủa vàng', q: 'Dung dịch vàng chanh trong vắt. Chọn chất khử:', s: { lvl: .85, liq: C.fe3, prec: P.au, precN: .5 }, eq: 'AuCl4^- + 3Fe^2+ → Au↓ + 3Fe^3+ + 4Cl^-',
          opts: [
            { t: 'Dung dịch FeSO₄ vừa làm từ đinh sắt', ok: true, fb: 'Fe²⁺ chỉ khử vàng, không khử Cu²⁺, Ni²⁺ hay Pd. Bột vàng màu "bã cà phê" lắng xuống.' },
            { t: 'SMB (natri metabisunfit)', ok: true, fb: 'Cũng chọn lọc như FeSO₄. SO₂ sinh ra khử vàng.' },
            { t: 'Thả thẳng đinh sắt vào', ok: 'meh', dp: 0.08, fb: 'Sắt kim loại khử cả Pd, Cu, Ni. Vàng ra kém sạch, phải tinh chế lại.' },
            { t: 'Đường', ok: false, dy: 4, fb: 'Tạo vàng keo đỏ tím, hạt nano lơ lửng không lọc được. Sai phép!' }
          ], th: 'ketuavang', tip: 'Màu bã cafe nhưng không phải bã cafe!' },
        { type: 'choice', t: '⚡ Sự kiện: vàng nổi', q: 'Một lớp bột vàng nổi lềnh bềnh trên mặt nước. Gạn đi được không?', s: { lvl: .85, liq: C.fe3, prec: P.au, precN: .5, floatGold: 1 },
          opts: [
            { t: 'Không gạn! Lọc cả nước qua giấy lọc, hoặc nhỏ chút chất làm ướt cho chìm', ok: true, fb: 'Bột vàng siêu mịn bị sức căng bề mặt và bọt khí giữ lại nên nổi. "Có vàng nổi thật nhé, trong nghề biết luôn!"' },
            { t: 'Gạn đổ phần nước phía trên', ok: false, dy: 3, fb: 'Bạn vừa đổ đi lớp vàng nổi.' }
          ], th: 'vangnoi' },
        { type: 'choice', t: 'Thử bằng SnCl₂', q: 'Chấm một giọt dung dịch lên giấy, nhỏ SnCl₂, thấy vết tím. Nghĩa là?', s: { lvl: .85, liq: C.fe3, prec: P.au, precN: .52 }, eq: '2AuCl4^- + 3Sn^2+ → 2Au (tím) + 3Sn^4+ + 8Cl^-',
          opts: [
            { t: 'Còn vàng. Thêm FeSO₄ và thử lại đến khi không tím', ok: true, fb: 'Thuốc thử thiếc là "con mắt phép thuật" của phù thủy vàng.' },
            { t: 'Hết vàng rồi, đổ bỏ dung dịch', ok: false, dy: 5, fb: 'Vết tím nghĩa là vẫn còn vàng tan trong dung dịch!' }
          ], th: 'sncl2' },
        { type: 'choice', t: 'Rửa bột vàng', q: 'Rửa bột vàng thế nào?', s: { lvl: .35, liq: C.clear, prec: P.au, precN: .48 },
          opts: [
            { t: 'HCl loãng nóng → nước cất nóng nhiều lần, sấy khô', ok: true, fb: 'Muối sắt bám trên bột được hoà sạch.' },
            { t: 'Tráng nước lạnh một lần', ok: 'meh', dp: 0.05, fb: 'Muối sắt còn bám, vàng nấu ra kém sáng.' }
          ] },
        { type: 'choice', t: 'Nấu chảy', q: 'Biến bột thành thỏi:', s: { melt: 'au' }, eq: 'Au (bột) → Au (lỏng, 1064 °C)',
          opts: [{ t: 'Chén nung khô, chút hàn the, khò đến khi giọt vàng xoay sáng', ok: true, fb: '"Lọc sạch, nấu lên là sáng choang!"' }], th: 'nauchay' }
      ]
    },
    {
      id: 'q5', lv: 2, metal: 'au', icon: '📿', title: 'Vàng tây thấp tuổi: 3 phần phép',
      sub: 'Phần 1: hoà kim loại khác → Phần 2: AgCl → Phần 3: hoà vàng, hoàn nguyên', input: '30 g vàng 10K (41,7% Au, nhiều Ag + Cu)', goal: 'Vàng ≥ 99,9% + thu bạc phụ',
      intro: 'Vàng thấp tuổi chứa nhiều bạc. Cho vào cường toan ngay sẽ bị AgCl bọc kín. Phải đi đúng ba phần phép.',
      steps: [
        PPE,
        { type: 'choice', t: 'Cán mỏng hay hạ tuổi?', q: 'Trong nghề có 2 lựa chọn. Bạn chọn:', s: { chunk: 'au', chunkS: 1 },
          opts: [
            { t: 'Cán mỏng: mất thời gian và cần máy cán, nhưng đỡ tốn hoá chất', ok: true, fb: 'Lựa chọn của người kiên nhẫn: ít NO₂, ít axit.' },
            { t: 'Hạ tuổi: nấu thêm bạc/đồng cho vàng ≤ 25%', ok: true, ds: 5, fb: 'Cảm giác tan mãnh liệt, nhưng tốn axit và NO₂ bay ra rất nhiều. Bảo hộ thật kỹ!' },
            { t: 'Cho thẳng vào nước cường toan', ok: 'meh', dy: 8, dp: 0.05, fb: 'AgCl bọc kín bề mặt, vàng tan dở dang. Phải làm lại nhiều lần.' }
          ], th: 'canmong' },
        { type: 'choice', t: 'Phần 1: hoà kim loại không phải vàng', q: 'Dùng gì để hoà bạc và đồng, giữ vàng lại?', s: { lvl: .5, liq: C.blueL, chunk: 'au', chunkS: .5, bub: 1, fume: 'no2', heat: true, prec: P.mud, precN: .25 },
          opts: [
            { t: 'HNO₃ pha loãng, đun nhẹ. Vàng còn lại thành bùn đen', ok: true, fb: '"Bùn đen" này chính là vàng! Đừng ai đổ đi nhé.' },
            { t: 'HCl', ok: false, fb: 'Bạc và vàng đều không tan trong HCl.' }
          ], th: 'hoatanbac' },
        { type: 'choice', t: 'Phần 2: lọc và kết tủa AgCl', q: 'Nước lọc màu xanh, có bạc. Làm sao?', s: { lvl: .7, liq: C.blueL, prec: P.white, precN: .6 }, eq: 'AgNO3 + NaCl → AgCl↓ + NaNO3',
          opts: [
            { t: 'Thêm nước muối → AgCl, cất riêng để thu bạc sau', ok: true, fb: 'Mẻ này được thêm cả bạc!' },
            { t: 'Đổ đi, chỉ cần vàng', ok: 'meh', fb: 'Vứt cả chục gam bạc. Tiếc lắm!' }
          ], th: 'agcl' },
        { type: 'choice', t: 'Phần 3: hoà vàng, lọc, hoàn nguyên', q: 'Bùn vàng đã rửa. Tiếp:', s: { lvl: .8, liq: C.fe3, prec: P.au, precN: .4 },
          opts: [
            { t: 'Cường toan → urê → lọc → FeSO₄/SMB → thử SnCl₂', ok: true, fb: '"Hoà tan vàng, lọc rồi hoàn nguyên thôi!"' },
            { t: 'Nấu luôn bùn đen', ok: 'meh', dp: 0.6, fb: 'Bùn còn lẫn bạc và đồng chưa tan hết. Vàng chỉ đạt khoảng 99%.' }
          ], th: 'ketuavang' },
        { type: 'choice', t: 'Nấu chảy', q: 'Nấu:', s: { melt: 'au' }, opts: [{ t: 'Hàn the, chén khô, khò', ok: true, fb: 'Chờ xem được bao nhiêu vàng nhá! Và kết quả: tuyệt vời!' }] }
      ]
    },
    {
      id: 'q6', lv: 3, metal: 'au', icon: '💾', title: 'Ve chai điện tử',
      sub: 'Chân mạ vàng, sim, cáp mềm → AP → lá vàng', input: '1 kg chân mạ vàng đã cắt (~0,6 g Au)', goal: 'Vàng ≥ 99,9%',
      intro: '"Khi bạn bè, người thân biết mình là phù thủy thì chuyển ve chai cho mình!" Lớp mạ vàng rất mỏng, nên phép ở đây là hoà phần đồng bên dưới.',
      steps: [
        PPE,
        { type: 'choice', t: 'Sơ chế ve chai', q: 'Một thùng bo mạch, sim, cáp. Sơ chế thế nào?', s: { chunk: 'pins', chunkS: 1 },
          opts: [
            { t: 'Cắt riêng phần mạ vàng, bỏ nhựa và linh kiện', ok: true, fb: 'Mẻ càng "giàu" phần mạ vàng thì càng đỡ tốn hoá chất.' },
            { t: 'Đốt cả bo mạch cho cháy hết nhựa', ok: false, ds: 30, fb: 'Đốt nhựa và bo mạch sinh dioxin, khói brom, kim loại nặng. Cực độc!' }
          ] },
        { type: 'choice', t: 'Bóc lớp vàng', q: 'Chọn phép hoà phần đồng/niken bên dưới:', s: { lvl: .6, liq: C.green, chunk: 'pins', chunkS: .35, bub: .6, flakes: 1 }, eq: 'Cu + 2HCl + H2O2 → CuCl2 + 2H2O',
          opts: [
            { t: 'Dung dịch AP (HCl 31% + H₂O₂ 3%, ~2:1) + sục khí bể cá, chờ vài ngày', ok: true, fb: 'Lá vàng mỏng bong ra lơ lửng. Dung dịch CuCl₂ còn tự tái sinh nhờ oxy không khí.' },
            { t: 'Nước cường toan cả kilo', ok: 'meh', ds: 10, dp: 0.1, fb: 'Tốn axit khủng khiếp, NO₂ mù mịt, vàng lẫn hết vào nước đồng.' }
          ], th: 'ap' },
        { type: 'choice', t: 'Hoà lá vàng', q: 'Lá vàng đã lọc rửa sạch. Hoà bằng?', s: { lvl: .3, liq: C.goldL, fume: 'cl2', bub: .4 }, eq: '2Au + 3Cl2 + 2HCl → 2HAuCl4',
          opts: [
            { t: 'HCl + javel thêm từng ít, ngoài trời, đứng đầu gió', ok: true, fb: 'Khí clo hoà tan vàng mà không cần HNO₃, nên không phải đuổi nitric.' },
            { t: 'Javel + HCl trong phòng kín', ok: false, ds: 25, fb: 'Khí clo tích tụ trong phòng kín. Ngộ độc ngay!' }
          ], th: 'ap' },
        { type: 'choice', t: 'Kết tủa vàng', q: 'Dung dịch vàng chanh. Dùng gì?', s: { lvl: .5, liq: C.fe3, prec: P.au, precN: .18 },
          opts: [
            { t: 'FeSO₄ từ đinh sắt hoặc SMB', ok: true, fb: 'Chọn lọc, sạch.' },
            { t: 'Kẽm lá', ok: 'meh', dp: 0.4, fb: 'Kẽm khử nhanh nhưng không chọn lọc: đồng còn sót cũng bám theo. Phải rửa HCl và tinh chế lại.' }
          ], th: 'kem' },
        { type: 'choice', t: 'Thu đồng', q: 'Còn mấy lít dung dịch AP xanh lục. Làm gì?', s: { lvl: .6, liq: C.greenL, nail: true, nailS: .8, coat: P.cu, prec: P.cu, precN: .35 }, eq: 'CuCl2 + Fe → Cu↓ + FeCl2',
          opts: [
            { t: 'Thả đinh sắt thu đồng, rồi trung hoà', ok: true, fb: 'Thu thêm đồng, dung dịch thải bớt độc.' },
            { t: 'Đổ xuống cống', ok: false, ds: 30, fb: 'Đồng và axit huỷ hoại môi trường và vi phạm quy định về chất thải nguy hại.' }
          ], th: 'thai' },
        { type: 'choice', t: 'Nấu chảy', q: 'Nấu:', s: { melt: 'au' }, opts: [{ t: 'Khò với hàn the', ok: true, fb: '"Mụ ve chai tích cóp mãi mới được 1 viên bé tí ti!" Nhưng là vàng thật!' }] }
      ]
    },
    {
      id: 'q7', lv: 3, metal: 'cu', icon: '♻️', title: 'Phù thủy có tâm: dọn thải',
      sub: 'Đinh sắt vét đồng → trung hoà → giao thu gom', input: '30 L nước thải xanh từ các nhiệm vụ', goal: 'Môi trường sạch',
      intro: 'Phù thủy giỏi là phù thủy có tâm. Nhiệm vụ cuối cùng là dọn dẹp.',
      steps: [
        PPE,
        { type: 'choice', t: 'Vét kim loại', q: 'Nước thải xanh chứa đồng và chút kim loại quý. Đầu tiên:', s: { lvl: .7, liq: C.greenL, nail: true, nailS: .7, coat: P.cu, prec: P.cu, precN: .4, bub: .2 }, eq: 'Cu^2+ + Fe → Cu↓ + Fe^2+',
          opts: [
            { t: 'Thả đinh sắt / sắt vụn 1–3 ngày, lọc lấy bùn đồng', ok: true, fb: 'Đồng và chút vàng, bạc sót đều bị kéo ra.' },
            { t: 'Pha thật loãng rồi đổ', ok: false, ds: 30, fb: 'Pha loãng không làm mất kim loại nặng.' }
          ], th: 'thai' },
        { type: 'choice', t: 'Trung hoà', q: 'Dung dịch còn axit và Fe²⁺. Tiếp?', s: { lvl: .65, liq: '#e8efe6', bub: .6, prec: '#6d6a4a', precN: .35 },
          opts: [
            { t: 'Rắc soda/vôi từ từ tới pH 7–8, lọc bỏ cặn hidroxit', ok: true, fb: 'Kim loại nặng kết tủa thành bùn.' },
            { t: 'Đổ xút đặc thật nhanh', ok: 'meh', ds: 10, fb: 'Toả nhiệt mạnh, sôi trào. Phải thêm từ từ.' }
          ] },
        { type: 'choice', t: 'Bùn thải', q: 'Phần bùn rắn cuối cùng:', s: { lvl: .2, liq: C.clear, prec: '#6d6a4a', precN: .3 },
          opts: [
            { t: 'Đóng bao, dán nhãn, giao đơn vị thu gom chất thải nguy hại có giấy phép', ok: true, fb: 'Đúng chuẩn phù thủy có tâm!' },
            { t: 'Đổ ra vườn làm phân', ok: false, ds: 30, fb: 'Kim loại nặng ngấm vào đất và nước ngầm.' }
          ] }
      ]
    }
  ];

  const RANKS = [
    { xp: 0, t: 'Phù thủy Level 0', s: 'Học việc', ic: '🧹' },
    { xp: 150, t: 'Phù thủy Level 1', s: 'Tập sự Ngân thuật', ic: '🥈' },
    { xp: 400, t: 'Phù thủy Level 2', s: 'Thợ Bạc', ic: '⚗️' },
    { xp: 750, t: 'Phù thủy Level 3', s: 'Phù thủy Kim', ic: '🥇' },
    { xp: 1150, t: 'Phù thủy Level 4', s: 'Đại pháp sư 9999', ic: '🧙' }
  ];
  const GRADES = {
    ag: [[99.9, 'Ngân Thuần 999', 'Sáng choang, đạt chuẩn bạc nguyên liệu', 'S'], [99.5, 'Bạc 995', 'Rất tốt, dùng cho chế tác', 'A'], [99, 'Bạc 99', 'Khá, nên tinh luyện lại', 'B'], [97, 'Bạc thô', 'Còn lẫn đồng/sắt', 'C'], [0, 'Bạc lẫn', 'Phải làm lại từ đầu', 'D']],
    au: [[99.99, 'Kim Thuần 9999', 'Vàng bốn số chín: đỉnh cao phù thủy', 'S'], [99.9, 'Vàng 999', 'Rất tốt', 'A'], [99.5, 'Vàng 995', 'Khá', 'B'], [98, 'Vàng 98', 'Còn tạp', 'C'], [0, 'Vàng lẫn', 'Phải tinh luyện lại', 'D']],
    cu: [[99, 'Huy hiệu Phù thủy Có Tâm', 'Môi trường cảm ơn bạn', 'S'], [0, 'Phù thủy vô tâm', 'Hãy làm lại', 'D']]
  };
  Object.assign(PACK, { quests: QUESTS, ranks: RANKS, grades: GRADES });
})();
