# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no framework, no build step beyond copying public files into `dist/` (see `netlify.toml`). Deployed with the Netlify CLI to the `portfoliohalima` site (https://portfoliohalima.netlify.app). Source at https://github.com/HalimaF/portfolio-site.

## Users

Primary (inferred default, user skipped the question): **recruiters and hiring managers** screening for remote full-stack or AI developer roles and internships. They skim fast, often on a phone, and need to know in seconds what she does, what she has shipped, and how to contact her or get her CV.

Secondary: **freelance clients** (founders, small teams) who need a web platform, mobile app or AI workflow built and want proof she ships complete products.

## Product Purpose

Personal portfolio for Halima Fahim, Full-Stack and AI Developer. Success is a visitor who contacts her, downloads her CV, or opens her LinkedIn/GitHub after understanding what she builds. The user's own words: "make sure I can get work easily".

## Positioning

A final-year CS student who already ships complete, production products across web, mobile and agentic AI: a live Odoo operations system for a Qatar retailer (Point Eight), an agentic workflow deployed in a live enterprise client system (Systems Limited), and co-founding a commerce SaaS (MartFlow).

## Operating Context

Visitors arrive from LinkedIn, GitHub, job applications and direct links. Contact is by email, phone, LinkedIn. Based in Lahore, Pakistan (UTC+5), open to remote roles worldwide.

## Capabilities and Constraints

- Static site, no backend, no contact form server.
- Features to keep: theme toggle (light/dark), CV download (`Halima_Fahim_CV.pdf`), "Ask my CV" BM25 search over the CV text (inferred default: keep, but not as the hero).
- Content lives in `index.html`; the search corpus lives in `app.js`.
- Copy rules from the user: no em or en dashes; plain, human tone; never invent skills, numbers, dates or links; private repos shown without a GitHub link.

## Brand Commitments

- Name: **Halima Fahim**. Title: **Full-Stack and AI Developer**.
- Email halima1939531@gmail.com, phone +92 334 4615646, GitHub https://github.com/HalimaF, LinkedIn https://www.linkedin.com/in/halima-fahim-82960b1b2/.
- Headshot supplied by the user: `assets/halima.jpg` (400x400, wears a niqab; use it as given, never crop it in a way that reads as hiding her or apply filters).

## Evidence on Hand

- Full CV content as currently in `index.html` (experience, 7 featured projects, 8 other projects, skills, education, leadership).
- Verified public repo links: Invoiceflow, Repo-Radar, Mental-Health-chatbot, FinAgentPro, Resume-Anlyzer-Maker, GameMart.
- Project screenshots: **not yet supplied**, the user will add them later. Leave easy slots in `assets/projects/`, never use placeholders that look like real screenshots.
- Absent, must not be fabricated: testimonials, client logos, metrics beyond those in the CV, live demo URLs (two Netlify demos exist but were not approved for use).

## Product Principles

1. **Hireable in ten seconds.** Role, availability, proof and contact are visible without scrolling.
2. **Shipped work over claims.** Lead with real, production projects and the facts that prove them.
3. **Nothing invented.** Every word is from her CV; gaps stay empty.
4. **Easy to update.** Adding a project or screenshot should be a copy-paste of one block.

## Accessibility & Inclusion

Keyboard navigable, honours `prefers-reduced-motion`, readable at 320px wide, AA contrast in both themes.
