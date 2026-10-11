// UNDO — Storage & State Management
// LocalStorage helpers with safe parsing

const STORAGE_KEYS = {
  CART: 'undo_cart',
  WISHLIST: 'undo_wishlist',
  RECENTLY_VIEWED: 'undo_recently_viewed',
  USER: 'undo_user',
  ORDERS: 'undo_orders',
  LISTINGS: 'undo_listings',
  FILTERS: 'undo_filters',
  DISMISSED_ANNOUNCEMENT: 'undo_dismissed_announcement'
};

// Safe localStorage read
function storageGet(key) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.warn('UNDO storage read error:', key, e);
    return null;
  }
}

// Safe localStorage write
function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('UNDO storage write error:', key, e);
    return false;
  }
}

// Safe localStorage remove
function storageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('UNDO storage remove error:', key, e);
  }
}

// ── CART ────────────────────────────────────────────────────────
function getCart() {
  return storageGet(STORAGE_KEYS.CART) || [];
}

function saveCart(cart) {
  storageSet(STORAGE_KEYS.CART, cart);
  updateCartCountDisplay();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (!existing) {
    cart.push({ id: productId, qty: 1 });
    saveCart(cart);
    showToast('Added to cart', 'success');
    return true;
  } else {
    showToast('Already in your cart', 'info');
    return false;
  }
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function isInCart(productId) {
  return getCart().some(item => item.id === productId);
}

function getCartCount() {
  return getCart().length;
}

function clearCart() {
  saveCart([]);
}

function updateCartCountDisplay() {
  const count = getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── WISHLIST ─────────────────────────────────────────────────────
function getWishlist() {
  return storageGet(STORAGE_KEYS.WISHLIST) || [];
}

function saveWishlist(list) {
  storageSet(STORAGE_KEYS.WISHLIST, list);
  updateWishlistCountDisplay();
}

function toggleWishlist(productId) {
  let list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx === -1) {
    list.push(productId);
    saveWishlist(list);
    showToast('Saved to wishlist', 'success');
    return true; // now wishlisted
  } else {
    list.splice(idx, 1);
    saveWishlist(list);
    showToast('Removed from wishlist', 'info');
    return false; // now removed
  }
}

function isWishlisted(productId) {
  return getWishlist().includes(productId);
}

function getWishlistCount() {
  return getWishlist().length;
}

function updateWishlistCountDisplay() {
  const count = getWishlistCount();
  document.querySelectorAll('[data-wishlist-count]').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── RECENTLY VIEWED ──────────────────────────────────────────────
function addToRecentlyViewed(productId) {
  let list = storageGet(STORAGE_KEYS.RECENTLY_VIEWED) || [];
  list = list.filter(id => id !== productId);
  list.unshift(productId);
  list = list.slice(0, 10);
  storageSet(STORAGE_KEYS.RECENTLY_VIEWED, list);
}

function getRecentlyViewed() {
  return storageGet(STORAGE_KEYS.RECENTLY_VIEWED) || [];
}

// ── USER ─────────────────────────────────────────────────────────
function getUser() {
  return storageGet(STORAGE_KEYS.USER);
}

function setUser(userData) {
  storageSet(STORAGE_KEYS.USER, userData);
}

function logoutUser() {
  storageRemove(STORAGE_KEYS.USER);
}

function isLoggedIn() {
  return !!getUser();
}

// ── ORDERS ───────────────────────────────────────────────────────
function getOrders() {
  return storageGet(STORAGE_KEYS.ORDERS) || [];
}

function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  storageSet(STORAGE_KEYS.ORDERS, orders);
}

// Generate a demo order number
function generateOrderId() {
  return 'UNDO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// ── LISTINGS ─────────────────────────────────────────────────────
function getListings() {
  return storageGet(STORAGE_KEYS.LISTINGS) || [];
}

function addListing(listing) {
  const listings = getListings();
  listings.unshift(listing);
  storageSet(STORAGE_KEYS.LISTINGS, listings);
}

// ── FILTERS ──────────────────────────────────────────────────────
function getSavedFilters() {
  return storageGet(STORAGE_KEYS.FILTERS) || {};
}

function saveFilters(filters) {
  storageSet(STORAGE_KEYS.FILTERS, filters);
}

function clearSavedFilters() {
  storageRemove(STORAGE_KEYS.FILTERS);
}
