/* =============================================================
   Halima Fahim — editorial portfolio

   Deliberately small. The previous build carried a canvas renderer, a
   cursor spotlight and card tilt; none of that survived the redesign,
   because the look it produced was the thing being replaced.

   What is left: theme, reveals, counters, nav state, mobile drawer,
   anchors.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. THEME (paper / night) ---------- */
  var root  = document.documentElement;
  var label = $('#modeLabel');

  function applyTheme(name) {
    root.setAttribute('data-theme', name);
    if (label) label.textContent = name === 'night' ? 'Night' : 'Paper';
  }

  var stored = null;
  try { stored = localStorage.getItem('hf-theme'); } catch (e) {}

  if (stored === 'paper' || stored === 'night') {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('night');
  } else {
    applyTheme('paper');
  }

  var toggle = $('#themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'night' ? 'paper' : 'night';
      applyTheme(next);
      try { localStorage.setItem('hf-theme', next); } catch (e) {}
    });
  }

  /* ---------- 2. YEAR ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 3. REVEALS ---------- */
  var revealables = $$('.reveal');
  revealables.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- 4. COUNTERS ---------- */
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduced) { el.textContent = target + suffix; return; }

    var duration = 1100, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('.count');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); cObs.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cObs.observe(el); });
    }
  }

  /* ---------- 5. ACTIVE SECTION ---------- */
  var navLinks = $$('.masthead-nav a');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var line = y + window.innerHeight * 0.3;
    var activeId = null;

    sections.forEach(function (sec) { if (sec.offsetTop <= line) activeId = sec.id; });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 6. DRAWER ---------- */
  var menuBtn = $('#menuBtn');
  var drawer  = $('#mobileMenu');

  function setMenu(open) {
    if (!menuBtn || !drawer) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
    drawer.hidden = !open;
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });


  /* =============================================================
     8. HALFTONE PLATE

     A printed dot-field, drawn flat in ink. The dots describe a
     sphere the way a letterpress halftone would: radius falls off
     from a light source, so form comes from dot SIZE, not shading.

     The cursor is a lens. Dots near it swell and are pushed outward,
     as though the plate were being pressed. No glow, no gradient,
     no blur - the whole point of the redesign was to drop those.

     With no pointer (touch, or the cursor off the plate) the lens
     drifts on its own slow orbit, so it is never simply static.
     ============================================================= */
  (function plate() {
    var canvas = document.getElementById('plate');
    if (!canvas || !canvas.getContext) return;

    var fig = canvas.parentNode;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var W = 0, H = 0, DPR = 1, STEP = 15;

    // lens position, in canvas pixels
    var tx = 0, ty = 0;      // target
    var lx = 0, ly = 0;      // eased
    var hasPointer = false;

    function resize() {
      var r = fig.getBoundingClientRect();
      if (!r.width || !r.height) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      STEP = Math.max(11, Math.min(17, Math.round(Math.min(W, H) / 30)));
      if (!hasPointer) { lx = tx = W * 0.5; ly = ty = H * 0.45; }
    }

    function inkColor() {
      // read the live token so the plate follows the paper/night themes
      return getComputedStyle(document.documentElement)
               .getPropertyValue('--ink').trim() || '#16150F';
    }

    function draw(t) {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = inkColor();

      var cx = W * 0.5, cy = H * 0.46;
      var R  = Math.min(W, H) * 0.40;        // radius of the printed sphere
      var lensR = Math.min(W, H) * 0.26;
      var MAXR = STEP * 0.44;                // keeps dots from touching

      for (var y = STEP * 0.5; y < H; y += STEP) {
        for (var x = STEP * 0.5; x < W; x += STEP) {

          /* --- the sphere: dot size grows toward the shadow side --- */
          var dx = x - cx, dy = y - cy;
          var d  = Math.sqrt(dx * dx + dy * dy);
          var inside = 1 - d / R;
          if (inside <= 0) continue;

          // highlight upper-left (small dots), shadow lower-right (large)
          var shade = ((dx / R) * 0.6 + (dy / R) * 0.6 + 1) * 0.5;
          shade = Math.max(0, Math.min(1, shade));

          // a slow swell so the plate breathes even when untouched
          var breathe = 0.96 + 0.04 * Math.sin(t * 0.0009 + d * 0.02);

          var rad = MAXR * Math.pow(inside, 0.42) * (0.26 + shade * 0.70) * breathe;

          /* --- the lens: swell and displace --- */
          var ldx = x - lx, ldy = y - ly;
          var ld = Math.sqrt(ldx * ldx + ldy * ldy);
          var px = x, py = y;

          if (ld < lensR) {
            var f = 1 - ld / lensR;
            f = f * f * (3 - 2 * f);         // smoothstep

            rad *= 1 + f * 0.62;

            // displacement peaks mid-radius, not at the centre - pushing
            // hardest at the centre tears a hole in the middle of the field
            if (ld > 0.001) {
              var push = f * (1 - f) * 4 * STEP * 0.42;
              px += (ldx / ld) * push;
              py += (ldy / ld) * push;
            }
          }

          // never let neighbouring dots merge: that is what turned the
          // field into a solid blot rather than a halftone
          if (rad > MAXR) rad = MAXR;
          if (rad < 0.3) continue;

          ctx.globalAlpha = Math.min(0.92, 0.24 + inside * 0.62);
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    /* --- run loop: only while the plate is on screen --- */
    var raf = null, onScreen = true, visible = true, t0 = 0;

    function frame(ts) {
      if (!t0) t0 = ts;
      var t = ts - t0;

      if (!hasPointer) {                     // autonomous drift
        tx = W * (0.5 + 0.26 * Math.cos(t * 0.00043));
        ty = H * (0.46 + 0.22 * Math.sin(t * 0.00059));
      }
      lx += (tx - lx) * 0.075;
      ly += (ty - ly) * 0.075;

      draw(t);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (raf === null && onScreen && visible && !reduced) raf = requestAnimationFrame(frame); }
    function stop()  { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    resize();

    if (reduced) {
      lx = W * 0.5; ly = H * 0.45;
      draw(0);
    } else {
      function track(e) {
        var r = fig.getBoundingClientRect();
        tx = e.clientX - r.left;
        ty = e.clientY - r.top;
        hasPointer = true;
      }
      // both, because Pointer Events are missing on some older browsers
      fig.addEventListener('pointermove', track);
      fig.addEventListener('mousemove', track);
      fig.addEventListener('pointerleave', function () { hasPointer = false; });
      fig.addEventListener('mouseleave',  function () { hasPointer = false; });

      document.addEventListener('visibilitychange', function () {
        visible = !document.hidden;
        visible ? start() : stop();
      });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          onScreen ? start() : stop();
        }, { threshold: 0.01 }).observe(fig);
      }
      start();
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { resize(); if (reduced) draw(0); }).observe(fig);
    } else {
      window.addEventListener('resize', function () { resize(); if (reduced) draw(0); });
    }

    // the ink token changes with the theme, so redraw once on toggle
    var tgl = document.getElementById('themeToggle');
    if (tgl) tgl.addEventListener('click', function () {
      if (reduced) setTimeout(function () { draw(0); }, 60);
    });
  })();

  /* ---------- 9. ANCHORS ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', id);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
