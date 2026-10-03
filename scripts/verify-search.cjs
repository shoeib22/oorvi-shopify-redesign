const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({channel:process.env.OORVI_BROWSER || 'msedge'});
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const [query,count] of [['groundnut',2],['coconut',1],['sesame',2],['cold groundnut',1],['not-an-oil',0]]) {
    await page.goto('http://localhost:4173/search?q='+encodeURIComponent(query)+'&type=product');
    assert.equal(await page.locator('.catalog-grid .oil-card').count(),count,query+' returns only matching oils');
    assert.equal(await page.locator('#search-query').inputValue(),query);
  }
  await page.goto('http://localhost:4173/search');
  await page.locator('#search-query').fill('coconut');
  await page.locator('.search-suggestions a').first().waitFor();
  assert.equal(await page.locator('.search-suggestions a').count(),1);
  assert.ok((await page.locator('.search-suggestions a').first().getAttribute('href')).includes('wood-pressed-coconut-oil'));
  await page.locator('#search-query').press('ArrowDown');
  assert.equal(await page.locator('.search-suggestions a').first().evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#search-suggestions').isVisible(),false);
  await page.locator('#search-query').fill('groundnut');
  await page.locator('.search-suggestions a').nth(1).waitFor();
  await page.getByRole('button',{name:'Search',exact:true}).click();await page.waitForURL('**/search?**');
  assert.equal(await page.locator('.catalog-grid .oil-card').count(),2);
  await page.getByRole('link',{name:'Clear search'}).click();
  assert.equal(await page.locator('#search-query').inputValue(),'');
  await page.locator('#search-query').fill('not-an-oil');await page.locator('.search-hint').waitFor();
  assert.equal(await page.locator('.search-suggestions a').count(),0);
  await page.locator('#search-query').fill('');assert.equal(await page.locator('#search-suggestions').isVisible(),false);
  await page.route('**/search/suggest?**',route=>route.fulfill({status:500,body:'Unavailable'}));
  await page.locator('#search-query').fill('mustard');await page.getByRole('status').filter({hasText:'Press Search to see matching oils.'}).waitFor();
  await page.getByRole('button',{name:'Search',exact:true}).click();await page.waitForURL('**/search?**');
  assert.equal(await page.locator('.catalog-grid .oil-card').count(),1,'normal search works when suggestions fail');
  assert.deepEqual(errors,[]);await browser.close();
  console.log('Search checks passed: exact matches, multi-word queries, no results, suggestions, keyboard navigation, clear, and service-error fallback.');
})().catch(error=>{console.error(error);process.exit(1);});
