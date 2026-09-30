/* =========================================================
   CURAIM 2nd Anniversary LP
   ========================================================= */

/* ---- 申込フォームのURLが決まったらここに入れてください ---- */
const CONFIG = {
  entryUrl: 'https://liff.line.me/2007322339-mwM0JJGp/landing?follow=%40630kphsw&lp=GRL2Mn&liff_id=2007322339-mwM0JJGp',   // 参加申込
  sponsorUrl: 'https://liff.line.me/2007322339-mwM0JJGp/landing?follow=%40630kphsw&lp=GRL2Mn&liff_id=2007322339-mwM0JJGp', // 協賛申込
  eventDate: '2027-01-23T13:00:00+09:00',
};

(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = $$('.sec');
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------------- CTA links ---------------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  $$('[data-cta]').forEach((a) => {
    const url = a.dataset.cta === 'sponsor' ? CONFIG.sponsorUrl : CONFIG.entryUrl;
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    } else if (a.getAttribute('href') === '#') {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('お申込みフォームは近日公開予定です');
      });
    }
  });

  /* ---------------- navigation lists ---------------- */
  const drawerList = $('.dr-list');
  const dots = $('.dots');
  const ftNav = $('.ft-nav ul');
  sections.forEach((sec, i) => {
    const n = pad(i + 1);
    const { en, ja } = sec.dataset;
    const li = document.createElement('li');
    li.style.transitionDelay = `${0.15 + i * 0.035}s`;
    li.innerHTML = `<a href="#${sec.id}"><span class="n">${n}</span><span class="en">${en}</span><span class="ja">${ja}</span></a>`;
    drawerList.appendChild(li);

    const dli = document.createElement('li');
    dli.innerHTML = `<button type="button" data-label="${n} ${en}" aria-label="${en}へ移動"></button>`;
    dli.firstChild.addEventListener('click', () => sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
    dots.appendChild(dli);

    const fli = document.createElement('li');
    fli.innerHTML = `<a href="#${sec.id}"><span>${n}</span>${en}</a>`;
    ftNav.appendChild(fli);
  });

  /* ---------------- drawer ---------------- */
  const menuBtn = $('.hd-menu');
  const drawer = $('#drawer');
  const setDrawer = (open) => {
    document.body.classList.toggle('drawer-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    drawer.setAttribute('aria-hidden', !open);
    header.classList.remove('is-hidden');
  };
  menuBtn.addEventListener('click', () => setDrawer(!document.body.classList.contains('drawer-open')));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setDrawer(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });

  /* ---------------- countdown ---------------- */
  const target = new Date(CONFIG.eventDate).getTime();
  const cdEls = $$('[data-cd]');
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const v = {
      days: Math.floor(diff / 864e5),
      hours: pad(Math.floor(diff / 36e5) % 24),
      mins: pad(Math.floor(diff / 6e4) % 60),
      secs: pad(Math.floor(diff / 1e3) % 60),
    };
    cdEls.forEach((el) => { el.textContent = v[el.dataset.cd]; });
  };
  tick();
  setInterval(tick, 1000);

  /* =======================================================
     PARTICLES — one canvas per section, runs only on screen
     ======================================================= */
  const PALETTES = {
    blue: [[142, 197, 255], [185, 164, 255], [222, 236, 255]],
    warm: [[255, 214, 170], [255, 190, 150], [255, 236, 214], [255, 184, 214]],
    champagne: [[255, 236, 200], [240, 222, 186], [255, 250, 236]],
    gold: [[255, 220, 160], [255, 241, 212], [255, 200, 140]],
    pastel: [[142, 197, 255], [185, 164, 255], [255, 168, 207], [255, 255, 255]],
    snow: [[230, 240, 255], [205, 222, 255], [255, 255, 255]],
    petal: [[255, 255, 255], [255, 236, 244], [240, 244, 255]],
  };
  const spriteCache = new Map();
  const sprite = (rgb, soft) => {
    const key = rgb.join() + soft;
    if (spriteCache.has(key)) return spriteCache.get(key);
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    const [r, gg, b] = rgb;
    if (soft) {
      gr.addColorStop(0, `rgba(${r},${gg},${b},.9)`);
      gr.addColorStop(0.55, `rgba(${r},${gg},${b},.45)`);
      gr.addColorStop(0.8, `rgba(${r},${gg},${b},.12)`);
      gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    } else {
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.18, `rgba(${r},${gg},${b},.9)`);
      gr.addColorStop(0.45, `rgba(${r},${gg},${b},.18)`);
      gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    }
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    spriteCache.set(key, c);
    return c;
  };
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  class Particles {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.mode = canvas.dataset.particles;
      this.pal = PALETTES[canvas.dataset.hue] || PALETTES[this.mode] || PALETTES.pastel;
      const o = (canvas.dataset.origin || '').split(',').map(Number);
      this.origin = o.length === 2 ? { x: o[0] / 100, y: o[1] / 100 } : null;
      this.list = [];
      this.running = false;
      this.started = false;
      this.resize();
    }
    resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      this.w = this.c.clientWidth;
      this.h = this.c.clientHeight;
      this.c.width = this.w * dpr;
      this.c.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.unit = this.w / 400;
    }
    count() {
      return { snow: 46, petal: 26, bokeh: 34, dust: 70, bubble: 40, confetti: 60 }[this.mode] || 30;
    }
    spawn(initial) {
      const u = this.unit, w = this.w, h = this.h, m = this.mode;
      const p = { rgb: pick(this.pal), life: 0, t: rand(0, Math.PI * 2) };
      if (m === 'snow') {
        Object.assign(p, { x: rand(0, w), y: initial ? rand(0, h) : -20, vx: rand(-.15, .15), vy: rand(.2, .6), s: rand(2, 14) * u, a: rand(.15, .55), soft: true });
      } else if (m === 'petal') {
        Object.assign(p, { x: rand(0, w), y: initial ? rand(0, h) : -20, vx: rand(-.3, .2), vy: rand(.35, .8), s: rand(5, 11) * u, a: rand(.35, .75), rot: rand(0, 6.28), vr: rand(-.02, .02), petal: true });
      } else if (m === 'bokeh') {
        Object.assign(p, { x: rand(0, w), y: initial ? rand(0, h) : h + 40, vx: rand(-.12, .12), vy: rand(-.45, -.12), s: rand(8, 34) * u, a: rand(.08, .32), soft: true });
      } else if (m === 'dust') {
        if (this.origin && Math.random() < .7) {
          Object.assign(p, { x: this.origin.x * w + rand(-14, 14) * u, y: this.origin.y * h + rand(-90, 90) * u, vx: rand(-.9, .2), vy: rand(-.5, .1) });
        } else {
          Object.assign(p, { x: rand(0, w), y: initial ? rand(0, h) : h + 10, vx: rand(-.15, .15), vy: rand(-.6, -.15) });
        }
        Object.assign(p, { s: rand(2, 7) * u, a: rand(.4, 1) });
      } else if (m === 'bubble') {
        const ox = this.origin ? this.origin.x * w : w / 2, oy = this.origin ? this.origin.y * h : h / 2;
        const far = Math.random() < .45;
        Object.assign(p, { x: far ? rand(0, w) : ox + rand(-30, 30) * u, y: far ? (initial ? rand(0, h) : h + 10) : oy + rand(-10, 40) * u, vx: 0, vy: rand(-.9, -.35), s: rand(1.5, 4.5) * u, a: rand(.35, .8), ring: true, wob: rand(.3, 1) });
      } else if (m === 'confetti') {
        Object.assign(p, { x: rand(0, w), y: initial ? rand(0, h) : h + 10, vx: rand(-.2, .2), vy: rand(-.55, -.2), s: rand(2, 6) * u, a: rand(.35, .9) });
      }
      p.max = rand(360, 900);
      return p;
    }
    burst() {
      // finale: a luminous bloom of pastel ribbons from the title
      const u = this.unit, cx = this.w * .5, cy = this.h * .3;
      for (let i = 0; i < 110; i++) {
        const ang = rand(0, Math.PI * 2), sp = rand(1.5, 7.5) * u;
        this.list.push({
          rgb: pick(PALETTES.pastel), x: cx, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 2 * u,
          s: rand(3, 7) * u, a: rand(.6, 1), rot: rand(0, 6.28), vr: rand(-.15, .15), ribbon: true,
          g: .045 * u, drag: .975, life: 0, t: rand(0, 6), max: rand(220, 380), once: true,
        });
      }
    }
    start() {
      if (reduced) return;
      if (!this.started) {
        this.started = true;
        const n = this.count();
        for (let i = 0; i < n; i++) this.list.push(this.spawn(true));
        if (this.mode === 'confetti') this.burst();
      }
      if (this.running) return;
      this.running = true;
      const loop = () => {
        if (!this.running) return;
        this.draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }
    stop() {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
    draw() {
      const { ctx, w, h } = this;
      ctx.clearRect(0, 0, w, h);
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        p.life++;
        p.t += .03;
        if (p.g) { p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; }
        p.x += p.vx + (p.wob ? Math.sin(p.t * 2) * p.wob * .3 : 0) + (p.petal ? Math.sin(p.t) * .4 : 0);
        p.y += p.vy;
        const fadeIn = Math.min(1, p.life / 40);
        const fadeOut = Math.min(1, (p.max - p.life) / 60);
        let alpha = p.a * fadeIn * Math.max(0, fadeOut);
        if (this.mode === 'dust' || this.mode === 'confetti') alpha *= .55 + .45 * Math.sin(p.t * 3);
        const out = p.y < -60 || p.y > h + 60 || p.x < -60 || p.x > w + 60 || p.life > p.max;
        if (out) {
          if (p.once) this.list.splice(i, 1);
          else this.list[i] = this.spawn(false);
          continue;
        }
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha;
        if (p.ring) {
          ctx.strokeStyle = `rgba(${p.rgb.join()},1)`;
          ctx.lineWidth = Math.max(.6, p.s * .3);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.petal || p.ribbon) {
          p.rot += p.vr;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, p.ribbon ? Math.abs(Math.sin(p.t * 2)) * .8 + .2 : .55);
          ctx.fillStyle = `rgba(${p.rgb.join()},1)`;
          ctx.shadowColor = `rgba(${p.rgb.join()},.9)`;
          ctx.shadowBlur = p.ribbon ? 8 : 4;
          ctx.beginPath();
          if (p.ribbon) ctx.rect(-p.s, -p.s * .35, p.s * 2, p.s * .7);
          else ctx.ellipse(0, 0, p.s, p.s * .6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          const s = p.s * (p.soft ? 1 : 2.4);
          ctx.drawImage(sprite(p.rgb, !!p.soft), p.x - s, p.y - s, s * 2, s * 2);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  const fxMap = new Map();
  $$('.fx-canvas').forEach((c) => fxMap.set(c.closest('.sec'), new Particles(c)));
  let rT;
  addEventListener('resize', () => {
    clearTimeout(rT);
    rT = setTimeout(() => fxMap.forEach((p) => p.resize()), 150);
  });

  /* =======================================================
     SECTION ENTRANCES
     ======================================================= */
  const tween = (dur, fn, done) => {
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      fn(k);
      if (k < 1) requestAnimationFrame(step);
      else if (done) done();
    };
    requestAnimationFrame(step);
  };
  const easeInOut = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const easeOutExpo = (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k));

  const enter = {
    count(sec) {
      const b = $('.counter b', sec);
      if (reduced) { sec.classList.add('lit'); return; }
      sec.classList.add('counting');
      tween(1500, (k) => { b.textContent = Math.round(150 * easeOutExpo(k)); }, () => {
        setTimeout(() => sec.classList.add('lit'), 180);
      });
    },
    spotlight(sec) {
      const veil = $('.spot-veil', sec);
      veil.style.setProperty('--sx', sec.dataset.sx);
      veil.style.setProperty('--sy', sec.dataset.sy);
      if (reduced) { veil.remove(); return; }
      setTimeout(() => tween(2600, (k) => veil.style.setProperty('--r', `${easeInOut(k) * 140}%`), () => veil.remove()), 250);
    },
    split(sec) {
      setTimeout(() => sec.classList.add('done'), reduced ? 0 : 1700);
    },
  };

  // prepare split halves with the section image
  $$('[data-fx="split"]').forEach((sec) => {
    const img = $('img', sec);
    const set = () => $$('.half', sec).forEach((h) => { h.style.backgroundImage = `url("${img.currentSrc || img.src}")`; });
    img.complete ? set() : img.addEventListener('load', set, { once: true });
  });
  $$('[data-fx="iris"]').forEach((sec) => {
    sec.style.setProperty('--sx', sec.dataset.sx);
    sec.style.setProperty('--sy', sec.dataset.sy);
  });

  const reveal = (sec) => {
    if (sec.classList.contains('in')) return;
    const go = () => {
      sec.classList.add('in');
      const fn = enter[sec.dataset.fx];
      if (fn) fn(sec);
    };
    const img = $('img', sec);
    if (img.complete) go();
    else {
      img.addEventListener('load', go, { once: true });
      img.addEventListener('error', go, { once: true });
    }
  };

  // eager-load the next images a little before they arrive
  const loadAhead = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { $('img', e.target).loading = 'eager'; loadAhead.unobserve(e.target); }
    });
  }, { rootMargin: '150% 0px' });

  // dramatic sections wait until they reach the middle of the screen
  const CENTER_FX = ['count', 'spotlight', 'door'];
  const onReveal = (io) => (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
    });
  };
  const revealIO = new IntersectionObserver((en) => onReveal(revealIO)(en), { threshold: 0.22 });
  const centerIO = new IntersectionObserver((en) => onReveal(centerIO)(en), { rootMargin: '-40% 0px -40% 0px' });

  const fxIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const p = fxMap.get(e.target);
      if (!p) return;
      if (e.isIntersecting && e.target.classList.contains('in')) p.start();
      else p.stop();
    });
  }, { threshold: 0 });

  sections.forEach((sec) => {
    loadAhead.observe(sec);
    if (sec.id === 'first-view') return;
    (CENTER_FX.includes(sec.dataset.fx) ? centerIO : revealIO).observe(sec);
  });

  // particles start when a section has revealed and is visible
  const mo = new MutationObserver((muts) => muts.forEach((m) => {
    const sec = m.target;
    if (sec.classList.contains('in') && fxMap.has(sec)) {
      fxIO.unobserve(sec);
      fxIO.observe(sec);
    }
  }));
  sections.forEach((s) => mo.observe(s, { attributes: true, attributeFilter: ['class'] }));

  /* ---------------- footer reveals ---------------- */
  const ftIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); ftIO.unobserve(e.target); } });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => ftIO.observe(el));

  /* ---------------- hover light ---------------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.frame').forEach((f) => {
      f.addEventListener('pointermove', (e) => {
        const r = f.getBoundingClientRect();
        f.style.setProperty('--mx', `${e.clientX - r.left}px`);
        f.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* =======================================================
     SCROLL: header / progress / current section / ambient
     ======================================================= */
  const header = $('#header');
  const bar = $('.hd-progress i');
  const sticky = $('#sticky-cta');
  const footer = $('#footer');
  const sideL = $('.side-left');
  const sideNum = $('.side-num b');
  const sideTitle = $('.side-title');
  const dotBtns = $$('.dots button');
  const drawerLinks = $$('.dr-list a');
  const ambA = $('.amb-a');
  const ambB = $('.amb-b');
  let ambFront = ambA;
  let current = -1;
  let lastY = scrollY;
  let ticking = false;

  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    dotBtns.forEach((b, j) => b.classList.toggle('on', j === i));
    drawerLinks.forEach((a, j) => a.classList.toggle('is-current', j === i));
    // side label swap
    sideL.classList.add('swap');
    setTimeout(() => {
      sideNum.textContent = pad(i + 1);
      sideTitle.textContent = sections[i].dataset.en;
      sideL.classList.remove('swap');
    }, 300);
    // ambient cross-fade
    const back = ambFront === ambA ? ambB : ambA;
    back.style.backgroundImage = `url("assets/img/thumb${pad(i + 1)}.jpg")`;
    back.classList.add('on');
    ambFront.classList.remove('on');
    ambFront = back;
  };

  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    const vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (!document.body.classList.contains('drawer-open')) {
      header.classList.toggle('is-hidden', y > vh * .8 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove('is-hidden');
    }
    lastY = y;

    const mid = vh * .5;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { setCurrent(i); break; }
    }

    const fr = footer.getBoundingClientRect();
    const firstH = sections[0].offsetHeight;
    sticky.classList.toggle('show', y > firstH * .6 && fr.top > vh * .9);
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* =======================================================
     OPENING
     ======================================================= */
  const opening = $('#opening');
  const logo = $('[data-split]', opening);
  logo.innerHTML = [...logo.textContent].map((ch, i) => `<span class="ch" style="animation-delay:${0.35 + i * 0.09}s">${ch}</span>`).join('');

  let seen = false;
  try { seen = sessionStorage.getItem('curaim-op') === '1'; sessionStorage.setItem('curaim-op', '1'); } catch (_) { /* storage unavailable */ }

  let opened = false;
  const openPage = () => {
    if (opened) return;
    opened = true;
    opening.classList.add('is-open');
    document.body.classList.remove('is-loading');
    setTimeout(() => reveal(sections[0]), 250);
    setTimeout(() => opening.classList.add('is-gone'), 1500);
    onScroll();
  };
  $('.op-skip', opening).addEventListener('click', openPage);
  opening.addEventListener('click', openPage);

  if (reduced || location.hash) {
    opening.classList.add('is-gone');
    opened = true;
    document.body.classList.remove('is-loading');
    reveal(sections[0]);
    onScroll();
  } else {
    const heroImg = $('img', sections[0]);
    const minWait = seen ? 900 : 2700;
    const t0 = performance.now();
    const ready = () => setTimeout(openPage, Math.max(0, minWait - (performance.now() - t0)));
    if (heroImg.complete) ready();
    else {
      heroImg.addEventListener('load', ready, { once: true });
      heroImg.addEventListener('error', ready, { once: true });
      setTimeout(openPage, 6000); // safety
    }
  }
})();
