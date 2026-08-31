# Halima Fahim — portfolio

A single-page editorial portfolio. No build step, no framework, no dependencies.
Three files do all of it.

| File | What it holds |
|---|---|
| `index.html` | Every word on the page |
| `styles.css` | The whole visual system; tokens are at the top |
| `app.js` | Theme, reveals, counters, nav state, drawer, anchors |
| `Halima_Fahim_CV.pdf` | Linked from the hero and the contact section |
| `serve.py` | Local preview server (not part of the deployed site) |

---

## Run it

Double-click `index.html` — it works straight from the filesystem.

To serve it over HTTP instead:

```bash
python serve.py               # opens http://localhost:8000
python serve.py 8000 lan      # also reachable from your phone on the same wifi
```

`serve.py` disables caching on purpose. Python's plain `http.server` sends no
`Cache-Control` header, so browsers keep serving a stale `styles.css` after an
edit — which will cost you an hour if you hit it.

---

## Put it online

**GitHub Pages:** create a repo, push these files to `main`, then
Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
Name the repo exactly `HalimaF.github.io` and it serves at
`https://halimaf.github.io/`.

**Netlify / Vercel / Cloudflare Pages:** drag the folder in. No build command,
publish directory `.`.

Don't deploy `serve.py`, `_archive/` or `.impeccable/` — all three are
gitignored already.

---

## The design

An editorial print direction: warm paper stock, ink-black text, one accent, and
hierarchy built from type size and whitespace rather than decoration.

Deliberately **not** used, because each is a signature of the generated-portfolio
look this replaced:

- gradients of any kind, including gradient-filled text
- glow, bloom and drop shadows
- glassmorphism / backdrop-blurred cards
- floating blurred orbs
- pill-shaped buttons
- card grids

Structure comes from hairline rules. Emphasis comes from the single accent.
If you add a section, keep to that and it will fit.

**Type**

| Role | Face |
|---|---|
| Display | Instrument Serif (the name, section headings, pull quotes) |
| Body | IBM Plex Sans |
| Labels, meta, numbers | IBM Plex Mono, uppercase, letterspaced |

**Colour** — the top of `styles.css`. Change these four and the whole site
follows:

```css
--paper:  #F4F1EA;   /* warm stock, not white */
--ink:    #16150F;   /* near-black, warm      */
--accent: #C2410C;   /* burnt vermilion       */
--rule:   #DAD3C2;   /* hairline              */
```

There are two themes, `paper` and `night`, defined in that same block. `night`
is a warm dark — deliberately not blue-black. The toggle sits in the masthead
and remembers your choice; with no choice stored it follows your OS setting.

---

## Editing it

**Text** — `index.html`, directly. Sections are marked with comment banners
(`<!-- ===== WORK ===== -->`).

**Adding a project** — copy a `<li class="work">` block and edit it. Bump the
`work-num`. Drop the `<a>` wrapper on the `<h3>` if there's no repo to link.

**Adding an experience entry** — copy a `<li class="entry">` block. The date
column and the body are two grid cells; leave the structure alone and it lines
up.

**The ledger numbers** — `data-to` is the figure each one counts up to.

---

## Motion

Restrained by design: a short fade-and-rise as each block enters the viewport,
counters that tick up once, and an underline that grows under the active nav
link. That is the whole inventory — there is no canvas, no parallax, no
scroll-jacking.

`data-delay` on a `.reveal` element staggers it (`1` = 70ms, `2` = 140ms, and
so on).

Under `prefers-reduced-motion: reduce` everything renders in place instantly.
That is a real skip, not a slowdown.

---

## Checked

- No horizontal overflow at 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 /
  1920px, measured as `documentElement.scrollWidth === clientWidth`
- Both themes
- Keyboard navigable: skip link, focus-visible rings, anchors move focus to the
  section they point at
- Prints cleanly — the masthead and drawer drop out

Not checked: real mobile hardware, and browsers other than Chrome.

---

## Content notes

Everything on the page comes from the CV. Nothing is invented — there are no
metrics, client names or accuracy figures, because those weren't in the CV and
an unverifiable number is worse than no number.

Two things worth adding when you have them:

1. **Real figures on the projects.** If you measured anything on FinAgent Pro —
   extraction accuracy, documents per minute, review hours saved — that is the
   single most persuasive thing you could add.
2. **A live demo link** for anything deployed.

The previous version of this site is in `_archive/`, and the full history is in
git if you want any of it back.
