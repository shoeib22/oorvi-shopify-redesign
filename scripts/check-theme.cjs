const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { Liquid } = require('liquidjs');
const root = path.resolve(__dirname, '..');
const engine = new Liquid();
let count = 0;
for (const folder of ['sections', 'snippets', 'layout']) {
  for (const file of fs.readdirSync(path.join(root, folder)).filter(file => file.endsWith('.liquid'))) {
    const source = fs.readFileSync(path.join(root, folder, file), 'utf8').replace(/^\uFEFF/, '');
    const schema = source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    if (schema) { const data = JSON.parse(schema[1]); assert.ok(data.name.length <= 25, `${file}: section name too long`); }
    for (const match of source.matchAll(/'([^']+)'\s*\|\s*asset_url/g)) assert.ok(fs.existsSync(path.join(root, 'assets', match[1])), `${file}: missing asset ${match[1]}`);
    const adapted = source.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g,'').replace(/{%\s*form\s+[^%]+%}/g,'<form>').replace(/{%\s*endform\s*%}/g,'</form>').replace(/{%\s*paginate\s+[^%]+%}/g,'').replace(/{%\s*endpaginate\s*%}/g,'');
    engine.parse(adapted);
    count++;
  }
}
for (const folder of ['templates','templates/customers','config','locales']) {
  for (const file of fs.readdirSync(path.join(root, folder)).filter(file => file.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(root, folder, file), 'utf8').replace(/^\uFEFF/,'').replace(/^\s*\/\*[\s\S]*?\*\//,''));
    for (const section of Object.values(data.sections || {})) assert.ok(fs.existsSync(path.join(root,'sections',section.type+'.liquid')), `${file}: missing section ${section.type}`);
  }
}
console.log(`Checked ${count} Liquid files, all section schemas, template references, JSON files, and static assets.`);
