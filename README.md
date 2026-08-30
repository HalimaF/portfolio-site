# Halima Fahim — portfolio

A single-page animated portfolio. No build step, no framework, no `npm install`.
Three files do everything.

| File | What it holds |
|---|---|
| `index.html` | All the content — every word on the page is here |
| `styles.css` | The whole visual system; colours are tokens at the top |
| `app.js` | Theme toggle, scroll reveals, typewriter, counters, nav, tilt |
| `hero-assembly.js` | The scroll-driven assembly section (self-contained) |
| `hero-assembly.css` | Styles for that section only |
| `serve.py` | Local preview server with caching disabled |
| `Halima_Fahim_CV.pdf` | Linked by both "Download CV" buttons |

---

## Run it

Just double-click `index.html`. It works straight from the filesystem —
there are no ES modules, so no local server is needed.

If you'd rather serve it:

```bash
python serve.py               # opens http://localhost:8000
python serve.py 8000 lan      # also reachable from your phone on the same wifi
```

`serve.py` disables caching. Python's plain `http.server` sends no
`Cache-Control` header, so browsers keep serving a stale `styles.css` after an
edit - which will waste an hour of your life if you hit it.

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

## The scroll-driven assembly section

Between the stats band and About sits a 400vh pinned section where an agent
system assembles itself as you scroll: a request node appears, then router,
tools, memory and the llm call one at a time, edges draw between them, a pulse
of data sweeps the finished graph, and a response node resolves.

It lives in exactly two files, `hero-assembly.js` and `hero-assembly.css`, plus
one `<section class="assembly">` block and two tags in `index.html`. It touches
nothing else - `app.js` and `styles.css` are not involved.

**To remove it:** delete those two files, their `<link>` and `<script>` tags, and
the section block. Nothing else changes.

**To rewrite the captions:** they are plain HTML in that section block. Each
carries the progress window it appears in:

```html
<p class="assembly-caption" data-from="0.25" data-to="0.45">It gets routed.</p>
```

`data-from` / `data-to` are scroll progress, 0 to 1. Keep the windows from
overlapping and only one caption is ever on screen.

**To change the graph:** `NODES` and `EDGES` at the top of `hero-assembly.js`.
Each node carries its position in world units and the `from`/`to` progress
window over which it fades in. Each edge carries its own window plus a `depth`,
which is how many hops it sits from the request node - that is what makes the
data pulse sweep outward in order rather than firing everywhere at once.

**To retime the camera:** the `CAM` keyframe array. Each entry is a progress
point with an x/y position and a zoom. They are interpolated with smootherstep,
so the drift never snaps between keyframes.

The whole thing is one pure function: `render(p)` depends only on scroll
progress, with no state carried between frames - not even the drifting particle
field, which is seeded and positioned from `p`. That is why scrubbing backwards
is exact rather than approximately undone.

Pinning is CSS `position: sticky`. The browser drives it, so there is no scroll
hijacking and no library.

Under `prefers-reduced-motion`, or on viewports narrower than 900px, it binds no
scroll listener at all: the section collapses to a normal-height panel showing
the finished graph, so there is no dead scroll to wade through.

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
