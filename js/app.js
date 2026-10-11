// UNDO — Dedicated Mobile App Prototype Logic (`app.html`)

let currentMobileTab = 'home';
let currentMobileProduct = null;
let mobileSearchQuery = '';
let mobileSelectedCat = 'All';

document.addEventListener('DOMContentLoaded', () => {
  initMobileApp();
});

function initMobileApp() {
  bindMobileNav();
  checkSplash();
  renderMobileHome();
  bindMobileExplore();
  bindMobileSell();
  bindMobileCart();
  bindMobileWishlist();
  bindMobileProfile();
  updateMobileBadges();
}

function checkSplash() {
  const splash = document.getElementById('mobile-splash-screen');
  const getStartedBtn = document.getElementById('mobile-splash-start');
  if (splash && getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      splash.classList.add('splash-dismissed');
      setTimeout(() => splash.style.display = 'none', 400);
    });
  }
}

function switchMobileTab(tabName) {
  currentMobileTab = tabName;

  // Update screens
  document.querySelectorAll('.mobile-screen').forEach(screen => {
    screen.classList.add('hidden');
  });

  const targetScreen = document.getElementById(`screen-${tabName}`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Update bottom nav
  document.querySelectorAll('.mobile-bottom-nav__item').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  // Tab specific refreshes
  if (tabName === 'home') renderMobileHome();
  if (tabName === 'explore') renderMobileExplore();
  if (tabName === 'wishlist') renderMobileWishlist();
  if (tabName === 'cart') renderMobileCart();
  if (tabName === 'profile') renderMobileProfile();

  updateMobileBadges();
}

function bindMobileNav() {
  document.querySelectorAll('.mobile-bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      if (tab) switchMobileTab(tab);
    });
  });
}

function updateMobileBadges() {
  const cartCount = getCartCount();
  const wishCount = getWishlistCount();

  const cartBadge = document.getElementById('mobile-cart-badge');
  const wishBadge = document.getElementById('mobile-wishlist-badge');

  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }
  if (wishBadge) {
    wishBadge.textContent = wishCount;
    wishBadge.style.display = wishCount > 0 ? 'flex' : 'none';
  }
}

// ── HOME TAB ──────────────────────────────────────────────────────
function renderMobileHome() {
  const container = document.getElementById('mobile-featured-scroll');
  if (!container) return;

  container.innerHTML = '';
  const featured = UNDO_PRODUCTS.slice(0, 6);
  featured.forEach(item => {
    const card = document.createElement('div');
    card.className = 'w-48 flex-shrink-0 bg-white border border-ivory-dark rounded overflow-hidden flex flex-col justify-between';
    card.innerHTML = `
      <div class="cursor-pointer" data-view-product="${escapeHtml(item.id)}">
        <div class="h-56 bg-sage relative">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover" onerror="this.src='assets/images/fallback.svg'">
          <span class="absolute top-2 left-2 ${getConditionClass(item.condition)} text-[10px] font-bold px-1.5 py-0.5 rounded">${escapeHtml(item.condition)}</span>
        </div>
        <div class="p-2.5">
          <p class="font-medium text-xs text-charcoal line-clamp-1">${escapeHtml(item.name)}</p>
          <p class="font-semibold text-sm text-forest mt-1">${formatPrice(item.price)}</p>
        </div>
      </div>
      <div class="px-2.5 pb-2.5">
        <button class="w-full btn-primary text-[11px] py-1.5 justify-center" data-quick-cart="${escapeHtml(item.id)}">
          Add to Cart
        </button>
      </div>
    `;

    card.querySelector('[data-view-product]').addEventListener('click', () => {
      openMobileProduct(item.id);
    });

    card.querySelector('[data-quick-cart]').addEventListener('click', () => {
      addToCart(item.id);
      updateMobileBadges();
    });

    container.appendChild(card);
  });
}

// ── EXPLORE TAB ───────────────────────────────────────────────────
function bindMobileExplore() {
  const searchInp = document.getElementById('mobile-explore-search');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => {
      mobileSearchQuery = e.target.value.trim();
      renderMobileExplore();
    });
  }

  document.querySelectorAll('.mobile-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mobile-cat-pill').forEach(p => p.classList.remove('bg-forest', 'text-ivory'));
      pill.classList.add('bg-forest', 'text-ivory');
      mobileSelectedCat = pill.dataset.cat;
      renderMobileExplore();
    });
  });
}

function renderMobileExplore() {
  const grid = document.getElementById('mobile-explore-grid');
  if (!grid) return;

  let list = [...UNDO_PRODUCTS, ...getListings()];

  if (mobileSelectedCat !== 'All') {
    list = list.filter(p => p.category === mobileSelectedCat);
  }

  if (mobileSearchQuery) {
    const q = mobileSearchQuery.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.colour.toLowerCase().includes(q)
    );
  }

  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = `<div class="col-span-2 py-12 text-center text-grey text-sm">No items found matching your filters.</div>`;
    return;
  }

  list.forEach(item => {
    const el = document.createElement('div');
    el.className = 'bg-white border border-ivory-dark rounded overflow-hidden flex flex-col justify-between';
    el.innerHTML = `
      <div class="cursor-pointer" data-view-product="${escapeHtml(item.id)}">
        <div class="aspect-[3/4] bg-sage relative">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover" onerror="this.src='assets/images/fallback.svg'">
          <span class="absolute top-2 left-2 ${getConditionClass(item.condition)} text-[9px] font-bold px-1.5 py-0.5 rounded">${escapeHtml(item.condition)}</span>
        </div>
        <div class="p-2">
          <p class="font-medium text-xs text-charcoal line-clamp-1">${escapeHtml(item.name)}</p>
          <div class="flex items-center justify-between mt-1">
            <span class="font-semibold text-xs text-forest">${formatPrice(item.price)}</span>
            <span class="text-[10px] text-grey">${escapeHtml(item.size || 'Unique')}</span>
          </div>
        </div>
      </div>
      <div class="p-2 pt-0">
        <button class="w-full btn-ghost text-[10px] py-1 justify-center" data-add-cart="${escapeHtml(item.id)}">
          Add
        </button>
      </div>
    `;

    el.querySelector('[data-view-product]').addEventListener('click', () => {
      openMobileProduct(item.id);
    });

    el.querySelector('[data-add-cart]').addEventListener('click', () => {
      addToCart(item.id);
      updateMobileBadges();
    });

    grid.appendChild(el);
  });
}

// ── PRODUCT DETAILS MODAL / SCREEN ────────────────────────────────
function openMobileProduct(id) {
  const all = [...UNDO_PRODUCTS, ...getListings()];
  const item = all.find(p => p.id === id);
  if (!item) return;

  currentMobileProduct = item;

  const modal = document.getElementById('mobile-product-detail-sheet');
  if (!modal) return;

  document.getElementById('mobile-detail-img').src = item.image;
  document.getElementById('mobile-detail-title').textContent = item.name;
  document.getElementById('mobile-detail-price').textContent = formatPrice(item.price);
  document.getElementById('mobile-detail-cond').textContent = item.condition;
  document.getElementById('mobile-detail-cond').className = `condition-badge ${getConditionClass(item.condition)}`;
  document.getElementById('mobile-detail-desc').textContent = item.description;
  document.getElementById('mobile-detail-seller').textContent = `${item.seller} • ${item.location}`;
  document.getElementById('mobile-detail-size').textContent = item.size || 'Unique';
  document.getElementById('mobile-detail-colour').textContent = item.colour || 'Mixed';

  // Buy button
  const buyBtn = document.getElementById('mobile-sheet-buy-btn');
  if (buyBtn) {
    buyBtn.onclick = () => {
      addToCart(item.id);
      updateMobileBadges();
      closeMobileProduct();
      switchMobileTab('cart');
    };
  }

  // Wish button
  const wishBtn = document.getElementById('mobile-sheet-wish-btn');
  if (wishBtn) {
    wishBtn.onclick = () => {
      toggleWishlist(item.id);
      updateMobileBadges();
    };
  }

  modal.classList.remove('hidden');
}

function closeMobileProduct() {
  const modal = document.getElementById('mobile-product-detail-sheet');
  if (modal) modal.classList.add('hidden');
}

// ── WISHLIST TAB ─────────────────────────────────────────────────
function renderMobileWishlist() {
  const list = document.getElementById('mobile-wishlist-items');
  const empty = document.getElementById('mobile-wishlist-empty');
  if (!list) return;

  const savedIds = getWishlist();
  const all = [...UNDO_PRODUCTS, ...getListings()];
  const items = savedIds.map(id => all.find(p => p.id === id)).filter(Boolean);

  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  list.innerHTML = items.map(item => `
    <div class="flex items-center gap-3 p-3 bg-white border border-ivory-dark rounded">
      <img src="${escapeHtml(item.image)}" class="w-16 h-20 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
      <div class="flex-1">
        <p class="font-medium text-xs text-charcoal line-clamp-1">${escapeHtml(item.name)}</p>
        <p class="font-semibold text-xs text-forest mt-0.5">${formatPrice(item.price)}</p>
        <span class="condition-badge ${getConditionClass(item.condition)} mt-1 text-[9px]">${escapeHtml(item.condition)}</span>
      </div>
      <div class="flex flex-col gap-1">
        <button class="btn-primary text-[10px] py-1 px-2 justify-center" data-mob-move-cart="${escapeHtml(item.id)}">Cart</button>
        <button class="btn-ghost text-[10px] py-1 px-2 justify-center text-grey hover:text-orange" data-mob-remove-wish="${escapeHtml(item.id)}">✕</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-mob-move-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.mobMoveCart;
      addToCart(id);
      toggleWishlist(id);
      renderMobileWishlist();
      updateMobileBadges();
    });
  });

  list.querySelectorAll('[data-mob-remove-wish]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.mobRemoveWish;
      toggleWishlist(id);
      renderMobileWishlist();
      updateMobileBadges();
    });
  });
}

function bindMobileWishlist() {}

// ── CART TAB ──────────────────────────────────────────────────────
function renderMobileCart() {
  const container = document.getElementById('mobile-cart-items');
  const empty = document.getElementById('mobile-cart-empty');
  const summary = document.getElementById('mobile-cart-summary');
  if (!container) return;

  const cart = getCart();
  const all = [...UNDO_PRODUCTS, ...getListings()];
  const items = cart.map(c => all.find(p => p.id === c.id)).filter(Boolean);

  if (items.length === 0) {
    container.innerHTML = '';
    if (summary) summary.classList.add('hidden');
    if (empty) empty.classList.remove('hidden');
    return;
  }

  if (empty) empty.classList.add('hidden');
  if (summary) summary.classList.remove('hidden');

  let subtotal = 0;
  container.innerHTML = items.map(item => {
    subtotal += item.price;
    return `
      <div class="flex items-center gap-3 p-3 bg-white border border-ivory-dark rounded">
        <img src="${escapeHtml(item.image)}" class="w-14 h-18 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
        <div class="flex-1">
          <p class="font-medium text-xs text-charcoal line-clamp-1">${escapeHtml(item.name)}</p>
          <p class="text-[10px] text-grey">Single 1-of-1 piece</p>
          <p class="font-semibold text-xs text-forest mt-0.5">${formatPrice(item.price)}</p>
        </div>
        <button class="text-grey hover:text-orange p-1 text-xs" data-mob-remove-cart="${escapeHtml(item.id)}">✕</button>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;

  const subtotalEl = document.getElementById('mobile-cart-subtotal');
  const totalEl = document.getElementById('mobile-cart-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(total);

  container.querySelectorAll('[data-mob-remove-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.dataset.mobRemoveCart);
      renderMobileCart();
      updateMobileBadges();
    });
  });

  const checkoutBtn = document.getElementById('mobile-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      openMobileCheckoutModal();
    };
  }
}

function bindMobileCart() {}

// ── MOBILE CHECKOUT MODAL ─────────────────────────────────────────
function openMobileCheckoutModal() {
  const modal = document.getElementById('mobile-checkout-sheet');
  if (!modal) return;
  modal.classList.remove('hidden');

  const confirmBtn = document.getElementById('mobile-confirm-pay-btn');
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      const orderId = generateOrderId();
      const cart = getCart();
      const all = [...UNDO_PRODUCTS, ...getListings()];
      const items = cart.map(c => all.find(p => p.id === c.id)).filter(Boolean);
      const total = items.reduce((acc, p) => acc + p.price, 0) + 99;

      addOrder({
        orderId,
        date: new Date().toLocaleDateString('en-IN'),
        items,
        total,
        shippingAddress: 'Bengaluru, Karnataka (App Demo)',
        contact: 'App Shopper (demo)',
        paymentMethod: 'UPI DEMO'
      });

      clearCart();
      modal.classList.add('hidden');
      updateMobileBadges();
      showToast(`Order placed! Ref: ${orderId}`, 'success');
      switchMobileTab('profile');
    };
  }
}

// ── SELL TAB ──────────────────────────────────────────────────────
function bindMobileSell() {
  const form = document.getElementById('mobile-sell-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('mob-sell-title').value.trim();
    const price = Number(document.getElementById('mob-sell-price').value);
    const cat = document.getElementById('mob-sell-category').value;
    const cond = document.getElementById('mob-sell-condition').value;

    if (!title || !price || !cat || !cond) {
      showToast('Please complete all fields', 'error');
      return;
    }

    const newProd = {
      id: 'app-' + Date.now().toString(36),
      name: title,
      category: cat,
      brand: null,
      price: price,
      originalPrice: null,
      condition: cond,
      size: 'One Size',
      colour: 'Various',
      seller: 'App Seller (You)',
      sellerRating: 5.0,
      location: 'Bengaluru',
      description: 'Listed via UNDO Mobile App prototype.',
      image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80',
      altText: title,
      listingDate: new Date().toISOString().split('T')[0],
      verified: true,
      tags: [cat.toLowerCase(), 'preloved']
    };

    addListing(newProd);
    showToast('Listing published successfully!', 'success');
    form.reset();
    switchMobileTab('explore');
  });
}

// ── PROFILE TAB ───────────────────────────────────────────────────
function renderMobileProfile() {
  const ordersContainer = document.getElementById('mobile-profile-orders');
  if (!ordersContainer) return;

  const orders = getOrders();
  if (orders.length === 0) {
    ordersContainer.innerHTML = `<p class="text-xs text-grey">No past simulated orders yet.</p>`;
    return;
  }

  ordersContainer.innerHTML = orders.map(o => `
    <div class="p-2.5 bg-white border border-ivory-dark rounded text-xs">
      <div class="flex justify-between font-semibold">
        <span>${escapeHtml(o.orderId)}</span>
        <span>${formatPrice(o.total)}</span>
      </div>
      <p class="text-[10px] text-grey mt-0.5">${escapeHtml(o.date)} • ${o.items.length} item(s)</p>
    </div>
  `).join('');
}

function bindMobileProfile() {}
