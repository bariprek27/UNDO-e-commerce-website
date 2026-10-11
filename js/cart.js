// UNDO — Cart Page Logic

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const container = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const cartContent = document.getElementById('cart-content-wrapper');

  if (!container) return;

  const cart = getCart();
  const allProducts = [...UNDO_PRODUCTS, ...getListings()];
  const items = cart.map(cartItem => {
    const product = allProducts.find(p => p.id === cartItem.id);
    return product ? { ...product, qty: 1 } : null;
  }).filter(Boolean);

  if (items.length === 0) {
    if (cartContent) cartContent.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (cartContent) cartContent.classList.remove('hidden');
  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = '';

  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.price;

    const row = document.createElement('div');
    row.className = 'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-ivory-dark rounded mb-3';

    row.innerHTML = `
      <div class="flex items-center gap-4">
        <a href="product.html?id=${escapeHtml(item.id)}" class="w-20 h-24 bg-sage flex-shrink-0 rounded overflow-hidden">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover" onerror="this.src='assets/images/fallback.svg'">
        </a>
        <div>
          <a href="product.html?id=${escapeHtml(item.id)}" class="font-medium text-charcoal hover:text-forest text-base leading-snug">
            ${escapeHtml(item.name)}
          </a>
          <div class="flex items-center gap-2 mt-1">
            <span class="condition-badge ${getConditionClass(item.condition)}">${escapeHtml(item.condition)}</span>
            <span class="text-xs text-grey">Seller: ${escapeHtml(item.seller)}</span>
          </div>
          <p class="text-xs text-forest mt-1 font-medium">Unique single listing (1 of 1)</p>
        </div>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-ivory-dark">
        <div class="text-right">
          <span class="font-semibold text-lg text-charcoal">${formatPrice(item.price)}</span>
          ${item.originalPrice ? `<span class="block text-xs text-grey line-through">${formatPrice(item.originalPrice)}</span>` : ''}
        </div>
        <button class="text-grey hover:text-orange p-2 transition-colors" data-remove-item="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} from cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    `;

    row.querySelector('[data-remove-item]').addEventListener('click', () => {
      removeFromCart(item.id);
      showToast(`Removed "${item.name}" from cart`, 'info');
      renderCart();
    });

    container.appendChild(row);
  });

  // Calculate Shipping & Total
  // Free delivery above ₹1,500, else ₹99 standard circular delivery
  const shippingFee = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shippingFee;

  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shippingFee === 0 ? 'FREE' : formatPrice(shippingFee);
  if (totalEl) totalEl.textContent = formatPrice(total);
}
