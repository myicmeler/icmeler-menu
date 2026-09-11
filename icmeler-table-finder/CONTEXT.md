# Context: İçmeler Table Finder (restaurant search agent mockup)

Paste this whole block as your first message in ChatGPT, or drop it in as
`CONTEXT.md` in the project root for Cursor, before asking for further changes.

## What this is

A front-end prototype for **myicmeler.net** — an independent, non-sponsored
travel content site/Facebook page (29,500+ followers) covering İçmeler and
Marmaris, Turkey, run by Tom (Norwegian, based in London). The page's content
plan already includes a "restaurant review series" and an "İçmeler restaurant
price guide" (`Icmeler_Prices_Enhanced.xlsx`, 7+ restaurants, 363+ items) —
this app is the search/browse front end for that price guide.

**Core idea:** most restaurant-discovery sites (TheFork etc.) show a rating
and an *average* price per person. This tool's differentiator is showing the
**full itemised menu with prices**, searchable dish-by-dish — someone can
search "sea bass" and see exactly which venues serve it and at what price.

## Design language — must match the sibling project, dalaman.me

This app intentionally reuses **dalaman.me's** visual style (Tom's other
project, a blind-bidding airport transfer marketplace). Key tokens:

- Background: charcoal `#2A2A2D`, cards `#35353A`, borders `#45454B`
- Amber accent (headers, scores, dividers, "menu" pill): `#F2A93B`
- Green pill (WhatsApp-style CTA): text `#4ADE80`, border `#2FAF6B`,
  bg `rgba(46,160,90,0.15)`
- Blue pill (Map CTA): text `#6BB8DA`, border `#3E7E99`
- Purple pill (Photos CTA): text `#C79AE8`, border `#8E5FB8`
- Body text `#F5F5F4`, muted/secondary text `#9A9A9E` / `#B4B4B8`
- Font: Inter throughout, no serif
- Small rounded "pill" buttons (20px radius) for all CTAs, kept on one
  scrollable row per card rather than wrapping
- Menu line items use a dotted leader between dish name and price
  (literal menu-board convention — dish name `....` price)
- Mobile-first: container capped ~480px wide, small type scale
  (card titles ~15px, body ~12px), designed to be viewed on a phone

## Current features (all implemented, all against placeholder data)

- Free-text search across restaurant name, cuisine, **and individual dish
  names** — a match highlights the specific dish inline
- Two dropdown filters (deliberately dropdowns, not chips, to save vertical
  space): Cuisine (All / Turkish / Seafood / Italian / Café / Drinks) and
  Price tier (Any / ₺ / ₺₺ / ₺₺₺)
- Each restaurant card shows: rating score, review count, name, cuisine,
  price tier, avg price per person, waterfront tag, address
- Per-card action pills: **Photos** (opens popup carousel), **Map** (opens
  Google Maps search link), **WhatsApp** (opens `wa.me/<number>`), **View
  menu** (expands the full itemised menu in place)
- Photo popup: modal overlay, prev/next arrows, dot indicators, caption per
  photo — currently CSS gradient blocks standing in for real photos

## Data model (see `RESTAURANTS` array in `src/App.jsx`)

Each restaurant object: `id, name, cuisine, tier (1-3), waterfront (bool),
score, reviews, avgPrice, address, mapUrl, whatsapp, photos: [{color,
caption}], menu: [{category, items: [{name, price}]}]`

## What's placeholder and needs replacing before going live

- All restaurant names, prices, addresses, WhatsApp numbers are fictional
- Photos are CSS gradients with captions, not real images
- Filtering/search runs entirely client-side over an in-memory array

## Known next steps (not yet built)

- Wire real data from `Icmeler_Prices_Enhanced.xlsx` (or a live backend)
  instead of the hardcoded array
- At real scale: load restaurant summaries by default, fetch a restaurant's
  full menu only when its card expands; run search server-side against an
  indexed table rather than filtering client-side
- Candidate additional filters: dietary (veg/vegan/gluten-free), meal time
  (breakfast/lunch/dinner), open now, minimum rating
- Replace gradient photo placeholders with real images

## Working conventions to keep following

- Full-file replacements when editing `App.jsx` — no partial diffs
- One change at a time, confirm before bundling multiple changes together
- Keep the mobile-first sizing; don't widen the layout back out for desktop
  without being asked
