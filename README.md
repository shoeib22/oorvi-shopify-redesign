# Oorvi — Homepage Redesign (Shopify Theme)

A minimal Shopify Online Store 2.0 theme package containing the homepage
redesign concept for [oorvi.store](https://oorvi.store) — a light, editorial,
cream-canvas layout modelled on category peers Gramiyaa and Nune, with
Oorvi's own gold/ink accent system and real product photography.

This is **homepage-only** — it deliberately doesn't include product,
collection, cart, or other templates, so connect it as a preview theme
first rather than publishing it live.

## How this was built

Plain hand-written Liquid, CSS, and vanilla JS — no build step. Everything
lives directly in this repo: `sections/oorvi-homepage.liquid` is the markup,
`assets/oorvi-homepage.css` is the stylesheet, `assets/oorvi-homepage.js`
handles the mobile menu, range filters, and scroll reveal. All `.png` files
are the real Oorvi product photography and logo, pulled from the brand's own
asset kit.

An earlier version of this homepage used a Three.js scroll-scrubbed 3D
flythrough (built from a separate Vite + TypeScript source project). That
direction was dropped in favor of this lighter, photography-led design that
follows the visual language of category peers more closely.

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
