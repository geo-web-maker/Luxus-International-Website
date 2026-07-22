# Luxuz Consult — React frontend (scaffold)

Vite + React + React Router. No backend wired yet — every form logs to console
and every service/job is local mock data in `src/data/`, ready to be swapped
for real `fetch()` calls once FastAPI is live.

## Run it

```bash
npm install
npm run dev
```

## What's real vs. placeholder

**Real (confirmed from WP extraction):**
- Page hierarchy in `src/data/services.js` (with the two structural fixes: Surveying
  Works promoted to top-level, Asset Management vs Asset Management System renamed)
- Contact form fields, Quote form fields + both dropdown option lists, Job
  application form fields — all match the WPForms/WP Job Manager exports exactly
- Design tokens in `src/styles/tokens.css` — colors sampled from the logo, typefaces
  per the design brief
- Logo assets (both light-bg and dark-bg/reversed variants) in `src/assets/`

**Placeholder (needs real content dropped in):**
- Service page descriptions — `src/data/services.js` has structure but not real
  copy; pull from `pages_full_content.json` per slug
- All images — every card/hero shows an honest "image pending" tag rather than
  stock photography; check `icon_inventory.csv` for which pages already have
  confirmed real assets in the WP media library
- Job listings in `src/data/jobs.js` — one mock entry, replace with real data
  or wire to the admin-created listings once that exists
- Form submit handlers — all three forms log to console and show a success
  state; each has a `// TODO` marking exactly which FastAPI endpoint it expects

## Structure

```
src/
  data/            service hierarchy, site content, job listings, form options
  components/
    layout/        Navbar, TopBar, Footer, PageHeader, Layout
    ui/             ServiceCard, WireframeGlobe
    forms/          ContactForm, QuoteForm, JobApplicationForm
  pages/            one file per route
  styles/           tokens.css (design system variables), components.css
```

See `DESIGN_BRIEF.md` for the full design rationale if this ever needs to go
through a fresh AI session or a different developer.
