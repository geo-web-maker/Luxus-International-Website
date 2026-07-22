# Luxuz Consult — design system brief

Use this document as the design brief when generating or refining any page, component, or asset for the Luxuz Consult website redesign. It captures a direction that has already been reviewed and approved — the goal of using this brief is consistency with what's already been built, not a fresh creative exploration.

## 1. Project context

Luxuz Consult International Ltd is an ISO certification, engineering, and compliance consultancy operating in partnership with MQA International Certification Body. Core service lines: management system certification (ISO 9001, 14001, 45001, 22000, 27001), ISO training, engineering design, survey and GIS mapping, HSE training and equipment, and asset maintenance.

Audience: organizations evaluating a certification/compliance partner — a B2B, credibility-driven decision. The design needs to read as serious and established, not playful or consumer-facing.

The site is being rebuilt from WordPress into a React frontend (FastAPI backend, MongoDB for content, Cloudflare R2 or Cloudinary for media storage). Design decisions should stay implementable as React components with real data behind them — nothing here should assume static, one-off markup.

## 2. Direction: "Bold Corporate Dark" + data-accent hybrid

Two directions were explored and merged:

- **Base direction ("Bold Corporate Dark")**: deep navy surfaces, bold uppercase display type, full-bleed photography with a dark duotone treatment, one warm accent for calls to action. Chosen because it reads as authoritative and serious — appropriate for a certification/compliance business.
- **Accent layer ("Documentation / wayfinding")**: monospace labels used specifically for data-like content — ISO standard codes, phone numbers, emails, URL-style path fragments (e.g. `/ser/mse/qms`). This layer was folded into the base direction rather than used on its own, applied only to secondary/data content so it doesn't compete with the bold headlines.

Do not revert to a generic light/minimal template, and do not apply the monospace treatment to headlines or primary marketing copy — it is reserved for data-like content only.

## 3. Color palette

All colors are sampled directly from the client's existing logo — do not introduce new hues (e.g. gold, purple, teal) without explicit direction.

| Role | Hex | Usage |
|---|---|---|
| Page background (navy) | `#0C1524` | Primary surface for all pages |
| Border / hairline (dark) | `#1B2536` | Card borders, dividers, table rules |
| Secondary dark surface | `#10182A` | Input fields, subtle raised panels |
| Brand blue (wayfinding/label accent) | `#6FC5F0` | Eyebrows, tags, path labels, ISO codes, active nav state, sidebar item IDs — informational/label use only |
| Brand green (action accent) | `#0F7A45` | Reserved exclusively for conversion actions: primary buttons ("Get a quotation," "Request quote," "Search jobs"), sidebar CTA borders. Do not use for anything that isn't a clickable action. |
| Body text (primary) | `#F3F5F8` | Headlines, primary text on navy |
| Body text (secondary) | `#C4CBD6` | Paragraph copy |
| Muted text | `#6E7A8C` / `#9AA5B5` | Captions, counts, placeholder-style labels |

**Color logic to preserve:** blue = wayfinding/information, green = action. Keeping these separate is what gives the accent system meaning rather than being decorative. Do not let green creep into labels, or blue into buttons.

## 4. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / headlines | Archivo (weight 900, uppercase) | Bold, condensed-feeling despite not being a condensed cut. Used for all H1s and section headers. |
| Body copy | Source Sans 3 (400/500/600) | Paragraphs, nav links, general UI text |
| Data / monospace accent | IBM Plex Mono (400/500) | ISO codes, phone/email, URL-style path labels, sidebar item IDs — never for headlines or paragraph copy |

Google Fonts is an acceptable source (`Archivo`, `Source Sans 3`, `IBM Plex Mono`).

## 5. Logo usage

The logo has a black wordmark and checkmark shape on a transparent background — this only works on light surfaces. Two production-ready variants now exist:

- **`luxuz_logo_white.png`** — reversed variant (black elements recolored to white; blue globe and green gear untouched) for use on the navy background used throughout this design. Use this in every nav bar, footer, and any other dark surface.
- Original color logo — light-background use only (if a light section is ever introduced).

If regenerating any of this in a fresh AI session, note explicitly: *"the source logo's dark elements must be reversed to white for dark backgrounds — do not place the original black-on-transparent logo on a navy or black surface."*

## 6. Page-level components

### Global nav
Dark navy bar. Reversed-white logo mark + wordmark on the left. Nav links in muted gray, active page in brand blue. A green "Request quote" button on the right, always present. A thin topbar above nav shows the current path (`luxuzconsult.com / services`) and phone number in monospace — this is a deliberate wayfinding device tying to the site's real nested URL structure (`/ser/mse/qms` etc.), not decoration.

### Hero (homepage)
Full-bleed photography on the right side, fading into solid navy on the left via gradient overlay — text never sits directly on unmodified photography. Eyebrow label in brand blue, bold uppercase Archivo headline, supporting paragraph in secondary text color, primary + ghost button pair. A row of monospace "coverage tags" (ISO standard codes) sits below the CTA row as supporting proof, not as another headline.

### Page header (interior pages)
Shorter version of the hero pattern used on Services, About, Contact, Career: a darkened photographic band with an eyebrow (path, e.g. `/services`) and a single bold headline. No body copy in the header itself — that goes in the page body below.

### Service cards
Photographic cards with a dark gradient at the bottom for text legibility. A small monospace path label (e.g. `/ser/msc`) sits above the bold service name. This pairing — path ID + bold name — is the standard pattern for representing any service, anywhere it appears (homepage teaser, services grid, sidebars).

### Service detail template
This is the single most reused template (applies to every `/ser/...` page). Structure: photographic header → two-column body → sticky sidebar. Left column: description copy, then a benefits grid where each item has a two-digit monospace number and short label (numbering is justified here because ISO benefit lists are genuinely enumerable content, not decorative sequencing). Right column (sticky): "More in [parent path]" — only sibling services under the same route prefix, not a random related-items list — followed by a bordered (green) quote-request CTA card that stays in view while the user scrolls the long description column.

### About page
Intro copy runs full width, uninterrupted. Mission and Vision follow immediately as a fixed two-column section — always visible, never hidden behind interaction, since it's core positioning content. Below that, a three-item horizontal control strip (Core Values / Why Luxuz / Accreditation) swaps a content panel in place beneath it via client-side state — this must not navigate to a new page or reload; it's an in-page tab pattern (in React: local `useState` for the active key, content sourced from a small lookup/data object). The active tab's highlighted state is the only "you are here" indicator — do not repeat the section's path/label inside the panel content itself, since that's redundant with the tab highlight.

### Contact page
Two-column: contact details (email, phone, address, accreditation partner) in a bordered row list on the left, using monospace for the data values (email, phone) but plain text for the physical address; a map embed placeholder on the right.

### Career page
Search bar (keyword + location) with a green search button, a row of filter checkboxes, and an empty-state pattern that reads as an invitation ("check back soon, or send your CV to...") rather than a dead end — avoid a bare "no results" message with nothing actionable beneath it.

### Footer
Copyright line on the left; the site's top-level route paths rendered as a monospace breadcrumb-style list on the right (`/ser · /eng · /gis · /hse · /career`) instead of a conventional link list — consistent with the path-as-wayfinding device used throughout.

## 7. Interaction principles

- Any content that is genuinely supplementary (About's three sub-sections) should swap in place via client-side state, not route navigation — reserve real page navigation for genuinely distinct pages.
- Any sidebar accompanying long-form content should be sticky, and should include a conversion action, not just navigation links — a reader deep in content is a warmer lead than one on the homepage.
- "Related" or "more like this" lists should be derived from actual information architecture (shared parent path/category), not arbitrary curation, since the site's real route structure already encodes these relationships.

## 8. What to avoid

- Any accent color not sampled from the logo (no gold, purple, teal, or neon accents).
- Placing the original black-on-transparent logo on a dark surface.
- Monospace treatment on headlines or marketing copy — it is a data/label device only.
- Decorative numbered sequences (01/02/03) where the underlying content isn't actually ordered — only use numbering where it reflects real structure (e.g., an enumerable benefits list, or genuine route hierarchy).
- Generic light-background "startup SaaS" templates, or a warm-cream-and-serif look — neither matches this brand or its logo.
