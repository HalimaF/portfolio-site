/* =============================================================
   HERO 3D — the retrieval space

   Every passage in the CV is a point. They sit in five clusters, one
   per section of the résumé, so the space is legible before you type
   anything. When a query is ranked, matching passages advance toward
   the camera and brighten in proportion to their BM25 score; the rest
   recede and dim.

   It listens to the `cv:ranked` event and computes nothing itself. The
   ranking is BM25's, unmodified.

   It shows the WHOLE corpus, not just the four passages the list has
   room for. That is the only thing this layer can tell you that the
   list cannot, and the only reason it earns its place.

   No library. The 3D here is a rotation, a perspective divide and a
   depth sort — about sixty lines. Vendoring 671 KB of three.js to draw
   twenty circles would have cost 13x the weight of the entire site.

   Deliberately flat: solid fills, one accent, no gradient, no glow, no
   bloom, no sparkle. It reads the live theme tokens, so it follows
   paper/night without knowing anything about them.

   TO REMOVE: delete this file, its <script> tag, and the
   <div class="space"> block in index.html. Nothing else refers to it.
   ============================================================= */
(function () {
  'use strict';

  var MIN_WIDTH = 768;   // below this the layer does not run at all

  var host   = document.querySelector('.space');
  var canvas = document.getElementById('askSpace');
  var cap    = document.getElementById('spaceCap');
  if (!host || !canvas) return;

  /* --- if 2D canvas is unavailable, remove the band and leave the hero
         exactly as it was without this feature --- */
  var ctx = null;
  try { ctx = canvas.getContext('2d'); } catch (e) { ctx = null; }
  if (!ctx) { host.parentNode.removeChild(host); return; }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- the space ----------
     Five clusters, one per résumé section. Positions are fixed and
     deterministic: the same passage is always in the same place, so the
     picture is stable enough to read across queries. */
  var CLUSTERS = {
    'Experience':   { x: -1.75, y:  0.10, z:  0.05 },
    'Work':         { x: -0.75, y: -0.42, z: -0.30 },
    'Toolkit':      { x:  0.35, y:  0.28, z:  0.15 },
    'Education':    { x:  1.28, y: -0.30, z:  0.40 },
    'Availability': { x:  1.88, y:  0.46, z:  0.50 }
  };

  var points = [];     // one per corpus entry
  var built  = false;

  function seeded(i) {                       // deterministic jitter
    var v = Math.sin(i * 12.9898) * 43758.5453;
    return v - Math.floor(v);
  }

  function build(corpus) {
    points = corpus.map(function (d, i) {
      var c = CLUSTERS[d.s] || { x: 0, y: 0, z: 0 };
      var s = 0.34;
      return {
        doc: d,
        bx: c.x + (seeded(i * 3 + 1) - 0.5) * s,
        by: c.y + (seeded(i * 3 + 2) - 0.5) * s,
        bz: c.z + (seeded(i * 3 + 3) - 0.5) * s,
        score: 0,       // target
        lit: 0,         // eased score, 0..1
        push: 0,        // eased depth offset
        top: false
      };
    });
    built = true;
  }

  /* ---------- sizing ---------- */
  var W = 0, H = 0, DPR = 1;

  function resize() {
    var r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* ---------- tokens, read live so themes just work ---------- */
  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  /* ---------- projection ----------
     Perspective divide with a fixed focal length. Depth is the signal
     here, so a perspective camera is the whole point; an orthographic
     one would make "toward the camera" invisible. */
  function project(x, y, z, rot) {
    var c = Math.cos(rot), s = Math.sin(rot);
    var x1 =  x * c - z * s;
    var z1 =  x * s + z * c;

    var dist = 3.0;
    var f = 2.1 / (dist + z1);

    // Anisotropic on purpose: the band is wide and short, so x and y get
    // their own scales. Nothing here is measured off absolute position —
    // rank is carried by size and brightness — so the stretch costs nothing
    // and the alternative is a cramped blob in the middle of empty space.
    var sx = W * 0.26, sy = H * 0.60;

    return { x: W / 2 + x1 * f * sx, y: H / 2 + y * f * sy, f: f, z: z1 };
  }

  /* ---------- draw ---------- */
  var rot = 0;

  function draw() {
    if (!W || !H || !built) return;

    var ink    = token('--ink', '#0A0A0A');
    var dim    = token('--ink-3', '#6A6A63');
    var accent = token('--accent', '#FF3B00');

    ctx.clearRect(0, 0, W, H);

    var order = points.map(function (p, i) {
      var pr = project(p.bx, p.by, p.bz + p.push, rot);
      return { p: p, pr: pr, i: i };
    }).sort(function (a, b) { return a.pr.z - b.pr.z; });   // far first

    /* cluster labels, so the five regions are nameable */
    ctx.font = '400 9px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    Object.keys(CLUSTERS).forEach(function (k) {
      var c = CLUSTERS[k];
      var pr = project(c.x, c.y, c.z, rot);
      ctx.fillStyle = dim;
      ctx.globalAlpha = 0.5;
      ctx.fillText(k.toUpperCase(), pr.x, pr.y - 30);
    });
    ctx.globalAlpha = 1;

    order.forEach(function (o) {
      var p = o.p, pr = o.pr;
      var lit = p.lit;

      var rad = (2.6 + lit * 6.0) * pr.f * 1.3;
      if (rad < 0.4) return;

      ctx.beginPath();
      ctx.arc(pr.x, pr.y, rad, 0, 6.2832);

      if (lit > 0.01) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.35 + lit * 0.65;
      } else {
        ctx.fillStyle = dim;
        ctx.globalAlpha = 0.18 + Math.max(0, pr.f - 0.5) * 0.5;
      }
      ctx.fill();

      // the top hit is named, so the ranking is readable and not just felt
      if (p.top && lit > 0.5) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = accent;
        ctx.font = '500 9.5px "IBM Plex Mono", ui-monospace, monospace';
        ctx.fillText(p.doc.t, pr.x, pr.y - rad - 9);
        ctx.font = '400 9px "IBM Plex Mono", ui-monospace, monospace';
      }
    });
    ctx.globalAlpha = 1;
  }

  /* ---------- state from the ranking ---------- */
  function apply(detail) {
    if (!built) build(detail.corpus || []);

    var all = detail.all || [];
    var top = all.length ? all[0].score : 0;
    var byText = {};
    all.forEach(function (r) { byText[r.doc.x] = r.score; });

    points.forEach(function (p) {
      var sc = byText[p.doc.x] || 0;
      p.score = top > 0 ? sc / top : 0;
      p.top = !!(all.length && all[0].doc.x === p.doc.x);
    });

    if (cap) {
      cap.textContent = all.length
        ? all.length + ' of ' + points.length + ' passages match'
        : points.length + ' passages indexed';
    }

    if (reduced) {                       // no animation: land on the value
      points.forEach(function (p) {
        p.lit = p.score;
        p.push = p.score * 0.85;
      });
      resize();
      draw();
    } else {
      start();
    }
  }

  /* ---------- loop ---------- */
  var raf = null, onScreen = true, visible = true;

  function frame() {
    var moving = false;
    points.forEach(function (p) {
      var tl = p.score, tp = p.score * 0.85;
      p.lit  += (tl - p.lit)  * 0.10;
      p.push += (tp - p.push) * 0.10;
      if (Math.abs(tl - p.lit) > 0.002 || Math.abs(tp - p.push) > 0.002) moving = true;
    });

    rot += 0.0016;
    draw();

    raf = (visible && onScreen) ? requestAnimationFrame(frame) : null;
    if (!raf) return;
    void moving;                         // the slow rotation never settles
  }

  function start() {
    if (reduced) { draw(); return; }
    if (raf === null && visible && onScreen) raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  /* ---------- below the breakpoint the layer does not exist ---------- */
  if (window.innerWidth < MIN_WIDTH) {
    host.parentNode.removeChild(host);
    return;
  }

  document.addEventListener('cv:ranked', function (e) { apply(e.detail); });

  resize();

  if (!reduced) {
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      visible ? start() : stop();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        onScreen ? start() : stop();
      }, { threshold: 0.01 }).observe(host);
    }
    start();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { resize(); if (reduced) draw(); }).observe(canvas);
  } else {
    window.addEventListener('resize', function () { resize(); if (reduced) draw(); });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('#themeToggle')) setTimeout(draw, 60);
  });
})();
