const {chromium}=require('@playwright/test');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const preview=process.env.OORVI_THEME_ID;
 await page.goto('https://oorvi.store/'+(preview?'?preview_theme_id='+preview:''),{waitUntil:'networkidle'});
 console.log(JSON.stringify(await page.evaluate(()=>({theme:Shopify.theme,h1:document.querySelector('h1')?.innerText,font:document.querySelector('h1')?getComputedStyle(document.querySelector('h1')).fontSize:null,hero:document.querySelector('.hero-visual img')?.src,logo:document.querySelector('.brand img')?.src,overflow:document.documentElement.scrollWidth>innerWidth}))));
 if(!await page.locator('.home-hero').count()){await browser.close();return;}
 await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.screenshot({path:'output/shopify-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'output/shopify-mobile.png',fullPage:true});
 console.log('Mobile overflow:',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.goto('https://oorvi.store/search?q=coconut&type=product');
 console.log('Search:',await page.locator('.oil-card').count(),await page.locator('h1').innerText());
 await page.locator('#search-query').fill('groundnut');
 await page.waitForTimeout(1800);
 console.log('Suggestions:',await page.locator('#search-suggestions a strong').allTextContents());
 console.log('Broken images:',await page.evaluate(()=>[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)));
 await browser.close();
})().catch(e=>{console.error(e.message);process.exitCode=1});
