/* ============================================================
   Brand Appart — interactions
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloaderCount');
  const barEl = document.getElementById('preloaderBar');

  function runPreloader(done) {
    if (prefersReduced) { preloader.classList.add('done'); done(); return; }
    let p = 0;
    const tick = () => {
      p += Math.random() * 16 + 4;
      if (p >= 100) p = 100;
      countEl.textContent = Math.floor(p);
      barEl.style.width = p + '%';
      if (p < 100) {
        setTimeout(tick, 120);
      } else {
        setTimeout(() => {
          preloader.classList.add('done');
          done();
        }, 380);
      }
    };
    setTimeout(tick, 300);
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (isTouch) return;
    const cursor = document.getElementById('cursor');
    const follow = document.getElementById('cursorFollow');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let fx = mx, fy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function loop() {
      fx += (mx - fx) * 0.15;
      fy += (my - fy) * 0.15;
      follow.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (isTouch || prefersReduced) return;
    document.querySelectorAll('.magnetic').forEach((el) => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal, .line');
    if (prefersReduced) { items.forEach((i) => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Stagger sibling reveals slightly
          const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
          setTimeout(() => el.classList.add('in'), delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach((i) => io.observe(i));
  }

  /* ---------- Word-by-word highlight (intro + testimonial) ---------- */
  function initWordLight() {
    const containers = document.querySelectorAll('.intro__text, .testimonial__quote');
    if (prefersReduced) {
      containers.forEach((c) => c.querySelectorAll('.word').forEach((w) => w.classList.add('lit')));
      return;
    }
    function onScroll() {
      containers.forEach((c) => {
        const words = c.querySelectorAll('.word');
        const rect = c.getBoundingClientRect();
        const start = window.innerHeight * 0.85;
        const end = window.innerHeight * 0.3;
        const progress = (start - rect.top) / (start - end + rect.height);
        const litCount = Math.floor(progress * words.length);
        words.forEach((w, i) => w.classList.toggle('lit', i <= litCount));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Count-up stats ---------- */
  function initStats() {
    const nums = document.querySelectorAll('.stat__num');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (prefersReduced) { el.textContent = target; io.unobserve(el); return; }
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur;
        }, 28);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---------- Header show/hide + solid ---------- */
  function initHeader() {
    const header = document.getElementById('header');
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('solid', y > 60);
      if (y > lastY && y > 300 && !document.body.classList.contains('menu-open')) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Scroll progress ---------- */
  function initProgress() {
    const bar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (window.scrollY / h) * 100 + '%';
    }, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const toggle = document.getElementById('menuToggle');
    const links = document.querySelectorAll('.mobile-menu__link');
    toggle.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    links.forEach((l) => l.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  /* ---------- Misc ---------- */
  function initMisc() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    const backTop = document.getElementById('backTop');
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Boot ---------- */
  function boot() {
    initReveal();
    initWordLight();
    initStats();
    // Kick the hero line reveal
    document.querySelectorAll('.hero .line').forEach((l, i) => {
      setTimeout(() => l.classList.add('in'), 120 + i * 120);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initMagnetic();
    initHeader();
    initProgress();
    initMenu();
    initMisc();
    runPreloader(boot);
  });
})();
