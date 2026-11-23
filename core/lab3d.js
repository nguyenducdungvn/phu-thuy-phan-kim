/* Lab3D — mô phỏng 3D phòng thí nghiệm phân kim (Three.js r128)
   Dùng: const lab = new Lab3D(containerEl); lab.set({lvl:.5, liq:'#3d8fd6', ...}); */
(function () {
  'use strict';
  const BR = 1.05, BH = 2.5;
  const COL = {
    clear: '#dfeef7', blue: '#3d8fd6', blueL: '#8ec5ee', green: '#2f9a68', greenL: '#bfe3b4',
    fe2: '#c9e7b8', gold: '#f1b92a', goldL: '#f5d77a', amber: '#e7d6a2', naoh: '#eef3f6',
    sugar: '#f3e8c8', fe3: '#d9a441', zn: '#e9eef0', niGreen: '#9fc98a'
  };
  const PREC = { white: '#f5f5f2', ag2o: '#3a2a1e', ag: '#7d8186', au: '#7b4b1d', cu: '#b5602e', black: '#202020', w: '#8f8a6a', mud: '#55585c' };
  const DEF = { lvl: 0, liq: COL.clear, chunk: null, chunkS: 1, nail: false, nailS: 1, coat: null, bub: 0, fume: null,
    prec: PREC.white, precN: 0, heat: false, melt: null, funnel: false, flakes: 0, floatGold: 0, wool: false, zinc: false, zincS: 1,
    elec: false, anode: '#b87333', cathode: '#8a9098', cathodeCoat: null, anodeS: 1, volts: 0, amps: 0 };

  class Lab3D {
    constructor(el) {
      this.el = el; this.ok = typeof THREE !== 'undefined';
      this.tgt = Object.assign({}, DEF); this.theta = 0.6; this.phi = 1.12; this.dist = 7.2;
      if (!this.ok) { el.insertAdjacentHTML('beforeend', '<div class="nogl">Không tải được thư viện 3D (vendor/three.min.js).</div>'); return; }
      try { this._init(); } catch (e) { this.ok = false; el.insertAdjacentHTML('beforeend', '<div class="nogl">Trình duyệt không hỗ trợ WebGL.</div>'); }
    }
    set(s) { this.tgt = Object.assign({}, DEF, s || {}); }
    _init() {
      const T = THREE, el = this.el, o = this.o = {};
      const R = this.R = new T.WebGLRenderer({ antialias: true, alpha: true });
      R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      el.prepend(R.domElement);
      const sc = this.scene = new T.Scene();
      this.cam = new T.PerspectiveCamera(38, 1, 0.1, 100);
      sc.add(new T.HemisphereLight(0xdfe8ff, 0x2a2018, 0.75));
      const dl = new T.DirectionalLight(0xffffff, 0.9); dl.position.set(4, 7, 5); sc.add(dl);
      const dl2 = new T.DirectionalLight(0xffd9a0, 0.35); dl2.position.set(-5, 3, -3); sc.add(dl2);
      o.heatLight = new T.PointLight(0xff5522, 0, 4); o.heatLight.position.set(0, -0.05, 0); sc.add(o.heatLight);
      const bench = new T.Mesh(new T.BoxGeometry(9, 0.2, 6), new T.MeshStandardMaterial({ color: 0x2c3138, roughness: .85 }));
      bench.position.y = -0.6; sc.add(bench);
      // bếp
      const hp = new T.Group();
      const body = new T.Mesh(new T.BoxGeometry(2.8, 0.38, 2.8), new T.MeshStandardMaterial({ color: 0xd8dbe0, roughness: .5, metalness: .2 }));
      body.position.y = -0.31; hp.add(body);
      o.plate = new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 0.05, 48), new T.MeshStandardMaterial({ color: 0x333333, roughness: .6, emissive: 0xff3300, emissiveIntensity: 0 }));
      o.plate.position.y = -0.1; hp.add(o.plate);
      const knob = new T.Mesh(new T.CylinderGeometry(.13, .13, .12, 20), new T.MeshStandardMaterial({ color: 0x222222 }));
      knob.rotation.x = Math.PI / 2; knob.position.set(.9, -.31, 1.43); hp.add(knob);
      o.hp = hp; sc.add(hp);
      // cốc
      const bk = new T.Group();
      const glass = new T.MeshStandardMaterial({ color: 0xcfe6ff, transparent: true, opacity: .18, roughness: .05, metalness: .1, side: T.DoubleSide, depthWrite: false });
      const wall = new T.Mesh(new T.CylinderGeometry(BR, BR, BH, 48, 1, true), glass); wall.position.y = BH / 2 - 0.07; wall.renderOrder = 3; bk.add(wall);
      const bottom = new T.Mesh(new T.CircleGeometry(BR, 48), glass); bottom.rotation.x = -Math.PI / 2; bottom.position.y = -0.065; bk.add(bottom);
      const rim = new T.Mesh(new T.TorusGeometry(BR, 0.03, 10, 60), new T.MeshStandardMaterial({ color: 0xe8f3ff, transparent: true, opacity: .5 }));
      rim.rotation.x = Math.PI / 2; rim.position.y = BH - 0.07; bk.add(rim);
      for (let i = 1; i <= 4; i++) { const m = new T.Mesh(new T.BoxGeometry(.25, .012, .01), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .5 })); m.position.set(0, i * 0.48, BR + 0.002); bk.add(m); }
      o.liqMat = new T.MeshStandardMaterial({ color: 0xdfeef7, transparent: true, opacity: .62, roughness: .15, depthWrite: false });
      const lg = new T.CylinderGeometry(BR - 0.03, BR - 0.03, 1, 48); lg.translate(0, .5, 0);
      o.liq = new T.Mesh(lg, o.liqMat); o.liq.position.y = -0.06; o.liq.renderOrder = 2; bk.add(o.liq);
      o.surf = new T.Mesh(new T.CircleGeometry(BR - 0.03, 48), new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .25, depthWrite: false }));
      o.surf.rotation.x = -Math.PI / 2; bk.add(o.surf);
      o.bk = bk; sc.add(bk);
      // kim loại cục
      o.metalAg = new T.MeshStandardMaterial({ color: 0xe4e8ee, metalness: .55, roughness: .3, emissive: 0x222428 });
      o.metalAu = new T.MeshStandardMaterial({ color: 0xf2c14e, metalness: .6, roughness: .3, emissive: 0x2a1c00 });
      o.metalWAu = new T.MeshStandardMaterial({ color: 0xeee9dc, metalness: .55, roughness: .3, emissive: 0x222222 });
      o.chunks = new T.Group();
      for (let i = 0; i < 9; i++) {
        const m = new T.Mesh(new T.DodecahedronGeometry(0.16 + Math.random() * 0.08, 0), o.metalAg);
        const a = i / 9 * Math.PI * 2, r = 0.25 + Math.random() * 0.45;
        m.position.set(Math.cos(a) * r, 0.06, Math.sin(a) * r); m.rotation.set(Math.random(), Math.random() * 3, Math.random());
        o.chunks.add(m);
      }
      bk.add(o.chunks);
      // phế liệu điện tử
      o.pins = new T.Group();
      const pcbM = new T.MeshStandardMaterial({ color: 0x2e7d32, roughness: .7 });
      for (let i = 0; i < 7; i++) {
        const g = new T.Group();
        g.add(new T.Mesh(new T.BoxGeometry(.75, .04, .32), pcbM));
        for (let k = 0; k < 8; k++) { const f = new T.Mesh(new T.BoxGeometry(.06, .045, .14), o.metalAu); f.position.set(-.31 + k * .088, .003, .1); g.add(f); }
        g.position.set((Math.random() - .5) * 1.1, 0.04 + i * 0.05, (Math.random() - .5) * 1.0); g.rotation.y = Math.random() * 3; g.rotation.z = (Math.random() - .5) * .3;
        o.pins.add(g);
      }
      bk.add(o.pins);
      // đinh sắt
      o.nailMat = new T.MeshStandardMaterial({ color: 0x8a9098, metalness: .85, roughness: .38 });
      const mkNail = () => {
        const n = new T.Group();
        n.add(new T.Mesh(new T.CylinderGeometry(.07, .07, 2.1, 16), o.nailMat));
        const tip = new T.Mesh(new T.ConeGeometry(.07, .22, 16), o.nailMat); tip.position.y = -1.16; tip.rotation.x = Math.PI; n.add(tip);
        const head = new T.Mesh(new T.CylinderGeometry(.2, .2, .06, 24), o.nailMat); head.position.y = 1.06; n.add(head);
        return n;
      };
      const n1 = mkNail(), n2 = mkNail(); n1.position.set(-.25, 1.05, .1); n1.rotation.z = .32; n2.position.set(.35, 1.0, -.2); n2.rotation.z = -.28; n2.rotation.x = .15;
      o.nail = new T.Group(); o.nail.add(n1, n2); bk.add(o.nail);
      // kẽm lá
      o.znMat = new T.MeshStandardMaterial({ color: 0xc9d3da, metalness: .8, roughness: .35, side: T.DoubleSide });
      o.zinc = new T.Group();
      for (let i = 0; i < 6; i++) {
        const z = new T.Mesh(new T.BoxGeometry(.08, 1.6 + Math.random() * .4, .02), o.znMat);
        z.position.set(-.5 + i * .2, .95, (Math.random() - .5) * .5); z.rotation.set((Math.random() - .5) * .3, Math.random() * 3, (Math.random() - .5) * .5);
        o.zinc.add(z);
      }
      bk.add(o.zinc);
      // bùi nhùi thép
      o.woolMat = new T.MeshStandardMaterial({ color: 0x8d9399, metalness: .8, roughness: .5, wireframe: true });
      o.wool = new T.Group();
      for (let i = 0; i < 3; i++) { const w = new T.Mesh(new T.TorusKnotGeometry(.42, .12, 90, 8, 2 + i, 3), o.woolMat); w.position.set((i - 1) * .25, .75 + i * .15, (i % 2) * .15); w.rotation.set(i, i * 2, 0); o.wool.add(w); }
      bk.add(o.wool);
      // lá vàng & vàng nổi
      o.flakes = []; const fm = new T.MeshStandardMaterial({ color: 0xf5c84c, metalness: 1, roughness: .3, side: T.DoubleSide });
      for (let i = 0; i < 40; i++) { const f = new T.Mesh(new T.PlaneGeometry(.09 + Math.random() * .07, .05 + Math.random() * .05), fm); f.userData = { a: Math.random() * 6.28, r: Math.random() * .85, y: Math.random(), sp: .2 + Math.random() * .5 }; bk.add(f); o.flakes.push(f); }
      o.floatMat = new T.MeshStandardMaterial({ color: 0x9a6a2a, metalness: .6, roughness: .5, transparent: true, opacity: 0, depthWrite: false });
      o.floatFilm = new T.Mesh(new T.RingGeometry(.55, BR - .05, 48), o.floatMat); o.floatFilm.rotation.x = -Math.PI / 2; bk.add(o.floatFilm);
      // kết tủa
      const PN = this.PN = 420;
      o.precMat = new T.MeshStandardMaterial({ color: 0xf5f5f2, roughness: .9 });
      o.prec = new T.InstancedMesh(new T.IcosahedronGeometry(.055, 0), o.precMat, PN);
      o.precData = [];
      for (let i = 0; i < PN; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (BR - .12);
        const mound = 0.33 * (1 - (r / BR) ** 2) * (i / PN) + Math.random() * .03;
        o.precData.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, ty: -0.02 + mound, y: 1.6, v: 0, s: .7 + Math.random() * .7 });
      }
      o.prec.count = 0; bk.add(o.prec); o.dummy = new T.Object3D(); this.precVisible = 0;
      // bọt khí
      o.bubbles = []; const bm = new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .55, roughness: .1 });
      for (let i = 0; i < 70; i++) { const b = new T.Mesh(new T.SphereGeometry(.03 + Math.random() * .03, 8, 6), bm); b.visible = false; b.userData = { alive: false }; bk.add(b); o.bubbles.push(b); }
      // khói
      o.fumes = [];
      for (let i = 0; i < 46; i++) { const m = new T.MeshStandardMaterial({ color: 0x7a3414, transparent: true, opacity: 0, depthWrite: false, roughness: 1 }); const f = new T.Mesh(new T.SphereGeometry(.22, 12, 10), m); f.userData = { alive: false }; f.visible = false; bk.add(f); o.fumes.push(f); }
      // phễu lọc
      const fun = new T.Group();
      const cone = new T.Mesh(new T.CylinderGeometry(.9, .08, 1.0, 40, 1, true), new T.MeshStandardMaterial({ color: 0xd6ecff, transparent: true, opacity: .25, side: T.DoubleSide, depthWrite: false }));
      fun.add(cone);
      const paper = new T.Mesh(new T.ConeGeometry(.82, .9, 40, 1, true), new T.MeshStandardMaterial({ color: 0xf7f3ea, side: T.DoubleSide, roughness: 1 }));
      paper.rotation.x = Math.PI; paper.position.y = .05; fun.add(paper);
      const stem = new T.Mesh(new T.CylinderGeometry(.07, .05, .9, 16), cone.material); stem.position.y = -.92; fun.add(stem);
      fun.position.y = BH + 0.55; o.funnel = fun; bk.add(fun);
      o.drip = new T.Mesh(new T.SphereGeometry(.05, 10, 8), o.liqMat); bk.add(o.drip);

      // điện phân / mạ điện: 2 điện cực + nguồn
      o.elec = new T.Group();
      o.anMat = new T.MeshStandardMaterial({ color: 0xb87333, metalness: .6, roughness: .35 });
      o.caMat = new T.MeshStandardMaterial({ color: 0x8a9098, metalness: .6, roughness: .35 });
      o.anode = new T.Mesh(new T.BoxGeometry(.5, 2.1, .05), o.anMat); o.anode.position.set(-.55, 1.15, 0); o.elec.add(o.anode);
      o.cathode = new T.Mesh(new T.BoxGeometry(.5, 2.1, .05), o.caMat); o.cathode.position.set(.55, 1.15, 0); o.elec.add(o.cathode);
      const rod = new T.Mesh(new T.CylinderGeometry(.03, .03, 2.6, 8), new T.MeshStandardMaterial({ color: 0x444444 })); rod.rotation.z = Math.PI / 2; rod.position.set(0, BH + .15, 0); o.elec.add(rod);
      const wireM = (c) => new T.MeshStandardMaterial({ color: c, roughness: .6 });
      const mkWire = (x, c) => { const cv = new T.CatmullRomCurve3([new T.Vector3(x, 2.2, 0), new T.Vector3(x, BH + .6, 0), new T.Vector3(x * 1.2 + 1.4, BH + .3, .5), new T.Vector3(1.75, .15, .75)]); return new T.Mesh(new T.TubeGeometry(cv, 30, .025, 6), wireM(c)); };
      o.elec.add(mkWire(-.55, 0xd62828)); o.elec.add(mkWire(.55, 0x222222));
      const psu = new T.Group();
      psu.add(new T.Mesh(new T.BoxGeometry(1.2, .7, .8), new T.MeshStandardMaterial({ color: 0x2b4c7e, roughness: .5 })));
      o.lcdCanvas = document.createElement('canvas'); o.lcdCanvas.width = 256; o.lcdCanvas.height = 96;
      o.lcdTex = new T.CanvasTexture(o.lcdCanvas);
      const lcd = new T.Mesh(new T.PlaneGeometry(.9, .34), new T.MeshBasicMaterial({ map: o.lcdTex })); lcd.position.set(0, .08, .401); psu.add(lcd);
      psu.position.set(2.25, -.15, .75); psu.rotation.y = .32; o.elec.add(psu);
      o.elec.visible = false; sc.add(o.elec); this._lcd = '';
      // nấu chảy
      const mg = new T.Group();
      const brick = new T.Mesh(new T.BoxGeometry(2.2, .5, 1.6), new T.MeshStandardMaterial({ color: 0xd9cdb8, roughness: 1 })); brick.position.y = -.25; mg.add(brick);
      const pts = []; for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(new T.Vector2(.45 + .4 * t, t * .55)); }
      const cruM = new T.MeshStandardMaterial({ color: 0x3a3a3a, roughness: .8, side: T.DoubleSide, emissive: 0xff4400, emissiveIntensity: .15 });
      mg.add(new T.Mesh(new T.LatheGeometry(pts, 40), cruM));
      const cb = new T.Mesh(new T.CircleGeometry(.45, 30), cruM); cb.rotation.x = -Math.PI / 2; cb.position.y = .01; mg.add(cb);
      o.beadMat = new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .12, emissive: 0xff7a1a, emissiveIntensity: 1 });
      o.bead = new T.Mesh(new T.SphereGeometry(.42, 32, 24), o.beadMat); o.bead.scale.y = .45; o.bead.position.y = .3; mg.add(o.bead);
      o.flame = new T.Group();
      for (let i = 0; i < 3; i++) { const f = new T.Mesh(new T.ConeGeometry(.12 - i * .03, .9 - i * .2, 16), new T.MeshBasicMaterial({ color: [0x4f7dff, 0x9ec0ff, 0xffffff][i], transparent: true, opacity: .55 - i * .1, depthWrite: false })); f.rotation.z = Math.PI / 2 + .5; o.flame.add(f); }
      o.flame.position.set(1.05, .8, 0);
      const torch = new T.Mesh(new T.CylinderGeometry(.08, .1, 1.2, 16), new T.MeshStandardMaterial({ color: 0x777777, metalness: .8, roughness: .3 })); torch.rotation.z = Math.PI / 2 + .5; torch.position.set(1.85, 1.3, 0); mg.add(torch);
      mg.add(o.flame);
      o.meltLight = new T.PointLight(0xff8833, 1.8, 5); o.meltLight.position.set(0, 1, 0); mg.add(o.meltLight);
      const mold = new T.Mesh(new T.BoxGeometry(1.1, .25, .5), new T.MeshStandardMaterial({ color: 0x444a52, metalness: .6, roughness: .5 })); mold.position.set(-1.9, -.37, .6); mg.add(mold);
      o.ingot = new T.Mesh(new T.BoxGeometry(.85, .12, .3), o.metalAg); o.ingot.position.set(-1.9, -.2, .6); mg.add(o.ingot);
      o.melt = mg; mg.visible = false; sc.add(mg);

      this.cur = Object.assign({}, DEF, { liqC: new T.Color(COL.clear), precC: new T.Color(PREC.white), coatC: new T.Color(0x8a9098), heatV: 0, floatV: 0 });
      this.clock = new T.Clock();
      // điều khiển
      let drag = false, px = 0, py = 0; const c = R.domElement;
      c.style.touchAction = 'none';
      c.addEventListener('pointerdown', e => { drag = true; px = e.clientX; py = e.clientY; try { c.setPointerCapture(e.pointerId); } catch (_) { } });
      c.addEventListener('pointermove', e => { if (!drag) return; this.theta -= (e.clientX - px) * 0.008; this.phi = Math.max(.35, Math.min(1.5, this.phi - (e.clientY - py) * 0.006)); px = e.clientX; py = e.clientY; });
      c.addEventListener('pointerup', () => { drag = false; });
      c.addEventListener('wheel', e => { e.preventDefault(); this.dist = Math.max(4, Math.min(13, this.dist + e.deltaY * 0.005)); }, { passive: false });
      if (window.ResizeObserver) new ResizeObserver(() => this._resize()).observe(el);
      this._resize();
      const loop = () => { requestAnimationFrame(loop); if (el.offsetParent !== null) this._tick(); };
      requestAnimationFrame(loop);
    }
    _resize() { if (!this.R) return; const w = this.el.clientWidth || 400, h = this.el.clientHeight || 300; this.R.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); }
    _tick() {
      const T = THREE, o = this.o, cur = this.cur, tg = this.tgt;
      const dt = Math.min(.05, this.clock.getDelta()), t = this.clock.elapsedTime, k = 1 - Math.pow(.03, dt);
      const lerp = (a, b, u) => a + (b - a) * u;
      const cam = this.cam, ph = this.phi, th = this.theta, d = this.dist;
      cam.position.set(d * Math.sin(ph) * Math.sin(th), 1 + d * Math.cos(ph), d * Math.sin(ph) * Math.cos(th)); cam.lookAt(0, 1, 0);
      const melting = !!tg.melt;
      o.melt.visible = melting; o.bk.visible = !melting; o.hp.visible = !melting;
      if (melting) {
        const isAu = tg.melt === 'au';
        o.bead.scale.x = o.bead.scale.z = 1 + Math.sin(t * 3) * .03;
        o.beadMat.color.set(isAu ? 0xffd36a : 0xf0f2f5); o.beadMat.emissive.set(isAu ? 0xff8a1a : 0xff6a10);
        o.beadMat.emissiveIntensity = .55 + Math.sin(t * 5) * .15;
        o.ingot.material = isAu ? o.metalAu : o.metalAg;
        o.flame.children.forEach((f, i) => { f.scale.y = 1 + Math.sin(t * 30 + i) * .08; });
        o.meltLight.intensity = 1.6 + Math.sin(t * 20) * .2;
      }
      cur.lvl = lerp(cur.lvl, tg.lvl, k);
      const lh = Math.max(0.001, cur.lvl * BH * 0.92);
      o.liq.scale.y = lh; o.liq.visible = cur.lvl > 0.01;
      o.surf.position.y = -0.06 + lh + 0.001; o.surf.visible = o.liq.visible;
      cur.liqC.lerp(new T.Color(tg.liq), k); o.liqMat.color.copy(cur.liqC); o.surf.material.color.copy(cur.liqC).offsetHSL(0, 0, .15);
      cur.heatV = lerp(cur.heatV, tg.heat ? 1 : 0, k * .6);
      o.plate.material.emissiveIntensity = cur.heatV * (.55 + Math.sin(t * 4) * .08); o.heatLight.intensity = cur.heatV * 1.2;
      cur.chunkS = lerp(cur.chunkS, tg.chunk ? tg.chunkS : 0, k * .5);
      const isMetalChunk = tg.chunk === 'ag' || tg.chunk === 'au' || tg.chunk === 'wau';
      o.chunks.visible = isMetalChunk && cur.chunkS > 0.02;
      if (o.chunks.visible) { const mm = tg.chunk === 'au' ? o.metalAu : tg.chunk === 'wau' ? o.metalWAu : o.metalAg; o.chunks.children.forEach(m => { m.material = mm; m.scale.set(1.3 * cur.chunkS, .55 * cur.chunkS, cur.chunkS); }); }
      o.pins.visible = tg.chunk === 'pins';
      if (o.pins.visible) o.pins.children.forEach(g => g.scale.setScalar(.4 + .6 * Math.min(1, cur.chunkS)));
      o.nail.visible = tg.nail;
      cur.nailS = lerp(cur.nailS, tg.nail ? tg.nailS : 1, k * .4);
      o.nail.children.forEach(n => { n.scale.x = n.scale.z = cur.nailS; });
      cur.coatC.lerp(new T.Color(tg.coat || '#8a9098'), k * .35);
      o.nailMat.color.copy(cur.coatC); o.woolMat.color.copy(cur.coatC);
      o.wool.visible = tg.wool;
      o.zinc.visible = tg.zinc;
      if (tg.zinc) { o.znMat.color.copy(new T.Color(tg.coat || '#c9d3da')); o.zinc.children.forEach(z => { z.scale.x = tg.zincS; }); }
      cur.precC.lerp(new T.Color(tg.prec), k * .5); o.precMat.color.copy(cur.precC);
      const want = Math.round(tg.precN * this.PN);
      if (want > this.precVisible) for (let i = this.precVisible; i < want; i++) { const p = o.precData[i]; p.y = Math.max(p.ty, lh * .9 + Math.random() * .2); p.v = 0; }
      this.precVisible = want; o.prec.count = want;
      for (let i = 0; i < want; i++) {
        const p = o.precData[i];
        if (p.y > p.ty) { p.v += dt * (0.6 + Math.random() * .4); p.y = Math.max(p.ty, p.y - p.v * dt * 1.5); }
        o.dummy.position.set(p.x, p.y, p.z); o.dummy.scale.setScalar(p.s); o.dummy.rotation.set(i, i * .7, 0); o.dummy.updateMatrix(); o.prec.setMatrixAt(i, o.dummy.matrix);
      }
      o.prec.instanceMatrix.needsUpdate = true;
      const nf = Math.round(tg.flakes * o.flakes.length);
      o.flakes.forEach((f, i) => { f.visible = i < nf && cur.lvl > .05; if (!f.visible) return; const u = f.userData; u.a += dt * u.sp * .4; f.position.set(Math.cos(u.a) * u.r, (.15 + u.y * .75) * lh, Math.sin(u.a) * u.r); f.rotation.set(t * u.sp, u.a, t * .3); });
      cur.floatV = lerp(cur.floatV, tg.floatGold, k * .5);
      o.floatFilm.position.y = -0.06 + lh + 0.004; o.floatMat.opacity = cur.floatV * .85; o.floatFilm.visible = cur.floatV > .02 && cur.lvl > .05;
      o.floatFilm.rotation.z = t * .05;
      o.bubbles.forEach(b => {
        const u = b.userData;
        if (!u.alive) { if (tg.bub > 0 && cur.lvl > .05 && Math.random() < tg.bub * dt * 6) { u.alive = true; const a = Math.random() * 6.28, r = Math.random() * (BR - .2); b.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r); u.v = .4 + Math.random() * .6; b.visible = true; } }
        else { b.position.y += u.v * dt; if (b.position.y > lh - .03) { u.alive = false; b.visible = false; } }
      });
      const fcol = tg.fume === 'no2' ? 0x7a3414 : tg.fume === 'cl2' ? 0xc9d65a : tg.fume === 'smoke' ? 0x555555 : 0xdddddd;
      o.fumes.forEach(f => {
        const u = f.userData;
        if (!u.alive) { if (tg.fume && Math.random() < dt * 5) { u.alive = true; u.age = 0; f.visible = true; const a = Math.random() * 6.28, r = Math.random() * .6; f.position.set(Math.cos(a) * r, Math.max(lh, .3) + .05, Math.sin(a) * r); u.vx = (Math.random() - .5) * .25; u.vz = (Math.random() - .5) * .25; f.material.color.setHex(fcol); } }
        else { u.age += dt; f.position.y += dt * (.55 + u.age * .2); f.position.x += u.vx * dt; f.position.z += u.vz * dt; f.scale.setScalar(.4 + u.age * 1.1); f.material.opacity = Math.max(0, .3 * (1 - u.age / 3.2)); if (u.age > 3.2) { u.alive = false; f.visible = false; } }
      });

      o.elec.visible = !!tg.elec && !melting;
      if (o.elec.visible) {
        o.anMat.color.set(tg.anode); o.anode.scale.x = lerp(o.anode.scale.x, tg.anodeS, k * .3);
        cur.caC = cur.caC || new T.Color(tg.cathode); cur.caC.lerp(new T.Color(tg.cathodeCoat || tg.cathode), k * .25); o.caMat.color.copy(cur.caC);
        const txt = tg.volts ? `${tg.volts.toFixed(1)}V  ${tg.amps.toFixed(2)}A` : 'OFF';
        if (txt !== this._lcd) { const g = o.lcdCanvas.getContext('2d'); g.fillStyle = '#0b1a0b'; g.fillRect(0, 0, 256, 96); g.fillStyle = tg.volts ? '#6cff6c' : '#3a5a3a'; g.font = 'bold 40px monospace'; g.textAlign = 'center'; g.fillText(txt, 128, 62); o.lcdTex.needsUpdate = true; this._lcd = txt; }
      }
      o.funnel.visible = tg.funnel; o.drip.visible = tg.funnel;
      if (tg.funnel) { const p = (t * 1.4) % 1; o.drip.position.set(0, BH + .55 - 1.4 - p * (BH + .55 - 1.4 - lh), 0); }
      this.R.render(this.scene, cam);
    }
  }
  Lab3D.COL = COL; Lab3D.PREC = PREC;
  window.Lab3D = Lab3D;
})();
