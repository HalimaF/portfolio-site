/* =============================================================
   Halima Fahim — editorial portfolio

   Theme, reveals, counters, nav state, drawer, anchors, and the
   retrieval engine in the hero.
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

  if (stored === 'paper' || stored === 'night') applyTheme(stored);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('night');
  else applyTheme('paper');

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
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
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
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('.count');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) counters.forEach(runCount);
    else {
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
  var menuBtn = $('#menuBtn'), drawer = $('#mobileMenu');
  function setMenu(open) {
    if (!menuBtn || !drawer) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
    drawer.hidden = !open;
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  if (drawer) drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });

  /* =============================================================
     7. RETRIEVAL OVER THE CV

     A real ranked-retrieval engine, not a chat box. It indexes the
     résumé below with BM25 — the standard lexical ranking function —
     and returns the passages that actually match, scored.

     It is deliberately NOT a language model. It cannot answer in
     sentences, and it cannot invent anything: every word it shows is a
     word already written further down the page. On a portfolio where
     nothing else is fabricated, a hallucinating chatbot would be the
     one dishonest thing on it.

     THE CORPUS IS THE ONLY THING TO EDIT. Add an entry and it becomes
     searchable; the index rebuilds on load.
     ============================================================= */
  (function retrieval() {
    var input   = $('#askInput');
    var results = $('#askResults');
    if (!input || !results) return;

    /* ---- the corpus: every passage comes from the CV ---- */
    var CORPUS = [
      { s: 'Experience', t: 'AI Intern, Systems Limited', a: '#experience',
        x: 'Built agentic AI workflows for an enterprise client using LangChain, LangGraph, FastAPI and SQLAlchemy.' },
      { s: 'Experience', t: 'AI Intern, Systems Limited', a: '#experience',
        x: 'Implemented security features for AI agents, constraining agent behaviour to safe, reliable, approved actions.' },
      { s: 'Experience', t: 'AI Intern, Systems Limited', a: '#experience',
        x: 'Designed multi-agent architectures and integrated them with backend services and database layers.' },
      { s: 'Experience', t: 'Backend Intern, Dr Coders', a: '#experience',
        x: 'Designed, built and maintained RESTful APIs supporting scalable web applications.' },
      { s: 'Experience', t: 'Backend Intern, Dr Coders', a: '#experience',
        x: 'Integrated backend components to streamline data flow and improve system efficiency.' },
      { s: 'Experience', t: 'Backend Intern, Dr Coders', a: '#experience',
        x: 'Collaborated with frontend developers to define API contracts and deliver features to production.' },
      { s: 'Experience', t: 'Project Management Intern, Excelerate', a: '#experience',
        x: 'Coordinated planning and delivery tracking for a fully remote, cross-functional team across multiple time zones.' },

      { s: 'Work', t: 'FinAgent Pro', a: '#work',
        x: 'A multi-agent pipeline that ingests financial documents, extracts structured fields with LayoutLMv3 and OCR, and flags fraud signals via FinBERT.' },
      { s: 'Work', t: 'FinAgent Pro', a: '#work',
        x: 'Automates financial document workflows end to end, replacing manual field entry and review. Python, LangChain, LayoutLMv3, FinBERT, OCR.' },
      { s: 'Work', t: 'Smart Resume Analyzer', a: '#work',
        x: 'A full-stack app that parses resumes, extracts skills and experience, and scores them against a target job description. JavaScript, Python, Flask.' },
      { s: 'Work', t: 'Smart Resume Analyzer', a: '#work',
        x: 'Generates ATS-style feedback on formatting, keyword coverage and section structure.' },
      { s: 'Work', t: 'Sales, Inventory & HR System', a: '#work',
        x: 'A Flask dashboard unifying sales forecasting, inventory tracking and employee records, built over historical transaction data. Python, Flask, Pandas, SQL.' },

      { s: 'Toolkit', t: 'Languages', a: '#skills', x: 'Python, SQL, JavaScript.' },
      { s: 'Toolkit', t: 'AI & ML', a: '#skills',
        x: 'LangChain, LangGraph, Hugging Face Transformers, scikit-learn, FinBERT, LayoutLMv3, OCR.' },
      { s: 'Toolkit', t: 'Backend', a: '#skills', x: 'FastAPI, Flask, SQLAlchemy, REST API design.' },
      { s: 'Toolkit', t: 'Data', a: '#skills',
        x: 'Pandas, NumPy, feature engineering, data preprocessing, data pipelines.' },
      { s: 'Toolkit', t: 'Frontend & tools', a: '#skills', x: 'React, HTML/CSS, Git, GitHub, Selenium.' },

      { s: 'Education', t: 'BS Computer Science', a: '#education',
        x: 'Kinnaird College for Women, Lahore, 2023 to 2027 expected. Coursework: Machine Learning, Data Structures and Algorithms, Database Systems, Operating Systems.' },
      { s: 'Education', t: 'Leadership', a: '#education',
        x: 'Logistics Director, IEEE Women in Engineering. Senior Representative, Computer Science Club. Ambassador, IEEE Xtreme 19.0.' },

      { s: 'Availability', t: 'Open to work', a: '#contact',
        x: 'Available part-time immediately and full-time from June 2027. Open to remote and contract roles worldwide. Based in Lahore, Pakistan, UTC+5.' }
    ];

    /* ---- tokenising ---- */
    var STOP = {};
    ('a an the and or of to in for with on at by is are was were be been it its this that as from into '
     + 'his her their your our i she he they them we you').split(' ')
      .forEach(function (w) { STOP[w] = 1; });

    // crude suffix stripping — enough to bind plurals and gerunds together
    function stem(w) {
      if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
      if (w.length > 4 && /(ed|es)$/.test(w)) return w.slice(0, -2);
      if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
      return w;
    }

    function tokenise(text) {
      var raw = String(text).toLowerCase().match(/[a-z0-9+#.]+/g) || [];
      var out = [];
      for (var i = 0; i < raw.length; i++) {
        var w = raw[i].replace(/^\.+|\.+$/g, '');
        if (!w || STOP[w] || w.length < 2) continue;
        out.push(stem(w));
      }
      return out;
    }

    /* ---- index ---- */
    var N = CORPUS.length, df = {}, avgdl = 0, docs = [];

    CORPUS.forEach(function (d) {
      var toks = tokenise(d.t + ' ' + d.x + ' ' + d.s);
      var tf = {}, seen = {};
      toks.forEach(function (w) {
        tf[w] = (tf[w] || 0) + 1;
        if (!seen[w]) { seen[w] = 1; df[w] = (df[w] || 0) + 1; }
      });
      docs.push({ d: d, tf: tf, dl: toks.length });
      avgdl += toks.length;
    });
    avgdl = avgdl / N || 1;

    var K1 = 1.5, B = 0.75;

    function search(q) {
      var terms = tokenise(q);
      if (!terms.length) return { terms: [], hits: [] };

      var scored = docs.map(function (doc) {
        var score = 0;
        terms.forEach(function (w) {
          var f = doc.tf[w];
          if (!f) return;
          var n = df[w] || 0;
          var idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
          score += idf * (f * (K1 + 1)) / (f + K1 * (1 - B + B * doc.dl / avgdl));
        });
        return { doc: doc.d, score: score };
      });

      scored = scored.filter(function (r) { return r.score > 0; })
                     .sort(function (a, b) { return b.score - a.score; })
                     .slice(0, 4);
      return { terms: terms, hits: scored };
    }

    /* ---- rendering ---- */
    function esc(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function highlight(text, terms) {
      var set = {};
      terms.forEach(function (t) { set[t] = 1; });
      return esc(text).replace(/[A-Za-z0-9+#]+/g, function (word) {
        return set[stem(word.toLowerCase())] ? '<mark>' + word + '</mark>' : word;
      });
    }

    function render(q) {
      var res = search(q);

      if (!res.terms.length) {
        results.innerHTML = '<p class="ask-empty">Type a term, or pick one above.</p>';
        return;
      }
      if (!res.hits.length) {
        results.innerHTML = '<p class="ask-empty">No passage matches &ldquo;' + esc(q) + '&rdquo;.</p>';
        return;
      }

      var top = res.hits[0].score || 1;
      results.innerHTML = res.hits.map(function (h) {
        var pct = Math.max(6, Math.round((h.score / top) * 100));
        return '<a class="hit" href="' + h.doc.a + '">'
             +   '<p class="hit-meta">' + esc(h.doc.s) + ' &#183; <b>' + esc(h.doc.t) + '</b>'
             +     '<span class="hit-score">' + h.score.toFixed(2) + '</span></p>'
             +   '<div class="hit-bar"><i style="width:' + pct + '%"></i></div>'
             +   '<p class="hit-text">' + highlight(h.doc.x, res.terms) + '</p>'
             + '</a>';
      }).join('');
    }

    /* ---- wiring ---- */
    var timer = null;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { render(input.value); }, 90);
    });

    $$('.ask-chips button').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-q');
        render(input.value);
        input.focus();
      });
    });

    /* ---- demonstrate itself ----------------------------------------
       People do not read a label above an empty search box; they read a
       box that is visibly doing something. So on load it types a query
       itself, one character at a time, re-ranking as it goes. Any real
       interaction cancels it immediately and hands control back. */
    var demoTimer = null, demoLive = false;

    function stopDemo() {
      demoLive = false;
      clearTimeout(demoTimer);
    }

    ['focus', 'keydown', 'input', 'pointerdown'].forEach(function (ev) {
      input.addEventListener(ev, stopDemo);
    });

    if (reduced) {
      input.value = 'agentic AI';
      render(input.value);
    } else {
      render('agentic AI multi-agent');       // something on screen at once
      demoLive = true;
      var phrase = 'fraud detection', ci = 0;

      demoTimer = setTimeout(function tick() {
        if (!demoLive) return;
        ci++;
        input.value = phrase.slice(0, ci);
        render(input.value);
        if (ci < phrase.length) demoTimer = setTimeout(tick, 80);
      }, 1100);
    }
  })();

  /* ---------- 8. ANCHORS ---------- */
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
