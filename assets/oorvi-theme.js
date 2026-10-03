(function () {
  'use strict';
  const menu = document.getElementById('mobileMenu');
  const trigger = document.getElementById('menuBtn');
  const close = document.getElementById('menuClose');
  let previousOverflow = '';
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = previousOverflow;
    trigger.focus();
  }
  trigger?.addEventListener('click', () => {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.focus();
  });
  close?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') closeMenu();
    if (event.key === 'Tab') {
      const items = [...menu.querySelectorAll('a,button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll('[data-oil-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-oil-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-oil-type]').forEach(card => {
      card.hidden = button.dataset.oilFilter !== 'all' && button.dataset.oilFilter !== card.dataset.oilType;
    });
  }));
  const finder = {
    everyday: {title: 'Groundnut oil', tag: 'Meet your everyday companion', description: 'A warm, nutty flavour that feels right at home in curries, stir-fries, and everyday Indian cooking.', image: 'groundnut-cp.png', handle: 'cold-pressed-groundnut-oil'},
    traditional: {title: 'White sesame oil', tag: 'A taste of tradition', description: 'Rich, aromatic, and wonderfully nutty. A familiar favourite for podi, pickles, and traditional South Indian dishes.', image: 'white-sesame-cp.png', handle: 'oorvi-cold-pressed-white-sesame-oil-500ml'},
    light: {title: 'Safflower oil', tag: 'Let your ingredients shine', description: 'A gentle, neutral character for the days you want the flavours of your vegetables and spices to take centre stage.', image: 'safflower-cp.png', handle: 'cold-pressed-safflower-oil-1-l'}
  };
  const finderImage = document.getElementById('finder-image');
  const assetBase = finderImage?.src.substring(0, finderImage.src.lastIndexOf('/') + 1);
  document.querySelectorAll('[data-finder]').forEach(button => button.addEventListener('click', () => {
    const oil = finder[button.dataset.finder];
    document.querySelectorAll('[data-finder]').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.getElementById('finder-title').textContent = oil.title;
    document.getElementById('finder-tag').textContent = oil.tag;
    document.getElementById('finder-description').textContent = oil.description;
    finderImage.src = assetBase + oil.image;
    finderImage.alt = 'Oorvi ' + oil.title;
    document.getElementById('finder-link').href = (window.Shopify?.routes?.root || '/') + 'products/' + oil.handle;
  }));
  document.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => {
    const input = button.closest('.quantity-control').querySelector('input');
    button.dataset.quantity === 'plus' ? input.stepUp() : input.stepDown();
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }));
  document.querySelectorAll('[data-product-thumbnail]').forEach(button => button.addEventListener('click', () => {
    const image = document.getElementById('product-main-photo');
    image.src = button.dataset.productThumbnail;
    image.alt = button.querySelector('img').alt;
    document.querySelectorAll('[data-product-thumbnail]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  }));
  const variantSelect = document.getElementById('product-variant');
  const variantsElement = document.getElementById('product-variants');
  if (variantSelect && variantsElement) {
    const variants = JSON.parse(variantsElement.textContent);
    variantSelect.addEventListener('change', () => {
      const variant = variants.find(item => String(item.id) === variantSelect.value);
      if (!variant) return;
      document.getElementById('product-price').textContent = variant.price;
      const compare = document.getElementById('product-compare-price');
      compare.textContent = variant.compare || '';
      compare.hidden = !variant.compare;
      const submit = document.getElementById('product-submit');
      submit.disabled = !variant.available;
      submit.querySelector('span').textContent = variant.available ? 'Add to your bag' : 'Sold out';
      const url = new URL(location.href); url.searchParams.set('variant', variant.id); history.replaceState({}, '', url);
    });
  }
  document.querySelector('[data-sort-by]')?.addEventListener('change', event => {
    const url = new URL(location.href); url.searchParams.set('sort_by', event.target.value); url.searchParams.delete('page'); location.href = url;
  });
  const searchExperience = document.querySelector('.search-experience');
  if (searchExperience) {
    const input = searchExperience.querySelector('input[name="q"]');
    const panel = document.getElementById('search-suggestions');
    const status = document.getElementById('search-status');
    let timer, controller, version = 0;
    function dismissSuggestions() { panel.hidden = true; panel.replaceChildren(); }
    input.addEventListener('input', () => {
      clearTimeout(timer); controller?.abort(); version++;
      const query = input.value.trim();
      dismissSuggestions();
      if (!query) { status.textContent = 'Type an oil or seed name to find your match.'; panel.removeAttribute('aria-busy'); return; }
      const requestVersion = version;
      timer = setTimeout(async () => {
        controller = new AbortController();
        status.textContent = 'Looking for your oils…'; panel.setAttribute('aria-busy', 'true');
        const endpoint = searchExperience.dataset.searchEndpoint || (window.Shopify?.routes?.root || '/') + 'search/suggest';
        const url = new URL(endpoint, location.origin);
        url.searchParams.set('q', query); url.searchParams.set('section_id', 'predictive-search');
        url.searchParams.set('resources[type]', 'product'); url.searchParams.set('resources[limit]', '6');
        url.searchParams.set('resources[options][unavailable_products]', 'show');
        url.searchParams.set('resources[options][fields]', 'title');
        try {
          const response = await fetch(url, {signal: controller.signal, credentials: 'same-origin'});
          if (!response.ok) throw new Error('Search unavailable');
          const html = await response.text();
          if (requestVersion !== version) return;
          const content = new DOMParser().parseFromString(html, 'text/html').getElementById('predictive-search-content');
          if (!content) throw new Error('Search unavailable');
          panel.replaceChildren(...content.childNodes); panel.hidden = false;
          const count = panel.querySelectorAll('.search-suggestions a').length;
          status.textContent = count ? `${count} suggested ${count === 1 ? 'oil' : 'oils'}. Press Search for all results.` : 'No matching oils. Try a different seed name.';
        } catch (error) {
          if (error.name !== 'AbortError' && requestVersion === version) { dismissSuggestions(); status.textContent = 'Press Search to see matching oils.'; }
        } finally { if (requestVersion === version) panel.removeAttribute('aria-busy'); }
      }, 200);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' && !panel.hidden) { const first = panel.querySelector('a'); if (first) { event.preventDefault(); first.focus(); } }
      if (event.key === 'Escape') { clearTimeout(timer); controller?.abort(); version++; dismissSuggestions(); status.textContent = 'Press Search to see all matching oils.'; }
    });
    panel.addEventListener('keydown', event => {
      const links = [...panel.querySelectorAll('a')]; const current = links.indexOf(document.activeElement);
      if (event.key === 'Escape') { dismissSuggestions(); input.focus(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); links[(current + 1) % links.length]?.focus(); }
      if (event.key === 'ArrowUp') { event.preventDefault(); current <= 0 ? input.focus() : links[current - 1].focus(); }
    });
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll('.section-heading,.process-copy,.finder-intro,.questions-section>div:first-child').forEach(element => { element.classList.add('js-reveal'); observer.observe(element); });
  }
})();
