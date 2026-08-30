# Halima Fahim — portfolio

A single-page animated portfolio. No build step, no framework, no `npm install`.
Three files do everything.

| File | What it holds |
|---|---|
| `index.html` | All the content — every word on the page is here |
| `styles.css` | The whole visual system; colours are tokens at the top |
| `app.js` | Theme toggle, scroll reveals, typewriter, counters, nav, tilt |
| `Halima_Fahim_CV.pdf` | Linked by both "Download CV" buttons |

---

## Run it

Just double-click `index.html`. It works straight from the filesystem —
there are no ES modules, so no local server is needed.

If you'd rather serve it:

```bash
python -m http.server 8000    # then open http://localhost:8000
```

---

## Put it online

**GitHub Pages** (free):

1. Create a repo and push these files to `main`.
2. Repo -> Settings -> Pages -> Source: *Deploy from a branch* -> `main` / `/ (root)`.
3. Live in a minute or two.

Name the repo exactly `HalimaF.github.io` and it serves at
`https://halimaf.github.io/` as your main profile site.

**Netlify / Vercel / Cloudflare Pages**: drag the folder in. No build command,
publish directory `.`.

---

## Editing it

**Text** — open `index.html` and edit it directly. Sections are marked with big
comment banners (`<!-- ===== PROJECTS ===== -->`) so they're easy to find.

**Colours** — the top of `styles.css`. Change these four and the whole site
follows, including the gradients:

```css
--a1: #7c6bff;   /* violet */
--a2: #2ad0e0;   /* cyan   */
--a3: #ff7ab8;   /* pink   */
```

**The rotating job titles** — `ROLES` near the top of `app.js`.

**Adding a project** — copy an `<article class="proj reveal tilt">` block in the
projects section and edit it. Bump the `proj-idx` number. Drop the
`<a class="proj-link">` if there's no repo to link to.

**The stats band** — `data-to` is the number it counts up to.

---

## The hero scene

The visual in the hero is a real 3D renderer written by hand in `app.js`
(section 11) on a plain 2D canvas — no WebGL, no Three.js, no library.

It draws the actual LangGraph topology from your Systems Limited work: `input`
fans out to `retrieve`, `guardrail` and `memory`, and everything converges on
`respond`. The moving points of light are requests travelling that graph.

The depth is genuine, not faked with layers: every node is rotated in 3D,
projected through a focal length, sorted back-to-front, and dimmed by distance,
so the far side of the graph sits behind the near side as it turns. Moving the
mouse eases the camera. It renders at device pixel ratio (capped at 2x) so it
stays crisp on retina and 4K displays.

It stops drawing entirely when scrolled off-screen or when the tab is in the
background, so it costs nothing when it isn't visible.

To change the graph, edit `NODES` and `EDGES` at the top of that section — the
labels, colours, packets and layout all follow from those two arrays.

## What's animated

- Floating gradient orbs behind everything
- A cursor-following spotlight (desktop, fine pointer only)
- Scroll-progress bar in the top border
- Reveal-on-scroll for every section, staggered via `data-delay`
- Typewriter cycling job titles; the code panel types itself out
- Count-up stat numbers
- 3D tilt on the hero card and project cards
- Dashed, flowing edges and pulsing nodes in the agent graph

All of it is disabled under `prefers-reduced-motion: reduce` — that isn't a
slowdown, the animations genuinely stop and everything renders in place.

---

## Checked

- No horizontal overflow at 320 / 360 / 390 / 430 / 768 / 1024 / 1440 / 1920px
  (measured as `documentElement.scrollWidth === clientWidth` at each size)
- The hero fits above the fold at every one of those sizes, including short
  laptop viewports at 125-150% Windows scaling
- On phones the name and buttons come first; the 3D scene follows them
- Light and dark themes; follows the OS setting, toggle overrides and persists
- Keyboard navigable, skip link, focus-visible rings, anchor focus handoff
- Prints cleanly (background effects and nav drop out)

---

## Content notes

Everything on the page comes from your CV — the internships, the three projects,
the coursework, the leadership roles. Nothing is invented: there are no metrics,
client names, or accuracy figures, because those weren't in the CV and a number
nobody can verify is worse than no number.

Two things worth adding when you have them:

1. **Numbers on the projects.** If you measured anything on FinAgent Pro —
   extraction accuracy, documents per minute, hours saved — that is the single
   most persuasive thing you could add.
2. **A live demo link** for anything that's deployed.

The previous version of this site is in `_archive/` if you ever want anything
back from it.
