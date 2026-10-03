# Oorvi Shopify deployment

Store: `oorvi-store.myshopify.com` (`oorvi.store`).
GitHub: `shoeib22/oorvi-shopify-redesign`, connected branch `main`.

The existing Shopify bot commits confirm that the repository's main branch is connected to the theme named `oorvi-shopify-redesign/main`. The public storefront was serving `Copy of Dawn` (theme ID `150720839886`) before this deployment.

This revision maps the eight existing catalogue handles, preserves cart updates by line-item key, includes the original Oorvi logos and revised groundnut/coconut hero, serves fonts/CSS/images as theme assets, and adds product search with predictive suggestions and graceful fallback.

Local checks: Liquid/schema/template/asset validation, Shopify Theme Check, responsive UI and interaction checks, and search behavior checks. Live-theme verification and publishing require Shopify authentication. Final deployment results will be recorded here after verification.

GitHub deployment: redesign and search changes pushed to `main` at `0594a0b`, preserving Shopify history. All responsive/interaction/search checks passed; Shopify Theme Check inspected 47 files with zero offenses. Public-store verification still found Copy of Dawn active. Shopify sign-in is pending, so the connected theme has not yet been verified or published.

Published successfully on 2026-10-03: GitHub-connected theme `oorvi-shopify-redesign/main`, ID `150900998350`, is live at https://oorvi.store. Public verification confirmed theme role main, original logo and revised hero assets, desktop typography, matching product search, two groundnut suggestions, loaded images, and responsive home/shop/story/contact/cart/search pages. The live mobile product gallery overflow was fixed and rechecked. One delayed search-script sync was completed using the identical committed GitHub asset; subsequent CSS update synced through GitHub automatically. Shopify bot changes were preserved.
