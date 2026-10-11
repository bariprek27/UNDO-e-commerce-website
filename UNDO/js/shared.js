// UNDO — Shared Utilities & UI Components
// Runs on every page

// ── TOAST NOTIFICATIONS ──────────────────────────────────────────
let toastTimeout = null;

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `undo-toast undo-toast--${type}`;
  
  const icons = { success: '✓', info: 'ℹ', error: '✕', warning: '⚠' };
  toast.innerHTML = `<span class="toast-icon" aria-hidden="true">${icons[type] || 'ℹ'}</span><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── SAFE HTML ESCAPE ─────────────────────────────────────────────
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── PRODUCT CARD ─────────────────────────────────────────────────
function createProductCard(product) {
  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  
  const savings = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);

  card.innerHTML = `
    <a href="product.html?id=${escapeHtml(product.id)}" class="product-card__image-link" tabindex="-1" aria-hidden="true">
      <div class="product-card__image-wrap">
        <img 
          src="${escapeHtml(product.image)}" 
          alt="${escapeHtml(product.altText)}"
          class="product-card__img"
          loading="lazy"
          width="400" height="500"
          onerror="this.src='assets/images/fallback.svg'; this.onerror=null;"
        />
        ${savings ? `<span class="product-card__discount" aria-label="${savings}% off">−${savings}%</span>` : ''}
      </div>
    </a>
    <button 
      class="product-card__wishlist ${wishlisted ? 'is-active' : ''}" 
      aria-label="${wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}: ${escapeHtml(product.name)}"
      data-wishlist-btn="${escapeHtml(product.id)}"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
    <div class="product-card__body">
      <a href="product.html?id=${escapeHtml(product.id)}" class="product-card__name">${escapeHtml(product.name)}</a>
      <div class="product-card__meta">
        <span class="condition-badge ${getConditionClass(product.condition)}">${escapeHtml(product.condition)}</span>
        ${product.brand ? `<span class="product-card__brand">${escapeHtml(product.brand)}</span>` : ''}
      </div>
      <div class="product-card__pricing">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="product-card__original">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
      <p class="product-card__seller">by ${escapeHtml(product.seller)} · ${escapeHtml(product.location)}</p>
    </div>
  `;

  // Wishlist button handler
  const wishBtn = card.querySelector('[data-wishlist-btn]');
  wishBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = wishBtn.dataset.wishlistBtn;
    const nowWishlisted = toggleWishlist(id);
    wishBtn.classList.toggle('is-active', nowWishlisted);
    wishBtn.setAttribute('aria-label', `${nowWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}: ${product.name}`);
    const heartPath = wishBtn.querySelector('path');
    if (heartPath) {
      heartPath.setAttribute('fill', nowWishlisted ? 'currentColor' : 'none');
    }
    // If on wishlist page, refresh
    if (typeof renderWishlist === 'function') renderWishlist();
  });

  return card;
}

// ── ANNOUNCEMENT BAR ─────────────────────────────────────────────
function initAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;

  if (storageGet(STORAGE_KEYS.DISMISSED_ANNOUNCEMENT)) {
    bar.style.display = 'none';
    return;
  }

  const dismissBtn = bar.querySelector('[data-dismiss-announcement]');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      bar.style.opacity = '0';
      bar.style.transition = 'opacity 0.2s ease';
      setTimeout(() => { bar.style.display = 'none'; }, 200);
      storageSet(STORAGE_KEYS.DISMISSED_ANNOUNCEMENT, true);
    });
  }
}

// ── MOBILE MENU ───────────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

// ── SEARCH ───────────────────────────────────────────────────────
function searchProducts(query, products = UNDO_PRODUCTS) {
  if (!query || query.trim() === '') return products;
  const q = query.toLowerCase().trim();
  return products.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.brand && p.brand.toLowerCase().includes(q)) ||
    p.colour.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(q)))
  );
}

// ── FILTER PRODUCTS ───────────────────────────────────────────────
function filterProducts(products, filters) {
  return products.filter(p => {
    if (filters.category && filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
    if (filters.condition && filters.condition.length > 0 && !filters.condition.includes(p.condition)) return false;
    if (filters.colour && filters.colour.length > 0) {
      const match = filters.colour.some(c => p.colour.toLowerCase().includes(c.toLowerCase()));
      if (!match) return false;
    }
    if (filters.brand && filters.brand.length > 0) {
      if (!p.brand || !filters.brand.includes(p.brand)) return false;
    }
    if (filters.location && filters.location !== 'All' && p.location !== filters.location) return false;
    return true;
  });
}

// ── SORT PRODUCTS ─────────────────────────────────────────────────
function sortProducts(products, sortBy) {
  const arr = [...products];
  switch(sortBy) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'newest':
      return arr.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
    case 'recommended':
    default:
      return arr;
  }
}

// ── IMAGE FALLBACK ────────────────────────────────────────────────
function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      img.src = img.dataset.fallback || 'assets/images/fallback.svg';
    });
  });
}

// ── ACTIVE NAV LINK ───────────────────────────────────────────────
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ── INIT SHARED ───────────────────────────────────────────────────
function initShared() {
  initAnnouncementBar();
  initMobileMenu();
  initImageFallbacks();
  setActiveNavLink();
  updateCartCountDisplay();
  updateWishlistCountDisplay();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
