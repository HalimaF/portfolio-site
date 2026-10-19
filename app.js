/* =============================================================
   Halima Fahim, portfolio
   Theme, active section, mobile bar, anchors, and BM25 search
   over the CV text.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. THEME (light / dark, follows the OS until chosen) ---------- */
  var root = document.documentElement;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : darkQuery.matches;
  }
  function syncLabels() {
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('hf-theme', next); } catch (e) {}
      syncLabels();
    });
  });
  syncLabels();

  /* ---------- 2. YEAR ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 3. ACTIVE SECTION + MOBILE BAR ---------- */
  var tocLinks = $$('.toc a');
  var sections = tocLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);
  var mbar = $('#mbar'), side = $('.side');

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var line = y + window.innerHeight * 0.35;
    var activeId = sections.length ? sections[0].id : null;
    sections.forEach(function (sec) { if (sec.offsetTop <= line) activeId = sec.id; });
    // at the very bottom the last short section can never cross the line
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4 && sections.length) {
      activeId = sections[sections.length - 1].id;
    }
    tocLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
    });
    // mobile: the bar appears once the identity block (with its buttons) has scrolled away
    if (mbar && side) mbar.classList.toggle('on', side.getBoundingClientRect().bottom < 0);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* =============================================================
     4. SEARCH OVER THE CV

     A real ranked-retrieval engine, not a chat box. It indexes the
     CV text with BM25 and returns the passages that actually match,
     scored. It cannot invent anything: every word it shows is a word
     already written on the page.

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
        x: 'Built agentic AI workflows for an enterprise client with LangChain, LangGraph, FastAPI and SQLAlchemy, deployed in a live client system.' },
      { s: 'Experience', t: 'AI Intern, Systems Limited', a: '#experience',
        x: 'Designed multi-agent roles, tool access and orchestration. Added access controls so agents could only take safe, approved actions.' },
      { s: 'Experience', t: 'Co-Founder, MartFlow', a: '#experience',
        x: 'Retail commerce SaaS. Multi-tenant commerce platform integrated with Odoo ERP, with login, per-store catalogue and inventory, and an admin back office.' },
      { s: 'Experience', t: 'Backend Intern, Dr Coders', a: '#experience',
        x: 'Built and maintained REST APIs, agreed API contracts with frontend developers, and shipped features to production.' },
      { s: 'Experience', t: 'Freelance, Amazon Operations', a: '#experience',
        x: 'Work with US clients since 2021. Automate reporting with Python and Amazon\'s Selling Partner API.' },

      { s: 'Work', t: 'Point Eight', a: '#projects',
        x: 'Flask app on top of Odoo via XML-RPC with 130 routes. Inventory dashboards, demand forecasting with Holt-Winters, stock sync to Snoonu and Talabat, purchase orders, cash-outs, payroll.' },
      { s: 'Work', t: 'Point Eight', a: '#projects',
        x: 'AI-written daily sales summary with Gemini or OpenAI. Python, Flask, Odoo, SQLite, Playwright, Selenium.' },
      { s: 'Work', t: 'Rentify', a: '#projects',
        x: 'Rental platform for Pakistan. React 18, Vite, MUI and Tailwind on the web. Node 20, Express, PostgreSQL via Prisma, JWT auth and Zod validation on the API.' },
      { s: 'Work', t: 'Rentify', a: '#projects',
        x: 'Rule-based fraud scoring with an optional Python ML service. Deployed on Render with Docker, CI and 11 test files.' },
      { s: 'Work', t: 'InvoiceFlow', a: '#projects',
        x: 'Agentic accounts-payable automation. A state-machine orchestrator runs five agents. LLM output is checked against a strict schema and self-corrects.' },
      { s: 'Work', t: 'InvoiceFlow', a: '#projects',
        x: 'Catches duplicate invoices and bank-account-change fraud, does 2-way PO matching, and logs every decision with confidence and reasoning.' },
      { s: 'Work', t: 'SheTrack+', a: '#projects',
        x: 'Women\'s health mobile app in Flutter, Dart, Provider, Firebase, Firestore and Cloud Functions. Cycle, symptom, mood and hydration tracking. 104 automated tests.' },
      { s: 'Work', t: 'Repo Radar', a: '#projects',
        x: 'Chrome extension that grades any GitHub repo from 0 to 100, checks dependency vulnerabilities against OSV.dev, and draws the import graph. JavaScript.' },
      { s: 'Work', t: 'Dil-e-Azaad', a: '#projects',
        x: 'Mental health companion. Flask with Hugging Face models, two-layer crisis detection with a classifier, Fernet encryption at rest, Docker and Render.' },
      { s: 'Work', t: 'brandscan', a: '#projects',
        x: 'Python CLI for Amazon FBA wholesale screening through the Keepa API. Computes the maximum unit cost that meets a profit target. 15 test files.' },
      { s: 'Work', t: 'FinAgent Pro', a: '#projects',
        x: 'Multi-agent finance automation for the IBM watsonx Orchestrate Agentic AI Hackathon 2025. FastAPI, 5 orchestrated skills, webhooks.' },
      { s: 'Work', t: 'Smart Resume Analyzer', a: '#projects',
        x: 'Flask, PyMuPDF and EasyOCR extraction, ATS scoring from 0 to 100, PDF report export.' },
      { s: 'Work', t: 'Other projects', a: '#projects',
        x: 'Flight booking site in Next.js 15 and TypeScript. GameMart in React and Express with socket.io chat. NestJS Products API with TypeORM and MySQL. Craftora Flutter community app.' },
      { s: 'Work', t: 'Other projects', a: '#projects',
        x: 'Road Safety Detection with YOLO, OpenCV and PyTorch. TenderX, a multi-agent system for Pakistani government tenders, in progress.' },

      { s: 'Toolkit', t: 'Frontend', a: '#skills',
        x: 'React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind, MUI.' },
      { s: 'Toolkit', t: 'Mobile', a: '#skills', x: 'Flutter, Dart, Firebase/Firestore, Provider.' },
      { s: 'Toolkit', t: 'Backend', a: '#skills',
        x: 'Python, Flask, FastAPI, Node.js, Express, NestJS, SQLAlchemy, Prisma, REST APIs, JWT auth.' },
      { s: 'Toolkit', t: 'Data & AI', a: '#skills',
        x: 'LangChain, LangGraph, LLM APIs, Hugging Face Transformers, PyTorch, scikit-learn, Pandas, NumPy, OpenCV, YOLO.' },
      { s: 'Toolkit', t: 'Databases and tools', a: '#skills',
        x: 'PostgreSQL, MySQL, SQLite, Firestore. Git, GitHub, Docker, CI, Render, Selenium, Playwright, Odoo XML-RPC.' },

      { s: 'Education', t: 'BS Computer Science', a: '#education',
        x: 'Kinnaird College for Women, Lahore, 2023 to 2027 expected. Coursework: Machine Learning, Data Structures and Algorithms, Database Systems, Operating Systems.' },
      { s: 'Education', t: 'Leadership', a: '#education',
        x: 'IEEE Chairperson 2026 to 2027. Logistics Director, IEEE Women in Engineering. Senior Representative, Computer Science Club. Ambassador, IEEE Xtreme 19.0.' },

      { s: 'Availability', t: 'Open to work', a: '#contact',
        x: 'Open to remote roles worldwide. Based in Lahore, Pakistan, UTC+5. Uses Claude Code, Cursor and Copilot every day.' }
    ];

    /* ---- tokenising ---- */
    var STOP = {};
    ('a an the and or of to in for with on at by is are was were be been it its this that as from into '
     + 'his her their your our i she he they them we you').split(' ')
      .forEach(function (w) { STOP[w] = 1; });

    // crude suffix stripping, enough to bind plurals and gerunds together
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
                     .sort(function (a, b) { return b.score - a.score; });
      return { terms: terms, hits: scored.slice(0, 4), all: scored };
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
        input.value = b.textContent;
        render(b.getAttribute('data-q'));
      });
    });
  })();

  /* ---------- 5. ANCHORS: move focus with the scroll ---------- */
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
