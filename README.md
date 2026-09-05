# Oorvi — Homepage Redesign (Shopify Theme)

A minimal Shopify Online Store 2.0 theme package containing the homepage
redesign concept for [oorvi.store](https://oorvi.store) — dark, editorial,
true-to-life product photography, and an interactive 3D hero bottle.

This is **homepage-only** — it deliberately doesn't include product,
collection, cart, or other templates, so connect it as a preview theme
first rather than publishing it live.

## How this was built

Source lives at `oorvi-redesign/` (a Vite + TypeScript + Three.js project)
on the machine that generated this. `assets/oorvi-redesign.js` and
`assets/oorvi-redesign.css` are its production build output; all `.png`
files are the real Oorvi product photography and logo, pulled from the
brand's own asset kit.

## Connecting this to your Shopify store

1. In Shopify admin: **Online Store → Themes**
2. Click **Add theme → Connect from GitHub**
3. Authorize Shopify's GitHub app if prompted, then select this repository
   and the `main` branch
4. Shopify creates an **unpublished** theme wired to this repo — click
   **Preview** to see it live before doing anything else
5. When you're happy with it, **Publish** from the theme's `···` menu

Any future `git push` to `main` will sync automatically to the connected
theme.
