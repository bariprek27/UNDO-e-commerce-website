// UNDO — Product Detail Page Logic

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showNotFoundState();
    return;
  }

  // Lookup in catalog, then fallback to user listings
  currentProduct = getProductById(productId);
  if (!currentProduct) {
    const localListings = getListings();
    currentProduct = localListings.find(l => l.id === productId);
  }

  if (!currentProduct) {
    showNotFoundState();
    return;
  }

  // Record in recently viewed
  addToRecentlyViewed(currentProduct.id);

  // Render product details
  renderProductDetails(currentProduct);
  renderSimilarProducts(currentProduct);
  initProductInteractions(currentProduct);
});

function showNotFoundState() {
  const main = document.getElementById('product-detail-container');
  if (main) {
    main.innerHTML = `
      <div class="empty-state container py-20">
        <div class="empty-state__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>
        <h1 class="empty-state__title">Piece Not Found</h1>
        <p class="empty-state__text">This vintage or pre-loved item might have already found a new home, or the link is invalid.</p>
        <a href="shop.html" class="btn-primary mt-4">Discover Available Pieces</a>
      </div>
    `;
  }
}

function renderProductDetails(p) {
  document.title = `${p.name} | UNDO — Pre-Loved, Reimagined`;

  // Update Breadcrumbs
  const breadcrumbCategory = document.getElementById('crumb-category');
  const breadcrumbProduct = document.getElementById('crumb-product');
  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = p.category;
    breadcrumbCategory.href = `shop.html?category=${encodeURIComponent(p.category)}`;
  }
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = p.name;
  }

  // Gallery
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) {
    mainImg.src = p.image;
    mainImg.alt = p.altText || p.name;
  }

  // Thumbnails: main image + simulated alternate angles
  const thumbsContainer = document.getElementById('gallery-thumbnails');
  if (thumbsContainer) {
    const images = [
      p.image,
      // create alternate view using slight crop/contrast or secondary mock image
      p.image + '&auto=format&fit=crop&w=400&h=500&crop=top',
      p.image + '&auto=format&fit=crop&w=400&h=500&crop=center'
    ];

    thumbsContainer.innerHTML = images.map((imgSrc, idx) => `
      <button class="gallery-thumb ${idx === 0 ? 'is-active' : ''}" 
              data-img-src="${imgSrc}" 
              aria-label="View photo ${idx + 1} of ${escapeHtml(p.name)}">
        <img src="${imgSrc}" alt="Thumbnail ${idx + 1}" loading="lazy" onerror="this.src='assets/images/fallback.svg'">
      </button>
    `).join('');

    thumbsContainer.querySelectorAll('.gallery-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (mainImg) mainImg.src = btn.dataset.imgSrc;
      });
    });
  }

  // Product Meta
  const nameEl = document.getElementById('product-title');
  if (nameEl) nameEl.textContent = p.name;

  const brandEl = document.getElementById('product-brand');
  if (brandEl) {
    if (p.brand) {
      brandEl.textContent = p.brand;
      brandEl.classList.remove('hidden');
    } else {
      brandEl.classList.add('hidden');
    }
  }

  // Pricing
  const priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = formatPrice(p.price);

  const origPriceEl = document.getElementById('product-original-price');
  const savingsEl = document.getElementById('product-savings-badge');
  if (p.originalPrice) {
    if (origPriceEl) {
      origPriceEl.textContent = formatPrice(p.originalPrice);
      origPriceEl.classList.remove('hidden');
    }
    if (savingsEl) {
      const pct = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      savingsEl.textContent = `Save ${pct}%`;
      savingsEl.classList.remove('hidden');
    }
  } else {
    if (origPriceEl) origPriceEl.classList.add('hidden');
    if (savingsEl) savingsEl.classList.add('hidden');
  }

  // Condition Badge & Explanation
  const condBadge = document.getElementById('product-condition-badge');
  if (condBadge) {
    condBadge.textContent = p.condition;
    condBadge.className = `condition-badge ${getConditionClass(p.condition)}`;
  }

  const condNote = document.getElementById('product-condition-note');
  if (condNote) {
    condNote.textContent = p.conditionNote || 'Well-preserved second-hand condition with no notable structural defects.';
  }

  // Attributes: Size, Colour, Category, Unique piece notice
  const sizeEl = document.getElementById('product-size');
  if (sizeEl) sizeEl.textContent = p.size || 'One Size';

  const colourEl = document.getElementById('product-colour');
  if (colourEl) colourEl.textContent = p.colour;

  const descEl = document.getElementById('product-description');
  if (descEl) descEl.textContent = p.description;

  const sustainEl = document.getElementById('product-sustainability');
  if (sustainEl) {
    sustainEl.textContent = p.sustainabilityNote || 'Choosing this pre-loved piece extends the lifecycle of quality materials.';
  }

  // Seller Card
  const sellerNameEl = document.getElementById('seller-name');
  if (sellerNameEl) sellerNameEl.textContent = p.seller;

  const sellerAvatarEl = document.getElementById('seller-avatar');
  if (sellerAvatarEl) sellerAvatarEl.textContent = p.seller.charAt(0);

  const sellerLocEl = document.getElementById('seller-location');
  if (sellerLocEl) sellerLocEl.textContent = p.location;

  const sellerRatingEl = document.getElementById('seller-rating');
  if (sellerRatingEl) sellerRatingEl.textContent = `${p.sellerRating || 4.8} ★`;

  const sellerVerifiedEl = document.getElementById('seller-verified-badge');
  if (sellerVerifiedEl) {
    if (p.verified) {
      sellerVerifiedEl.classList.remove('hidden');
    } else {
      sellerVerifiedEl.classList.add('hidden');
    }
  }

  // Sticky bar sync
  const stickyPrice = document.getElementById('sticky-bar-price');
  if (stickyPrice) stickyPrice.textContent = formatPrice(p.price);

  const stickyTitle = document.getElementById('sticky-bar-title');
  if (stickyTitle) stickyTitle.textContent = p.name;
}

function initProductInteractions(p) {
  // Add to cart buttons (Main and Sticky)
  const cartButtons = document.querySelectorAll('[data-action-add-to-cart]');
  const syncCartState = () => {
    const inCart = isInCart(p.id);
    cartButtons.forEach(btn => {
      if (inCart) {
        btn.textContent = 'In Your Cart';
        btn.classList.add('bg-forest-light', 'opacity-90');
      } else {
        btn.textContent = 'Add to Cart — 1 of 1';
        btn.classList.remove('bg-forest-light', 'opacity-90');
      }
    });
  };

  syncCartState();

  cartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(p.id);
      syncCartState();
    });
  });

  // Wishlist buttons
  const wishButtons = document.querySelectorAll('[data-action-toggle-wishlist]');
  const syncWishlistState = () => {
    const saved = isWishlisted(p.id);
    wishButtons.forEach(btn => {
      btn.classList.toggle('is-active', saved);
      const textSpan = btn.querySelector('.wishlist-text');
      if (textSpan) textSpan.textContent = saved ? 'Saved to Wishlist' : 'Save to Wishlist';
      const icon = btn.querySelector('svg path');
      if (icon) icon.setAttribute('fill', saved ? 'currentColor' : 'none');
    });
  };

  syncWishlistState();

  wishButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWishlist(p.id);
      syncWishlistState();
    });
  });

  // Accordion Toggles
  document.querySelectorAll('.accordion-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.accordion-icon');
      if (content) {
        const isOpen = content.classList.contains('is-open');
        content.classList.toggle('is-open', !isOpen);
        if (icon) icon.textContent = isOpen ? '+' : '−';
      }
    });
  });
}

function renderSimilarProducts(current) {
  const container = document.getElementById('similar-products-grid');
  if (!container) return;

  const similar = getRelatedProducts(current.id, 4);
  container.innerHTML = '';
  similar.forEach(item => {
    container.appendChild(createProductCard(item));
  });
}
