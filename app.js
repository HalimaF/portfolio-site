/* =============================================================
   Halima Fahim — editorial portfolio

   Theme, reveals, counters, nav state, mobile drawer, anchors, and the
   attention matrix in the hero.
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
     8. ATTENTION MATRIX

     A printed attention map: the square grid a transformer produces
     when every token scores every earlier token. Rows are queries,
     columns are keys, dot size is the weight. Causal, so nothing
     attends forward - hence the triangle.

     Hovering reads out a single pair, the way you would inspect a real
     attention head.

     The weights are ILLUSTRATIVE, not measured. They are generated
     from a deterministic function shaped like real decoder attention -
     a strong diagonal, a sink on the first token, recency decay - and
     the caption says so on the page. Nothing here is presented as an
     experimental result.

     Drawn flat in ink: dot size carries the value, so there is no
     gradient, glow or heatmap ramp anywhere in it.
     ============================================================= */
  (function attention() {
    var canvas = document.getElementById('plate');
    if (!canvas || !canvas.getContext) return;

    var fig = canvas.parentNode;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var TOKENS = ['the', 'agent', 'reads', 'the', 'request', 'then', 'calls', 'a', 'tool'];
    var N = TOKENS.length;

    var W = 0, H = 0, DPR = 1;
    var gx = 0, gy = 0, cell = 0;         // grid origin and cell size
    var padL = 0, padT = 0;               // label margins, needed when drawing
    var readout = document.getElementById('plateReadout');
    var hoverI = -1, hoverJ = -1;         // hovered query row / key column

    function token(el) {
      return getComputedStyle(document.documentElement).getPropertyValue(el).trim();
    }

    function resize() {
      var r = fig.getBoundingClientRect();
      if (!r.width || !r.height) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      padL = Math.min(78, W * 0.20);       // room for row labels
      padT = Math.min(76, H * 0.20);       // room for rotated column labels
      var padR = 16, padB = 34;

      cell = Math.min((W - padL - padR) / N, (H - padT - padB) / N);
      gx = padL + (W - padL - padR - cell * N) * 0.5;
      gy = padT + (H - padT - padB - cell * N) * 0.35;
    }

    /* --- illustrative weights, shaped like causal decoder attention --- */
    function rawWeight(i, j, t) {
      if (j > i) return 0;                          // causal mask
      var d = i - j;
      var recency = Math.exp(-d * 0.52);            // nearby tokens dominate
      var sink    = (j === 0) ? 0.42 : 0;           // attention sink on token 0
      var self    = (d === 0) ? 0.46 : 0;
      var drift   = 0.16 * (0.5 + 0.5 * Math.sin(i * 2.7 + j * 1.9 + t * 0.00035));
      return recency + sink + self + drift;
    }

    function rowWeights(i, t) {
      var out = [], sum = 0, j;
      for (j = 0; j < N; j++) { out[j] = rawWeight(i, j, t); sum += out[j]; }
      if (sum > 0) for (j = 0; j < N; j++) out[j] /= sum;
      return out;
    }

    function draw(t) {
      if (!W || !H || !cell) return;

      var ink = token('--ink') || '#16150F';
      var accent = token('--accent') || '#1B4079';
      var dim = token('--ink-3') || '#8C8674';

      ctx.clearRect(0, 0, W, H);
      ctx.textBaseline = 'middle';

      var mono = 'px "IBM Plex Mono", ui-monospace, monospace';
      var labelSize = Math.max(8, Math.min(11, cell * 0.34));

      /* --- axis captions --- */
      ctx.font = '500 ' + Math.max(8, labelSize - 1.5) + mono;
      ctx.fillStyle = dim;
      ctx.textAlign = 'left';
      ctx.fillText('KEYS', gx, gy - padT + 7);      // clear above the rotated labels
      ctx.save();
      ctx.translate(gx - padL * 0.88, gy + cell * N * 0.5);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText('QUERIES', 0, 0);
      ctx.restore();

      /* --- labels --- */
      ctx.font = '400 ' + labelSize + mono;

      for (var k = 0; k < N; k++) {
        // rows, right-aligned into the left margin
        ctx.textAlign = 'right';
        ctx.fillStyle = (k === hoverI) ? accent : dim;
        ctx.fillText(TOKENS[k], gx - 8, gy + cell * (k + 0.5));

        // columns, rotated, the way a real attention plot is labelled
        ctx.save();
        ctx.translate(gx + cell * (k + 0.5), gy - 8);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'left';
        ctx.fillStyle = (k === hoverJ) ? accent : dim;
        ctx.fillText(TOKENS[k], 0, 0);
        ctx.restore();
      }

      /* --- crosshair on the hovered cell --- */
      if (hoverI >= 0 && hoverJ >= 0) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.07;
        ctx.fillRect(gx, gy + cell * hoverI, cell * N, cell);
        ctx.fillRect(gx + cell * hoverJ, gy, cell, cell * N);
        ctx.globalAlpha = 1;
      }

      /* --- the matrix --- */
      var maxR = cell * 0.44;              // never let neighbours touch
      for (var i = 0; i < N; i++) {
        var w = rowWeights(i, t);
        for (var j = 0; j <= i; j++) {
          var cx = gx + cell * (j + 0.5);
          var cy = gy + cell * (i + 0.5);
          var rad = Math.sqrt(w[j]) * maxR * 1.25;
          if (rad > maxR) rad = maxR;
          if (rad < 0.35) continue;

          var on = (i === hoverI && j === hoverJ);
          ctx.fillStyle = on ? accent : ink;
          ctx.globalAlpha = on ? 1 : 0.26 + w[j] * 0.9;
          ctx.beginPath();
          ctx.arc(cx, cy, on ? rad * 1.25 : rad, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      /* --- readout lives in the figcaption: real text, selectable and
         reachable by a screen reader, rather than pixels on a canvas --- */
      if (readout) {
        readout.textContent = (hoverI >= 0 && hoverJ >= 0)
          ? TOKENS[hoverI] + ' → ' + TOKENS[hoverJ] + '  ' + rowWeights(hoverI, t)[hoverJ].toFixed(2)
          : 'Hover a cell to inspect a pair';
      }
    }

    /* --- pointer: bound in EVERY case ---------------------------------
       Reduced motion means no unsolicited animation. It does not mean
       the reader loses the ability to interact, and gating the pointer
       behind it was a bug: with Windows animation effects switched off,
       the whole thing became inert. */
    function locate(e) {
      var r = fig.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var j = Math.floor((x - gx) / cell);
      var i = Math.floor((y - gy) / cell);
      if (i >= 0 && i < N && j >= 0 && j < N && j <= i) { hoverI = i; hoverJ = j; }
      else { hoverI = hoverJ = -1; }
    }

    function onMove(e) {
      var pi = hoverI, pj = hoverJ;
      locate(e);
      if (reduced && (pi !== hoverI || pj !== hoverJ)) draw(0);
    }
    function onLeave() {
      hoverI = hoverJ = -1;
      if (reduced) draw(0);
    }

    fig.addEventListener('pointermove', onMove);
    fig.addEventListener('mousemove', onMove);      // older browsers
    fig.addEventListener('pointerleave', onLeave);
    fig.addEventListener('mouseleave', onLeave);

    /* --- run loop, only when it can be seen --- */
    var raf = null, onScreen = true, visible = true, t0 = 0;

    function frame(ts) {
      if (!t0) t0 = ts;
      draw(ts - t0);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (raf === null && onScreen && visible && !reduced) raf = requestAnimationFrame(frame); }
    function stop() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    resize();
    draw(0);

    if (!reduced) {
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

    function refresh() { resize(); draw(0); }
    if ('ResizeObserver' in window) new ResizeObserver(refresh).observe(fig);
    else window.addEventListener('resize', refresh);

    var tgl = document.getElementById('themeToggle');
    if (tgl) tgl.addEventListener('click', function () { setTimeout(function () { draw(0); }, 60); });
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
