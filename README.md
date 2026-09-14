# Oorvi — Multipage Redesign (Shopify Theme)

A Shopify Online Store 2.0 theme for [oorvi.store](https://oorvi.store) — a
light, editorial, cream-canvas design modelled on category peers Gramiyaa
and Nune, with Oorvi's own gold/ink accent system and real product
photography. A real multipage site, not a single scrolling homepage: Home,
Shop, Product, Our Story, Contact, and Cart all exist as separate pages with
shared navigation.

## Pages

| Page | Route | Template |
| --- | --- | --- |
| Home | `/` | `templates/index.json` → `sections/oorvi-homepage.liquid` |
| Shop | `/collections/all` | `templates/collection.json` → `sections/main-collection.liquid` |
| Product | `/products/<handle>` | `templates/product.json` → `sections/main-product.liquid` |
| Our Story | `/pages/our-story` | `templates/page.our-story.json` → `sections/page-our-story.liquid` |
| Contact | `/pages/contact` | `templates/page.contact.json` → `sections/page-contact.liquid` |
| Cart | `/cart` | `templates/cart.json` → `sections/main-cart.liquid` |

Header (topline + nav + mobile menu) and footer (newsletter signup + links +
social) are shared across every page via `snippets/header.liquid` and
`snippets/footer.liquid`, rendered from `layout/theme.liquid`.

**Shop and Product pull from real Shopify data** (`collection.products`,
`product.variants`, real add-to-cart forms) — they'll render empty/generic
until real products exist in the store. **Home stays hand-authored** with
the eight real Oorvi oils hardcoded for the marketing-page teaser, since
there's no live catalogue to pull from yet.

**Our Story and Contact need Page records created in Shopify admin** before
their URLs resolve (Shopify pages are admin content, not theme files):

1. **Online Store → Pages → Add page**
2. Set the page **handle** to `our-story` (or `contact`)
3. Under **Theme template**, choose `page.our-story` (or `page.contact`)
4. Save — the page section's own copy renders regardless of what's typed
   into the admin page body

## How this was built

Plain hand-written Liquid, CSS, and vanilla JS — no build step. Everything
lives directly in this repo: `assets/oorvi-theme.css` is the site-wide
stylesheet, `assets/oorvi-theme.js` handles the mobile menu, range/shop
filters, and scroll reveal. All `.png` files are the real Oorvi product
photography and logo, pulled from the brand's own asset kit.

An earlier version of this homepage used a Three.js scroll-scrubbed 3D
flythrough (built from a separate Vite + TypeScript source project). That
direction was dropped in favor of this lighter, photography-led design that
follows the visual language of category peers more closely — first as a
single redesigned homepage, then expanded into this full multipage site.

## Connecting this to your Shopify store

1. In Shopify admin: **Online Store → Themes**
2. Click **Add theme → Connect from GitHub**
3. Authorize Shopify's GitHub app if prompted, then select this repository
   and the `main` branch
4. Shopify creates an **unpublished** theme wired to this repo — click
   **Preview** to see it live before doing anything else
5. Create the **Our Story** and **Contact** pages in admin (see above) so
   their nav links resolve
6. Add real products so **Shop** and **Product** pages have something to
   show
7. When you're happy with it, **Publish** from the theme's `···` menu

Any future `git push` to `main` will sync automatically to the connected
theme.
