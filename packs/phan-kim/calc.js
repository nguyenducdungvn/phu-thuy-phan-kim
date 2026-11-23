/* Bàn tính phù thủy — ước tính hoá chất theo tỉ lượng phản ứng */
(function(){
const CALC_HTML = `<div class="wrap">
  <h2 class="sec">Bàn tính phù thủy</h2>
  <p class="muted">Chọn nguyên liệu, nhập khối lượng và chất khử. Bàn tính ước lượng lượng kim loại quý và hoá chất theo tỉ lượng phản ứng, đã cộng dư hợp lý. Đây là số tham khảo: hàm lượng phế liệu điện tử chỉ là ước tính thô.</p>
  <div class="matgrid" id="matgrid"></div>
  <div class="inputs">
    <label><span id="masslbl">Khối lượng (g)</span><input type="number" id="mass" min="0" step="any" value="100"></label>
    <label id="purlbl">Hàm lượng ước tính (%)<input type="number" id="purity" min="0" max="100" step="any"></label>
    <label id="redlbl">Chất khử / tác nhân kết tủa<select id="reducer"></select></label>
    <button class="btnlight" id="goto3d">🧊 Xem quy trình 3D</button>
  </div>
  <div id="out"></div>
</div>`;
function fmt(x,d){ if(!isFinite(x)) return '—'; d = d===undefined ? (x<10?2:x<100?1:0) : d; return x.toLocaleString('vi-VN',{maximumFractionDigits:d,minimumFractionDigits:0}); }
PACK.views = PACK.views || {};
PACK.views.calc = { nav: '🧮 Bàn tính', title: 'Bàn tính phù thủy', html: CALC_HTML, init: function(){
const MAT=[
 {id:'au24',g:'Vàng',ic:'🟡',nm:'Vàng 24K / vàng 9999 phế',sub:'≈ 99% Au',kind:'gold',au:99,ag:.5},
 {id:'au18',g:'Vàng',ic:'💍',nm:'Trang sức vàng 18K',sub:'75% Au, ~12–16% Ag, còn lại Cu',kind:'gold',au:75,ag:14},
 {id:'au14',g:'Vàng',ic:'💍',nm:'Trang sức vàng 14K',sub:'58,5% Au, ~10–25% Ag',kind:'gold',au:58.5,ag:15},
 {id:'au10',g:'Vàng',ic:'📿',nm:'Vàng tây 10K và thấp hơn',sub:'≤ 41,7% Au, cần pha loãng + HNO₃',kind:'gold',au:41.7,ag:12,inq:true},
 {id:'dental',g:'Vàng',ic:'🦷',nm:'Vàng nha khoa (răng, mão)',sub:'thường 40–85% Au, có Pd/Pt',kind:'gold',au:60,ag:10,pgm:true},
 {id:'pins',g:'Vàng',ic:'💾',nm:'Chân mạ vàng RAM/PCI/CPU đã cắt',sub:'≈ 0,2–1,5 g Au/kg (ước tính thô)',kind:'plated',au:0.06,lo:.02,hi:.15},
 {id:'plated',g:'Vàng',ic:'⌚',nm:'Đồ mỹ ký / đồng hồ mạ vàng',sub:'thường < 0,1 g Au/kg, hiếm khi đáng làm',kind:'plated',au:0.005,lo:.001,hi:.03,lowValue:true},
 {id:'ag925',g:'Bạc',ic:'🥄',nm:'Bạc 925 / bạc ta (trang sức, thìa)',sub:'92,5% Ag, 7,5% Cu',kind:'silver',ag:92.5},
 {id:'ag999',g:'Bạc',ic:'⚪',nm:'Bạc 999 phế / phoi bạc',sub:'≈ 99% Ag',kind:'silver',ag:99},
 {id:'coin',g:'Bạc',ic:'🪙',nm:'Xu bạc cổ',sub:'thường 80–90% Ag',kind:'silver',ag:90},
 {id:'contact',g:'Bạc',ic:'🔌',nm:'Tiếp điểm rơ-le / công tắc bạc',sub:'≈ 85–90% Ag; có thể có Cd',kind:'silver',ag:85,cd:true},
 {id:'solder',g:'Bạc',ic:'🧵',nm:'Que hàn bạc',sub:'15–56% Ag; loại cũ có Cd',kind:'silver',ag:45,cd:true},
 {id:'fixer',g:'Bạc',ic:'🧪',nm:'Dung dịch hãm ảnh (fixer) đã dùng',sub:'≈ 2–8 g Ag/L',kind:'fixer',agPerUnit:4},
 {id:'xray',g:'Bạc',ic:'🩻',nm:'Phim X-quang đã chụp',sub:'≈ 3–10 g Ag/kg phim (ước tính)',kind:'film',agPerUnit:6},
];
const matgrid=document.getElementById('matgrid'), massI=document.getElementById('mass'), purI=document.getElementById('purity'), redS=document.getElementById('reducer'), out=document.getElementById('out');
let sel=MAT[1];
matgrid.innerHTML=MAT.map(m=>`<button class="mat" data-id="${m.id}"><div class="grp" style="color:${m.g==='Vàng'?'#a77b10':'#5c6672'}">${m.ic} ${m.g}</div><div class="nm">${m.nm}</div><div class="sub">${m.sub}</div></button>`).join('');
matgrid.addEventListener('click',e=>{ const b=e.target.closest('.mat'); if(!b) return; selectMat(b.dataset.id); });
function selectMat(id){
  sel=MAT.find(m=>m.id===id);
  [...matgrid.children].forEach(b=>b.classList.toggle('on',b.dataset.id===id));
  const unitL = sel.kind==='fixer'?'Thể tích (L)': sel.kind==='film'?'Khối lượng phim (kg)': sel.kind==='plated'?'Khối lượng phế liệu (g)':'Khối lượng (g)';
  document.getElementById('masslbl').textContent=unitL;
  if(sel.kind==='fixer'){ massI.value=20; } else if(sel.kind==='film'){ massI.value=10; } else if(sel.kind==='plated'){ massI.value=1000; } else massI.value=100;
  const purLab=document.getElementById('purlbl');
  if(sel.kind==='fixer'||sel.kind==='film'){ purLab.firstChild.textContent= sel.kind==='fixer'?'Hàm lượng Ag ước tính (g/L)':'Hàm lượng Ag ước tính (g/kg)'; purI.value=sel.agPerUnit; }
  else if(sel.kind==='plated'){ purLab.firstChild.textContent='Hàm lượng Au ước tính (% khối lượng)'; purI.value=sel.au; }
  else if(sel.kind==='gold'){ purLab.firstChild.textContent='Hàm lượng Au (%)'; purI.value=sel.au; }
  else { purLab.firstChild.textContent='Hàm lượng Ag (%)'; purI.value=sel.ag; }
  if(sel.kind==='gold'||sel.kind==='plated'){
    redS.innerHTML='<option value="fe">FeSO₄ tự làm từ đinh sắt + H₂SO₄</option><option value="smb">SMB (natri metabisunfit)</option>';
  } else if(sel.kind==='fixer'){
    redS.innerHTML='<option value="sugar">Bùi nhùi thép → tinh chế bằng đường + xút</option><option value="iron">Bùi nhùi thép → tinh chế bằng đinh sắt</option>';
  } else {
    redS.innerHTML='<option value="sugar">Đường (glucose / đường kính thuỷ phân) + xút</option><option value="sugarS">Đường kính (saccarozơ) + chanh + xút</option><option value="iron">Đinh sắt + axit loãng</option>';
  }
  calc();
}
[massI,purI,redS].forEach(e=>e.addEventListener('input',calc));
const MW={Ag:107.87,Au:196.97,Cu:63.55,Fe:55.85,NaCl:58.44,NaOH:40,Glu:180.16,Suc:342.3,FeSO47:278.0,SMB:190.1,AgCl:143.32};
const HNO3_molPerMl=1.41*0.68/63.01; // 68%
const HCl_molPerMl=1.16*0.32/36.46;  // 32%
const H2SO4_molPerMl=1.84*0.98/98.08;
function row(name,amt,note){ return `<tr><td>${name}</td><td style="white-space:nowrap"><b>${amt}</b></td><td class="small muted">${note||''}</td></tr>`; }
function procFor(){
  if(sel.kind==='gold') return 'auIron';
  if(sel.kind==='plated') return 'apPins';
  if(sel.kind==='fixer'||sel.kind==='film') return 'fixer';
  return redS.value==='iron'?'agIron':'agSugar';
}
document.getElementById('goto3d').onclick=()=>{ const m={auIron:'au',apPins:'pins',fixer:'fixer',agIron:'agIron',agSugar:'agSugar'}; APP.open3D(m[procFor()]||'agSugar'); };

function silverReagents(agG, cuG, red, rows){
  const nAg=agG/MW.Ag, nCu=cuG/MW.Cu;
  const hno3=(nAg*4/3+nCu*8/3)*1.25/HNO3_molPerMl;
  rows.push(row('Axit nitric HNO₃ 68%',fmt(hno3)+' mL',`+ cùng thể tích nước cất (pha 1:1). Đã cộng dư 25%; cho từng phần.`));
  rows.push(row('Muối ăn NaCl',fmt(nAg*1.3*MW.NaCl)+' g','Pha thành nước muối bão hoà (~360 g/L)'));
  if(red==='iron'){
    rows.push(row('Đinh sắt / phoi sắt (không mạ kẽm)',fmt(nAg/2*MW.Fe*3)+' g','Gấp 3 lần lý thuyết vì một phần sắt tan vào axit'));
    rows.push(row('H₂SO₄ 98% hoặc HCl 32% (axit hoá)',fmt(Math.max(3,agG*0.05))+' mL','Pha vào nước ngâm AgCl để pH khoảng 1–2'));
    rows.push(row('HCl 32% (rửa bột bạc)',fmt(Math.max(10,agG*0.3))+' mL','Pha loãng 1:3 với nước'));
  } else {
    rows.push(row('Xút NaOH (vảy)',fmt(nAg*1.5*MW.NaOH)+' g','Pha dung dịch khoảng 20%'));
    if(red==='sugarS'){
      rows.push(row('Đường kính (saccarozơ)',fmt(nAg/4*MW.Suc*2.5)+' g','Đun với nước + 1–2 thìa nước cốt chanh khoảng 15–20 phút để thuỷ phân trước'));
    } else {
      rows.push(row('Glucose (hoặc siro mạch nha ~1,4× khối lượng)',fmt(nAg/2*MW.Glu*2)+' g','Gấp 2 lần lý thuyết'));
    }
  }
  return {nAg,nCu,hno3};
}
function goldReagents(m, auG, red, rows, fromFoil){
  const nAu=auG/MW.Au;
  if(!fromFoil){
    rows.push(row('Axit clohidric HCl 32%',fmt(m*4)+' mL','Khoảng 4 mL cho mỗi gam hợp kim'));
    rows.push(row('Axit nitric HNO₃ 68%',fmt(m*1)+' mL','Khoảng 1 mL/g, nhưng chỉ thêm từng ít đến khi vừa tan hết'));
    rows.push(row('Urê (phân đạm)',fmt(Math.max(2,m*0.2))+' g','Ước lượng; thêm đến khi hết sủi'));
  }
  if(red==='smb'){
    rows.push(row('SMB Na₂S₂O₅',fmt(Math.max(1,auG*1.3))+' g','Lý thuyết 0,72 g/g Au, đã cộng dư. Hoà trong nước ấm'));
  } else {
    const fes=nAu*3*MW.FeSO47*1.5;
    const nFe=fes/MW.FeSO47;
    rows.push(row('↳ Đinh sắt sạch (để làm FeSO₄)',fmt(Math.max(1,nFe*MW.Fe*1.15))+' g','Không mạ kẽm, đã tẩy gỉ và dầu'));
    rows.push(row('↳ Axit sunfuric H₂SO₄ 98%',fmt(Math.max(2,nFe*1.15/H2SO4_molPerMl))+' mL','Rót AXIT VÀO NƯỚC thành dung dịch ~20%'));
    rows.push(row('= Tương đương FeSO₄·7H₂O',fmt(Math.max(1,fes))+' g','Nếu mua sẵn (sắt sunfat) thì không cần 2 dòng trên'));
  }
  rows.push(row('Thiếc + HCl (thuốc thử SnCl₂)','≈ 1 g thiếc + 10 mL HCl','Dùng thiếc hàn không chì'));
  return nAu;
}
function calc(){
  if(!sel) return;
  const m=Math.max(0,parseFloat(massI.value)||0), pur=Math.max(0,parseFloat(purI.value)||0);
  const red=redS.value; const rows=[]; let kp=[], flags=[], steps=[];
  const common=['Hàn the (borax): một nhúm, khoảng 2–5% khối lượng kim loại khi nấu','Nước cất: nhiều (vài lít cho mỗi mẻ)','Soda/vôi + đinh sắt vụn để xử lý dung dịch thải'];
  if(sel.kind==='silver'){
    const agG=m*pur/100, cuG=m-agG;
    silverReagents(agG,cuG,red,rows);
    kp=[['ag',fmt(agG*0.97)+' g','Bạc thu được (hiệu suất ~97%)'],['',fmt(agG*MW.AgCl/MW.Ag)+' g','AgCl trung gian (khối lượng khô)']];
    steps=['Cắt nhỏ, cán mỏng, tẩy dầu.','Hoà tan bằng HNO₃ pha loãng 1:1, đun 50–70 °C, ngoài trời hoặc trong tủ hút.','Pha loãng, lọc bỏ cặn (giữ lại cặn đen vì có thể chứa vàng).','Thêm nước muối đến khi không còn kết tủa trắng mới.','Gạn, rửa AgCl bằng nước nóng đến hết màu xanh.',
      red==='iron'?'Ngâm AgCl trong nước axit loãng, thả đinh sắt sạch, khuấy đến khi kết tủa xám hoàn toàn.':(red==='sugarS'?'Thuỷ phân đường kính (đun với chanh). Thêm NaOH vào AgCl (chuyển nâu đen), đun 60–80 °C, cho đường vào từ từ đến khi xám bạc.':'Thêm NaOH vào AgCl (chuyển nâu đen), đun 60–80 °C, cho glucose/siro vào từ từ đến khi xám bạc.'),
      red==='iron'?'Gắp sắt ra, rửa bột bạc bằng HCl loãng, rồi nước cất.':'Rửa bột bạc bằng nước nóng đến hết kiềm.','Sấy khô, nấu chảy với hàn the ở khoảng 1000 °C, rót khuôn.','Xử lý dung dịch đồng thải bằng đinh sắt, rồi trung hoà.'];
    if(sel.cd) flags.push('<b>Có thể chứa cadmi (Cd).</b> Khi hoà bằng HNO₃, cadmi tan vào dung dịch thải, vốn rất độc. Không nấu chảy tiếp điểm thô ở nơi kín. Phải xử lý dung dịch thải như chất thải nguy hại.');
    if(pur<50) flags.push('Hàm lượng bạc thấp: tốn nhiều HNO₃ cho phần đồng/kẽm. Cân nhắc hiệu quả kinh tế.');
  }
  else if(sel.kind==='gold'){
    const auG=m*pur/100, agG=m*(sel.ag/100);
    goldReagents(m,auG,red,rows,false);
    kp=[['au',fmt(auG*0.98)+' g','Vàng thu được (hiệu suất ~98%)'],['ag',fmt(agG)+' g','Bạc nằm trong cặn AgCl (thu tiếp bằng đường/đinh sắt)']];
    if(pur<50||sel.inq){
      const addAg=Math.max(0, auG/0.25 - m);
      flags.push(`<b>Vàng dưới ~14K hoà rất chậm trong nước cường toan</b> vì AgCl bọc kín bề mặt. Nên <b>pha loãng</b>: nấu thêm khoảng <b>${fmt(addAg)} g bạc hoặc đồng</b> để vàng ≤ 25%, cán mỏng, hoà phần bạc/đồng bằng HNO₃ trước. HNO₃ thêm cho bước này khoảng ${fmt((addAg+m*(1-pur/100))/MW.Cu*8/3*1.25/HNO3_molPerMl)} mL (tính như đồng).`);
    }
    if(sel.pgm) flags.push('Vàng nha khoa thường có paladi/platin. Chúng tan vào nước cường toan và không bị FeSO₄ khử, nên ở lại trong dung dịch. Giữ dung dịch lại, đừng đổ đi.');
    steps=[...(pur<50||sel.inq?['Nấu pha loãng với bạc/đồng để vàng ≤ 25%, cán mỏng. Hoà bằng HNO₃ để lấy bùn vàng.']:['Cán mỏng hoặc cắt nhỏ, tẩy dầu.']),
      red==='smb'?'Chuẩn bị dung dịch SMB (hoà trong nước ấm).':'Làm dung dịch FeSO₄: ngâm đinh sắt trong H₂SO₄ ~20%, đun ấm, lọc lấy dung dịch xanh lục (dùng trong ngày).',
      'Hoà tan bằng HCl, rồi thêm HNO₃ từng ít, đun ấm. Bắt buộc có mặt nạ, làm ngoài trời hoặc trong tủ hút.','Đuổi HNO₃ dư bằng urê đến khi hết sủi.','Pha loãng 3–4 lần, để lắng qua đêm, lọc bỏ AgCl (giữ lại để thu bạc).',
      red==='smb'?'Thêm dung dịch SMB, khuấy. Bột vàng nâu lắng.':'Thêm dung dịch FeSO₄, khuấy. Bột vàng nâu lắng.','Thử bằng SnCl₂ đến khi không còn vết tím.','Rửa bột vàng bằng HCl nóng loãng rồi nước cất, sấy khô.','Nấu với hàn the ở khoảng 1100 °C, rót khuôn.'];
  }
  else if(sel.kind==='plated'){
    const auG=m*pur/100, baseG=m*0.85;
    const nCu=baseG/MW.Cu;
    rows.push(row('HCl 31–32% (dung dịch AP)',fmt(nCu*2*1.1/HCl_molPerMl/1000,2)+' L','Lý thuyết để hoà hết phần đồng. Thực tế có thể dùng ít hơn nhờ tái sinh CuCl₂ bằng sục khí'));
    rows.push(row('H₂O₂ 3%',fmt(nCu/0.88*0.5,2)+' L','Khoảng một nửa lý thuyết; phần còn lại thay bằng sục khí bể cá'));
    rows.push(row('Máy sục khí bể cá + ống sục','1 bộ','Chạy liên tục nhiều ngày'));
    rows.push(row('Nước javel 5% (hoà lá vàng)',fmt(Math.max(5,auG*6))+' mL','Cùng với khoảng '+fmt(Math.max(10,auG*15))+' mL HCl'));
    goldReagents(m,auG,red,rows,true);
    rows.push(row('Đinh sắt (thu hồi đồng từ dung dịch AP)',fmt(baseG*0.7*MW.Fe/MW.Cu*1.2/1000,2)+' kg','Đồng thu được khoảng '+fmt(baseG*0.7/1000,2)+' kg'));
    kp=[['au',fmt(auG*0.9,3)+' g','Vàng ước tính (hiệu suất ~90%)'],['',fmt(m*sel.lo/100,3)+'–'+fmt(m*sel.hi/100,3)+' g','Khoảng dao động thường gặp'],['cu',fmt(baseG*0.7/1000,2)+' kg','Đồng thu hồi bằng đinh sắt']];
    steps=['Cắt riêng phần mạ vàng, bỏ nhựa và linh kiện.','Ngâm trong HCl + H₂O₂ (2:1), sục khí liên tục, vài ngày đến 2 tuần.','Lọc lấy lá vàng, rửa bằng HCl loãng và nước cất.','Hoà lá vàng bằng HCl + javel từng ít (khí clo, làm ngoài trời).','Lọc trong, rồi kết tủa vàng bằng '+(red==='smb'?'SMB':'FeSO₄ tự làm từ đinh sắt')+'.','Thử bằng SnCl₂, rửa, sấy, nấu chảy.','Thả đinh sắt vào dung dịch AP cũ để thu đồng, rồi trung hoà và giao xử lý thải.'];
    flags.push('Hàm lượng vàng trên phế liệu điện tử dao động rất lớn theo đời máy và loại linh kiện. Con số ở đây chỉ để định hướng. Hãy cân thử một mẻ nhỏ trước.');
    if(sel.lowValue) flags.push('<b>Đồ mỹ ký/đồ mạ thường không đủ vàng để bù tiền hoá chất và công sức.</b>');
  }
  else { // fixer / film
    const agG=m*pur; // g
    if(sel.kind==='film'){
      rows.push(row('NaOH (bóc lớp nhũ tương)',fmt(m*0.25,2)+' kg','Pha khoảng 5% (khoảng '+fmt(m*5)+' L), ngâm nóng 60–80 °C'));
    } else {
      rows.push(row('Bùi nhùi thép (không xà phòng)',fmt(m*15)+' g','Khoảng 15 g/L; thay khi thép đã mục hết'));
    }
    if(sel.kind==='film') rows.push(row('Bùi nhùi thép / đinh sắt (tuỳ chọn)','—','Không cần với phim; dùng cho dung dịch rửa nếu có'));
    silverReagents(agG, agG*0.3, red==='iron'?'iron':'sugar', rows);
    kp=[['ag',fmt(agG*0.9)+' g','Bạc ước tính (hiệu suất ~90%)'],['',fmt(m)+(sel.kind==='fixer'?' L':' kg'),'Nguyên liệu đầu vào']];
    steps= sel.kind==='fixer'
      ? ['Gom dung dịch hãm ảnh đã dùng vào thùng nhựa.','Thả bùi nhùi thép, để 1–3 ngày; khuấy thỉnh thoảng.','Lấy thép ra, giũ bùn, lọc, sấy bùn đen.','Hoà bùn bằng HNO₃ loãng, đun nhẹ, lọc bỏ cặn lưu huỳnh.','Thêm nước muối để tạo AgCl, rửa sạch.', red==='iron'?'Khử AgCl bằng đinh sắt trong axit loãng.':'Khử AgCl bằng NaOH + đường, đun 60–80 °C.','Rửa, sấy, nấu chảy với hàn the.']
      : ['Cắt phim nhỏ, ngâm trong NaOH ~5% nóng để lớp nhũ tương bong ra.','Lọc lấy bùn đen chứa bạc, rửa, sấy.','Hoà bùn bằng HNO₃ loãng, đun nhẹ, lọc.','Thêm nước muối để tạo AgCl, rửa sạch.', red==='iron'?'Khử AgCl bằng đinh sắt trong axit loãng.':'Khử AgCl bằng NaOH + đường, đun 60–80 °C.','Rửa, sấy, nấu chảy với hàn the.'];
    flags.push('Dung dịch hãm ảnh sau khi vét bạc vẫn chứa thiosunfat và sắt. Không đổ ra cống; giao đơn vị thu gom chất thải.');
  }
  out.innerHTML=`<div class="result">
    <div>
      <div class="kpis">${kp.map(k=>`<div class="kpi ${k[0]}"><div class="v">${k[1]}</div><div class="l">${k[2]}</div></div>`).join('')}</div>
      <div class="tablewrap"><table><thead><tr><th>Hoá chất / vật liệu</th><th>Lượng</th><th>Ghi chú</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>
      <ul class="flaglist small muted">${common.map(c=>`<li>${c}</li>`).join('')}</ul>
    </div>
    <div>
      <div class="card"><h4>Các bước thực hiện — ${sel.nm}</h4><ol class="steps small">${steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      <button class="btnlight" onclick="document.getElementById('goto3d').click()">▶ Xem mô phỏng 3D</button></div>
      ${flags.length?`<div class="callout warn small"><b class="t">Lưu ý riêng cho nguyên liệu này</b><ul class="flaglist">${flags.map(f=>`<li>${f}</li>`).join('')}</ul></div>`:''}
      <div class="callout ok small"><b class="t">Bảo hộ tối thiểu</b>Mặt nạ phin lọc khí axit, kính kín, găng nitrile dày, làm nơi thoáng gió. Đọc Phần 8 trước khi bắt đầu.</div>
    </div></div>`;
}
selectMat('au18');
}};
})();
