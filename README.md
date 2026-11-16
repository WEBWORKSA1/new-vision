# New.Vision

Free vision board maker & life-design studio — static site for **new.vision**, hosted on GitHub Pages (main branch, root).

- **Tools:** Vision Board Maker, SMART + WOOP Goal Planner, Wheel of Life, Affirmation Generator, Letter to Future Self, printable Vision Workbook
- **Content:** 10 research-informed guides (`/guides/`), curated video library
- **Revenue:** Google AdSense (auto ads), coaching lead funnel, team workshops, coach partner applications, sponsorships, support pledges, Vision Board of the Year contest
- **Self-updating:** the daily prompt, affirmation and featured guide rotate automatically by date in the browser. Optional server-side rotation: move `automation/daily-refresh.yml` into `.github/workflows/` and it will refresh `data/daily.json` and the sitemap every day via `tools/refresh.py`.

## Editing / adding pages
Every page is plain HTML sharing one header/footer, `assets/css/style.css` and `assets/js/main.js`.
- New guide: copy any file in `guides/`, change title, meta description, canonical URL and article body, then add it to `guides.html`, `sitemap.xml` and `data/articles.json`.
- New video: add a `<div class="video" data-id="YOUTUBE_ID">` card to `videos.html` (and `data/videos.json`).
- Tool logic lives in `assets/js/board.js` (vision board) and `assets/js/tools.js` (planner, wheel, affirmations, letter).

## Publish
1. Settings → Pages → Build and deployment → *Deploy from a branch* → `main` / `/ (root)` → Save.
2. Custom domain `new.vision`: add it in Pages settings, then at the registrar create `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `CNAME` for `www` → `webworksa1.github.io`. Enable *Enforce HTTPS*.

## Forms
All forms post to FormSubmit's AJAX endpoint; the destination address is assembled at runtime and never appears in the source. The first submission sends a one-time activation email — confirm it once.

See `BUILD-PROMPT.md` for the full phase-wise build prompt and research notes.
