const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { render, matchingProducts, renderSuggestions } = require('./build-preview.cjs');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:4173');
  if (req.method !== 'GET') { res.writeHead(405); return res.end('Local design preview only. Forms run on Shopify.'); }
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/search' || pathname === '/search/suggest') {
    try {
      const query = (url.searchParams.get('q') || '').trim().slice(0,200);
      let html;
      if (pathname === '/search/suggest') html = await renderSuggestions(query);
      else { const results = matchingProducts(query); html = await render('/search','main-search','search',{ search:{performed:!!query,terms:query,results,results_count:results.length} },false); }
      res.setHeader('Content-Type','text/html; charset=utf-8'); return res.end(html);
    } catch(error) { res.writeHead(500); return res.end('Preview search could not load.'); }
  }
  if (pathname === '/collections/all' && ['price-ascending','price-descending','title-ascending'].includes(url.searchParams.get('sort_by'))) pathname = '/preview/sort-' + url.searchParams.get('sort_by');
  const base = pathname.startsWith('/assets/') || pathname.startsWith('/scripts/') ? root : path.join(root, '.preview');
  let file = path.resolve(base, '.' + pathname);
  if (!file.startsWith(base + path.sep) && file !== base) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { file = path.join(root, '.preview/404/index.html'); res.statusCode = 404; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(4173, '127.0.0.1', () => console.log('Oorvi preview: http://localhost:4173 (local sample catalogue; Shopify forms are simulated)'));
