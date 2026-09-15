# Oorvi — Multipage Redesign (Shopify Theme)

A Shopify Online Store 2.0 theme for [oorvi.store](https://oorvi.store) — a
light, editorial, cream-canvas design modelled on category peers Gramiyaa
and Nune, with Oorvi's own gold/ink accent system and real product
photography. A real multipage site: Home, Shop, Product, Our Story, Contact,
Cart, and customer accounts (login/register/order history/addresses) all
exist as separate pages with shared navigation.

## Pages

| Page | Route | Template |
| --- | --- | --- |
| Home | `/` | `templates/index.json` → `sections/oorvi-homepage.liquid` |
| Shop | `/collections/all` | `templates/collection.json` → `sections/main-collection.liquid` |
| Product | `/products/<handle>` | `templates/product.json` → `sections/main-product.liquid` |
| Our Story | `/pages/our-story` | `templates/page.our-story.json` → `sections/page-our-story.liquid` |
| Contact | `/pages/contact` | `templates/page.contact.json` → `sections/page-contact.liquid` |
| Cart | `/cart` | `templates/cart.json` → `sections/main-cart.liquid` |
| Login | `/account/login` | `templates/customers/login.json` → `sections/customers-login.liquid` |
| Register | `/account/register` | `templates/customers/register.json` → `sections/customers-register.liquid` |
| Reset password | `/account/reset/...` (from emailed link) | `templates/customers/reset_password.json` → `sections/customers-reset-password.liquid` |
| Account | `/account` | `templates/customers/account.json` → `sections/customers-account.liquid` |
| Order detail | `/account/orders/<id>` | `templates/customers/order.json` → `sections/customers-order.liquid` |
| Addresses | `/account/addresses` | `templates/customers/addresses.json` → `sections/customers-addresses.liquid` |

Header (topline + nav + mobile menu, with a login/account icon) and footer
(newsletter signup + links + social) are shared across every page via
`snippets/header.liquid` and `snippets/footer.liquid`, rendered from
`layout/theme.liquid`.

**Shop, Product, Cart, and the customer account pages are all wired to real
Shopify data and forms** — `collection.products`, `product.variants`, real
add-to-cart, real cart line-item updates, real `customer_login` /
`create_customer` / `reset_customer_password` / `customer_address` forms.
None of it is mocked. It needs real data behind it to show anything (see
checklist below). **Home stays hand-authored** with the eight real Oorvi
oils hardcoded for the marketing-page teaser, since there's no live
catalogue to pull from yet.

## What I can't do for you

I don't have — and won't ask for — your Shopify admin login or an API
token, so connecting this theme to your actual store, enabling customer
accounts, creating pages, and importing products all have to happen in your
Shopify admin, by you. Everything below is written as exact steps for that.

## Go-live checklist

1. **Connect the theme**
   - Shopify admin → **Online Store → Themes → Add theme → Connect from
     GitHub**
   - Authorize Shopify's GitHub app if prompted, select this repository and
     the `main` branch
   - Shopify creates an **unpublished** theme wired to this repo — click
     **Preview** before doing anything else

2. **Enable customer accounts** (for Login/Register/Account/Cart account
   link to work)
   - Shopify admin → **Settings → Customer accounts**
   - Choose **Classic customer accounts** — this theme's login/register/
     account/order/address pages are classic-account templates. ("New
     customer accounts" is a Shopify-hosted flow off-theme; it won't use
     these pages.)
   - Set to **Accounts optional** or **Accounts required**, whichever you
     want at checkout

3. **Create the Our Story and Contact pages** (Shopify pages are admin
   content, not theme files, so these routes 404 until you do this)
   - **Online Store → Pages → Add page**
   - Set the page **handle** to `our-story`, under **Theme template** choose
     `page.our-story` — save
   - Repeat with handle `contact` and template `page.contact`
   - The page body content you type in admin is ignored; each page's own
     section carries its copy

4. **Import the product catalogue** so Shop/Product/Cart have something to
   sell
   - **Products → Import**, upload `products-import.csv` from the repo root
   - It has all 8 real Oorvi oils — title, price, description, size —
     with images pulled directly from this repo's `assets/` folder (public
     GitHub raw URLs), so no manual image upload needed
   - Review/adjust inventory quantities after import (it defaults to 100
     per variant)

5. **Publish** from the theme's `···` menu once you're happy with the
   preview

Any future `git push` to `main` syncs automatically to the connected theme.

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
single redesigned homepage, then expanded into this full multipage site
with working shop, cart, and customer accounts.

### Known simplifications

- The address form uses a plain text input for State/Province rather than a
  country-dependent dropdown — still fully functional, just less guided
- Cart quantity +/- submits the form on each click (a full page reload)
  rather than updating via AJAX — simpler and fully working, just not
  instant
- Address editing/deletion isn't built out yet — customers can view saved
  addresses and add new ones from `/account/addresses`
