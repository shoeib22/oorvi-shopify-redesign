const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.resolve(__dirname, '..');
const out = path.join(root, '.preview');
const snippetRoot = path.join(out, 'snippets');
fs.mkdirSync(snippetRoot, { recursive: true });
for (const file of fs.readdirSync(path.join(root, 'snippets'))) {
  fs.writeFileSync(path.join(snippetRoot, file), prepare(fs.readFileSync(path.join(root, 'snippets', file), 'utf8')));
}
const engine = new Liquid({ root: snippetRoot, extname: '.liquid', lenientIf: true });
engine.registerFilter('asset_url', value => '/assets/' + value);
engine.registerFilter('stylesheet_tag', value => `<link rel="stylesheet" href="${value}">`);
engine.registerFilter('image_url', value => typeof value === 'object' ? value.src : value);
engine.registerFilter('money', value => '₹' + (Number(value || 0) / 100).toLocaleString('en-IN'));
engine.registerFilter('json', value => JSON.stringify(value));
engine.registerFilter('default_errors', () => 'Please check your details and try again.');
engine.registerFilter('default_pagination', () => '');
engine.registerFilter('customer_login_link', () => '<a href="/account/login">Log in</a>');
engine.registerFilter('customer_logout_link', () => '<a href="/account/login">Log out</a>');
engine.registerFilter('format_address', value => `${value?.address1 || ''}, ${value?.city || ''}`);
engine.registerFilter('payment_type_svg_tag', () => '');
function prepare(source) {
  return source.replace(/^\uFEFF/, '').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '')
    .replace(/{%\s*paginate\s+[^%]+%}/g, '').replace(/{%\s*endpaginate\s*%}/g, '')
    .replace(/{%\s*form\s+'([^']+)'([^%]*)%}/g, (_, type, args) => {
      const css = args.match(/class:\s*'([^']+)'/);
      return `<form method="post" action="/__preview-form/${type}"${css ? ` class="${css[1]}"` : ''} data-preview-form="${type}">`;
    }).replace(/{%\s*endform\s*%}/g, '</form>');
}
// Render the exact theme snippets, with Shopify-only tags adapted for local review.
function csvRows(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (ch === '\n' && !quoted) { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell.replace(/\r$/, '')); rows.push(row); }
  const keys = rows.shift();
  return rows.filter(row => row.length > 1).map(row => Object.fromEntries(keys.map((key, i) => [key, row[i]])));
}
const products = csvRows(fs.readFileSync(path.join(root, 'products-import.csv'), 'utf8')).map((row, index) => {
  const image = { src: '/assets/' + row['Image Src'].split('/').pop(), alt: row['Image Alt Text'] };
  const price = Math.round(Number(row['Variant Price']) * 100);
  const variant = { id: 100 + index, title: row['Option1 Value'], price, available: true };
  return { id: index + 1, handle: row.Handle, url: '/products/' + row.Handle, title: row.Title, description: '<p>' + row['Body (HTML)'] + '</p>', price, type: row.Type, tags: row.Tags.split(',').map(s => s.trim()), featured_image: image, images: [image], variants: [variant], selected_or_first_available_variant: variant, available: true, object_type: 'product' };
});
const allProducts = Object.fromEntries(products.map(product => [product.handle, product]));
const routes = { root_url: '/', all_products_collection_url: '/collections/all', collections_url: '/collections/all', cart_url: '/cart', search_url: '/search', predictive_search_url: '/search/suggest', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', account_logout_url: '/account/logout', account_addresses_url: '/account/addresses', account_recover_url: '/account/login#recover' };
const collection = { title: 'Everyday goodness.', products, products_count: products.length, default_sort_by: 'manual', sort_options: [{ value: 'manual', name: 'Featured' }, { value: 'price-ascending', name: 'Price: low to high' }, { value: 'price-descending', name: 'Price: high to low' }, { value: 'title-ascending', name: 'A to Z' }] };
const base = { shop: { name: 'Oorvi', customer_accounts_enabled: true }, routes, all_products: allProducts, collections: { all: collection }, collection, pages: { 'our-story': { url: '/pages/our-story' }, contact: { url: '/pages/contact' } }, cart: { item_count: 0, items: [], total_price: 0 }, request: { locale: { iso_code: 'en' } }, form: {}, paginate: { pages: 1 }, search: { performed: false }, customer: { name: 'Preview customer', email: 'preview@example.com', orders: [], addresses: [] } };
const map = [
  ['/', 'oorvi-homepage', 'index'], ['/collections/all', 'main-collection', 'collection'],
  ['/pages/our-story', 'page-our-story', 'page'], ['/pages/contact', 'page-contact', 'page'],
  ['/cart', 'main-cart', 'cart'], ['/search', 'main-search', 'search'], ['/404', 'main-404', '404'],
  ['/account/login', 'customers-login', 'customers'], ['/account/register', 'customers-register', 'customers'],
  ['/account', 'customers-account', 'customers'], ['/account/addresses', 'customers-addresses', 'customers'],
  ...products.map(product => [product.url, 'main-product', 'product', { product }]),
  ['/preview/cart-filled', 'main-cart', 'cart', { cart: { item_count: 2, items: [{ key: 'preview-item', title: products[0].title, product: products[0], variant: products[0].variants[0], image: products[0].featured_image, quantity: 2, final_price: products[0].price, final_line_price: products[0].price * 2, url: products[0].url, url_to_remove: '/cart?line=1&quantity=0' }], total_price: products[0].price * 2 } }],
  ['/preview/search-results', 'main-search', 'search', { search: { performed: true, terms: 'oil', results: products, results_count: products.length } }],
  ['/preview/collection-empty', 'main-collection', 'collection', { collection: { ...collection, products: [], products_count: 0 } }],
  ...['price-ascending', 'price-descending', 'title-ascending'].map(sort => ['/preview/sort-' + sort, 'main-collection', 'collection', { collection: { ...collection, sort_by: sort, products: [...products].sort(sort === 'title-ascending' ? (a, b) => a.title.localeCompare(b.title) : (a, b) => sort === 'price-ascending' ? a.price - b.price : b.price - a.price) } }]),
  ['/preview/product-variants', 'main-product', 'product', { product: { ...products[0], images: [products[0].featured_image, { src: '/assets/oorvi-hero-v4.webp', alt: 'Oorvi groundnut campaign' }], variants: [products[0].variants[0], { id: 900, title: '2 L — preview variant', price: 94000, compare_at_price: 98000, available: true }, { id: 901, title: '5 L — preview sold out', price: 220000, available: false }] } }],
  ['/preview/password-reset', 'customers-reset-password', 'customers'],
  ['/preview/product-sold-out', 'main-product', 'product', { product: { ...products[0], available: false, selected_or_first_available_variant: { ...products[0].variants[0], available: false }, variants: [{ ...products[0].variants[0], available: false }] } }],
];
async function render(route, section, type, extra = {}, save = true) {
  const context = { ...base, ...extra, template: { name: type }, page: { handle: route.split('/').pop() }, page_title: 'Oorvi — Goodness. Naturally.', canonical_url: 'http://localhost:4173' + route };
  context.content_for_layout = await engine.parseAndRender(prepare(fs.readFileSync(path.join(root, 'sections', section + '.liquid'), 'utf8')), context, { globals: context });
  let html = await engine.parseAndRender(prepare(fs.readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8')), context, { globals: context });
  html = html.replace('</body>', '<aside class="preview-notice">Local design preview · Sample catalogue · Shopify forms simulated</aside><script src="/scripts/preview-client.js" defer></script></body>');
  html = html.replace(/[ \t]+$/gm, '');
  if (save) {
    const dest = path.join(out, route === '/' ? 'index.html' : route.slice(1) + '/index.html');
    fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, html);
  }
  return html;
}
function matchingProducts(query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return words.length ? products.filter(product => words.every(word => (product.title + ' ' + product.handle + ' ' + product.type).toLowerCase().includes(word))) : [];
}
async function renderSuggestions(query) {
  const context = { ...base, predictive_search: { performed: true, terms: query, resources: { products: matchingProducts(query).slice(0,6) } } };
  return engine.parseAndRender(prepare(fs.readFileSync(path.join(root,'sections/predictive-search.liquid'),'utf8')),context,{ globals:context });
}
module.exports = { render, matchingProducts, renderSuggestions };
if (require.main === module) (async () => {
  for (const entry of map) await render(...entry);
  fs.writeFileSync(path.join(root, 'preview.html'), fs.readFileSync(path.join(out, 'index.html')));
  console.log(`Rendered ${map.length} preview routes from theme Liquid. Run npm run preview → http://localhost:4173`);
})().catch(error => { console.error(error); process.exitCode = 1; });
