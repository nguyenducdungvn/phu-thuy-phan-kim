/* ============================================================
   KHUNG ỨNG DỤNG "Học viện Giả kim" — engine dùng chung
   Đọc nội dung từ window.PACK (do packs/<gói>/*.js khai báo)
   và cấu hình từ window.APP_CONFIG (app.config.js).
   ============================================================ */
(function () {
  'use strict';
  const CFG = window.APP_CONFIG, P = window.PACK;
  const M = P.meta;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const IMG = n => `${M.imgBase}${n}.jpg`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const chem = s => (s || '').replace(/\^(\d*[+\-])/g, '<sup>$1</sup>').replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
  const fmt = (x, d = 2) => Number(x).toLocaleString('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: d });
  const QUESTS = P.quests || [], RANKS = P.ranks || [], THEORY = P.theory || [], QUIZ = P.quiz || [], GALLERY = P.gallery || [], PROCS = P.procs || {};

  /* ---------- LƯU TIẾN TRÌNH ---------- */
  const KEY = `hocvien-${P.id}-v2`;
  const blank = () => ({ agreed: false, best: {}, read: {}, quiz: 0, unlockAll: false, name: '', finaleSeen: false, adult: false });
  let S = blank();
  try {
    const raw = localStorage.getItem(KEY) || (P.id === 'phan-kim' ? localStorage.getItem('phuthuy-phankim-v1') : null); // nhận tiến trình bản 1
    S = Object.assign(blank(), JSON.parse(raw || '{}'));
  } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
  const xpTotal = () => Object.values(S.best).reduce((a, b) => a + (b.xp || 0), 0) + Object.keys(S.read).length * 5 + S.quiz * 10;
  const rankOf = xp => { let r = 0; RANKS.forEach((k, i) => { if (xp >= k.xp) r = i; }); return r; };
  const doneCount = () => QUESTS.filter(q => S.best[q.id]).length;
  const isMaster = () => doneCount() === QUESTS.length && rankOf(xpTotal()) === RANKS.length - 1;
  const siteUrl = () => {
    if (CFG.siteUrl) return CFG.siteUrl;
    const h = location.hostname;
    // chỉ dùng địa chỉ đang mở khi là trang thật (GitHub Pages / tên miền riêng), không dùng localhost hay trang xem thử
    if (!location.protocol.startsWith('http') || /^(localhost|127\.|0\.0\.0\.0)/.test(h) || /claude|anthropic|usercontent/.test(h)) return '';
    return location.origin + location.pathname.replace(/index\.html$/, '');
  };
  const feedbackUrl = () => CFG.feedbackUrl || (CFG.repoUrl ? CFG.repoUrl.replace(/\/$/, '') + '/issues' : '');

  function toast(msg) { const t = $('#toast'); t.innerHTML = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2800); }
  function renderRank() {
    const xp = xpTotal(), r = rankOf(xp), R = RANKS[r], N = RANKS[r + 1];
    const pct = N ? Math.min(100, (xp - R.xp) / (N.xp - R.xp) * 100) : 100;
    $('#rankbox').innerHTML = `<span class="rk-ic">${R.ic}</span><span class="rk-t"><b>${R.t}</b><small>${R.s} · ${xp} XP</small><i class="bar"><i style="width:${pct}%"></i></i></span>`;
  }
  function afterXP(before) {
    const a = rankOf(before), b = rankOf(xpTotal());
    if (b > a) toast(`🎉 Lên cấp: <b>${RANKS[b].t}</b> — ${RANKS[b].s}!`);
    renderRank(); buildNav();
    if (isMaster() && !S.finaleSeen) setTimeout(openFinale, 1600);
  }

  /* ---------- KHUNG GIAO DIỆN ---------- */
  document.title = `${M.title} — ${M.subtitle}`;
  $('#brandTitle').textContent = M.title; $('#brandSub').textContent = M.subtitle;
  if (M.logo) $('#brandLogo').src = M.logo;
  const NAV = [
    ['home', '🏰 Học viện'], ['quests', '🧪 Nhiệm vụ'], ['book', '📖 Sách phép'], ['lab3d', '🧊 Phòng 3D'],
    ...Object.entries(P.views || {}).map(([k, v]) => [k, v.nav]),
    ['quiz', '❓ Thử thách'], GALLERY.length ? ['gallery', '🖼️ Ảnh thực tế'] : null,
    ['secret', '📜 Bí kíp'], ['coffee', '☕ Cà phê'], ['safety', '⚠️ An toàn'], ['guide', '🧭 Hướng dẫn'],
    ['install', '📲 Cài đặt'], ['about', 'ℹ️ Giới thiệu'], ['disclaimer', '⚖️ Miễn trừ']
  ].filter(Boolean);
  function buildNav() {
    $('#nav').innerHTML = NAV.map(([k, t]) => `<a href="#${k}" data-r="${k}">${k === 'secret' ? (isMaster() ? '📜 Bí kíp' : '🔒 Bí kíp') : t}</a>`).join('');
    markNav();
  }
  const main = $('#main');
  function view(name, html) {
    let v = $(`[data-view="${name}"]`);
    if (!v) { v = document.createElement('section'); v.className = 'view'; v.dataset.view = name; main.appendChild(v); }
    if (html !== undefined) v.innerHTML = html;
    return v;
  }
  $('#foot').innerHTML = `${M.title} · v${CFG.version} · <a href="#about">Giới thiệu</a> · <a href="#safety">An toàn</a> · <a href="#disclaimer">Miễn trừ trách nhiệm</a> · <a href="#coffee">☕ Mời một ly cà phê</a>`;

  /* ---------- ĐIỀU HƯỚNG ---------- */
  const views = {}; let curView = 'home';
  function markNav() { $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === curView || (curView === 'play' && a.dataset.r === 'quests'))); }
  function route() {
    const h = (location.hash || '#home').slice(1);
    let [name, arg] = h.split(/-(.+)/);
    if (!views[name]) { name = 'home'; arg = null; }
    curView = name;
    views[name](arg);
    $$('.view').forEach(v => v.classList.toggle('on', v.dataset.view === name));
    markNav(); $('#nav').classList.remove('open'); window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  $('#menubtn').onclick = () => $('#nav').classList.toggle('open');

  /* ---------- MODAL ---------- */
  function modal(html, cls = '') {
    const m = $('#modal'), b = $('#modalBox');
    b.className = 'modal-box ' + cls; b.innerHTML = html; m.hidden = false;
    m.onclick = e => { if (e.target === m && !b.dataset.locked) m.hidden = true; };
    return b;
  }
  const closeModal = () => { $('#modal').hidden = true; $('#modalBox').dataset.locked = ''; };

  /* ---------- HỌC VIỆN (trang chủ) ---------- */
  views.home = () => {
    const done = doneCount(), r = rankOf(xpTotal());
    const coll = QUESTS.filter(q => S.best[q.id]).map(q => {
      const b = S.best[q.id], mt = P.metrics[q.metal];
      return `<div class="ingot ${q.metal} g${b.rank}"><div class="ing-shape"></div><b>${b.grade}</b><small>${q.title}</small><small>${mt.bySafety ? '' : fmt(b.purity, mt.dec) + mt.unit + ' · '}hạng ${b.rank}</small></div>`;
    });
    view('home', `
      <div class="hero"><div class="hero-txt"><p class="kicker">${M.heroKicker}</p><h1>${M.heroTitle}</h1><p>${M.heroText}</p>
        <div class="cta"><a class="btn gold" href="#quests">▶ Bắt đầu nhiệm vụ</a><a class="btn" href="#book">📖 Mở Sách phép</a><a class="btn" href="#guide">🧭 Cách chơi</a></div></div>
        <div class="hero-img">${M.heroImgs.length ? M.heroImgs.map(n => `<img src="${IMG(n)}" alt="">`).join('') : `<img src="assets/icons/logo.svg" alt="" class="logo-big">`}</div></div>
      <div class="wrap">
        <div class="grid4 feats">${M.features.map(f => `<div class="card"><h3>${f[0]}</h3><p>${f[1]}</p></div>`).join('')}</div>
        <a class="teaser ${isMaster() ? 'open' : ''}" href="#secret"><span class="tz-ic">${isMaster() ? '📜' : '🔒'}</span><span><b>${isMaster() ? 'Bí kíp đã mở khoá!' : 'Phần thưởng bí mật'}</b><br>${M.teaser}</span>
          <span class="tz-prog"><small>${done}/${QUESTS.length} nhiệm vụ · ${RANKS[r].t}</small><i class="bar"><i style="width:${(done / QUESTS.length * 70 + r / (RANKS.length - 1) * 30)}%"></i></i></span></a>
        <h2 class="sec">Bộ sưu tập của bạn</h2>
        <div class="collection">${coll.length ? coll.join('') : `<p class="muted">Chưa có thành phẩm nào. Hãy bắt đầu với <a href="#play-${QUESTS[0].id}">${QUESTS[0].title}</a>.</p>`}</div>
        <blockquote class="quote">"${M.quote[0]}"<span>— ${M.quote[1]}</span></blockquote>
      </div>`);
  };

  /* ---------- NHIỆM VỤ ---------- */
  views.quests = () => {
    const r = rankOf(xpTotal());
    view('quests', `<div class="wrap"><h2 class="sec">Bản đồ nhiệm vụ</h2>
      <p class="muted">Hoàn thành nhiệm vụ, đọc Sách phép và vượt Thử thách để nhận XP và lên cấp. Lên cấp sẽ mở khoá nhiệm vụ khó hơn.</p>
      <div class="questlist">${QUESTS.map(q => {
        const lock = !S.unlockAll && q.lv > r, b = S.best[q.id];
        return `<div class="qcard ${q.metal} ${lock ? 'locked' : ''}"><div class="qic">${q.icon}</div>
          <div class="qbody"><div class="qlv">Level ${q.lv} · ${(P.metalName || {})[q.metal] || ''}</div><h3>${q.title}</h3><p class="small">${q.sub}</p>
          <p class="small muted">📦 ${q.input}<br>🎯 ${q.goal}</p>${b ? `<p class="small best">🏅 Tốt nhất: <b>${b.grade}</b> (hạng ${b.rank}) · ${b.xp} XP</p>` : ''}</div>
          <div class="qact">${lock ? `<span class="lockmsg">🔒 Cần ${RANKS[q.lv].t}</span>` : `<a class="btn gold sm" href="#play-${q.id}">${b ? 'Chơi lại' : 'Bắt đầu'}</a>`}</div></div>`;
      }).join('')}</div>
      <label class="small muted unlock"><input type="checkbox" id="unlockAll" ${S.unlockAll ? 'checked' : ''}> Chế độ giáo viên: mở khoá tất cả nhiệm vụ (để dạy học; Bí kíp vẫn cần hoàn thành)</label></div>`);
    $('#unlockAll').onchange = e => { S.unlockAll = e.target.checked; save(); views.quests(); };
  };

  /* ---------- GAME ---------- */
  let gameLab = null, run = null;
  view('play', `<div class="wrap-wide"><div class="playgrid"><div>
      <div class="viewer" id="gameViewer"><div class="ov"><div class="ovno" id="gOvNo"></div><div class="ovt" id="gOvT"></div></div><div class="eqov" id="gEq"></div><div class="hint">kéo để xoay · cuộn để zoom</div></div>
      <div class="meters" id="meters"></div></div><div class="playpanel" id="playpanel"></div></div></div>`);
  views.play = (id) => {
    const q = QUESTS.find(x => x.id === id);
    if (!q) { location.hash = '#quests'; return; }
    if (!S.unlockAll && q.lv > rankOf(xpTotal())) { toast('🔒 Nhiệm vụ chưa mở khoá'); location.hash = '#quests'; return; }
    if (!gameLab) gameLab = new Lab3D($('#gameViewer'));
    const mt = P.metrics[q.metal];
    run = { q, mt, i: -1, purity: mt.base, yld: 100, safety: 100, wrong: 0 };
    gameLab.set({});
    $('#gOvNo').textContent = `Nhiệm vụ · Level ${q.lv}`; $('#gOvT').textContent = q.title; $('#gEq').innerHTML = '';
    renderMeters();
    $('#playpanel').innerHTML = `<div class="qhead"><span class="qic big">${q.icon}</span><div><h2>${q.title}</h2><p class="small muted">${q.sub}</p></div></div>
      <div class="brief"><p>${q.intro}</p><p>📦 <b>Đầu vào:</b> ${q.input}<br>🎯 <b>Mục tiêu:</b> ${q.goal}</p></div>
      <button class="btn gold" id="startQ">⚗️ Vào phòng thí nghiệm</button> <a class="btn" href="#quests">← Bản đồ</a>`;
    $('#startQ').onclick = nextStep;
  };
  function renderMeters() {
    const mt = run.mt;
    const pc = mt.bySafety ? 100 : Math.max(0, 100 - (mt.base - run.purity) / mt.span * 100);
    $('#meters').innerHTML = `
      <div class="meter"><span>💎 ${mt.label}</span><b>${mt.bySafety ? '—' : fmt(run.purity, mt.dec) + mt.unit}</b><i class="bar"><i style="width:${pc}%"></i></i></div>
      <div class="meter"><span>⚖️ Thu hồi</span><b>${fmt(run.yld, 1)}%</b><i class="bar y"><i style="width:${run.yld}%"></i></i></div>
      <div class="meter"><span>🛡️ An toàn</span><b>${Math.max(0, run.safety)}</b><i class="bar s ${run.safety < 40 ? 'low' : ''}"><i style="width:${Math.max(0, run.safety)}%"></i></i></div>`;
  }
  function apply(o) {
    if (o.dp) run.purity = Math.max(0, run.purity - o.dp);
    if (o.dy) run.yld = Math.max(0, run.yld - o.dy);
    if (o.ds) run.safety -= o.ds;
    renderMeters();
    if (run.safety <= 0) { fail(); return false; }
    return true;
  }
  const stepFrame = (st, body) => { const n = run.q.steps.length; return `<div class="stephead"><span>Bước ${run.i + 1}/${n}</span><i class="bar prog"><i style="width:${run.i / n * 100}%"></i></i></div><h3 class="steptitle">${st.t}</h3>${body}<div id="fb"></div><div id="nextwrap"></div>`; };
  function showFb(kind, txt, st) {
    const cls = kind === true ? 'ok' : kind === 'meh' ? 'meh' : 'bad';
    const lab = kind === true ? '✅ Phép thành công' : kind === 'meh' ? '🟡 Tạm được' : '❌ Sai phép';
    let h = `<div class="fb ${cls}"><b>${lab}</b><p>${txt}</p>`;
    if (kind !== false && st) {
      if (st.eq) h += `<div class="eq">${chem(st.eq)}</div>`;
      if (st.tip) h += `<p class="tip">🧙‍♀️ <i>"${st.tip}"</i></p>`;
      if (st.th) h += `<a class="thlink" href="#book-${st.th}" data-th="${st.th}">📖 Đọc phép này trong Sách phép</a>`;
    }
    $('#fb').innerHTML = h + '</div>';
    const l = $('#fb .thlink'); if (l) l.onclick = e => { e.preventDefault(); openTheoryPopup(l.dataset.th); };
  }
  function proceed(st) {
    if (st && st.s) { gameLab.set(st.s); $('#gEq').innerHTML = st.eq ? chem(st.eq) : ''; }
    $('#nextwrap').innerHTML = `<button class="btn gold" id="goNext">${run.i + 1 < run.q.steps.length ? 'Tiếp tục ▶' : '🏁 Xem thành quả'}</button>`;
    $('#goNext').onclick = nextStep; $('#goNext').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function nextStep() {
    run.i++;
    if (run.i >= run.q.steps.length) return finish();
    const st = run.q.steps[run.i];
    $('#gOvNo').textContent = `Bước ${run.i + 1}/${run.q.steps.length}`; $('#gOvT').textContent = st.t;
    if (st.type === 'ppe') {
      const items = st.items.slice().sort(() => Math.random() - .5);
      $('#playpanel').innerHTML = stepFrame(st, `<p>${st.d}</p><div class="ppe">${items.map(it => `<label><input type="checkbox" value="${it.id}"> ${it.t}</label>`).join('')}</div><button class="btn gold" id="ppeOk">Xác nhận trang bị</button>`);
      $('#ppeOk').onclick = () => {
        const sel = new Set($$('.ppe input:checked').map(x => x.value));
        const miss = st.items.filter(it => it.need && !sel.has(it.id)), bad = st.items.filter(it => !it.need && sel.has(it.id));
        if (!miss.length && !bad.length) { showFb(true, 'Trang bị đầy đủ. Phù thủy giỏi là phù thủy an toàn!'); $('#ppeOk').disabled = true; $$('.ppe input').forEach(x => x.disabled = true); proceed(null); return; }
        if (!apply({ ds: 8 * (miss.length + bad.length) })) return;
        run.wrong++; showFb(false, [...miss.map(m => `Thiếu: ${m.t}`), ...bad.map(b => `Không nên: ${b.t}`)].join('<br>') + '<br><small>Chọn lại cho đúng nhé.</small>');
      };
    } else if (st.type === 'choice') {
      $('#playpanel').innerHTML = stepFrame(st, `<p class="qtext">${st.q}</p><div class="opts">${st.opts.map((o, k) => `<button class="opt" data-k="${k}">${o.t}</button>`).join('')}</div>`);
      $$('.opt').forEach(b => b.onclick = () => {
        const o = st.opts[+b.dataset.k];
        if (!apply(o)) return;
        if (o.ok === false) { run.wrong++; b.disabled = true; b.classList.add('bad'); showFb(false, o.fb); return; }
        b.classList.add(o.ok === true ? 'good' : 'mehb'); $$('.opt').forEach(x => x.disabled = true);
        showFb(o.ok, o.fb, st); proceed(st);
      });
    } else if (st.type === 'slider') {
      $('#playpanel').innerHTML = stepFrame(st, `<p class="qtext">${st.q}</p><div class="slider"><input type="range" id="sl" min="${st.min}" max="${st.max}" value="${st.def}" step="1"><output id="slv">${st.def} ${st.unit}</output></div><button class="btn gold" id="slOk">Xác nhận</button>`);
      $('#sl').oninput = e => $('#slv').textContent = `${e.target.value} ${st.unit}`;
      $('#slOk').onclick = () => {
        const r = st.eval(+$('#sl').value);
        if (!apply(r)) return;
        $('#sl').disabled = true; $('#slOk').disabled = true; showFb(r.ok, r.fb, st); proceed(st);
      };
    }
  }
  function fail() {
    gameLab.set({ lvl: .4, liq: '#7a3414', fume: 'no2', bub: 1 });
    $('#playpanel').innerHTML = `<div class="fb bad big"><h2>☠️ Thí nghiệm bị dừng</h2><p>Điểm an toàn về 0. Ngoài đời thực, những lỗi này có thể gây bỏng hoá chất, ngộ độc khí hoặc cháy nổ.</p><p>Đọc lại <a href="#safety">An toàn</a> rồi thử lại nhé.</p></div>
      <button class="btn gold" id="retry">↻ Làm lại</button> <a class="btn" href="#quests">← Bản đồ</a>`;
    $('#retry').onclick = () => views.play(run.q.id);
  }
  function finish() {
    const q = run.q, mt = run.mt, tab = P.grades[q.metal];
    const g = mt.bySafety ? (run.safety >= 70 ? tab[0] : tab[tab.length - 1]) : (tab.find(x => run.purity >= x[0]) || tab[tab.length - 1]);
    const fac = { S: 1, A: .8, B: .6, C: .4, D: .2 }[g[3]];
    const xp = Math.round((q.lv + 1) * 100 * fac * (0.5 + 0.5 * run.yld / 100) * (run.safety >= 70 ? 1 : 0.8));
    const before = xpTotal(), prev = S.best[q.id];
    let newBest = false;
    if (!prev || xp > prev.xp) { S.best[q.id] = { grade: g[1], rank: g[3], purity: run.purity, yld: run.yld, safety: run.safety, xp }; save(); newBest = true; }
    gameLab.set({ melt: mt.melt });
    $('#gOvNo').textContent = 'Thành quả'; $('#gOvT').textContent = g[1]; $('#gEq').innerHTML = '';
    $('#playpanel').innerHTML = `<div class="result-card ${q.metal}"><div class="ingot big ${q.metal}"><div class="ing-shape"></div></div>
      <div><div class="grade">Hạng ${g[3]}</div><h2>${g[1]}</h2><p class="muted">${g[2]}</p></div></div>
      <div class="stats">${mt.bySafety ? '' : `<div><span>${mt.label}</span><b>${fmt(run.purity, mt.dec)}${mt.unit}</b></div>`}
        <div><span>Thu hồi</span><b>${fmt(run.yld, 1)}%</b></div><div><span>An toàn</span><b>${Math.max(0, run.safety)}</b></div><div><span>XP</span><b>+${xp}</b></div></div>
      <p class="small">${newBest ? '🏅 Kỷ lục mới cho nhiệm vụ này!' : `Kỷ lục cũ: ${prev.grade} (${prev.xp} XP). Thử lại để đạt hạng cao hơn!`}</p>
      ${run.wrong ? `<p class="small muted">Bạn đã chọn sai ${run.wrong} lần. Đọc Sách phép để hiểu vì sao.</p>` : ''}
      <p class="small muted">Tiến độ Bí kíp: ${doneCount()}/${QUESTS.length} nhiệm vụ · ${RANKS[rankOf(xpTotal())].t}</p>
      <div class="row gap"><button class="btn" id="retry">↻ Chơi lại</button><a class="btn gold" href="#quests">Nhiệm vụ tiếp ▶</a><a class="btn" href="#home">🏰 Bộ sưu tập</a></div>`;
    $('#retry').onclick = () => views.play(q.id);
    afterXP(before);
  }

  /* ---------- SÁCH PHÉP ---------- */
  const capOf = n => { const g = GALLERY.find(x => x[0] === n); return g ? g[1] : ''; };
  const theoryHTML = t => `<h2>${t.ic} ${t.t}</h2>${t.html}${t.img && t.img.length ? `<div class="thimgs">${t.img.map(n => `<figure><img src="${IMG(n)}" alt="" data-lb="${n}" loading="lazy"><figcaption>${capOf(n)}</figcaption></figure>`).join('')}</div>` : ''}`;
  function markRead(id) { if (!S.read[id]) { const b = xpTotal(); S.read[id] = 1; save(); toast('📖 +5 XP: đã đọc chương'); afterXP(b); } }
  views.book = (id) => {
    const t = THEORY.find(x => x.id === id) || THEORY[0], i = THEORY.indexOf(t);
    view('book', `<div class="wrap-wide bookgrid"><aside class="booktoc"><h3>Mục lục</h3>${THEORY.map(x => `<a href="#book-${x.id}" class="${x.id === t.id ? 'on' : ''}">${x.ic} ${x.t}${S.read[x.id] ? ' <span class="rd">✓</span>' : ''}</a>`).join('')}</aside>
      <article class="bookpage">${theoryHTML(t)}<div class="row gap pager">${i > 0 ? `<a class="btn" href="#book-${THEORY[i - 1].id}">◀ ${THEORY[i - 1].t}</a>` : '<span></span>'}${i < THEORY.length - 1 ? `<a class="btn gold" href="#book-${THEORY[i + 1].id}">${THEORY[i + 1].t} ▶</a>` : ''}</div></article></div>`);
    hydrate(view('book'));
    clearTimeout(views.book._t); views.book._t = setTimeout(() => markRead(t.id), 1500);
  };
  function hydrate(root) {
    root.querySelectorAll('[data-eseries]').forEach(el => el.innerHTML = eseries());
    root.querySelectorAll('img[data-lb]').forEach(im => im.onclick = () => lightbox(im.dataset.lb));
  }
  function eseries() {
    const L = [['Mg', -2.37], ['Al', -1.66], ['Zn', -0.76], ['Fe', -0.44], ['Ni', -0.25], ['Sn', -0.14], ['H₂', 0], ['Cu', 0.34], ['Ag', 0.80], ['Pd', 0.95], ['Au', 1.00], ['Pt', 1.18]];
    const col = { Zn: '#6f8fa8', Fe: '#8a5a3c', Cu: '#a4532b', Ag: '#7d8794', Au: '#c8961e' };
    let h = '<svg viewBox="0 0 1000 200" width="100%" role="img" aria-label="Dãy điện hoá"><defs><linearGradient id="eg" x1="0" x2="1"><stop offset="0" stop-color="#5b7bd6"/><stop offset=".45" stop-color="#9aa3ad"/><stop offset="1" stop-color="#d4a12a"/></linearGradient></defs><rect x="30" y="92" width="940" height="12" rx="6" fill="url(#eg)"/>';
    L.forEach((s, i) => { const x = 30 + (i + .5) * (940 / L.length), c = col[s[0]] || '#555', big = !!col[s[0]]; h += `<circle cx="${x}" cy="98" r="${big ? 13 : 8}" fill="${c}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${i % 2 ? 70 : 62}" text-anchor="middle" font-size="${big ? 22 : 16}" font-weight="700" fill="${c}">${s[0]}</text><text x="${x}" y="138" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">${(s[1] > 0 ? '+' : '') + s[1].toFixed(2).replace('.', ',')} V</text>`; });
    return h + '<text x="30" y="185" font-size="14" fill="currentColor" opacity=".7">← chất khử mạnh (tan ra)</text><text x="970" y="185" font-size="14" text-anchor="end" fill="currentColor" opacity=".7">kim loại quý (bị khử ra) →</text></svg>';
  }
  function openTheoryPopup(id) {
    const t = THEORY.find(x => x.id === id); if (!t) return;
    const b = modal(`<button class="lbclose dark" aria-label="Đóng">✕</button>${theoryHTML(t)}`, 'wide');
    hydrate(b); markRead(id); b.querySelector('.lbclose').onclick = closeModal;
  }

  /* ---------- PHÒNG 3D ---------- */
  let roomLab = null, rProc = Object.keys(PROCS)[0], rStep = 0, rTimer = null;
  views.lab3d = (p) => {
    if (!roomLab) {
      view('lab3d', `<div class="wrap-wide"><h2 class="sec">Phòng thực hành 3D</h2><p class="muted">Chọn quy trình, bấm từng bước hoặc "Tự chạy". Kéo để xoay, cuộn để zoom.</p>
        <div class="playgrid"><div class="viewer" id="roomViewer"><div class="ov"><div class="ovno" id="rOvNo"></div><div class="ovt" id="rOvT"></div></div><div class="eqov" id="rEq"></div><div class="hint">kéo để xoay · cuộn để zoom</div></div>
        <div class="playpanel darkpanel"><select id="procsel">${Object.entries(PROCS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}</select>
        <div class="row gap"><button class="btn sm" id="rPrev">◀ Trước</button><button class="btn sm gold" id="rPlay">▶ Tự chạy</button><button class="btn sm" id="rNext">Tiếp ▶</button></div>
        <ol class="steplist" id="rSteps"></ol><div class="stepdesc" id="rDesc"></div></div></div></div>`).classList.add('dark');
      roomLab = new Lab3D($('#roomViewer'));
      $('#procsel').onchange = () => loadProc($('#procsel').value);
      $('#rPrev').onclick = () => { stopR(); showR(rStep - 1); };
      $('#rNext').onclick = () => { stopR(); showR(rStep + 1); };
      $('#rPlay').onclick = () => { if (rTimer) return stopR(); if (rStep >= PROCS[rProc].steps.length - 1) showR(0); $('#rPlay').textContent = '⏸ Dừng'; rTimer = setInterval(() => { if (rStep >= PROCS[rProc].steps.length - 1) return stopR(); showR(rStep + 1); }, 4000); };
      $('#rSteps').onclick = e => { const li = e.target.closest('li'); if (li) { stopR(); showR(+li.dataset.i); } };
    }
    loadProc(PROCS[p] ? p : rProc);
  };
  function stopR() { clearInterval(rTimer); rTimer = null; $('#rPlay').textContent = '▶ Tự chạy'; }
  function loadProc(k) { rProc = k; $('#procsel').value = k; $('#rSteps').innerHTML = PROCS[k].steps.map((s, i) => `<li data-i="${i}">${s[0]}</li>`).join(''); stopR(); showR(0); }
  function showR(i) {
    const st = PROCS[rProc].steps; rStep = Math.max(0, Math.min(st.length - 1, i)); const s = st[rStep];
    roomLab.set(s[3]); $$('#rSteps li').forEach((li, j) => li.classList.toggle('on', j === rStep));
    $('#rOvNo').textContent = `Bước ${rStep + 1}/${st.length}`; $('#rOvT').textContent = s[0]; $('#rEq').innerHTML = s[2] ? chem(s[2]) : ''; $('#rDesc').innerHTML = `<b>${s[0]}</b><br>${s[1] || ''}`;
  }

  /* ---------- VIEW RIÊNG CỦA GÓI (vd. Bàn tính) ---------- */
  Object.entries(P.views || {}).forEach(([k, v]) => { let inited = false; views[k] = () => { if (!inited) { view(k, v.html); v.init(); inited = true; } }; });

  /* ---------- THỬ THÁCH ---------- */
  views.quiz = () => {
    let i = 0, score = 0; const order = QUIZ.map((q, k) => k).sort(() => Math.random() - .5);
    view('quiz', `<div class="wrap narrow"><h2 class="sec">Thử thách lý thuyết</h2><p class="muted">${QUIZ.length} câu hỏi. Mỗi câu đúng được 10 XP (tính theo lần làm tốt nhất).</p><div id="quizbox"></div></div>`);
    const box = $('#quizbox');
    const show = () => {
      if (i >= order.length) {
        const before = xpTotal(); if (score > S.quiz) { S.quiz = score; save(); }
        box.innerHTML = `<div class="card center"><h2>${score}/${QUIZ.length} câu đúng</h2><p>${score >= QUIZ.length * .8 ? '🧙 Xuất sắc! Bạn hiểu bản chất rồi.' : score >= QUIZ.length * .6 ? '👍 Khá lắm! Đọc thêm Sách phép nhé.' : '📖 Hãy đọc lại Sách phép rồi thử lại.'}</p><p class="muted small">Điểm tốt nhất: ${S.quiz}/${QUIZ.length} (${S.quiz * 10} XP)</p><button class="btn gold" id="qAgain">↻ Làm lại</button></div>`;
        $('#qAgain').onclick = () => views.quiz(); afterXP(before); return;
      }
      const q = QUIZ[order[i]];
      box.innerHTML = `<div class="card"><div class="stephead"><span>Câu ${i + 1}/${QUIZ.length}</span><i class="bar prog"><i style="width:${i / QUIZ.length * 100}%"></i></i></div><h3>${q.q}</h3><div class="opts">${q.a.map((a, k) => `<button class="opt" data-k="${k}">${a}</button>`).join('')}</div><div id="qfb"></div></div>`;
      $$('#quizbox .opt').forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = k === q.c; if (ok) score++;
        $$('#quizbox .opt').forEach((x, j) => { x.disabled = true; if (j === q.c) x.classList.add('good'); else if (j === k) x.classList.add('bad'); });
        $('#qfb').innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${ok ? '✅ Chính xác!' : '❌ Chưa đúng'}</b><p>${q.e}</p></div><button class="btn gold" id="qNext">Tiếp ▶</button>`;
        $('#qNext').onclick = () => { i++; show(); };
      });
    };
    show();
  };

  /* ---------- ẢNH ---------- */
  views.gallery = () => {
    const v = view('gallery'); if (v.childElementCount) return;
    view('gallery', `<div class="wrap-wide"><h2 class="sec">Ảnh thực tế</h2><p class="muted">Ảnh nguyên liệu, công đoạn và thành phẩm thật. Bấm để phóng to.</p><div class="gallery">${GALLERY.map(([n, c]) => `<figure><img src="${IMG(n)}" alt="${esc(c)}" loading="lazy" data-lb="${n}"><figcaption>${c}</figcaption></figure>`).join('')}</div></div>`);
    hydrate(v);
  };
  function lightbox(n) { $('#lbImg').src = IMG(n); $('#lbCap').textContent = capOf(n); $('#lightbox').hidden = false; }
  $('#lightbox').onclick = () => $('#lightbox').hidden = true;

  /* ---------- BÍ KÍP (phần thưởng cuối) ---------- */
  const F = P.finale || {};
  function adultBlock() {
    if (!F.pdf) return `<p>${F.message}</p>`;
    return `<div class="adult" id="adultBox">
      <p>${F.message}</p>
      <label><input type="checkbox" id="ad18" ${S.adult ? 'checked' : ''}> Tôi xác nhận <b>đã đủ 18 tuổi</b>.</label>
      <label><input type="checkbox" id="adLegal" ${S.adult ? 'checked' : ''}> Tôi đã đọc <a href="#disclaimer">Miễn trừ trách nhiệm</a> và <a href="#safety">An toàn</a>, và tự chịu trách nhiệm khi áp dụng.</label>
      <div id="pdfWrap"></div></div>`;
  }
  function wireAdult(root) {
    if (!F.pdf) return;
    const a = root.querySelector('#ad18'), l = root.querySelector('#adLegal'), w = root.querySelector('#pdfWrap');
    const upd = () => {
      const ok = a.checked && l.checked; S.adult = ok; save();
      const fb = feedbackUrl();
      w.innerHTML = ok ? `<a class="btn gold big" href="${F.pdf}" target="_blank" rel="noopener" download>${F.pdfLabel}</a>
        <p class="small muted">Mở được trên điện thoại và máy tính. Nên in ra để mang vào xưởng.</p>
        ${fb ? `<a class="btn" href="${fb}" target="_blank" rel="noopener">💬 ${CFG.feedbackLabel}</a>` : `<p class="small">💬 Làm xong hãy chia sẻ kết quả và khó khăn với tác giả qua trang <a href="#about">Giới thiệu</a>.</p>`}`
        : `<p class="small muted">Tick cả hai ô để hiện nút tải Bí kíp.</p>`;
    };
    a.onchange = l.onchange = upd; upd();
  }
  function openFinale() {
    S.finaleSeen = true; save();
    const b = modal(`<div class="finale"><div class="confetti" aria-hidden="true">${'✨🎉⭐🪙'.repeat(6).split('').map((c, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 7) * .3}s">${c}</i>`).join('')}</div>
      <img src="${M.logo}" class="fin-logo" alt=""><h2>🎓 Chúc mừng ${S.name ? esc(S.name) : 'bạn'}!</h2>
      <p class="lead">Bạn đã đạt cấp độ <b>${F.title}</b> — hoàn thành ${QUESTS.length}/${QUESTS.length} nhiệm vụ của ${M.title}.</p>
      ${certBlock()}${adultBlock()}${P.id === 'phan-kim' ? teacherHTML(true) : ''}
      <div class="row gap center-row"><a class="btn" href="#coffee" id="finCoffee">☕ Chia sẻ cho bạn bè</a><button class="btn" id="finClose">Đóng</button></div></div>`, 'wide');
    wireCert(b); wireAdult(b);
    b.querySelector('#finClose').onclick = closeModal; b.querySelector('#finCoffee').onclick = closeModal;
  }
  function certBlock() {
    return `<div class="certbox"><label class="small">Tên in trên chứng nhận: <input id="certName" maxlength="40" value="${esc(S.name || '')}" placeholder="Nhập tên của bạn"></label>
      <canvas id="cert" width="1600" height="1100"></canvas><a class="btn sm" id="certDl" download="chung-nhan-${P.id}.png">💾 Lưu ảnh chứng nhận</a></div>`;
  }
  function wireCert(root) {
    const cv = root.querySelector('#cert'), inp = root.querySelector('#certName'), dl = root.querySelector('#certDl');
    const logo = new Image(); logo.src = M.logo;
    const draw = () => {
      const g = cv.getContext('2d'), W = 1600, H = 1100;
      const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1a1326'); bg.addColorStop(1, '#2d2145'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#d4a12a'; g.lineWidth = 14; g.strokeRect(40, 40, W - 80, H - 80); g.lineWidth = 3; g.strokeRect(70, 70, W - 140, H - 140);
      try { g.drawImage(logo, W / 2 - 110, 110, 220, 220); } catch (e) { }
      g.textAlign = 'center'; g.fillStyle = '#f0c552'; g.font = '700 46px "Playfair Display", Georgia, serif'; g.fillText('CHỨNG NHẬN', W / 2, 400);
      g.fillStyle = '#cfc4e0'; g.font = '30px "Be Vietnam Pro", Arial, sans-serif'; g.fillText(`${M.title} — ${M.subtitle}`, W / 2, 450);
      g.fillText('trân trọng công nhận', W / 2, 540);
      g.fillStyle = '#ffffff'; g.font = '700 84px "Playfair Display", Georgia, serif'; g.fillText(S.name || 'Phù thủy vô danh', W / 2, 650);
      g.fillStyle = '#f0c552'; g.font = '700 50px "Be Vietnam Pro", Arial, sans-serif'; g.fillText(`đạt cấp độ ${F.title}`, W / 2, 740);
      g.fillStyle = '#cfc4e0'; g.font = '28px "Be Vietnam Pro", Arial, sans-serif';
      g.fillText(`Hoàn thành ${QUESTS.length}/${QUESTS.length} nhiệm vụ · ${xpTotal()} XP · ${new Date().toLocaleDateString('vi-VN')}`, W / 2, 800);
      const cr = (P.credits || []).slice(0, 2);
      cr.forEach((c, i) => { const x = cr.length === 1 ? W / 2 : (i ? W * 0.72 : W * 0.28); g.strokeStyle = '#8a7aa8'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 200, 940); g.lineTo(x + 200, 940); g.stroke(); g.fillStyle = '#ffffff'; g.font = '600 30px "Be Vietnam Pro", Arial'; g.fillText(c.name, x, 980); g.fillStyle = '#a99cc0'; g.font = '22px "Be Vietnam Pro", Arial'; g.fillText(c.role, x, 1014); });
      try { dl.href = cv.toDataURL('image/png'); } catch (e) { }
    };
    logo.onload = draw; draw();
    inp.oninput = () => { S.name = inp.value.trim(); save(); draw(); };
  }
  views.secret = () => {
    const done = doneCount(), r = rankOf(xpTotal()), ok = isMaster();
    view('secret', `<div class="wrap narrow"><h2 class="sec">📜 Bí kíp ${F.title ? 'của ' + F.title : ''}</h2>
      ${ok ? `<div class="card">${certBlock()}${adultBlock()}</div>${P.id === 'phan-kim' ? teacherHTML(false) : ''}` : `
      <div class="card locked-card"><div class="bigic">🔒</div><p>${F.lockedText}</p>
        <div class="prog2"><div><span>Nhiệm vụ</span><b>${done}/${QUESTS.length}</b><i class="bar"><i style="width:${done / QUESTS.length * 100}%"></i></i></div>
        <div><span>Cấp bậc</span><b>${RANKS[r].t}</b><i class="bar"><i style="width:${r / (RANKS.length - 1) * 100}%"></i></i></div></div>
        <p class="small muted">Mẹo: đọc Sách phép (+5 XP/chương) và làm Thử thách (+10 XP/câu) để lên cấp nhanh hơn. Chế độ giáo viên không mở khoá Bí kíp.</p>
        <a class="btn gold" href="#quests">▶ Tiếp tục nhiệm vụ</a></div>`}</div>`);
    if (ok) { wireCert(view('secret')); wireAdult(view('secret')); }
  };

  /* ---------- CÀ PHÊ / CHIA SẺ / HỌC VỚI CÔ GIÁO ---------- */
  const DN = CFG.donate || {}, TC = CFG.teacher || {};
  const hasDonate = () => !!(DN.qrImage || (DN.bankBin && DN.accountNo));
  const qrSvg = (text, cell = 6) => { try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell, margin: 2, scalable: true }); } catch (e) { return ''; } };
  async function copyText(t, ok) { try { await navigator.clipboard.writeText(t); toast(ok || '✅ Đã sao chép'); } catch (e) { toast('Không sao chép được, hãy chép tay: ' + esc(t)); } }
  function donateHTML() {
    if (!hasDonate()) return '';
    let qr = '';
    if (DN.qrImage) qr = `<img src="${DN.qrImage}" alt="Mã QR chuyển khoản" class="qrimg">`;
    else if (window.VietQR && window.qrcode) qr = qrSvg(VietQR.payload({ bin: DN.bankBin, account: DN.accountNo, amount: DN.amount, note: DN.note }), 6);
    const bank = DN.bankName || (window.VietQR && VietQR.BANKS[DN.bankBin]) || '';
    const row = (k, v, copy) => v ? `<div class="dn-row"><span>${k}</span><b>${esc(v)}</b>${copy ? `<button class="btnlight sm" data-copy="${esc(v)}">Sao chép</button>` : ''}</div>` : '';
    return `<div class="card donate"><h3>☕ Mời cà phê bằng chuyển khoản</h3>
      <p class="small muted">Mở app ngân hàng bất kỳ → <b>Quét mã QR</b>. ${DN.amount > 0 ? `Số tiền gợi ý: <b>${Number(DN.amount).toLocaleString('vi-VN')} đ</b>.` : 'Bạn tự chọn số tiền — bao nhiêu cũng quý!'}</p>
      <div class="qr dn-qr">${qr}</div>
      <div class="dn-info">${row('Ngân hàng', bank)}${row('Số tài khoản', DN.accountNo, true)}${row('Chủ tài khoản', DN.accountName)}${row('Nội dung', DN.note, true)}</div>
      <p class="small muted">Cảm ơn bạn rất nhiều! Mỗi ly cà phê giúp mình có thêm động lực làm các bài học mới.</p></div>`;
  }
  function teacherHTML(compact) {
    const fb = TC.facebookUrl, other = TC.otherUrl;
    return `<div class="card teacher"><div class="tc-head"><div class="tc-ic">🧙‍♀️</div><div><small>Muốn học thật, làm thật?</small><h3>Học trực tiếp với ${esc(TC.name || 'Cô giáo phù thủy Hài Lê')}</h3></div></div>
      ${compact ? '' : `<p>Game chỉ là bước khởi đầu. Nếu bạn muốn <b>học nghề phân kim bài bản</b>: cầm cốc, pha hoá chất, nhìn tận mắt AgCl kết tủa, nấu thỏi bạc đầu tiên dưới sự hướng dẫn của người có hơn 20 năm kinh nghiệm, hãy tìm và liên hệ với cô qua Facebook.</p>
      <ul class="small"><li>Hỏi về lịch học, hình thức kèm cặp, chi phí trực tiếp với cô.</li><li>Gửi ảnh nguyên liệu để được tư vấn có nên làm hay không.</li><li>Nhắn rằng bạn biết cô qua game <b>${esc(M.title)}</b> nhé!</li></ul>`}
      <div class="row gap">${fb ? `<a class="btn gold" href="${fb}" target="_blank" rel="noopener">📘 Nhắn tin cho cô qua Facebook</a>` : `<span class="small muted">🔗 Tác giả sẽ cập nhật link Facebook của cô sớm. Trong lúc chờ, hãy tìm "<b>Bà giáo phù thủy Hài Lê</b>" trên Facebook.</span>`}
      ${other ? `<a class="btn" href="${other}" target="_blank" rel="noopener">▶ ${esc(TC.otherLabel || 'Kênh của cô')}</a>` : ''}</div>
      ${fb ? `<p class="small muted">Facebook: <code>${esc(fb)}</code></p>` : ''}</div>`;
  }
  function wireCopy(root) { root.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copyText(b.dataset.copy)); }
  views.coffee = () => {
    const url = siteUrl();
    const enc = encodeURIComponent(url), txt = encodeURIComponent(M.shareText);
    const qr = url && window.qrcode ? qrSvg(url, 6) : '';
    const v = view('coffee', `<div class="wrap narrow"><div class="coffee card">
      <div class="cup">☕</div>
      <h2 class="sec">Mời mình một ly cà phê nhé?</h2>
      <p class="lead">Bạn thấy game hữu ích và muốn cảm ơn mình một ly cà phê? ${hasDonate() ? 'Bạn có thể <b>chuyển khoản qua mã QR</b> bên dưới, hoặc' : ''} <b>chia sẻ game cho một người cùng sở thích</b> — với mình, đó cũng là ly cà phê ngon nhất!</p></div>
      ${donateHTML()}
      <div class="card coffee"><h3>📤 Chia sẻ cho bạn bè</h3>
      <div class="share">
        <button class="btn gold" id="shNative">📤 Chia sẻ ngay</button>
        ${url ? `<a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${enc}" target="_blank" rel="noopener">📘 Facebook</a>
        <a class="btn" href="https://zalo.me/share?url=${enc}" target="_blank" rel="noopener">💬 Zalo</a>
        <a class="btn" href="https://twitter.com/intent/tweet?url=${enc}&text=${txt}" target="_blank" rel="noopener">𝕏</a>` : ''}
        <button class="btn" id="shCopy">🔗 Sao chép link</button>
      </div>
      ${url ? `<div class="qr">${qr}<p class="small muted">Đưa mã QR cho bạn bè quét bằng camera điện thoại<br><code>${esc(url)}</code></p></div>` : `<p class="small muted">Mở app qua đường link (GitHub Pages) để có mã QR chia sẻ. Tác giả có thể khai báo link chính thức trong <code>app.config.js → siteUrl</code>.</p>`}
      <p class="small muted">Nếu Zalo không mở đúng, hãy bấm "Sao chép link" rồi dán vào tin nhắn Zalo.</p></div>
      ${teacherHTML(false)}</div>`);
    wireCopy(v);
    $('#shCopy').onclick = () => copyText(url ? `${M.shareText} ${url}` : M.shareText, '✅ Đã sao chép. Dán vào tin nhắn để gửi nhé!');
    $('#shNative').onclick = async () => { if (navigator.share) { try { await navigator.share({ title: M.title, text: M.shareText, url: url || undefined }); } catch (e) { } } else $('#shCopy').click(); };
  };

  /* ---------- GIỚI THIỆU ---------- */
  views.about = () => {
    const fb = feedbackUrl();
    view('about', `<div class="wrap narrow"><div class="about-head"><img src="${M.logo}" alt=""><div><h2 class="sec">${M.title}</h2><p class="muted">${M.subtitle} · phiên bản ${CFG.version}</p></div></div>
      <div class="credits">${(P.credits || []).map(c => `<div class="card credit"><div class="cr-ic">${c.ic}</div><div><small>${c.role}</small><h3>${c.name}</h3><p>${c.note}</p>${c.url ? `<a class="btn sm" href="${c.url}" target="_blank" rel="noopener">📘 Facebook</a>` : ''}</div></div>`).join('')}</div>
      ${P.id === 'phan-kim' ? teacherHTML(true) : ''}<div class="card"><h3>Về ứng dụng</h3><p>Trò chơi giáo dục kết hợp nhập vai: người chơi học bản chất hoá học qua từng lựa chọn, xem mô phỏng 3D và đọc lý thuyết có ảnh thực tế. Ứng dụng chạy hoàn toàn trên trình duyệt, không thu thập dữ liệu; tiến trình chỉ lưu trên máy của bạn.</p>
        <p>💬 Góp ý, báo lỗi, chia sẻ kết quả thực tế: ${fb ? `<a href="${fb}" target="_blank" rel="noopener">${CFG.feedbackLabel}</a>` : 'liên hệ tác giả qua kênh bạn nhận được ứng dụng này.'}</p>
        ${CFG.repoUrl ? `<p>📦 Mã nguồn: <a href="${CFG.repoUrl}" target="_blank" rel="noopener">${CFG.repoUrl}</a></p>` : ''}</div>
      <div class="card"><h3>Thư viện & giấy phép</h3><ul class="small"><li>Mã nguồn ứng dụng: giấy phép MIT © ${CFG.year} ${CFG.developer}.</li><li>Three.js r128 (MIT) — mô phỏng 3D.</li><li>qrcode-generator (MIT) — tạo mã QR.</li><li>Font Be Vietnam Pro, Playfair Display (SIL OFL 1.1) — đóng gói sẵn để chạy offline.</li><li>Ảnh thực tế: thuộc quyền chủ sở hữu, chỉ dùng minh hoạ trong ứng dụng.</li></ul></div></div>`);
  };

  /* ---------- CÀI ĐẶT (PWA) ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; if (curView === 'install') views.install(); });
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const phoneSVG = (steps) => `<svg viewBox="0 0 220 400" class="phone"><rect x="8" y="8" width="204" height="384" rx="28" fill="#1d1b26"/><rect x="18" y="40" width="184" height="320" rx="6" fill="#f6f2ea"/>${steps}</svg>`;
  views.install = async () => {
    view('install', view('install').innerHTML || '<div class="wrap"><h2 class="sec">📲 Cài ứng dụng</h2></div>');
    const isFile = location.protocol === 'file:';
    let off = '';
    if ('serviceWorker' in navigator && !isFile) { try { const reg = await navigator.serviceWorker.getRegistration(); off = reg && reg.active ? '✅ Đã sẵn sàng chạy offline trên thiết bị này.' : '⏳ Đang tải dữ liệu offline… mở lại trang này sau vài giây.'; } catch (e) { } }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    view('install', `<div class="wrap"><h2 class="sec">📲 Cài ứng dụng ra màn hình điện thoại</h2>
      <p class="muted">Cài xong, ứng dụng có biểu tượng riêng, mở toàn màn hình như app thật và <b>chơi được khi không có mạng</b>.</p>
      ${standalone() ? '<div class="callout ok">🎉 Bạn đang dùng bản đã cài. Tuyệt!</div>' : ''}
      ${isFile ? '<div class="callout warn"><b>Lưu ý:</b> bạn đang mở file trực tiếp trên máy (file://). Chế độ cài đặt và offline chỉ hoạt động khi mở qua đường link <b>https</b>, ví dụ GitHub Pages. Xem README để đưa app lên mạng.</div>' : ''}
      ${off ? `<div class="callout ok small">${off}</div>` : ''}
      ${deferredPrompt ? '<button class="btn gold big" id="installBtn">📲 Cài ứng dụng ngay</button>' : ''}
      <div class="grid2 install">
        <div class="card ${ios ? 'dim' : ''}"><h3>🤖 Android (Chrome, Cốc Cốc, Edge)</h3>
          ${phoneSVG('<rect x="18" y="40" width="184" height="30" fill="#fff"/><text x="30" y="60" font-size="11" fill="#555">github.io/phu-thuy…</text><circle cx="188" cy="55" r="9" fill="#d4a12a"/><text x="184" y="59" font-size="12" fill="#fff">⋮</text><rect x="90" y="78" width="110" height="74" rx="6" fill="#fff" stroke="#ddd"/><text x="98" y="98" font-size="10" fill="#333">Tab mới</text><rect x="94" y="106" width="102" height="18" rx="4" fill="#fbf1d6"/><text x="98" y="119" font-size="9.5" fill="#1a1326">📲 Cài đặt ứng dụng</text><text x="98" y="142" font-size="10" fill="#333">Dấu trang</text><g transform="translate(70,220)"><rect width="80" height="80" rx="18" fill="#1a1326"/><text x="40" y="52" font-size="36" text-anchor="middle">⚗️</text></g><text x="110" y="325" font-size="11" text-anchor="middle" fill="#333">Biểu tượng trên màn hình chính</text>')}
          <ol><li>Mở link ứng dụng bằng <b>Chrome</b>.</li><li>Bấm nút <b>"📲 Cài ứng dụng ngay"</b> ở trên nếu có. Hoặc bấm menu <b>⋮</b> (góc trên phải), chọn <b>"Cài đặt ứng dụng"</b> hoặc <b>"Thêm vào màn hình chính"</b>.</li><li>Bấm <b>Cài đặt</b>. Biểu tượng ⚗️ xuất hiện trên màn hình chính.</li><li>Mở app một lần khi có mạng để tải dữ liệu offline.</li></ol></div>
        <div class="card ${ios ? '' : 'dim'}"><h3>🍎 iPhone / iPad (Safari)</h3>
          ${phoneSVG('<rect x="18" y="330" width="184" height="30" fill="#fff"/><rect x="98" y="335" width="22" height="20" rx="3" fill="none" stroke="#2b6de0" stroke-width="2"/><path d="M109 350 V337 M104 342 L109 337 L114 342" stroke="#2b6de0" stroke-width="2" fill="none"/><rect x="30" y="180" width="160" height="140" rx="10" fill="#fff" stroke="#ddd"/><text x="42" y="204" font-size="10" fill="#333">Sao chép</text><text x="42" y="228" font-size="10" fill="#333">Thêm vào Danh sách đọc</text><rect x="36" y="238" width="148" height="22" rx="5" fill="#fbf1d6"/><text x="42" y="253" font-size="10" fill="#1a1326">➕ Thêm vào MH chính</text><text x="42" y="282" font-size="10" fill="#333">Đánh dấu</text>')}
          <ol><li>Mở link ứng dụng bằng <b>Safari</b> (bắt buộc trên iPhone).</li><li>Bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên lên) ở thanh dưới.</li><li>Kéo xuống, chọn <b>"Thêm vào MH chính"</b> (Add to Home Screen), rồi bấm <b>Thêm</b>.</li><li>Mở app một lần khi có mạng để tải dữ liệu offline.</li></ol></div>
      </div>
      <div class="card"><h3>💻 Máy tính (Chrome / Edge)</h3><p>Bấm biểu tượng <b>cài đặt</b> (màn hình có mũi tên) ở cuối thanh địa chỉ, hoặc menu ⋮ → <b>"Cài đặt Phù thủy…"</b>.</p>
      <h3>❓ Gặp sự cố</h3><ul class="small"><li>Không thấy mục "Cài đặt ứng dụng": hãy mở bằng Chrome (Android) hoặc Safari (iPhone), không mở trong trình duyệt của Facebook hay Zalo. Bấm ⋯ → "Mở bằng trình duyệt".</li><li>Offline không chạy: mở app khi có mạng, đợi trang này báo "Đã sẵn sàng chạy offline".</li><li>Muốn cập nhật bản mới: mở app khi có mạng, đóng hẳn rồi mở lại.</li><li>Font chữ đã đóng gói sẵn trong app nên hiển thị đẹp cả khi offline.</li></ul></div></div>`);
    const ib = $('#installBtn'); if (ib) ib.onclick = async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; views.install(); };
  };

  /* ---------- HƯỚNG DẪN ---------- */
  views.guide = () => view('guide', `<div class="wrap"><h2 class="sec">🧭 Hướng dẫn sử dụng</h2><div class="grid2">
    <div class="card"><h3>1. Nhận nhiệm vụ</h3><p>Vào <b>🧪 Nhiệm vụ</b>, chọn nhiệm vụ đã mở khoá. Mỗi nhiệm vụ cho biết nguyên liệu đầu vào và mục tiêu cần đạt.</p></div>
    <div class="card"><h3>2. Mặc đồ bảo hộ</h3><p>Bước đầu luôn là chọn đồ bảo hộ. Chọn thiếu hoặc chọn bậy thì bị trừ <b>điểm An toàn</b>.</p></div>
    <div class="card"><h3>3. Chọn phép cho từng bước</h3><ul><li><span class="tag ok">Đúng</span> Cảnh 3D chạy phản ứng, hiện phương trình và lời giải thích.</li><li><span class="tag meh">Tạm được</span> Đi tiếp được nhưng bị trừ chất lượng hoặc thu hồi.</li><li><span class="tag bad">Sai</span> Bị trừ điểm, đọc giải thích rồi chọn lại.</li></ul><p>Với thanh trượt (số lần rửa, thời gian, dòng điện…), giá trị càng sát thực tế thì kết quả càng tốt.</p></div>
    <div class="card"><h3>4. Ba chỉ số</h3><ul><li><b>${Object.values(P.metrics)[0].label}</b> quyết định hạng thành phẩm (S → D).</li><li><b>Thu hồi</b>: phần trăm kim loại giữ lại được.</li><li><b>An toàn</b>: về 0 là thí nghiệm bị dừng.</li></ul></div>
    <div class="card"><h3>5. Lên cấp</h3><p>XP = kết quả tốt nhất mỗi nhiệm vụ + chương đã đọc (+5) + Thử thách (+10/câu). Cấp bậc: ${RANKS.map(r => r.t).join(' → ')}.</p></div>
    <div class="card"><h3>6. 📜 Bí kíp</h3><p>${F.lockedText} Khi đạt, bạn nhận <b>chứng nhận</b> có tên mình${F.pdf ? ' và (nếu đủ 18 tuổi) được tải <b>Bí kíp PDF</b>' : ''}.</p></div>
    <div class="card"><h3>7. Học thêm</h3><ul><li><b>📖 Sách phép</b>: lý thuyết chi tiết. Trong nhiệm vụ, bấm "📖 Đọc phép này" để mở đúng chương.</li><li><b>🧊 Phòng 3D</b>: xem trọn quy trình, tự chạy từng bước.</li>${Object.values(P.views || {}).map(v => `<li><b>${v.nav}</b></li>`).join('')}</ul></div>
    <div class="card"><h3>8. Cài ra màn hình & offline</h3><p>Xem trang <a href="#install">📲 Cài đặt</a>.</p></div>
    <div class="card"><h3>9. Lưu tiến trình</h3><p>Tiến trình lưu trong trình duyệt của máy này. Xoá dữ liệu trình duyệt sẽ mất tiến trình.</p><button class="btnlight" id="resetBtn">🗑️ Xoá tiến trình</button></div></div></div>`)
    .querySelector('#resetBtn').onclick = function () { if (this.dataset.c) { S = Object.assign(blank(), { agreed: true }); save(); renderRank(); buildNav(); toast('Đã xoá tiến trình'); delete this.dataset.c; this.textContent = '🗑️ Xoá tiến trình'; } else { this.dataset.c = 1; this.textContent = 'Bấm lần nữa để xác nhận xoá'; } };

  views.safety = () => view('safety', `<div class="wrap">${P.pages.safety}</div>`);
  views.disclaimer = () => view('disclaimer', `<div class="wrap narrow">${P.pages.disclaimer}</div>`);

  /* ---------- LẦN ĐẦU MỞ APP ---------- */
  function firstRun() {
    const b = modal(`<img src="${M.logo}" class="fin-logo sm" alt=""><h2>Chào mừng tới ${M.title}</h2>
      <div class="teaser in-modal"><span class="tz-ic">📜</span><span>${M.teaser}</span></div>
      <p>Trước khi bước vào phòng thí nghiệm, hãy đọc và đồng ý:</p>
      <ul><li>Đây là <b>trò chơi giáo dục</b> mô phỏng hoá học, <b>không</b> phải hướng dẫn để tự làm tại nhà.</li>
      <li>Hoá chất thật có thể gây <b>thương tích nặng hoặc tử vong</b>.</li>
      <li>Số liệu chỉ để tham khảo. Tác giả không chịu trách nhiệm về việc áp dụng ngoài đời thực.</li>
      <li>Người dưới 18 tuổi chỉ học lý thuyết, có người lớn hoặc giáo viên giám sát.</li></ul>
      <label class="agree"><input type="checkbox" id="agreeChk"> Tôi đã đọc và đồng ý với <a href="#" id="mLegal">thông tin miễn trừ</a> và các lưu ý an toàn.</label>
      <label class="small">Tên phù thủy của bạn (để in lên chứng nhận, có thể bỏ trống): <input id="mName" maxlength="40" value="${esc(S.name)}"></label>
      <div class="row gap" style="margin-top:12px"><button class="btn gold" id="agreeBtn" disabled>Vào học viện ✨</button></div>`);
    b.dataset.locked = '1';
    $('#agreeChk').onchange = e => $('#agreeBtn').disabled = !e.target.checked;
    $('#agreeBtn').onclick = () => { S.agreed = true; S.name = $('#mName').value.trim(); save(); closeModal(); };
    $('#mLegal').onclick = e => { e.preventDefault(); if (!b.querySelector('.legal-in')) b.insertAdjacentHTML('beforeend', `<div class="legal-in small">${P.pages.disclaimer}</div>`); };
  }

  window.APP = { open3D: p => { location.hash = '#lab3d-' + p; }, toast, state: () => S };
  buildNav(); renderRank(); route();
  if (!S.agreed) firstRun();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
