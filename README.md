# Oorvi — Goodness. Naturally.

A complete Shopify Online Store 2.0 redesign for Oorvi, with a new homepage structure, a modern Indian pantry identity, and three premium generated campaign images.

The repository stays on Liquid, vanilla JavaScript, and Tailwind 3 utilities. The utility stylesheet is now compiled and included in the theme. Fonts and icons are local assets, so the storefront does not require the old Tailwind, Google Fonts, or Font Awesome CDNs.

## Review locally

```powershell
cd C:\Users\Shoeii\Documents\oorvi-shopify-theme
npm install
npm run preview:build
npm run preview
```

Open **http://localhost:4173**. The preview renders the actual theme Liquid with sample products from `products-import.csv`. It does not connect to Shopify or send email. Forms validate locally and display a preview message instead of submitting. The live theme uses Shopify's real forms.

Useful preview states:

- `/preview/cart-filled`
- `/preview/product-variants`
- `/preview/product-sold-out`
- `/preview/collection-empty`
- `/preview/search-results`
- `/preview/password-reset`

## Pages and behavior

| Page | Route | Section |
| --- | --- | --- |
| Home | `/` | `oorvi-homepage.liquid` |
| All oils | `/collections/all` | `main-collection.liquid` |
| Product | `/products/<handle>` | `main-product.liquid` |
| The Oorvi way | `/pages/our-story` | `page-our-story.liquid` |
| Contact | `/pages/contact` | `page-contact.liquid` |
| Shopping bag | `/cart` | `main-cart.liquid` |
| Search | `/search` | `main-search.liquid` |
| Missing page | invalid route | `main-404.liquid` |
| Account | `/account` and customer routes | `customers-*.liquid` |

The homepage provides cold/wood pressed filters and a cooking-based oil finder. Featured oil prices come from `all_products` when the products are present. Product pages include variants with price and availability updates, quantity controls, image galleries, and related oils. Collection sorting and pagination use Shopify data. Cart updates and checkout submit to Shopify. The header has a keyboard-accessible mobile menu with focus trapping and Escape support.

## Validation

```powershell
npm run check
npm run verify:ui
npm run verify:search
npx --yes @shopify/cli theme check --path .
```

The UI check requires the local preview server and Microsoft Edge. To use another installed Playwright browser channel, set `OORVI_BROWSER` (for example `chrome`). It checks 320, 390, 768, and 1440 pixel layouts; filtering; finder results; mobile navigation; sorting; variant pricing and sold-out state; galleries; quantities; and contact validation. It also saves review screenshots into `output/`.

`npm run check` validates Liquid syntax adapted for the local renderer, section schemas, static assets, and JSON/template references. Shopify Theme Check validates the actual theme files. Store authentication, order submission, email delivery, and checkout require a connected Shopify store and were not tested against a live account.

## Theme upload

The generated `output/oorvi-premium-theme.zip` contains only the Shopify theme directories: `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, and `templates`.

Upload it as an unpublished theme in Shopify, or connect this repository through Shopify's GitHub integration. Before publishing:

1. The eight product handles are matched to the existing `oorvi.store` catalogue. `products-import.csv` uses these same handles.
2. Create the `our-story` and `contact` pages and assign their respective templates.
3. Enable classic customer accounts to use the theme's customer templates.
4. Configure the store's privacy, terms, returns, and shipping policies; the footer links to Shopify policy routes.
5. Review inventory, pricing, shipping, payments, and the theme preview in Shopify.

The theme is deployed through the Shopify integration connected to this repository?s `main` branch. GitHub synchronization updates the connected theme; publishing that theme is a separate Shopify action. See `DEPLOYMENT.md` for the current deployment status.

## Maintaining the design

- Shared tokens and page styling: `assets/oorvi-theme.css`.
- Interactions: `assets/oorvi-theme.js`.
- Shared components: `snippets/header.liquid`, `footer.liquid`, `icon.liquid`, and `oil-card.liquid`.
- Regenerate existing Tailwind 3 utility classes after changing utility markup: `npm run css:build`.
- Font source and licenses: `scripts/vendor-fonts.py`, `assets/oorvi-fonts.css`, and the `OFL-*.txt` files.
- Concept and image provenance: `DESIGN.md`.

The storefront itself requires no Node process or build tool on Shopify. Node tools are only for local preview, verification, and optional CSS regeneration.
