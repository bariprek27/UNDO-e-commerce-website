// UNDO — Home Page Logic

document.addEventListener('DOMContentLoaded', () => {
  renderCuratedSection();
  renderNoteworthySection();
  initCategoryClicks();
});

function renderCuratedSection() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  container.innerHTML = '';
  // Show 8 fresh curated finds
  const featured = UNDO_PRODUCTS.slice(0, 8);
  featured.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function renderNoteworthySection() {
  const container = document.getElementById('noteworthy-products-grid');
  if (!container) return;

  container.innerHTML = '';
  // Pick vintage / statement pieces
  const noteworthy = UNDO_PRODUCTS.filter(p => 
    p.tags.includes('vintage') || p.condition === 'Like New' || p.price > 1200
  ).slice(0, 4);

  noteworthy.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function initCategoryClicks() {
  document.querySelectorAll('[data-category-slug]').forEach(tile => {
    tile.addEventListener('click', (e) => {
      const cat = tile.dataset.categorySlug;
      if (cat) {
        window.location.href = `shop.html?category=${encodeURIComponent(cat)}`;
      }
    });
  });
}
