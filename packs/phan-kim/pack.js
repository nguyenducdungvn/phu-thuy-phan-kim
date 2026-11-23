/* Gói "Phân kim" — thông tin chung của gói. Các phần khác: quests.js, theory.js, calc.js */
Object.assign(PACK, {
  id: 'phan-kim',
  meta: {
    title: 'Phù thủy Phân kim',
    subtitle: 'Học viện Giả kim Vàng & Bạc',
    logo: 'assets/icons/logo.svg',
    imgBase: 'packs/phan-kim/img/',
    heroKicker: 'Phù thủy Level 0 → Đại pháp sư 9999',
    heroTitle: 'Biến <span class="ag">đồ phế liệu</span> thành <span class="au">vàng</span> và <span class="ag">bạc</span> — bằng hoá học thật',
    heroText: 'Mỗi nhiệm vụ là một mẻ phân kim. Chọn đúng phép (hoá chất, thao tác) thì mẻ ra kim loại càng tinh khiết, thu hồi càng cao. Chọn sai thì hao vàng, hoặc tệ hơn là mất an toàn. Mỗi bước có giải thích bằng phản ứng thật và mô phỏng 3D.',
    heroImgs: ['ket-qua-vang-1', 'ket-qua-bac'],
    features: [
      ['🧪 7 nhiệm vụ', 'Từ thỏi bạc đầu tiên bằng đường và muối biển, tới vàng trắng 18K lên 9999, ve chai điện tử và dọn thải có tâm.'],
      ['📖 20 chương Sách phép', 'Dãy điện hoá, AgCl, tráng gương, đinh sắt, kẽm lá, cường toan, urê, wonfram, vàng nổi, thuốc thử thiếc…'],
      ['🧊 Mô phỏng 3D', 'Xoay, zoom cốc thí nghiệm: màu dung dịch, khí NO₂, kết tủa rơi, đinh sắt mạ đồng, kẽm lá, nấu chảy.'],
      ['📜 Bí kíp cho Đại pháp sư', 'Hoàn thành mọi cấp độ để mở khoá tài liệu quy trình phân kim chi tiết (PDF).']
    ],
    quote: ['Trong phân kim thì luôn luôn bình tĩnh và cẩn trọng nhé các cậu! Cũng khá dễ dàng nếu hiểu được bản chất.', 'Lời dặn của Bà giáo phù thủy Hài Lê'],
    teaser: 'Bạn muốn trở thành <b>phù thủy phân kim</b> thật sự? Hãy hoàn thành tất cả cấp độ của game để nhận <b>📜 Bí kíp phân kim</b> — quy trình chi tiết dành riêng cho Đại pháp sư!',
    shareText: 'Mình đang chơi "Phù thủy Phân kim" — game vừa học hoá học phân kim vàng bạc vừa nhập vai phù thủy, có mô phỏng 3D. Thử xem nhé!'
  },
  /* Chỉ số chấm điểm theo loại kim loại của nhiệm vụ (q.metal) */
  metrics: {
    ag: { base: 99.95, label: 'Độ tinh khiết', unit: '%', dec: 2, span: 3, melt: 'ag' },
    au: { base: 99.995, label: 'Độ tinh khiết', unit: '%', dec: 3, span: 0.05, melt: 'au' },
    cu: { base: 100, label: 'Môi trường', unit: '', dec: 0, span: 100, melt: null, bySafety: true }
  },
  metalName: { au: 'Vàng', ag: 'Bạc', cu: 'Môi trường' },
  finale: {
    title: 'Đại pháp sư 9999',
    pdf: 'packs/phan-kim/bi-kip/Bi-kip-phan-kim.pdf',
    pdfLabel: '📜 Tải Bí kíp phân kim (PDF)',
    lockedText: 'Bí kíp chỉ trao cho <b>Đại pháp sư 9999</b>: hoàn thành cả 7 nhiệm vụ và đạt Level 4.',
    message: 'Chúc mừng bạn đã đạt cấp độ <b>Đại pháp sư 9999</b>! Nếu bạn <b>đủ 18 tuổi</b> trở lên và muốn áp dụng vào thực tế, hãy tải quy trình hướng dẫn chi tiết dưới đây. Làm thử rồi chia sẻ cho mình biết kết quả cũng như những khó khăn gặp phải trong thực tế nhé!'
  },
  credits: [
    { role: 'Hình ảnh, kiến thức thực tế & cảm hứng', name: 'Bà giáo phù thủy Hài Lê', note: 'Người truyền nghề phân kim hơn 20 năm. Toàn bộ ảnh thực tế, các mẹo nghề ("hầm bạc bột", "vàng nổi", "cán mỏng hay hạ tuổi"…) và lời dặn trong game được tham khảo từ chia sẻ của cô.', ic: '🧙‍♀️', url: 'https://www.facebook.com/haile1980' },
    { role: 'Phát triển ứng dụng', name: 'Nguyễn Đức Dũng', note: 'Ý tưởng, thiết kế trò chơi, biên soạn nội dung và phát triển ứng dụng.', ic: '👨‍💻' }
  ],
  pages: {
    safety: `<h2 class="sec">⚠️ An toàn: phép quan trọng nhất</h2>
  <div class="callout danger"><b>Phân kim thật dùng hoá chất có thể gây chết người.</b> Trò chơi giúp bạn hiểu bản chất hoá học. Nó không thay thế đào tạo thực hành có người hướng dẫn, trang thiết bị đạt chuẩn và giấy phép theo quy định.</div>
  <div class="grid2">
    <div class="card"><h3>☠️ Khí độc</h3><ul>
      <li><b>NO₂ (nâu đỏ)</b> sinh ra khi hoà kim loại bằng HNO₃ hoặc cường toan. Gây <b>phù phổi muộn</b>: vài giờ sau mới khó thở nặng. Hít phải mà thấy khó thở thì đi cấp cứu ngay (gọi <b>115</b>).</li>
      <li><b>Clo (vàng lục)</b> sinh ra khi javel gặp axit. Chỉ làm có chủ đích, ngoài trời, đứng đầu gió.</li>
      <li><b>SO₂</b> sinh ra từ SMB và khi đun dung dịch hãm ảnh. <b>Dioxin, khói brom</b> sinh ra khi đốt bo mạch: <b>không bao giờ đốt</b>.</li>
      <li><b>Khói cadmi</b> từ tiếp điểm Ag-CdO và que hàn bạc cũ: rất độc với phổi và thận.</li></ul></div>
    <div class="card"><h3>🧪 Hoá chất ăn mòn</h3><ul>
      <li>Luôn <b>rót axit vào nước</b>, không bao giờ làm ngược lại.</li>
      <li>Nước cường toan pha đến đâu dùng đến đó. <b>Không đậy kín, không cất trữ.</b></li>
      <li>Không trộn HNO₃ với cồn, axeton hay chất hữu cơ.</li>
      <li>NaOH ăn da, gây mù nếu bắn vào mắt.</li>
      <li>Kim loại + axit sinh <b>hydro dễ cháy nổ</b>: để xa lửa và tia lửa điện.</li></ul></div>
    <div class="card"><h3>🦺 Trang bị bắt buộc</h3><ul>
      <li>Mặt nạ phin lọc khí axit/NOx (ABEK hoặc tương đương)</li>
      <li>Kính bảo hộ kín, tấm che mặt khi nấu chảy</li>
      <li>Găng nitrile hoặc neoprene dày, tạp dề chống hoá chất, giày kín</li>
      <li>Làm ngoài trời thoáng gió hoặc trong tủ hút. Không làm trong bếp, nơi ở hay gần trẻ em</li>
      <li>Xô nước + baking soda, vòi nước rửa mắt</li></ul></div>
    <div class="card"><h3>🔥 Nấu chảy</h3><ul>
      <li>Chén nung, khuôn và bột phải <b>khô tuyệt đối</b>. Nước gặp kim loại lỏng gây nổ bắn.</li>
      <li>Đặt trên gạch chịu lửa, xa vật dễ cháy. Có bình chữa cháy.</li>
      <li>Không dùng nồi nhôm hay inox mỏng.</li></ul></div>
    <div class="card"><h3>♻️ Chất thải</h3><ul>
      <li>Vét kim loại bằng đinh sắt, trung hoà tới pH 7–8.</li>
      <li>Bùn thải là <b>chất thải nguy hại</b>: giao đơn vị thu gom có giấy phép. Không đổ ra cống, vườn hay ao hồ.</li></ul></div>
    <div class="card"><h3>🚑 Sơ cứu</h3><ul>
      <li>Axit hoặc kiềm dính da, mắt: xả nước sạch liên tục <b>ít nhất 15 phút</b>, cởi bỏ quần áo dính hoá chất, rồi đi khám.</li>
      <li>Hít phải khí độc: ra chỗ thoáng, nghỉ ngơi, đi khám ngay cả khi thấy ổn (vì phù phổi muộn).</li>
      <li>Cấp cứu: <b>115</b>. Cứu hoả: <b>114</b>.</li></ul></div>
  </div>
  <figure class="fig"><img src="packs/phan-kim/img/poster-an-toan.jpg" alt="Poster an toàn hoá chất"><figcaption>Poster an toàn khi làm việc với hoá chất</figcaption></figure>`,
    disclaimer: `<h2 class="sec">⚖️ Thông tin miễn trừ trách nhiệm</h2>
  <div class="card legal" id="legalText">
    <p><b>1. Mục đích giáo dục.</b> "Phù thủy Phân kim" là trò chơi mô phỏng để học hoá học. Nội dung, phương trình, số liệu và hình ảnh chỉ nhằm giúp người học hiểu bản chất. Đây <b>không</b> phải tài liệu kỹ thuật, quy trình sản xuất hay lời khuyên chuyên môn.</p>
    <p><b>2. Không khuyến khích tự thực hiện.</b> Các quy trình nhắc tới dùng hoá chất độc, ăn mòn, dễ cháy nổ (HNO₃, HCl, H₂SO₄, nước cường toan, NaOH, javel…) và sinh khí độc (NO₂, Cl₂, SO₂). Chỉ người đã qua đào tạo, có trang thiết bị bảo hộ, nơi làm việc đạt chuẩn và đủ điều kiện pháp lý mới nên thực hành. <b>Người dưới 18 tuổi không được tự thực hành</b>, chỉ học lý thuyết dưới sự giám sát của người lớn hoặc giáo viên.</p>
    <p><b>3. Số liệu mang tính ước lượng.</b> Lượng hoá chất, hàm lượng kim loại trong phế liệu, hiệu suất và độ tinh khiết trong trò chơi và Bàn tính là giá trị tham khảo hoặc mô phỏng. Kết quả thực tế phụ thuộc nồng độ hoá chất, nguyên liệu, thiết bị và tay nghề.</p>
    <p><b>4. Tuân thủ pháp luật.</b> Người dùng tự chịu trách nhiệm tuân thủ các quy định hiện hành về: mua bán, lưu trữ, sử dụng hoá chất; kinh doanh vàng, bạc và kim loại quý; an toàn lao động; phòng cháy chữa cháy; bảo vệ môi trường và quản lý chất thải nguy hại.</p>
    <p><b>5. Không chịu trách nhiệm.</b> Tác giả và người đóng góp <b>không chịu trách nhiệm</b> về bất kỳ thương tích, thiệt hại tài sản, ô nhiễm, tổn thất tài chính hay hậu quả pháp lý nào phát sinh từ việc sử dụng, áp dụng hoặc làm theo nội dung trong ứng dụng.</p>
    <p><b>6. Hình ảnh.</b> Ảnh thực tế trong ứng dụng thuộc quyền của chủ sở hữu, chỉ dùng để minh hoạ, không được sao chép cho mục đích thương mại khi chưa được phép. Tên thương hiệu xuất hiện trong ảnh (nếu có) thuộc về chủ sở hữu tương ứng.</p>
    <p><b>7. Bí kíp PDF.</b> Tài liệu "Bí kíp phân kim" mở khoá sau khi hoàn thành game là tài liệu tham khảo cho người <b>đủ 18 tuổi</b>, có kiến thức hoá học và điều kiện an toàn phù hợp. Chi phí, giá cả và hàm lượng trong tài liệu là <b>giả định</b> tại thời điểm biên soạn. Người đọc tự chịu trách nhiệm khi áp dụng.</p>
    <p><b>8. Không thay thế chuyên gia.</b> Khi cần tinh luyện kim loại quý, hãy liên hệ cơ sở tinh luyện, kiểm định có giấy phép.</p>
  </div>`
  }
});
