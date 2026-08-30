/* =============================================================
   Halima Fahim — portfolio interactions
   No dependencies. No build step.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. THEME ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('hf-theme'); } catch (e) {}

  if (stored) {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('hf-theme', next); } catch (e) {}
    });
  }

  /* ---------- 2. YEAR ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 3. SCROLL REVEALS ---------- */
  var revealables = $$('.reveal');
  revealables.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 4. COUNT-UP STATS ---------- */
  var counters = $$('.count');

  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-to')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduced) { el.textContent = target + suffix; return; }

    var duration = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); countObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- 5. TYPEWRITER ---------- */
  var typedEl = $('#typed');
  var ROLES = [
    'AI / ML Engineer',
    'Agentic AI Developer',
    'Backend Engineer',
    'LangChain · LangGraph · FastAPI'
  ];

  if (typedEl) {
    if (reduced) {
      typedEl.textContent = ROLES[0];
    } else {
      var ri = 0, ci = 0, deleting = false;
      (function type() {
        var word = ROLES[ri];
        ci += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, ci);

        var delay = deleting ? 34 : 62;
        if (!deleting && ci === word.length) { deleting = true; delay = 1900; }
        else if (deleting && ci === 0)       { deleting = false; ri = (ri + 1) % ROLES.length; delay = 340; }
        setTimeout(type, delay);
      })();
    }
  }

  /* ---------- 6. TERMINAL CODE PRINTOUT ---------- */
  var termBody = $('#termBody');
  var CODE = [
    '<span class="c"># secure multi-agent workflow</span>',
    '<span class="k">from</span> langgraph.graph <span class="k">import</span> StateGraph',
    '',
    'g = <span class="f">StateGraph</span>(AgentState)',
    'g.<span class="f">add_node</span>(<span class="s">"guardrail"</span>, policy_check)',
    'app = g.<span class="f">compile</span>()  <span class="c"># via FastAPI</span>'
  ];

  if (termBody) {
    if (reduced) {
      termBody.innerHTML = CODE.join('\n');
    } else {
      var li = 0;
      var printLine = function () {
        if (li >= CODE.length) return;
        termBody.innerHTML += (li ? '\n' : '') + CODE[li];
        li++;
        setTimeout(printLine, 260);
      };
      setTimeout(printLine, 900);
    }
  }

  /* ---------- 7. NAV: stuck state, active link, progress ---------- */
  var nav = $('#nav');
  var progress = $('.scroll-progress span');
  var navLinks = $$('.nav-links a');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('stuck', y > 12);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    var line = y + window.innerHeight * 0.32;
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

  /* ---------- 8. MOBILE MENU ---------- */
  var menuBtn = $('#menuBtn');
  var mobileMenu = $('#mobileMenu');

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileMenu.hidden = !open;
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });

  /* ---------- 9. POINTER EFFECTS ---------- */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var pointer = { nx: 0, ny: 0 };          // -1..1, shared with the 3D scene

  if (finePointer && !reduced) {
    document.body.classList.add('has-pointer');

    var spot = $('.spotlight');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var sx = mx, sy = my, rafId = null;

    function follow() {
      sx += (mx - sx) * 0.12;
      sy += (my - sy) * 0.12;
      if (spot) {
        spot.style.setProperty('--mx', sx + 'px');
        spot.style.setProperty('--my', sy + 'px');
      }
      rafId = Math.abs(mx - sx) > 0.5 || Math.abs(my - sy) > 0.5
        ? requestAnimationFrame(follow) : null;
    }

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (rafId === null) rafId = requestAnimationFrame(follow);
    }, { passive: true });

    $$('#stage, .tilt').forEach(function (card) {
      var strength = card.id === 'stage' ? 5 : 4;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--px', (px * 100) + '%');
        card.style.setProperty('--py', (py * 100) + '%');
        card.style.transform =
          'perspective(1200px) rotateX(' + ((0.5 - py) * strength).toFixed(2) + 'deg)' +
          ' rotateY(' + ((px - 0.5) * strength).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- 10. SMOOTH ANCHORS ---------- */
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

  /* =============================================================
     11. CINEMATIC 3D AGENT-RUNTIME SCENE

     A hand-rolled perspective renderer on a 2D canvas — no WebGL, no
     library. It draws the actual LangGraph topology described in the
     experience section: input fans out to retrieval, a guardrail and
     memory, and everything converges on respond. Packets of light are
     requests moving through that graph.

     Depth is real: nodes are rotated in 3D, projected through a focal
     length, sorted back-to-front, and faded by distance so the far side
     of the graph sits behind the near side.
     ============================================================= */
  (function scene() {
    var canvas = document.getElementById('scene');
    var stage  = document.getElementById('stage');
    if (!canvas || !stage || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var VIOLET = [124, 107, 255],
        CYAN   = [ 42, 208, 224],
        PINK   = [255, 122, 184];

    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

    var NODES = [
      { id: 'input',     x: -1.78, y:  0.05, z:  0.00, c: VIOLET, r: 5.4 },
      { id: 'retrieve',  x: -0.35, y:  0.98, z:  0.55, c: CYAN,   r: 4.6 },
      { id: 'guardrail', x: -0.30, y: -0.98, z: -0.50, c: PINK,   r: 4.6 },
      { id: 'memory',    x: -0.62, y:  0.10, z: -1.18, c: VIOLET, r: 3.9 },
      { id: 'tools',     x:  0.78, y:  0.16, z:  1.08, c: CYAN,   r: 3.9 },
      { id: 'respond',   x:  1.82, y:  0.00, z:  0.05, c: CYAN,   r: 5.4 }
    ];

    var byId = {};
    NODES.forEach(function (n, i) { byId[n.id] = i; });

    var EDGES = [
      ['input', 'retrieve'], ['input', 'guardrail'], ['input', 'memory'],
      ['memory', 'retrieve'], ['retrieve', 'tools'], ['retrieve', 'respond'],
      ['tools', 'respond'],  ['guardrail', 'respond']
    ].map(function (e) { return { a: byId[e[0]], b: byId[e[1]] }; });

    // requests travelling the graph
    var packets = [];
    EDGES.forEach(function (_edge, i) {
      for (var k = 0; k < 3; k++) {
        packets.push({ e: i, t: (k / 3 + i * 0.13) % 1, sp: 0.0017 + Math.random() * 0.0016 });
      }
    });

    // atmospheric depth particles
    var dust = [];
    for (var i = 0; i < 120; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 7.5,
        y: (Math.random() - 0.5) * 5.5,
        z: (Math.random() - 0.5) * 6.5,
        ph: Math.random() * Math.PI * 2
      });
    }

    var W = 0, H = 0, DPR = 1;

    function resize() {
      var r = stage.getBoundingClientRect();
      if (!r.width || !r.height) return;
      // cap at 2x — beyond that the fill cost buys nothing visible
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width  = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    var camX = 0, camY = 0;                 // eased pointer parallax

    function project(p, ry, rx) {
      var cy = Math.cos(ry), sy = Math.sin(ry);
      var x1 =  p.x * cy - p.z * sy;
      var z1 =  p.x * sy + p.z * cy;

      var cx = Math.cos(rx), sx = Math.sin(rx);
      var y1 = p.y * cx - z1 * sx;
      var z2 = p.y * sx + z1 * cx;

      var dist = 4.4;
      var f = 3.1 / (dist + z2);            // perspective divide
      var scale = Math.min(W, H) * 0.30;

      // the graph sits BELOW the floating code panel, not behind it
      return {
        sx: W * 0.50 + x1 * f * scale,
        sy: H * 0.64 + y1 * f * scale,
        f: f,
        z: z2
      };
    }

    function draw(time) {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);

      var ry = time * 0.00016 + camX * 0.34;
      var rx = Math.sin(time * 0.00021) * 0.13 + camY * 0.20;

      /* --- atmospheric dust, far to near --- */
      var d, pr;
      for (var i = 0; i < dust.length; i++) {
        d = dust[i];
        pr = project(d, ry * 0.55, rx * 0.55);
        if (pr.z < -3.6) continue;
        var tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.0011 + d.ph));
        ctx.fillStyle = 'rgba(178,190,225,' + (0.05 + pr.f * 0.14) * tw + ')';
        ctx.beginPath();
        ctx.arc(pr.sx, pr.sy, Math.max(0.4, pr.f * 0.85), 0, 6.2832);
        ctx.fill();
      }

      /* --- project the graph once, reuse everywhere --- */
      var P = NODES.map(function (n) { return project(n, ry, rx); });

      /* --- edges, sorted far to near so the graph reads as a solid --- */
      var order = EDGES.map(function (e, i) {
        return { i: i, z: (P[e.a].z + P[e.b].z) * 0.5 };
      }).sort(function (a, b) { return a.z - b.z; });

      ctx.lineCap = 'round';
      order.forEach(function (o) {
        var e = EDGES[o.i], pa = P[e.a], pb = P[e.b];
        var depth = Math.max(0.12, Math.min(1, (pa.f + pb.f) * 0.5 * 1.5));
        var g = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        g.addColorStop(0, rgba(NODES[e.a].c, 0.30 * depth));
        g.addColorStop(1, rgba(NODES[e.b].c, 0.30 * depth));
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(0.6, depth * 1.5);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      });

      /* --- packets of light travelling the edges --- */
      ctx.globalCompositeOperation = 'lighter';
      for (i = 0; i < packets.length; i++) {
        var pk = packets[i];
        pk.t += pk.sp;
        if (pk.t > 1) pk.t -= 1;

        var e2 = EDGES[pk.e], na = NODES[e2.a], nb = NODES[e2.b];
        var t = pk.t;
        var mid = {
          x: na.x + (nb.x - na.x) * t,
          y: na.y + (nb.y - na.y) * t,
          z: na.z + (nb.z - na.z) * t
        };
        var pp = project(mid, ry, rx);
        var col = t < 0.5 ? na.c : nb.c;
        var fade = Math.sin(t * Math.PI);          // dim at both ends
        var a = 0.75 * fade * Math.min(1, pp.f * 1.6);

        var gl = ctx.createRadialGradient(pp.sx, pp.sy, 0, pp.sx, pp.sy, pp.f * 11);
        gl.addColorStop(0, rgba(col, a));
        gl.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = gl;
        ctx.beginPath();
        ctx.arc(pp.sx, pp.sy, pp.f * 11, 0, 6.2832);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,' + (a * 0.85) + ')';
        ctx.beginPath();
        ctx.arc(pp.sx, pp.sy, Math.max(0.7, pp.f * 1.5), 0, 6.2832);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      /* --- nodes, far to near, with bloom + label --- */
      var nOrder = P.map(function (p, i2) { return { i: i2, z: p.z }; })
                    .sort(function (a, b) { return a.z - b.z; });

      nOrder.forEach(function (o) {
        var n = NODES[o.i], p = P[o.i];
        var depth = Math.max(0.18, Math.min(1, p.f * 1.55));
        var rad = n.r * p.f * 1.25;
        var pulse = 0.82 + 0.18 * Math.sin(time * 0.0022 + o.i * 1.1);

        // bloom
        ctx.globalCompositeOperation = 'lighter';
        var bg = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 7 * pulse);
        bg.addColorStop(0, rgba(n.c, 0.30 * depth));
        bg.addColorStop(0.45, rgba(n.c, 0.07 * depth));
        bg.addColorStop(1, rgba(n.c, 0));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rad * 7 * pulse, 0, 6.2832);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // body + rim
        ctx.fillStyle = 'rgba(10,11,20,' + (0.85 * depth + 0.1) + ')';
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rad, 0, 6.2832);
        ctx.fill();

        ctx.strokeStyle = rgba(n.c, 0.85 * depth);
        ctx.lineWidth = Math.max(0.8, 1.7 * depth);
        ctx.stroke();

        // hot core
        ctx.fillStyle = rgba(n.c, 0.55 * depth * pulse);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rad * 0.42, 0, 6.2832);
        ctx.fill();

        // label
        if (depth > 0.34) {
          ctx.font = '500 ' + Math.max(8, Math.round(9.5 * Math.min(1.25, p.f * 1.5))) +
                     'px "JetBrains Mono", ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = 'rgba(224,228,245,' + (0.30 + 0.42 * (depth - 0.34)) + ')';
          ctx.fillText(n.id, p.sx, p.sy + rad + 13);
        }
      });
    }

    /* --- run loop, only while it can actually be seen --- */
    var raf = null, visible = true, onScreen = true, t0 = 0;

    function frame(ts) {
      if (!t0) t0 = ts;
      draw(ts - t0);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (raf === null && visible && onScreen && !reduced) raf = requestAnimationFrame(frame);
    }
    function stop() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }

    resize();

    if (reduced) {
      draw(4200);                                  // one composed still frame
    } else {
      document.addEventListener('visibilitychange', function () {
        visible = !document.hidden;
        visible ? start() : stop();
      });

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          onScreen = entries[0].isIntersecting;
          onScreen ? start() : stop();
        }, { threshold: 0.01 }).observe(stage);
      }
      start();
    }

    // pointer parallax, eased so the camera glides rather than snaps
    if (finePointer && !reduced) {
      (function ease() {
        camX += (pointer.nx - camX) * 0.045;
        camY += (pointer.ny - camY) * 0.045;
        requestAnimationFrame(ease);
      })();
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        resize();
        if (reduced) draw(4200);
      }).observe(stage);
    } else {
      window.addEventListener('resize', function () {
        resize();
        if (reduced) draw(4200);
      });
    }
  })();
})();
