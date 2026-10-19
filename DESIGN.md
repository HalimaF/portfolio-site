---
name: Halima Fahim
description: Hiring portfolio for a Full-Stack and AI Developer; identity pinned left, evidence scrolling right.
colors:
  accent: "#C2410C"
  accent-ink: "#FFFFFF"
  accent-soft: "#FDEEE6"
  accent-text: "#9A3412"
  live: "#15803D"
  live-soft: "#E7F6EC"
  bg: "#FBFBFC"
  bg-raise: "#FFFFFF"
  bg-hover: "#F2F2F5"
  ink: "#121318"
  ink-2: "#3F424C"
  ink-3: "#6B6F7B"
  rule: "#E4E4E9"
  accent-dark: "#FF7A3D"
  accent-ink-dark: "#1A0B03"
  accent-soft-dark: "#2A1A12"
  accent-text-dark: "#FF9A66"
  live-dark: "#4ADE80"
  live-soft-dark: "#13241A"
  bg-dark: "#0D0E12"
  bg-raise-dark: "#15161C"
  bg-hover-dark: "#17181F"
  ink-dark: "#EDEDF0"
  ink-2-dark: "#B4B6BF"
  ink-3-dark: "#858996"
  rule-dark: "#262832"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.4rem, 4vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)"
    fontWeight: 700
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.32rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title-sm:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  role:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 500
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.08em"
  meta:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.01em"
    fontFeature: "tnum"
rounded:
  xs: "6px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  pill: "999px"
  round: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "48px"
  xxl: "72px"
components:
  button:
    backgroundColor: "{colors.bg-raise}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "42px"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "42px"
  button-sm:
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "34px"
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    size: "38px"
  tag:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  tag-neutral:
    backgroundColor: "{colors.bg-hover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  list-row:
    rounded: "{rounded.lg}"
    padding: "20px"
  list-row-hover:
    backgroundColor: "{colors.bg-raise}"
  search-panel:
    backgroundColor: "{colors.bg-raise}"
    rounded: "{rounded.lg}"
    padding: "22px"
  search-input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 14px 0 42px"
    height: "46px"
  search-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
---

# Design System: Halima Fahim

## Overview

**Creative North Star: "The Hiring Page"**

A recruiter should get role, availability, proof and contact in ten seconds. The system serves that by staying out of the way: a cool white (or near-black) ground, ink text in three strengths, hairline rules, and one burnt orange taken from her headshot that marks actions and links and almost nothing else. Everything is set in Schibsted Grotesk; dates and scores use tabular numerals.

The page is a split. On desktop the identity column (photo, name, role, pitch, open-to-work status, Email and CV buttons, section nav, socials) is pinned while the evidence column scrolls. Density is calm and editorial: generous section gaps, rows with a fixed 150px date gutter, prose capped at 66ch. Depth is almost absent; surfaces are separated by tone and 1px rules, and only interactive rows earn a soft lift.

The build refuses stats bands, eyebrows above headings and section numbers. Section headings are themselves the small uppercase labels; there is nothing above them.

**Key Characteristics:**
- Two-column split above 1024px, identity sticky, evidence scrolling.
- One accent hue, used for actions, links, the active nav line, focus and search highlights.
- Three-step ink ramp (ink, ink-2, ink-3) carries all hierarchy that size does not.
- Hairline borders, 10px/14px corners, pill tags.
- Light and dark themes from the same token names; system preference respected, manual toggle persisted.
- Motion is short and eased with one curve; all of it collapses under reduced motion.

## Colors

Restrained near-neutral grounds with one warm signal colour and one green reserved for "live" status.

### Primary
- **Burnt Orange** (`accent`; dark: `accent-dark`): fill of the primary button, the active section-nav line, the search result score bar, focus outlines, text selection, the caret, and the email underline. Taken from the headshot.
- **Deep Rust Text** (`accent-text`; dark: `accent-text-dark`): accent used as text on light grounds where the fill tone would be too weak; hovered links, hovered project titles, tag text, search highlight text.
- **Peach Wash** (`accent-soft`; dark: `accent-soft-dark`): tag backgrounds, search `mark` backgrounds, the focus halo of the search input, archive link hover.
- **Accent Ink** (`accent-ink`; dark: `accent-ink-dark`): text on the accent fill. White in light mode, near-black brown in dark mode because the dark accent is lighter.

### Secondary
- **Live Green** (`live`, `live-soft`; dark variants): only for availability and production status, the status dot with its soft 3px ring and the "Live in production" / "Deployed" badges. Never decorative.

### Neutral
- **Cool Paper** (`bg`): page ground.
- **Raised White** (`bg-raise`): buttons, the search panel, a hovered linked row.
- **Hover Grey** (`bg-hover`): icon-button hover, search hit hover, neutral skill tags, empty screenshot ground.
- **Ink** (`ink`): headings, strong text, button labels.
- **Ink 2** (`ink-2`): body copy (the body default is ink-2, not ink).
- **Ink 3** (`ink-3`): dates, meta, placeholders, the inactive nav, bullet dashes.
- **Rule** (`rule`): every 1px border and divider, plus the scrollbar thumb.

### Named Rules
**The One Signal Rule.** Burnt orange means "you can act here" or "you are here". It never fills a section, a card or a heading.

**The Live Means Live Rule.** Green appears only on verified availability or production status. A badge that is not literally true stays neutral.

**The Same Names Rule.** Dark mode redefines the same custom properties; components never branch on theme. A new colour needs a light and a dark value at once.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui, -apple-system, Segoe UI)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** ui-monospace stack (Cascadia Code, SF Mono, Menlo) for inline `code` only

**Character:** One grotesk across weights 400 to 800 does all the work; hierarchy comes from weight, negative tracking at large sizes, and the ink ramp rather than from a second face.

### Hierarchy
- **Display** (800, clamp(2.4rem, 4vw, 3.2rem), 1.02, -0.03em): her name, once.
- **Headline** (700, clamp(1.9rem, 3.4vw, 2.6rem), -0.03em): the contact heading only.
- **Title** (700, 1.32rem, 1.25, -0.02em): project titles and the archive sub-heading.
- **Title small** (600, 1.06rem, 1.35, -0.01em): experience and education entry titles.
- **Body** (400, 16px, 1.65): prose, capped at 66ch; the pitch at 34ch, the contact lead at 52ch.
- **Body small** (400, 15px): entry descriptions, bullets, skill names.
- **Label** (600, 13px, 0.08em, uppercase): section headings; the section nav uses 500 at 0.06em.
- **Meta** (400, 12.5 to 14px, tabular numerals for dates and scores): dates, locations, sub-lines, tag text, notes.

### Named Rules
**The Tabular Dates Rule.** Every date column and numeric score uses `font-variant-numeric: tabular-nums` so ranges align down the gutter.

**The No Dashes Rule.** Copy carries no em or en dashes (PRODUCT.md). Ranges and asides are written with "to", commas or a middle dot; the type system offers no dash glyph styling.

## Layout

Mobile-first single column inside a 1200px shell (24px side padding).

- **1024px and up:** the shell becomes a grid of 5fr / 7fr with a 72px gap and 48px side padding. The identity column is `position: sticky`, full viewport height, its content spaced between top (72px) and bottom (48px). The evidence column gets the same 72px top padding.
- **1024px+ and max-height 860px:** compact identity column: 44px/28px padding, 72px avatar, tighter status/CTA/nav gaps, and the column scrolls internally with a hidden scrollbar so links are never clipped.
- **1024px+ and max-height 700px:** the section nav is hidden entirely.
- **Below 1024px:** one column; a fixed mobile action bar slides in once the identity block has scrolled away; scroll padding grows to 64px to clear it; shell padding 20px.
- **640px and below:** shell padding 16px; list rows and skill rows drop the 150px gutter to a single column; the archive table re-flows into a two-column grid (text, link) with its header hidden; buttons grow to 44px for touch.

Rhythm: sections at 56px top padding, section heading 24px above content, row gaps 6px, row padding 20px, 150px date/label gutter with a 20px gap shared by experience rows, project rows with screenshots, and skill rows.

**The Gutter Rule.** Anything chronological or categorical (dates, skill groups, screenshots) sits in the 150px left gutter; content sits right of it.

## Elevation & Depth

Flat by default. Depth comes from tonal steps (bg, bg-raise, bg-hover) and 1px `rule` borders. There are exactly two shadows, both responses to state or status.

### Shadow Vocabulary
- **Row lift** (`box-shadow: 0 6px 24px -12px rgb(0 0 0 / .12)`): a linked list row on hover, with a raised background and a rule border.
- **Status halo** (`box-shadow: 0 0 0 3px var(--live-soft)`): the availability dot. The search input's focus halo uses the same 3px ring shape in `accent-soft`.

### Named Rules
**The Lift Only When It Links Rule.** A row lifts on hover only if it contains a link (the stretched link covers the row). Rows that go nowhere never pretend to be clickable. Hover lift is also gated behind `(hover: hover)`.

## Shapes

Gently rounded. Controls and inputs use 10px; rows, the search panel and the stretched-link hit area use 14px; screenshots, search hits and archive icon links use 8px; tags and chips are full pills; the avatar and dots are circles. Borders are always 1px `rule` (or transparent until hover). Small decorative marks are drawn with CSS, not glyphs: a 6px hairline for bullets, a 5px dot before badges, a 48px line in the nav.

## Components

### Buttons
Quiet, solid, one per intent.
- **Shape:** 10px corners, 42px tall (44px at 640px and below), 16px horizontal padding, 500 weight at 15px, 8px icon gap.
- **Default:** raised white ground, rule border, ink label. Hover darkens the border to ink-3.
- **Primary:** accent fill and border, accent-ink label. Hover brightens by 8%. Reserved for email/hire actions.
- **Small:** 34px tall, 12px padding, 14px text; used in the mobile bar.
- **Active:** 1px press down. **Focus:** 2px accent outline, 3px offset (global focus rule for links, buttons and inputs).

### Theme Toggle
A 38px square (34px in the mobile bar), 10px corners, transparent ground, rule border, ink-2 icon; hover goes to ink with an ink-3 border. Shows a sun in light and a moon in dark, following the resolved theme (explicit choice or system preference). Stroke icons are inline SVG at 1.8 stroke width.

### Section Nav
Desktop only. Uppercase 13px labels in ink-3, each preceded by a 48px hairline scaled to half width. Hover and the active section scale the line to full width and turn the label ink; the active line also turns accent and thickens to 2px. Transitions 0.25 to 0.35s on the shared ease. Active state is set by scroll position.

### List Rows
Experience, projects and education. 150px date gutter plus content, 20px padding, 14px corners, transparent border at rest. Rows with a stretched link lift on hover (see Elevation); project titles shift to accent-text and their arrow nudges 2px up-right. Projects without a screenshot use one column; adding an `<img class="shot">` (16:10, 8px corners, rule border, bg-hover ground) switches the row to the gutter layout. Screenshot slots ship as commented-out `<img class="shot">` lines in each project; uncomment to add one, never fill with lookalike placeholders.

### Tags
Pills, 12.5px 500, 6px 10px padding, 6px gap. Default is accent-soft with accent-text (technology on an entry); inside the Skills list they turn neutral (bg-hover with ink) so the accent does not flood a whole section.

### Badges
Inline facts after an entry's description: 13px ink-2 text, each preceded by a 5px ink-3 dot, 6px/14px gaps. The live variant colours text and dot in `live` at 500 weight.

### Archive Table
Full-width, 14.5px, rows divided by rule hairlines, 14px vertical padding. Header in 12.5px ink-3; the project name column in ink 500 at 44% width with an optional ink-3 note line; the final column is a 30px icon link that hovers to accent-text on accent-soft. At 640px the table re-flows to a grid with the link spanning two rows on the right.

### CV Search Box
A raised panel (bg-raise, rule border, 14px corners, 22px padding; 16px on phones). The input is 46px, bg ground, 10px corners, with an inset search icon; focus turns the border accent with a 3px accent-soft halo instead of an outline. Suggestion chips are outline pills that hover to an accent border and accent-text. Each hit shows meta in 12.5px, a tabular score, a 2px accent score bar on a rule track, and matched terms highlighted with accent-soft marks. An honesty note sits below in 12.5px ink-3.

### Mobile Action Bar
Below 1024px only. Fixed to the top, 88% bg mixed with transparency, `saturate(1.4) blur(10px)` backdrop, rule bottom border. Holds a 28px round avatar with the name, the theme toggle and a small primary "Hire me" button. Hidden above the viewport until the identity block scrolls off, then slides down over 0.35s.

### Links
The "more" link is ink 500 with a 1.5px rule-coloured underline at 5px offset that turns accent-text on hover. The email link is larger (clamp 1.15 to 1.6rem, 600) with a 2px accent underline at 6px offset.

## Do's and Don'ts

### Do:
- **Do** take every colour from the custom properties and give any new one both a light and a dark value.
- **Do** keep burnt orange to actions, links, the active nav line, focus and search highlights.
- **Do** put dates, skill groups and screenshots in the 150px gutter, with tabular numerals for dates.
- **Do** let only linked rows lift, and only on hover-capable devices.
- **Do** use the shared ease `cubic-bezier(.16,1,.3,1)` at 0.2 to 0.35s, and keep everything working with reduced motion.
- **Do** draw small marks (bullets, badge dots, nav lines) with CSS and icons as inline stroke SVG.
- **Do** keep copy free of em and en dashes.

### Don't:
- **Don't** add eyebrow labels above headings, section numbers or stats bands.
- **Don't** add shadows beyond the row lift and the 3px status/focus rings.
- **Don't** use green for anything that is not literal live or available status.
- **Don't** fill tags with accent inside dense neutral lists like Skills.
- **Don't** add placeholder imagery in screenshot slots; leave the commented `<img class="shot">` line until a real screenshot exists.
- **Don't** crop or filter the headshot; it is used as supplied, round, with a rule border.
