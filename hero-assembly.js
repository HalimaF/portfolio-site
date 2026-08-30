/* =============================================================
   Scroll-driven agent assembly
   -------------------------------------------------------------
   A full-viewport Canvas 2D scene that assembles an agent system as
   the reader scrolls, then sends a pulse of data through it.

   Self-contained. No dependencies, no build step. To remove: delete
   this file, hero-assembly.css, their two tags, and the
   <section class="assembly"> block in index.html.

   THE ONE RULE THAT MATTERS
   -------------------------
   render(p) is a PURE FUNCTION of scroll progress p (0..1). Nothing
   accumulates between frames — no tweens in flight, no velocity, no
   elapsed-time term anywhere, including the drifting particles, which
   are seeded deterministically and positioned from p alone.

   That is what makes reverse scrubbing correct by construction: the
   same p always produces the same pixels, whether you arrived at it
   scrolling down or up. There is no cleanup path because there is no
   state to clean up.
   ============================================================= */
(function () {
  'use strict';

  var section = document.querySelector('.assembly');
  var canvas  = document.getElementById('assemblyCanvas');
  if (!section || !canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var pin      = section.querySelector('.assembly-pin');
  var captions = Array.prototype.slice.call(section.querySelectorAll('.assembly-caption'));
  var bar      = section.querySelector('.assembly-progress i');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STATIC_MAX_WIDTH = 900;

  /* ---------- palette (matches the site tokens) ---------- */
  var VIOLET = [124, 107, 255],
      CYAN   = [ 42, 208, 224],
      PINK   = [255, 122, 184],
      MINT   = [ 61, 220, 132];

  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  /* ---------- the graph, in world units (roughly 0..1) ---------- */
  var NODES = [
    { id: 'request',  label: 'request',  x: 0.08, y: 0.50, c: VIOLET, r: 0.030, from: 0.00, to: 0.12 },
    { id: 'router',   label: 'router',   x: 0.30, y: 0.50, c: CYAN,   r: 0.028, from: 0.14, to: 0.24 },
    { id: 'tools',    label: 'tools',    x: 0.54, y: 0.30, c: CYAN,   r: 0.025, from: 0.24, to: 0.34 },
    { id: 'memory',   label: 'memory',   x: 0.54, y: 0.70, c: PINK,   r: 0.025, from: 0.30, to: 0.40 },
    { id: 'llm',      label: 'llm call', x: 0.74, y: 0.50, c: VIOLET, r: 0.030, from: 0.36, to: 0.46 },
    { id: 'response', label: 'response', x: 0.94, y: 0.50, c: MINT,   r: 0.032, from: 0.85, to: 1.00 }
  ];

  var N = {};
  NODES.forEach(function (n, i) { N[n.id] = i; });

  // depth = how many hops from the request node; drives the pulse wavefront
  var EDGES = [
    { a: 'request', b: 'router',   from: 0.16, to: 0.26, depth: 0 },
    { a: 'router',  b: 'tools',    from: 0.28, to: 0.38, depth: 1 },
    { a: 'router',  b: 'memory',   from: 0.34, to: 0.44, depth: 1 },
    { a: 'router',  b: 'llm',      from: 0.40, to: 0.50, depth: 1 },
    { a: 'tools',   b: 'llm',      from: 0.48, to: 0.58, depth: 2 },
    { a: 'memory',  b: 'llm',      from: 0.54, to: 0.64, depth: 2 },
    { a: 'llm',     b: 'response', from: 0.86, to: 0.96, depth: 3 }
  ].map(function (e) { return { a: N[e.a], b: N[e.b], from: e.from, to: e.to, depth: e.depth }; });

  var PULSE_FROM = 0.62, PULSE_TO = 0.88;

  /* ---------- camera keyframes: starts tight on the request node and
       pulls back across the graph as it grows ---------- */
  var CAM = [
    { p: 0.00, x: 0.08, y: 0.50, z: 3.10 },
    { p: 0.18, x: 0.20, y: 0.50, z: 2.30 },
    { p: 0.45, x: 0.46, y: 0.50, z: 1.42 },
    { p: 0.68, x: 0.58, y: 0.50, z: 1.18 },
    { p: 0.88, x: 0.76, y: 0.50, z: 1.20 },
    { p: 1.00, x: 0.51, y: 0.50, z: 0.90 }
  ];

  /* ---------- easing / helpers ---------- */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // smootherstep: zero 1st AND 2nd derivative at both ends, so the camera
  // never visibly snaps where two keyframes meet
  function smoother(t) { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); }

  // 0 before `from`, 1 after `to`, eased in between
  function band(p, from, to) { return smoother((p - from) / (to - from)); }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function cameraAt(p) {
    if (p <= CAM[0].p) return CAM[0];
    for (var i = 1; i < CAM.length; i++) {
      if (p <= CAM[i].p) {
        var a = CAM[i - 1], b = CAM[i];
        var t = smoother((p - a.p) / (b.p - a.p));
        return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
      }
    }
    return CAM[CAM.length - 1];
  }

  /* ---------- deterministic particle field ----------
     Seeded, and advanced by p rather than by a clock, so scrubbing back
     to the same p reproduces the field exactly. */
  var DUST = (function () {
    var seed = 1337;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    var out = [];
    for (var i = 0; i < 90; i++) {
      out.push({ x: rnd() * 1.6 - 0.3, y: rnd() * 1.4 - 0.2, s: rnd(), drift: rnd() * 0.06 + 0.02 });
    }
    return out;
  })();

  /* ---------- canvas sizing ---------- */
  var W = 0, H = 0, DPR = 1, S = 1;

  function resize() {
    var r = pin.getBoundingClientRect();
    if (!r.width || !r.height) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // world->screen scale, floored so the graph's full height always fits
    // even on wide-and-short windows
    S = Math.min(W, H / 0.60);
  }

  /* ---------- projection ---------- */
  var cam = { x: 0, y: 0, z: 1 };

  // The graph is biased above centre: the lower third of the frame belongs to
  // the captions and the progress hairline, and the memory node collided with
  // them when the graph was centred.
  var FRAME_Y = 0.43;

  function px(wx) { return W / 2 + (wx - cam.x) * S * cam.z; }
  function py(wy) { return H * FRAME_Y + (wy - cam.y) * S * cam.z; }

  /* ---------- the draw ---------- */
  function render(p) {
    if (!W || !H) return;
    cam = cameraAt(p);

    ctx.clearRect(0, 0, W, H);

    /* --- drifting field, positioned from p only --- */
    var i, d, sx, sy;
    for (i = 0; i < DUST.length; i++) {
      d = DUST[i];
      sx = px(d.x + p * d.drift);
      sy = py(d.y - p * d.drift * 0.5);
      if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
      ctx.fillStyle = 'rgba(180,192,228,' + (0.05 + d.s * 0.13) + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, 0.6 + d.s * 1.5, 0, 6.2832);
      ctx.fill();
    }

    /* --- edges, drawn progressively from a to b --- */
    var pulseP = clamp((p - PULSE_FROM) / (PULSE_TO - PULSE_FROM), 0, 1);
    var pulseOn = p > PULSE_FROM && p < PULSE_TO + 0.04;

    ctx.lineCap = 'round';

    for (i = 0; i < EDGES.length; i++) {
      var e = EDGES[i];
      var grow = band(p, e.from, e.to);
      if (grow <= 0) continue;

      var na = NODES[e.a], nb = NODES[e.b];
      var ax = px(na.x), ay = py(na.y);
      var bx = px(nb.x), by = py(nb.y);
      var ex = lerp(ax, bx, grow), ey = lerp(ay, by, grow);

      var g = ctx.createLinearGradient(ax, ay, bx, by);
      g.addColorStop(0, rgba(na.c, 0.55));
      g.addColorStop(1, rgba(nb.c, 0.55));
      ctx.strokeStyle = g;
      ctx.lineWidth = Math.max(1, 0.0022 * S * cam.z);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // leading spark while the edge is still drawing
      if (grow < 1) {
        ctx.fillStyle = rgba(nb.c, 0.9);
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(1.5, 0.004 * S * cam.z), 0, 6.2832);
        ctx.fill();
      }

      /* --- the pulse: a wavefront sweeping outward by edge depth --- */
      if (pulseOn && grow >= 1) {
        var local = clamp((pulseP - e.depth * 0.17) / 0.42, 0, 1);
        if (local > 0 && local < 1) {
          var mx = lerp(ax, bx, local), my = lerp(ay, by, local);
          var rr = Math.max(3, 0.012 * S * cam.z);
          var fade = Math.sin(local * Math.PI);

          ctx.globalCompositeOperation = 'lighter';
          var pg = ctx.createRadialGradient(mx, my, 0, mx, my, rr * 3);
          pg.addColorStop(0, rgba(CYAN, 0.85 * fade));
          pg.addColorStop(1, rgba(CYAN, 0));
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(mx, my, rr * 3, 0, 6.2832);
          ctx.fill();

          ctx.fillStyle = 'rgba(255,255,255,' + (0.9 * fade) + ')';
          ctx.beginPath();
          ctx.arc(mx, my, rr * 0.5, 0, 6.2832);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }

    /* --- nodes --- */
    for (i = 0; i < NODES.length; i++) {
      var n = NODES[i];
      var appear = band(p, n.from, n.to);
      if (appear <= 0) continue;

      var x = px(n.x), y = py(n.y);
      var rad = n.r * S * cam.z * (0.6 + 0.4 * appear);

      // bloom
      ctx.globalCompositeOperation = 'lighter';
      var bg = ctx.createRadialGradient(x, y, 0, x, y, rad * 4.2);
      bg.addColorStop(0, rgba(n.c, 0.34 * appear));
      bg.addColorStop(0.5, rgba(n.c, 0.08 * appear));
      bg.addColorStop(1, rgba(n.c, 0));
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x, y, rad * 4.2, 0, 6.2832);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // body + rim
      ctx.fillStyle = 'rgba(8,9,16,' + (0.9 * appear) + ')';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, 6.2832);
      ctx.fill();

      ctx.strokeStyle = rgba(n.c, 0.95 * appear);
      ctx.lineWidth = Math.max(1.2, 0.0028 * S * cam.z);
      ctx.stroke();

      // core
      ctx.fillStyle = rgba(n.c, 0.5 * appear);
      ctx.beginPath();
      ctx.arc(x, y, rad * 0.38, 0, 6.2832);
      ctx.fill();

      // the response node resolves with an expanding ring
      if (n.id === 'response' && appear > 0 && appear < 1) {
        ctx.strokeStyle = rgba(MINT, (1 - appear) * 0.7);
        ctx.lineWidth = Math.max(1, 0.002 * S * cam.z);
        ctx.beginPath();
        ctx.arc(x, y, rad * (1 + appear * 2.4), 0, 6.2832);
        ctx.stroke();
      }

      // label
      var fs = clamp(0.021 * S * cam.z, 11, 30);
      ctx.font = '500 ' + fs.toFixed(1) + 'px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(226,230,246,' + (0.72 * appear) + ')';
      ctx.fillText(n.label, x, y + rad + fs * 1.5);
    }

    /* --- captions: exactly one visible, opacity from p --- */
    for (i = 0; i < captions.length; i++) {
      var cap = captions[i];
      var from = parseFloat(cap.getAttribute('data-from'));
      var to   = parseFloat(cap.getAttribute('data-to'));
      var a = 0;
      if (p >= from && p <= to) {
        var span = to - from, ramp = span * 0.22;
        a = p < from + ramp ? (p - from) / ramp
          : p > to - ramp   ? (to - p) / ramp
          : 1;
        a = clamp(a, 0, 1);
      }
      cap.style.opacity = a.toFixed(3);
      cap.style.transform = 'translateY(' + ((1 - a) * 12).toFixed(2) + 'px)';
    }

    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
  }

  /* ---------- static mode: final assembled graph, no scrubbing ---------- */
  function goStatic() {
    section.classList.add('is-static');
    resize();
    render(1);
    // show only the closing caption; the rest would be meaningless here
    captions.forEach(function (c, i) {
      c.style.opacity = i === captions.length - 1 ? '1' : '0';
      c.style.transform = 'none';
    });
  }

  /* ---------- scroll binding ---------- */
  var ticking = false, bound = false;

  function progress() {
    var rect = section.getBoundingClientRect();
    var travel = section.offsetHeight - window.innerHeight;
    if (travel <= 0) return 0;
    return clamp(-rect.top / travel, 0, 1);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      render(progress());
      ticking = false;
    });
  }

  function bind() {
    if (bound) return;
    bound = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    resize();
    render(progress());
  }

  function unbind() {
    if (!bound) return;
    bound = false;
    window.removeEventListener('scroll', onScroll);
  }

  /* ---------- mode selection, re-evaluated on resize ---------- */
  var isStatic = null;

  function chooseMode() {
    var wantStatic = reduced || window.innerWidth < STATIC_MAX_WIDTH;
    if (wantStatic === isStatic) {
      resize();
      render(isStatic ? 1 : progress());
      return;
    }
    isStatic = wantStatic;

    if (wantStatic) {
      unbind();
      goStatic();
    } else {
      section.classList.remove('is-static');
      bind();
    }
  }

  chooseMode();

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { chooseMode(); }).observe(pin);
  }
  window.addEventListener('resize', chooseMode);

  // exposed purely so the verification harness can drive and compare frames
  window.__assembly = { render: render, resize: resize };
})();
