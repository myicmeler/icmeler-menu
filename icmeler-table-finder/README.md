# İçmeler Table Finder — mockup

A front-end-only prototype for a restaurant search agent covering İçmeler:
free-text search across names/cuisines/dishes, cuisine + price dropdown
filters, a photo carousel popup, and expandable full menus with prices.
All restaurant/menu/photo data in `src/App.jsx` is fictional placeholder
data — see the `RESTAURANTS` array.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Opening in Cursor

Just open this folder in Cursor as a project. Everything lives in
`src/App.jsx` — it's a single self-contained component, no routing or
extra state management, so it's a reasonable target for AI-assisted
edits inside Cursor.

## Handing off to ChatGPT

If you're pasting into ChatGPT for further iteration rather than
opening the whole repo, paste the contents of `src/App.jsx` — it's the
only file with real logic. The rest (`main.jsx`, `index.html`,
`package.json`, `vite.config.js`) is boilerplate Vite scaffolding to
run it locally.

## What's still placeholder / not wired up

- `RESTAURANTS` array — fictional names, prices, addresses, WhatsApp
  numbers, and photo captions. Swap for a real data source (e.g. the
  `Icmeler_Prices_Enhanced.xlsx` price guide) before this goes live.
- Photos are CSS gradient blocks, not real images.
- Search/filtering happens entirely client-side over the in-memory
  array. At real scale you'd want to move search server-side (see
  notes below) rather than shipping every menu to the browser.

## Suggested next steps for a real backend

- Restaurant summaries (name, cuisine, price tier, rating, address)
  load by default; fetch a restaurant's full menu only when its card
  is expanded.
- Run the free-text search server-side against an indexed table
  (restaurant name / cuisine / dish name), rather than filtering a
  client-side array.
- Consider added filters: dietary (veg/vegan/gluten-free), meal
  (breakfast/lunch/dinner), open-now, minimum rating.
