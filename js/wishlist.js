// UNDO — Wishlist Page Logic

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
});

function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  const countEl = document.getElementById('wishlist-count-header');

  if (!container) return;

  const savedIds = getWishlist();
  const allProducts = [...UNDO_PRODUCTS, ...getListings()];
  const items = savedIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);

  if (countEl) {
    countEl.textContent = `${items.length} saved piece${items.length === 1 ? '' : 's'}`;
  }

  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  container.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card flex flex-col justify-between';

    card.innerHTML = `
      <div>
        <a href="product.html?id=${escapeHtml(product.id)}" class="product-card__image-link">
          <div class="product-card__image-wrap">
            <img 
              src="${escapeHtml(product.image)}" 
              alt="${escapeHtml(product.altText || product.name)}"
              class="product-card__img"
              loading="lazy"
              onerror="this.src='assets/images/fallback.svg'"
            />
          </div>
        </a>
        <div class="product-card__body">
          <a href="product.html?id=${escapeHtml(product.id)}" class="product-card__name font-medium">
            ${escapeHtml(product.name)}
          </a>
          <div class="product-card__meta my-1">
            <span class="condition-badge ${getConditionClass(product.condition)}">${escapeHtml(product.condition)}</span>
            <span class="text-xs text-grey">Size: ${escapeHtml(product.size || 'Unique')}</span>
          </div>
          <div class="product-card__pricing mt-1">
            <span class="product-card__price font-semibold">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="product-card__original text-xs text-grey line-through">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="p-3 border-t border-ivory-dark flex gap-2">
        <button class="btn-primary flex-1 text-xs py-2 justify-center" data-move-to-cart="${escapeHtml(product.id)}">
          Move to Cart
        </button>
        <button class="btn-ghost text-xs p-2 text-grey hover:text-orange" data-remove-wishlist="${escapeHtml(product.id)}" aria-label="Remove ${escapeHtml(product.name)} from wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    `;

    // Move to cart handler
    card.querySelector('[data-move-to-cart]').addEventListener('click', () => {
      addToCart(product.id);
      toggleWishlist(product.id);
      renderWishlist();
    });

    // Remove handler
    card.querySelector('[data-remove-wishlist]').addEventListener('click', () => {
      toggleWishlist(product.id);
      renderWishlist();
    });

    container.appendChild(card);
  });
}
