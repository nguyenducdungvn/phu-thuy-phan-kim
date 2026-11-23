/* Gói Phân kim — Sách phép, câu đố, ảnh thực tế, quy trình 3D */
(function () {
  const C = Lab3D.COL, P = Lab3D.PREC;
  const THEORY = [
    { id: 'tongquan', ic: '🗺️', t: 'Bản đồ phép phân kim', img: ['banner-quy-trinh', 'so-do-thu-hoi-bac'], html: `
<p><b>Phân kim</b> là tách kim loại quý (vàng, bạc, đôi khi platin và paladi) ra khỏi hợp kim hoặc phế liệu để thu được kim loại sạch. Mọi quy trình đều đi theo 4 giai đoạn:</p>
<ol><li><b>Sơ chế</b>: phân loại, cán mỏng hoặc hạ tuổi, cắt nhỏ, bỏ nhựa và linh kiện.</li>
<li><b>Hoà tan</b> (oxy hoá): đưa kim loại vào dung dịch dưới dạng ion, bằng HNO₃, nước cường toan, AP hoặc HCl + javel.</li>
<li><b>Tách chọn lọc</b>: giữ kim loại cần lấy, bỏ phần còn lại. Ví dụ: kết tủa AgCl bằng muối ăn, đuổi HNO₃ bằng urê, lọc cặn.</li>
<li><b>Hoàn nguyên</b> (khử) và nấu chảy: dùng đường, đinh sắt, kẽm, FeSO₄ hoặc SMB để đưa ion về kim loại, rồi rửa, sấy và nấu.</li></ol>
<div class="note">💡 <b>Đường, đinh sắt và kẽm không hoà tan được vàng hay bạc.</b> Chúng là <i>chất khử</i>, chỉ dùng ở giai đoạn 4.</div>
<table><tr><th>Chất khử</th><th>Thu được</th><th>Ghi chú</th></tr>
<tr><td>Đường + xút</td><td>Bạc (từ AgCl / Ag₂O)</td><td>Sạch nhất cho bạc. Không dùng cho vàng vì tạo vàng keo.</td></tr>
<tr><td>Đinh sắt</td><td>Bạc, đồng; vàng (gián tiếp qua FeSO₄)</td><td>Rẻ. Thả trực tiếp vào dung dịch vàng thì không chọn lọc.</td></tr>
<tr><td>Kẽm lá</td><td>Bạc, vàng, đồng</td><td>Nhanh, mạnh, nhưng không chọn lọc. Hợp để vét dung dịch loãng.</td></tr>
<tr><td>FeSO₄ / SMB</td><td>Vàng</td><td>Chọn lọc: không khử Cu, Ni, Pd.</td></tr></table>` },
    { id: 'dayth', ic: '⚡', t: 'Dãy điện hoá: luật của mọi phép khử', img: [], html: `
<p>Mỗi kim loại có một <b>thế điện cực chuẩn E°</b>. Kim loại có E° thấp hơn dễ nhường electron, nên nó tan ra và đẩy ion của kim loại có E° cao hơn về dạng kim loại. Phản ứng này gọi là <b>xi măng hoá</b> (cementation).</p>
<div class="eseries" data-eseries></div>
<p>Kẽm (−0,76 V) và sắt (−0,44 V) nằm xa về bên trái so với đồng (+0,34), bạc (+0,80) và vàng (+1,00, cặp AuCl₄⁻/Au). Vì vậy:</p>
<div class="eq">Fe + Cu²⁺ → Fe²⁺ + Cu↓  ;  Zn + 2Ag⁺ → Zn²⁺ + 2Ag↓  ;  3Zn + 2Au³⁺ → 3Zn²⁺ + 2Au↓</div>
<p>Ngược lại, sắt <b>không</b> đẩy được Zn, Al, Mg ra khỏi dung dịch vì chúng mạnh hơn sắt.</p>
<p><b>Chọn lọc</b>: kim loại hoạt động rất mạnh (Zn, Fe) đẩy ra <i>tất cả</i> kim loại đứng sau nó, nên bột thu được lẫn nhiều thứ. Chất khử yếu hơn như Fe²⁺ (cặp Fe³⁺/Fe²⁺: +0,77 V) chỉ đủ sức khử vàng (+1,00 V), không khử được Cu²⁺. Nhờ vậy vàng tách ra sạch.</p>` },
    { id: 'canmong', ic: '🔨', t: 'Cán mỏng hay hạ tuổi?', img: ['can-mong-nguyen-lieu', 'can-mong', 'ha-tuoi'], html: `
<p>Axit chỉ "ăn" được bề mặt kim loại. Muốn tan nhanh thì phải tăng diện tích tiếp xúc. Trong nghề có hai lựa chọn:</p>
<table><tr><th></th><th>Cán mỏng</th><th>Hạ tuổi (pha loãng, inquartation)</th></tr>
<tr><td>Cách làm</td><td>Dùng máy cán thành lá mỏng, cắt sợi</td><td>Nấu thêm bạc hoặc đồng để vàng chỉ còn ≤ 25%, đổ thành hạt hoặc lá</td></tr>
<tr><td>Ưu</td><td>Đỡ tốn hoá chất, ít NO₂</td><td>"Cảm giác tan mãnh liệt", rất triệt để với vàng thấp tuổi</td></tr>
<tr><td>Nhược</td><td>Mất thời gian, phải có máy cán</td><td>Tốn axit, NO₂ bay ra rất nhiều</td></tr></table>
<p><b>Vì sao vàng thấp tuổi cần hạ tuổi?</b> Khi vàng chiếm nhiều, bạc và đồng bị "nhốt" trong mạng tinh thể vàng nên HNO₃ không với tới. Khi bỏ vào cường toan, bạc lại tạo lớp AgCl bọc kín bề mặt và phản ứng dừng. Hạ tuổi xuống ≤ 25% vàng giúp HNO₃ hoà hết bạc và đồng, để lại vàng dạng xốp sạch.</p>` },
    { id: 'hoatanbac', ic: '🧪', t: 'Hoà tan bạc và kim loại thường bằng HNO₃', img: ['nguyen-lieu-tho', 'bun-den-chua-vang'], html: `
<div class="eq">3Ag + 4HNO₃ (loãng) → 3AgNO₃ + NO↑ + 2H₂O</div>
<div class="eq">Ag + 2HNO₃ (đặc) → AgNO₃ + NO₂↑ + H₂O</div>
<div class="eq">3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O  ;  2NO + O₂ → 2NO₂ (nâu đỏ)</div>
<p>HNO₃ <b>pha loãng 1:1</b> tốn ít axit hơn cho cùng một lượng bạc (4 mol HNO₃ cho 3 mol Ag, so với 2 mol HNO₃ cho mỗi mol Ag khi dùng axit đặc), lại phản ứng êm hơn. Đun nhẹ 50–70 °C. Đồng tan làm dung dịch có màu xanh lam.</p>
<p><b>Vàng không tan trong HNO₃.</b> Vàng còn lại dưới dạng bùn đen ở đáy cốc. Với vàng tây, đây là "Phần 1" của phép: hoà tan các kim loại không phải vàng.</p>
<div class="warn">⚠️ Khí NO₂ màu nâu đỏ có thể gây phù phổi muộn, vài giờ sau mới khó thở. Bắt buộc làm ngoài trời hoặc trong tủ hút, đeo mặt nạ phin lọc khí axit.</div>` },
    { id: 'loc', ic: '🧻', t: 'Lọc: bước vô cùng quan trọng', img: ['loc-hut-chan-khong', 'dung-dich-vang'], html: `
<p>Mọi tạp chất không tan mà lọt qua bước lọc đều sẽ nằm trong sản phẩm cuối. Lọc kỹ quyết định vàng đạt 999 hay 9999.</p>
<ul><li><b>Giấy lọc thường hoặc phễu</b>: rẻ nhưng chậm, dung dịch đặc thì lọc rất lâu.</li>
<li><b>Lọc hút chân không</b> (phễu Buchner + bình tam giác có vòi + bơm chân không): nhanh gấp nhiều lần và lọc được cặn mịn. Bộ lọc dùng được rất lâu ("Bộ này mình đã dùng 20 năm có lẻ!").</li>
<li>Để lắng qua đêm trước khi lọc thì cặn mịn (AgCl, wonfram) chìm xuống đáy, lọc nhanh hơn và trong hơn.</li></ul>
<p>Muốn biết dung dịch đã đủ trong chưa: soi đèn pin qua cốc. Không thấy vệt sáng (hiệu ứng Tyndall) là được.</p>` },
    { id: 'agcl', ic: '🧂', t: 'AgCl: muối biển tách bạc khỏi đồng', img: ['agcl-trang', 'agcl-duoi-dung-dich-dong', 'agcl-khuay', 'muoi-bien'], html: `
<div class="eq">AgNO₃ + NaCl → AgCl↓ (trắng) + NaNO₃</div>
<p>Trong các ion thường gặp, <b>chỉ Ag⁺</b> (cùng Pb²⁺ và Hg₂²⁺ hiếm gặp) tạo kết tủa clorua khó tan. AgCl có độ tan rất nhỏ (Ksp ≈ 1,8·10⁻¹⁰), còn CuCl₂ và Cu(NO₃)₂ tan rất tốt. Vì vậy:</p>
<div class="note">"Không khử đồng thì có thu đủ bạc không? <b>Đủ nhá!</b> Vì chỉ có bạc mới tạo kết tủa AgCl thôi, lọc kết tủa là bỏ được muối đồng mà!"</div>
<p>AgCl mới tạo trông như sữa đông, vón cục khi khuấy. Để ra ánh sáng, nó ngả tím xám vì bị quang phân thành bạc nano, điều này bình thường. Muối biển dùng tốt. Thêm đến khi nhỏ một giọt nước muối vào phần nước trong mà không còn vẩn trắng.</p>
<p><b>Rửa AgCl</b> bằng nước nóng 5–6 lần đến khi nước rửa hết xanh. Đây là bước quyết định bạc đạt 999 hay chỉ 99.</p>` },
    { id: 'duong', ic: '🍬', t: 'Đường: giải mã phản ứng "tráng gương"', img: ['duong', 'duong-tinh-luyen', 'bac-bot-1', 'bac-bot-2'], html: `
<div class="eq">2AgCl + 2NaOH → Ag₂O↓ (nâu đen) + 2NaCl + H₂O</div>
<div class="eq">Ag₂O + C₆H₁₂O₆ (glucose) → 2Ag↓ + C₆H₁₂O₇ (axit gluconic)</div>
<p>Đây là phản ứng <b>tráng gương nhưng không phải tráng gương</b>. Trong tráng gương Tollens, Ag⁺ nằm trong phức amoniac và bám thành lớp gương. Ở đây, Ag⁺ nằm trong Ag₂O rắn, nên bạc tạo thành ở dạng <b>bột xám</b>.</p>
<ul><li><b>Glucose và fructose</b> là đường khử. Nhóm anđehit (–CHO) của glucose bị oxy hoá thành nhóm axit, nhường 2 electron cho 2 Ag⁺.</li>
<li><b>Đường kính (saccarozơ)</b> không có nhóm khử tự do. Phải <i>thuỷ phân</i> trước: đun với nước và chút chanh hoặc axit citric 15–20 phút.</li></ul>
<div class="eq">C₁₂H₂₂O₁₁ + H₂O —(H⁺, t°)→ C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (fructose)</div>
<p><b>Hoàn nguyên chuẩn</b>: NaOH dư nhẹ, đun 60–80 °C, cho đường từ từ, khuấy đều. Kết tủa đổi màu <b>trắng → nâu đen → xám</b>. Khi không còn hạt trắng hay nâu là xong. Rửa nước nóng đến hết kiềm.</p>
<p class="muted">"Khi nhà em có thợ xây thì cái bay cũng dùng để khuấy!" Dụng cụ khuấy chỉ cần không phản ứng với kiềm nóng: thuỷ tinh, inox hoặc nhựa chịu nhiệt.</p>` },
    { id: 'xmanghoa', ic: '🔩', t: 'Đinh sắt và bùi nhùi thép', img: ['dinh-sat'], html: `
<div class="eq">2AgCl + Fe → 2Ag↓ + FeCl₂</div>
<div class="eq">2[Ag(S₂O₃)₂]³⁻ + Fe → 2Ag↓ + Fe²⁺ + 4S₂O₃²⁻ (dung dịch hãm ảnh)</div>
<div class="eq">Cu²⁺ + Fe → Cu↓ + Fe²⁺ (thu đồng, xử lý thải)</div>
<p>Ngâm AgCl trong nước có chút axit loãng (pH 1–2) để bề mặt sắt luôn sạch, khuấy thường xuyên. Màu trắng lan dần sang xám bắt đầu từ chỗ tiếp xúc với sắt. Dung dịch ngả xanh lục nhạt do Fe²⁺.</p>
<ul><li>Dùng đinh <b>đen, không mạ kẽm</b>, đã tẩy gỉ và dầu.</li>
<li>Xong thì gắp sắt ra, rửa bạc bằng HCl loãng để hoà vụn sắt.</li>
<li>Phản ứng phụ <code>Fe + 2H⁺ → Fe²⁺ + H₂↑</code> sinh khí hydro dễ cháy.</li></ul>` },
    { id: 'kem', ic: '🪙', t: 'Vì sao dùng kẽm lá trong phân kim?', img: ['la-kem'], html: `
<div class="eq">3Zn + 2HAuCl₄ → 2Au↓ + 3ZnCl₂ + 2HCl</div>
<div class="eq">Zn + 2AgCl → 2Ag↓ + ZnCl₂  ;  Zn + 2Ag⁺ → Zn²⁺ + 2Ag↓</div>
<p>Kẽm (E° = −0,76 V) là chất khử <b>mạnh hơn sắt</b>, nên phản ứng nhanh và triệt để. Dạng <b>lá</b> được ưa chuộng vì:</p>
<ul><li><b>Dễ thao tác</b>: cắt được thành miếng vừa ý, nhúng vào và gắp ra dễ.</li>
<li><b>Bề mặt tiếp xúc lớn</b>: ion kim loại quý nhận electron ngay trên bề mặt kẽm.</li>
<li><b>Dễ quan sát</b>: thấy rõ lớp kim loại bám lên lá.</li></ul>
<p><b>Lưu ý</b>: kẽm <i>không chọn lọc</i>. Nó khử cả Cu²⁺, Pd, Pt, và trong axit còn sinh khí hydro. Kim loại thu được cần rửa HCl để hoà kẽm dư rồi tinh chế lại. Phù hợp nhất để vét kim loại quý còn sót trong dung dịch loãng.</p>` },
    { id: 'fe2', ic: '🟢', t: 'FeSO₄ làm từ đinh sắt', img: ['dinh-sat'], html: `
<div class="eq">Fe + H₂SO₄ (loãng) → FeSO₄ + H₂↑</div>
<p>Rót <b>axit vào nước</b> thành dung dịch khoảng 20%, ngâm đinh sắt, đun ấm đến khi hết sủi. Lọc lấy dung dịch xanh lục nhạt và <b>dùng trong ngày</b>, vì để lâu Fe²⁺ bị không khí oxy hoá thành Fe³⁺ màu vàng nâu và mất tính khử. Dùng HCl thay H₂SO₄ thì được FeCl₂, cũng dùng được.</p>` },
    { id: 'cuongtoan', ic: '👑', t: 'Nước cường toan: "vua của các axit"', img: ['dung-dich-vang', 'loc-hut-chan-khong'], html: `
<div class="eq">Au + HNO₃ + 4HCl → HAuCl₄ + NO↑ + 2H₂O</div>
<p>Riêng HNO₃ chỉ oxy hoá được một lượng cực nhỏ vàng thành Au³⁺, rồi cân bằng dừng lại. <b>Ion Cl⁻</b> từ HCl lập tức "bắt" Au³⁺ vào phức bền [AuCl₄]⁻, kéo cân bằng về phía vàng tan. Hai axit phối hợp: HNO₃ oxy hoá, HCl tạo phức.</p>
<ul><li>Tỉ lệ khoảng 3–4 HCl : 1 HNO₃ theo thể tích. Cho HCl trước, rồi thêm HNO₃ <b>từng ít</b>.</li>
<li>Pha đến đâu dùng đến đó. <b>Không bao giờ</b> đậy kín hay cất trữ.</li>
<li>Bạc trong hợp kim tạo AgCl trắng lắng ở đáy. Vàng dưới 14K cần hạ tuổi trước.</li></ul>` },
    { id: 'mau', ic: '🎨', t: 'Vàng trắng, vàng hồng: vì sao nước khác màu?', img: ['phe-lieu-trang-suc'], html: `
<p>"Làm vàng trắng hao lắm có đúng không? <b>Không nhé!</b>" Màu dung dịch là tổng màu của mọi ion có trong đó:</p>
<ul><li>[AuCl₄]⁻: vàng cam. Cu²⁺ (trong vàng hồng): xanh lục khi đi cùng clorua. Ni²⁺ (trong vàng trắng): xanh lục. Pd²⁺: nâu đỏ.</li></ul>
<p>Màu khác nhau chỉ do thành phần "hội" (kim loại pha vào). <b>Tỷ lệ thu hồi vàng phụ thuộc hàm lượng vàng</b>, không phụ thuộc màu. Vàng trắng có paladi thì sau khi kết tủa vàng nên giữ lại dung dịch, vì Pd vẫn còn trong đó.</p>` },
    { id: 'ure', ic: '🌾', t: 'Urê: đuổi HNO₃ dư', img: [], html: `
<div class="eq">6HNO₃ + 5CO(NH₂)₂ → 8N₂↑ + 5CO₂↑ + 13H₂O</div>
<div class="eq">2HNO₂ + CO(NH₂)₂ → 2N₂↑ + CO₂↑ + 3H₂O</div>
<p>Nếu còn HNO₃, dung dịch vẫn là nước cường toan. Vàng vừa kết tủa sẽ bị <b>hoà tan trở lại</b>. Rắc urê (phân đạm) từng nhúm vào dung dịch ấm đến khi hết sủi bọt. Cách khác là cô cạn gần khô, thêm HCl rồi cô lại 2–3 lần.</p>` },
    { id: 'wonfram', ic: '🪨', t: 'Wonfram: kẻ phá hoại thầm lặng', img: ['wonfram-1', 'wonfram-2'], html: `
<p>Wonfram (W) có trong mảnh nhẫn tungsten carbide, mảnh hàn hoặc dụng cụ lẫn vào phế liệu. Nó <b>gần như không tan</b> trong nước cường toan, chỉ để lại cặn sợi xám hoặc oxit vàng nhạt rất mịn.</p>
<p>"Nhìn ít thế này nhưng <b>ảnh hưởng nghiêm trọng</b> lắm đến sản xuất hàng trang sức cao cấp!" Hạt W lọt vào vàng tạo <b>điểm cứng</b>, đánh bóng bị kéo xước, thợ kim hoàn không dùng được.</p>
<p><b>Cách trị</b>: để lắng qua đêm, lọc thật kỹ (lọc hút chân không, giấy lọc mịn hai lớp). Kiểm tra sản phẩm bằng máy phân tích phổ nếu làm hàng cao cấp.</p>` },
    { id: 'ketuavang', ic: '☕', t: 'Vàng kết tủa: "màu bã cà phê"', img: ['vang-bot-nau-1', 'vang-bot-nau-2', 'vang-bot', 'vang-bot-say-1'], html: `
<div class="eq">AuCl₄⁻ + 3Fe²⁺ → Au↓ + 3Fe³⁺ + 4Cl⁻</div>
<div class="eq">2HAuCl₄ + 3SO₂ + 6H₂O → 2Au↓ + 3H₂SO₄ + 8HCl  (SO₂ từ SMB Na₂S₂O₅)</div>
<p>Khi thêm FeSO₄ hoặc SMB, dung dịch đục dần rồi bột vàng nâu sẫm lắng xuống. Bột vàng siêu mịn hấp thụ ánh sáng nên có màu nâu, <b>"màu bã cafe nhưng không phải bã cafe"</b>. Nấu chảy lên mới ra màu vàng ánh kim.</p>
<p><b>Vàng bột như thế nào là đẹp?</b> Màu nâu vàng đồng đều, tơi, không lẫn hạt đen hay trắng, rửa hết muối sắt (nước rửa không còn ánh vàng).</p>
<p>Không dùng <b>đường</b> cho vàng: đường tạo vàng keo đỏ tím, hạt nano không lắng và không lọc được.</p>` },
    { id: 'vangnoi', ic: '🫧', t: 'Vàng nổi: có thật không?', img: [], html: `
<p>"Có cái vàng nổi í = không có gì. <b>Nhưng có vàng nổi thật nhé.</b> Trong nghề biết luôn!"</p>
<p>Vàng nặng gấp 19 lần nước, nhưng bột vàng kết tủa <b>siêu mịn</b> (cỡ micromet) lại nổi được vì:</p>
<ul><li><b>Sức căng bề mặt</b>: hạt rất nhỏ và nhẹ nằm trên "màng" mặt nước, giống con nhện nước.</li>
<li><b>Bọt khí bám</b> (SO₂, CO₂ từ các phản ứng) nâng hạt lên.</li>
<li>Bề mặt hạt kỵ nước do dầu mỡ bám vào.</li></ul>
<p><b>Đừng gạn đổ phần nước trên!</b> Hãy lọc cả nước qua giấy, khuấy nhẹ, chờ lắng lâu hơn, hoặc nhỏ một giọt chất làm ướt (nước rửa chén pha loãng, chỉ khi dung dịch không còn HNO₃) để phá sức căng bề mặt.</p>` },
    { id: 'sncl2', ic: '🟣', t: 'Thuốc thử thiếc: con mắt phù thủy', img: [], html: `
<div class="eq">Sn + 2HCl → SnCl₂ + H₂↑</div>
<div class="eq">2AuCl₄⁻ + 3Sn²⁺ → 2Au (keo tím "Purple of Cassius") + 3Sn⁴⁺ + 8Cl⁻</div>
<p>Hoà một mẩu thiếc hàn <b>không chì</b> vào HCl, được dung dịch SnCl₂. Chấm một giọt dung dịch cần thử lên giấy lọc, nhỏ SnCl₂ lên: <b>vết tím hoặc nâu tím</b> là còn vàng. Cách này phát hiện được vàng ở nồng độ vài ppm.</p>` },
    { id: 'ap', ic: '💾', t: 'Ve chai điện tử: AP và HCl + javel', img: ['phe-lieu-bo-mach', 'phe-lieu-sim', 'phe-lieu-dien-thoai', 'phe-lieu-cap-mem'], html: `
<div class="eq">Cu + 2HCl + H₂O₂ → CuCl₂ + 2H₂O</div>
<div class="eq">CuCl₂ + Cu → 2CuCl  ;  4CuCl + 4HCl + O₂ → 4CuCl₂ + 2H₂O</div>
<div class="eq">2Au + 3Cl₂ + 2HCl → 2HAuCl₄  (Cl₂ từ NaOCl + 2HCl → NaCl + Cl₂ + H₂O)</div>
<p>Lớp mạ vàng trên chân cắm chỉ dày 0,1–2 µm. Hoà vàng trực tiếp thì tốn axit vào phần đồng. Dung dịch <b>AP</b> (HCl + H₂O₂, sục khí) hoà <i>phần đồng bên dưới</i>, lớp vàng bong ra thành lá mỏng. Lọc lá vàng, rửa sạch, rồi hoà bằng HCl + javel.</p>
<p><b>Hàm lượng</b> rất khác nhau tuỳ loại: chân RAM, card, CPU cũ thì giàu; sim, cáp mềm, bo điện thoại thì ít. Điện thoại đời cũ đôi khi có tiếp điểm mạ dày. Đừng đốt bo mạch: sinh dioxin và khói brom.</p>` },
    { id: 'nauchay', ic: '🔥', t: 'Nấu chảy: "lửa thử vàng"', img: ['ket-qua-vang-1', 'giot-vang', 'thoi-bac', 'thoi-vang', 'thoi-bac-tren-can'], html: `
<p>Bạc nóng chảy ở <b>962 °C</b>, vàng ở <b>1064 °C</b>. Dùng chén graphit hoặc gốm, đèn khò gas–oxy hoặc lò nung nhỏ, thêm một nhúm <b>hàn the</b> (borax) để hoà oxit và tạp chất thành xỉ.</p>
<ul><li><b>"Hầm" bột</b>: sấy rồi nung từ từ bột bạc/vàng cho thật khô và kết khối trước khi khò mạnh. Bột khô kết khối không bị ngọn lửa thổi bay, không bắn, nên <b>nấu nhanh và hao ít</b>.</li>
<li>Chén nung và khuôn phải khô tuyệt đối. Nước gặp kim loại nóng chảy gây nổ bắn.</li>
<li>Kim loại sạch khi chảy sẽ có giọt tròn, xoay, sáng như gương. Có màng xỉn là còn tạp.</li></ul>
<p>Kiểm tra tuổi bằng máy phân tích phổ (XRF) hoặc gửi phòng kiểm định.</p>` },
    { id: 'thai', ic: '♻️', t: 'Xử lý chất thải', img: ['bun-thai-chua-vang'], html: `
<ol><li>Gom mọi dung dịch thải vào thùng nhựa. Thả đinh sắt hoặc sắt vụn 1–3 ngày để kéo đồng và kim loại quý còn sót ra (<code>Cu²⁺ + Fe → Cu + Fe²⁺</code>). Lọc lấy bùn.</li>
<li>Trung hoà <b>từ từ</b> bằng soda hoặc vôi đến pH 7–8. Kim loại nặng kết tủa thành hidroxit.</li>
<li>Bùn rắn là <b>chất thải nguy hại</b>: đóng bao, dán nhãn, giao đơn vị thu gom có giấy phép. Không đổ ra cống, vườn hay ao.</li></ol>` }
  ];

  const QUIZ = [
    { q: 'Đường và đinh sắt đóng vai trò gì trong phân kim?', a: ['Hoà tan vàng', 'Chất khử để thu kim loại từ muối/dung dịch', 'Chất trợ dung khi nấu', 'Chất tạo màu'], c: 1, e: 'Chúng nhường electron để đưa ion kim loại quý về dạng kim loại.' },
    { q: 'Vì sao thêm muối ăn tách được bạc khỏi đồng?', a: ['Muối khử đồng', 'Chỉ Ag⁺ tạo kết tủa AgCl, đồng vẫn tan', 'Muối hoà tan bạc', 'Muối làm đồng bay hơi'], c: 1, e: 'AgCl gần như không tan (Ksp ≈ 1,8·10⁻¹⁰), còn muối đồng tan tốt.' },
    { q: 'Đường kính muốn khử được Ag₂O thì phải làm gì?', a: ['Rang cháy', 'Thuỷ phân bằng cách đun với chút axit (chanh)', 'Hoà với HNO₃', 'Không cần gì'], c: 1, e: 'Saccarozơ thuỷ phân thành glucose + fructose, đều là đường khử.' },
    { q: 'Chất khử nào kết tủa vàng CHỌN LỌC (không kéo theo đồng)?', a: ['Kẽm lá', 'Đinh sắt', 'FeSO₄', 'Nhôm'], c: 2, e: 'Fe²⁺ đủ mạnh để khử Au³⁺ nhưng không khử được Cu²⁺.' },
    { q: 'Vì sao phải đuổi HNO₃ dư trước khi kết tủa vàng?', a: ['Để tiết kiệm axit', 'Vì vàng vừa kết tủa sẽ bị hoà tan lại', 'Để đổi màu dung dịch', 'Không cần thiết'], c: 1, e: 'Còn HNO₃ + HCl thì vẫn là nước cường toan.' },
    { q: 'Dung dịch vàng trắng có màu xanh lục. Điều này nghĩa là?', a: ['Mất vàng', 'Do Ni/Cu/Pd trong hợp kim, không ảnh hưởng thu hồi', 'Vàng giả', 'Phải đổ bỏ'], c: 1, e: 'Màu do thành phần hội. Hàm lượng vàng mới quyết định lượng thu được.' },
    { q: 'Thuốc thử SnCl₂ cho vết tím nghĩa là?', a: ['Còn vàng trong dung dịch', 'Hết vàng', 'Còn bạc', 'Có wonfram'], c: 0, e: 'Vàng keo tím (Purple of Cassius) cho thấy vẫn còn ion vàng.' },
    { q: 'Bột vàng nổi trên mặt nước. Nên làm gì?', a: ['Gạn đổ phần nước trên', 'Lọc cả nước, hoặc dùng chất làm ướt cho chìm', 'Đun sôi', 'Thêm HNO₃'], c: 1, e: 'Bột vàng siêu mịn nổi do sức căng bề mặt. Gạn đổ là mất vàng.' },
    { q: 'Pha loãng axit sunfuric đặc thế nào cho đúng?', a: ['Đổ nước vào axit', 'Rót axit từ từ vào nước', 'Trộn cùng lúc', 'Đun nóng trước'], c: 1, e: 'Đổ nước vào axit đặc sẽ sôi tức thì, bắn axit ra ngoài.' },
    { q: 'Vì sao "hầm" bạc bột trước khi nấu?', a: ['Cho đẹp', 'Cho khô, kết khối, không bị thổi bay hay bắn: nấu nhanh, hao ít', 'Để đổi màu', 'Để bạc tinh khiết hơn 9999'], c: 1, e: 'Bột ướt hoặc tơi bị ngọn lửa thổi bay và bắn.' },
    { q: 'Vì sao kẽm lá được dùng nhiều để vét kim loại quý?', a: ['Kẽm chọn lọc tuyệt đối', 'Khử mạnh, nhanh, dễ thao tác, bề mặt lớn', 'Kẽm rẻ hơn đường', 'Kẽm không phản ứng với axit'], c: 1, e: 'Nhưng kẽm không chọn lọc, nên kim loại thu được cần tinh chế lại.' },
    { q: 'Wonfram trong vàng gây hậu quả gì?', a: ['Vàng đổi màu xanh', 'Điểm cứng, đánh bóng bị xước, hỏng trang sức cao cấp', 'Vàng nhẹ hơn', 'Không ảnh hưởng'], c: 1, e: 'W không tan trong cường toan, phải lọc kỹ.' }
  ];

  const GALLERY = [
    ['phe-lieu-trang-suc', 'Phế liệu trang sức: nguyên liệu kinh điển của phân kim vàng'],
    ['phe-lieu-bo-mach', 'Ve chai điện tử: bo mạch, khay sim, RAM có chân mạ vàng'],
    ['phe-lieu-mainboard', 'Bo mạch máy tính, nguồn chân mạ vàng'],
    ['phe-lieu-sim', 'Thẻ sim cũ: tiếp điểm mạ vàng rất mỏng'],
    ['phe-lieu-cap-mem', 'Cáp mềm, đầu nối điện thoại'],
    ['phe-lieu-dien-thoai', '"Ve chai chất lượng": điện thoại đời cũ'],
    ['can-mong-nguyen-lieu', 'Nguyên liệu đã cán mỏng, cắt sợi'],
    ['can-mong', 'Lá hợp kim đã cán'],
    ['ha-tuoi', 'Thanh hợp kim vàng trước khi xử lý'],
    ['nguyen-lieu-tho', 'Bột thô chứa kim loại quý'],
    ['nguyen-lieu-tho-4', 'Mẻ nguyên liệu thô đã cân, ghi khối lượng'],
    ['nguyen-lieu-tho-3', 'Bùn sơ chế trong nồi'],
    ['so-che-bun', 'Bùn sau sơ chế'],
    ['so-che-cui-chay', 'Nghiền mịn cục cháy trong cối sứ'],
    ['bun-den-chua-vang', 'Bùn đen sau khi hoà kim loại khác bằng HNO₃: vàng nằm trong đây'],
    ['bun-thai-chua-vang', 'Bùn thải vẫn có thể chứa vàng'],
    ['agcl-trang', 'AgCl trắng như sữa sau khi thêm muối ăn'],
    ['agcl-duoi-dung-dich-dong', 'AgCl trắng lắng dưới dung dịch đồng xanh lam'],
    ['agcl-khuay', 'Khuấy AgCl'],
    ['muoi-bien', 'Muối biển: "đũa phép" kết tủa bạc'],
    ['duong', 'Đường: chất khử của phù thủy bạc'],
    ['duong-tinh-luyen', 'Đường tinh luyện'],
    ['dinh-sat', 'Đinh sắt: khử AgCl, thu đồng, làm FeSO₄'],
    ['la-kem', 'Kẽm lá dùng trong phân kim'],
    ['bac-bot-1', 'Bạc bột xám sau hoàn nguyên bằng đường'],
    ['bac-bot-2', 'Bạc bột màu gì? Xám bạc, tơi'],
    ['so-che-bot-xam', 'Bạc bột trong cốc'],
    ['loc-hut-chan-khong', 'Lọc hút chân không dung dịch vàng'],
    ['dung-dich-vang', 'Dung dịch vàng (HAuCl₄) màu vàng cam'],
    ['wonfram-1', 'Cặn wonfram trên giấy lọc sau cường toan'],
    ['wonfram-2', 'Cận cảnh cặn wonfram'],
    ['vang-bot-nau-1', '"Màu bã cafe nhưng không phải bã cafe": vàng bột'],
    ['vang-bot-nau-2', 'Vàng bột vừa kết tủa'],
    ['vang-bot-nau-3', 'Vàng bột đang lọc rửa'],
    ['vang-bot', 'Vàng bột như thế nào là đẹp'],
    ['vang-bot-say-1', 'Vàng bột đang sấy'],
    ['vang-bot-say-2', 'Vàng bột khô'],
    ['giot-vang', 'Giọt vàng sau khi nấu'],
    ['cuc-vang-nho', '"Mụ ve chai tích cóp mãi mới được 1 viên bé tí ti!"'],
    ['ket-qua-vang-1', '"Lọc sạch, nấu lên là sáng choang": 294,358 g'],
    ['ket-qua-vang-2', 'Khối vàng thành phẩm'],
    ['ket-qua-vang-4', 'Vàng thành phẩm'],
    ['ket-qua-vang-5', 'Vàng thành phẩm'],
    ['ket-qua-vang', 'Thành quả của trò'],
    ['ket-qua-vang-3', 'Thỏi vàng'],
    ['thoi-vang', 'Thanh vàng thành phẩm'],
    ['ket-qua-bac', 'Thỏi bạc thành phẩm'],
    ['ket-qua-bac-1', 'Các thỏi bạc'],
    ['ket-qua-bac-2', 'Thỏi bạc'],
    ['thoi-bac', 'Thỏi bạc'],
    ['thoi-bac-tren-can', 'Thỏi bạc trên cân'],
    ['pho-kiem-tra-vang', 'Phổ phân tích kiểm tra tuổi vàng'],
    ['kho-kien-thuc', '"24 năm nghịch hoá chất với những cuốn sách từ thời đại học"'],
    ['poster-an-toan', 'Poster an toàn khi làm việc với hoá chất'],
    ['so-do-thu-hoi-bac', 'Sơ đồ quy trình thu hồi bạc']
  ];

  const PROCS = {
    agSugar: { name: 'Bạc 925 → AgCl → đường + xút', steps: [
      ['Chuẩn bị bạc', 'Cân, cán mỏng, tẩy dầu.', '', { chunk: 'ag', chunkS: 1 }],
      ['Hoà tan bằng HNO₃ 1:1', 'Đun nhẹ 50–70 °C. Khí nâu NO₂, dung dịch xanh vì có đồng.', '3Ag + 4HNO3 → 3AgNO3 + NO↑ + 2H2O', { lvl: .45, liq: C.blueL, chunk: 'ag', chunkS: .15, bub: 1, fume: 'no2', heat: true }],
      ['Pha loãng, lọc', 'Giữ riêng cặn đen.', '', { lvl: .7, liq: C.blueL, funnel: true }],
      ['Thêm nước muối → AgCl', 'Kết tủa trắng như sữa đông.', 'AgNO3 + NaCl → AgCl↓ + NaNO3', { lvl: .8, liq: C.blueL, prec: P.white, precN: .8 }],
      ['Rửa AgCl', 'Nước nóng 5–6 lần đến hết xanh.', '', { lvl: .5, liq: C.clear, prec: P.white, precN: .8 }],
      ['Thêm NaOH → Ag₂O', 'Trắng chuyển nâu đen.', '2AgCl + 2NaOH → Ag2O + 2NaCl + H2O', { lvl: .55, liq: C.naoh, prec: P.ag2o, precN: .75 }],
      ['Glucose, 60–80 °C', 'Nâu đen chuyển xám bạc.', 'Ag2O + C6H12O6 → 2Ag + C6H12O7', { lvl: .6, liq: C.sugar, prec: P.ag, precN: .65, heat: true, bub: .25 }],
      ['Rửa, hầm khô', 'Rửa đến pH trung tính, sấy và hầm.', '', { lvl: .35, liq: C.clear, prec: P.ag, precN: .6 }],
      ['Nấu chảy 962 °C', 'Hàn the, khò, rót khuôn.', 'Ag → thỏi', { melt: 'ag' }]] },
    agIron: { name: 'AgCl → bạc bằng đinh sắt', steps: [
      ['AgCl trong nước axit loãng', 'pH 1–2.', '', { lvl: .55, liq: C.clear, prec: P.white, precN: .75 }],
      ['Thả đinh sắt, khuấy', 'Trắng chuyển xám, dung dịch xanh lục nhạt.', '2AgCl + Fe → 2Ag + FeCl2', { lvl: .6, liq: C.fe2, prec: P.ag, precN: .7, nail: true, nailS: .75, coat: '#9aa0a6', bub: .35 }],
      ['Rửa HCl loãng', 'Hoà vụn sắt.', 'Fe + 2HCl → FeCl2 + H2↑', { lvl: .4, liq: C.clear, prec: P.ag, precN: .62 }],
      ['Nấu chảy', '', '', { melt: 'ag' }]] },
    agZinc: { name: 'AgCl / dung dịch loãng → kẽm lá', steps: [
      ['Dung dịch hoặc AgCl', 'Có chút HCl loãng.', '', { lvl: .6, liq: C.clear, prec: P.white, precN: .5 }],
      ['Nhúng kẽm lá', 'Kim loại quý bám lên lá kẽm, kẽm mòn dần.', 'Zn + 2AgCl → 2Ag + ZnCl2', { lvl: .6, liq: C.zn, zinc: true, zincS: .7, coat: '#6f7378', prec: P.ag, precN: .55, bub: .5 }],
      ['Rửa HCl', 'Hoà kẽm dư.', 'Zn + 2HCl → ZnCl2 + H2↑', { lvl: .4, liq: C.clear, prec: P.ag, precN: .5, bub: .3 }],
      ['Nấu chảy', '', '', { melt: 'ag' }]] },
    au: { name: 'Vàng 14–22K → cường toan → FeSO₄ (từ đinh sắt)', steps: [
      ['Làm FeSO₄ từ đinh sắt', 'H₂SO₄ ~20% + đinh sắt, đun ấm.', 'Fe + H2SO4 → FeSO4 + H2↑', { lvl: .5, liq: C.fe2, nail: true, nailS: .45, bub: 1, heat: true }],
      ['Cán mỏng vàng', '', '', { chunk: 'au', chunkS: 1 }],
      ['Nước cường toan', 'HCl trước, HNO₃ từng ít.', 'Au + HNO3 + 4HCl → HAuCl4 + NO↑ + 2H2O', { lvl: .4, liq: C.gold, chunk: 'au', chunkS: .1, bub: 1, fume: 'no2', heat: true, prec: P.white, precN: .12 }],
      ['Đuổi HNO₃ bằng urê', 'Rắc đến hết sủi.', '6HNO3 + 5CO(NH2)2 → 8N2 + 5CO2 + 13H2O', { lvl: .42, liq: C.gold, bub: .8, heat: true, prec: P.white, precN: .12 }],
      ['Pha loãng, lắng, lọc', 'Lọc bỏ AgCl, wonfram.', '', { lvl: .75, liq: C.goldL, funnel: true }],
      ['Thêm FeSO₄', 'Bột vàng nâu "bã cafe" lắng.', 'AuCl4^- + 3Fe^2+ → Au↓ + 3Fe^3+ + 4Cl^-', { lvl: .85, liq: C.fe3, prec: P.au, precN: .5 }],
      ['Vàng nổi?', 'Lọc cả nước, đừng gạn!', '', { lvl: .85, liq: C.fe3, prec: P.au, precN: .5, floatGold: 1 }],
      ['Rửa bột vàng', 'HCl nóng, nước cất.', '', { lvl: .35, liq: C.clear, prec: P.au, precN: .48 }],
      ['Nấu chảy 1064 °C', '', 'Au → thỏi', { melt: 'au' }]] },
    pins: { name: 'Chân mạ vàng → AP → lá vàng', steps: [
      ['Cắt phần mạ vàng', '', '', { chunk: 'pins', chunkS: 1 }],
      ['AP + sục khí', 'Lá vàng bong ra.', 'Cu + 2HCl + H2O2 → CuCl2 + 2H2O', { lvl: .6, liq: C.green, chunk: 'pins', chunkS: .35, bub: .6, flakes: 1 }],
      ['Lọc lá vàng', '', '', { lvl: .45, liq: C.clear, flakes: .8, funnel: true }],
      ['HCl + javel', 'Khí clo! Ngoài trời.', '2Au + 3Cl2 + 2HCl → 2HAuCl4', { lvl: .3, liq: C.goldL, fume: 'cl2', bub: .4 }],
      ['Kết tủa vàng', 'FeSO₄ hoặc SMB.', '', { lvl: .5, liq: C.fe3, prec: P.au, precN: .18 }],
      ['Thu đồng bằng đinh sắt', '', 'CuCl2 + Fe → Cu + FeCl2', { lvl: .6, liq: C.greenL, nail: true, nailS: .8, coat: P.cu, prec: P.cu, precN: .35 }],
      ['Nấu chảy', '', '', { melt: 'au' }]] },
    fixer: { name: 'Nước hãm ảnh → bùi nhùi thép', steps: [
      ['Dung dịch hãm ảnh', '2–8 g Ag/L.', '', { lvl: .75, liq: C.amber }],
      ['Bùi nhùi thép', 'Bạc bám thành bùn đen.', '2[Ag(S2O3)2]^3- + Fe → 2Ag↓ + Fe^2+ + 4S2O3^2-', { lvl: .75, liq: C.amber, wool: true, coat: P.black, prec: P.black, precN: .35 }],
      ['Hoà bùn bằng HNO₃', '', '', { lvl: .5, liq: '#e9e2c9', bub: .9, fume: 'no2', heat: true, prec: P.black, precN: .08 }],
      ['AgCl → đường + xút', '', '', { lvl: .6, liq: C.sugar, prec: P.ag, precN: .4, heat: true, bub: .2 }],
      ['Nấu chảy', '', '', { melt: 'ag' }]] }
  };
  Object.assign(PACK, { theory: THEORY, quiz: QUIZ, gallery: GALLERY, procs: PROCS });
})();
