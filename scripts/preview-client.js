// Only loaded by the local preview renderer. Never loaded by the Shopify theme.
document.querySelectorAll('[data-preview-form]').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  let note = form.querySelector('[data-preview-note]');
  if (!note) { note = document.createElement('p'); note.dataset.previewNote = ''; note.setAttribute('role','status'); note.style.cssText='font-size:12px;padding:16px 0;line-height:1.6'; form.append(note); }
  note.textContent = form.dataset.previewForm === 'product' ? 'Local preview: your selection is ready. Adding items and checkout run on the connected Shopify store.' : 'Local preview: form validated. This form submits through Shopify on the connected store.';
}));
