# Halima Fahim, portfolio

Live at https://portfoliohalima.netlify.app

A single-page portfolio. Plain HTML, CSS and JS, no framework, no dependencies.

| File | What it holds |
|---|---|
| `index.html` | Every word on the page |
| `styles.css` | The whole visual system; colour tokens for light and dark are at the top |
| `app.js` | Theme toggle, active section nav, mobile bar, anchors, CV search |
| `assets/halima.jpg` | Headshot |
| `assets/projects/` | Project screenshots (see below) |
| `Halima_Fahim_CV.pdf` | Linked from the Download CV buttons |
| `DESIGN.md` / `PRODUCT.md` | Design system and product notes |

## Run it locally

```bash
python serve.py        # http://localhost:8000, caching disabled
```

## Deploy

```bash
netlify deploy --build          # draft preview
netlify deploy --build --prod   # live
```

`netlify.toml` copies only the public files (`index.html`, `styles.css`, `app.js`, the CV and `assets/`) into `dist/`, so `_archive/`, `.impeccable/` and `serve.py` are never published. If you add a new top-level file the page needs, add it to the list in `netlify.toml`.

The Netlify site is still connected to the old `HalimaF/Portfolio` repo. To deploy on every push, link this repo in Netlify: Site configuration, Build & deploy, Link repository.

## Editing

- **Text:** edit `index.html` directly. No em or en dashes in the copy.
- **Project screenshot:** save the image in `assets/projects/` (for example `point-eight.jpg`, about 1200px wide), then uncomment the `<img class="shot">` line inside that project in `index.html`.
- **New project:** copy one `<li class="item project">` block. For a public repo, wrap the title in `<a class="stretch" href="...">` so the whole row becomes a link.
- **CV search:** the searchable text is the `CORPUS` array in `app.js`. Add an entry when you add content and it is indexed on the next load.
