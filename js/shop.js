// UNDO — Shop & Catalogue Page Logic

let currentFilters = {
  category: 'All',
  search: '',
  minPrice: 0,
  maxPrice: 10000,
  conditions: [],
  brands: [],
  colours: [],
  location: 'All',
  sortBy: 'recommended'
};

document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  populateFilterOptions();
  bindFilterEvents();
  applyFiltersAndRender();
});

function parseUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('category')) {
    currentFilters.category = urlParams.get('category');
  }
  if (urlParams.has('q')) {
    currentFilters.search = urlParams.get('q');
    const searchInput = document.getElementById('shop-search-input');
    if (searchInput) searchInput.value = currentFilters.search;
  }
  if (urlParams.has('condition')) {
    currentFilters.conditions = [urlParams.get('condition')];
  }
}

function populateFilterOptions() {
  // Populate Brands
  const brandContainer = document.getElementById('brand-filter-list');
  if (brandContainer) {
    const brands = [...new Set(UNDO_PRODUCTS.map(p => p.brand).filter(Boolean))].sort();
    brandContainer.innerHTML = brands.map(b => `
      <label class="filter-checkbox">
        <input type="checkbox" value="${escapeHtml(b)}" class="brand-checkbox">
        <span>${escapeHtml(b)}</span>
      </label>
    `).join('');
  }

  // Populate Locations
  const locationSelect = document.getElementById('location-filter-select');
  if (locationSelect) {
    const locations = [...new Set(UNDO_PRODUCTS.map(p => p.location))].sort();
    locationSelect.innerHTML = `<option value="All">All Locations</option>` + 
      locations.map(loc => `<option value="${escapeHtml(loc)}">${escapeHtml(loc)}</option>`).join('');
  }

  // Set category radio/nav active
  syncCategoryControls();
}

function syncCategoryControls() {
  document.querySelectorAll('[data-filter-cat]').forEach(btn => {
    const cat = btn.dataset.filterCat;
    if (cat === currentFilters.category) {
      btn.classList.add('bg-forest', 'text-ivory');
      btn.classList.remove('bg-white', 'text-charcoal');
    } else {
      btn.classList.remove('bg-forest', 'text-ivory');
      btn.classList.add('bg-white', 'text-charcoal');
    }
  });
}

function bindFilterEvents() {
  // Search input
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value.trim();
      applyFiltersAndRender();
    });
  }

  // Category buttons
  document.querySelectorAll('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilters.category = btn.dataset.filterCat;
      syncCategoryControls();
      applyFiltersAndRender();
    });
  });

  // Price range slider
  const maxPriceInput = document.getElementById('price-max-range');
  const priceDisplay = document.getElementById('price-range-display');
  if (maxPriceInput && priceDisplay) {
    maxPriceInput.addEventListener('input', (e) => {
      currentFilters.maxPrice = Number(e.target.value);
      priceDisplay.textContent = `Up to ₹${currentFilters.maxPrice.toLocaleString('en-IN')}`;
      applyFiltersAndRender();
    });
  }

  // Condition checkboxes
  document.querySelectorAll('.condition-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = Array.from(document.querySelectorAll('.condition-checkbox:checked')).map(c => c.value);
      currentFilters.conditions = checked;
      applyFiltersAndRender();
    });
  });

  // Brand checkboxes
  document.addEventListener('change', (e) => {
    if (e.target && e.target.classList.contains('brand-checkbox')) {
      const checked = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(c => c.value);
      currentFilters.brands = checked;
      applyFiltersAndRender();
    }
  });

  // Colour checkboxes
  document.querySelectorAll('.colour-filter-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = Array.from(document.querySelectorAll('.colour-filter-checkbox:checked')).map(c => c.value);
      currentFilters.colours = checked;
      applyFiltersAndRender();
    });
  });

  // Location select
  const locationSelect = document.getElementById('location-filter-select');
  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => {
      currentFilters.location = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Sort select
  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Mobile Filter Drawer Toggle
  const openFilterBtn = document.getElementById('open-filter-drawer');
  const closeFilterBtn = document.getElementById('close-filter-drawer');
  const filterDrawer = document.getElementById('shop-filter-sidebar');
  const filterOverlay = document.getElementById('filter-drawer-overlay');

  if (openFilterBtn && filterDrawer) {
    openFilterBtn.addEventListener('click', () => {
      filterDrawer.classList.add('mobile-drawer-open');
      if (filterOverlay) filterOverlay.classList.remove('hidden');
    });
  }

  const closeDrawer = () => {
    if (filterDrawer) filterDrawer.classList.remove('mobile-drawer-open');
    if (filterOverlay) filterOverlay.classList.add('hidden');
  };

  if (closeFilterBtn) closeFilterBtn.addEventListener('click', closeDrawer);
  if (filterOverlay) filterOverlay.addEventListener('click', closeDrawer);

  // Clear all filters button
  const clearAllBtn = document.getElementById('clear-all-filters-btn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', resetAllFilters);
  }
}

function resetAllFilters() {
  currentFilters = {
    category: 'All',
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    conditions: [],
    brands: [],
    colours: [],
    location: 'All',
    sortBy: 'recommended'
  };

  // Reset inputs
  const searchInput = document.getElementById('shop-search-input');
  if (searchInput) searchInput.value = '';

  const maxPriceInput = document.getElementById('price-max-range');
  const priceDisplay = document.getElementById('price-range-display');
  if (maxPriceInput && priceDisplay) {
    maxPriceInput.value = 10000;
    priceDisplay.textContent = 'Up to ₹10,000';
  }

  document.querySelectorAll('.condition-checkbox, .brand-checkbox, .colour-filter-checkbox').forEach(cb => {
    cb.checked = false;
  });

  const locationSelect = document.getElementById('location-filter-select');
  if (locationSelect) locationSelect.value = 'All';

  const sortSelect = document.getElementById('shop-sort-select');
  if (sortSelect) sortSelect.value = 'recommended';

  syncCategoryControls();
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  let results = [...UNDO_PRODUCTS];

  // Include user created listings from local storage if any
  const localListings = getListings();
  if (localListings.length > 0) {
    results = [...localListings, ...results];
  }

  // 1. Search Query
  if (currentFilters.search) {
    const q = currentFilters.search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.colour.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // 2. Category
  if (currentFilters.category && currentFilters.category !== 'All') {
    results = results.filter(p => p.category === currentFilters.category);
  }

  // 3. Price
  results = results.filter(p => p.price <= currentFilters.maxPrice);

  // 4. Condition
  if (currentFilters.conditions.length > 0) {
    results = results.filter(p => currentFilters.conditions.includes(p.condition));
  }

  // 5. Brands
  if (currentFilters.brands.length > 0) {
    results = results.filter(p => p.brand && currentFilters.brands.includes(p.brand));
  }

  // 6. Colours
  if (currentFilters.colours.length > 0) {
    results = results.filter(p => 
      currentFilters.colours.some(c => p.colour.toLowerCase().includes(c.toLowerCase()))
    );
  }

  // 7. Location
  if (currentFilters.location && currentFilters.location !== 'All') {
    results = results.filter(p => p.location === currentFilters.location);
  }

  // 8. Sorting
  results = sortProducts(results, currentFilters.sortBy);

  // Update counts
  const countEl = document.getElementById('product-count-display');
  if (countEl) {
    countEl.textContent = `${results.length} piece${results.length === 1 ? '' : 's'} discovered`;
  }

  // Render chips
  renderFilterChips();

  // Render grid
  const grid = document.getElementById('shop-products-grid');
  const emptyState = document.getElementById('shop-empty-state');

  if (!grid) return;

  if (results.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    grid.innerHTML = '';
    results.forEach(product => {
      grid.appendChild(createProductCard(product));
    });
  }
}

function renderFilterChips() {
  const container = document.getElementById('active-filter-chips');
  if (!container) return;

  const chips = [];

  if (currentFilters.category !== 'All') {
    chips.push({ label: `Category: ${currentFilters.category}`, remove: () => { currentFilters.category = 'All'; syncCategoryControls(); } });
  }
  if (currentFilters.search) {
    chips.push({ label: `"${currentFilters.search}"`, remove: () => { 
      currentFilters.search = ''; 
      const inp = document.getElementById('shop-search-input'); 
      if (inp) inp.value = ''; 
    } });
  }
  if (currentFilters.maxPrice < 10000) {
    chips.push({ label: `≤ ₹${currentFilters.maxPrice.toLocaleString('en-IN')}`, remove: () => { 
      currentFilters.maxPrice = 10000; 
      const inp = document.getElementById('price-max-range'); 
      if (inp) inp.value = 10000;
      const disp = document.getElementById('price-range-display');
      if (disp) disp.textContent = 'Up to ₹10,000';
    } });
  }
  currentFilters.conditions.forEach(cond => {
    chips.push({ label: cond, remove: () => {
      currentFilters.conditions = currentFilters.conditions.filter(c => c !== cond);
      const cb = document.querySelector(`.condition-checkbox[value="${cond}"]`);
      if (cb) cb.checked = false;
    } });
  });
  currentFilters.brands.forEach(br => {
    chips.push({ label: br, remove: () => {
      currentFilters.brands = currentFilters.brands.filter(b => b !== br);
      const cb = document.querySelector(`.brand-checkbox[value="${br}"]`);
      if (cb) cb.checked = false;
    } });
  });
  currentFilters.colours.forEach(col => {
    chips.push({ label: col, remove: () => {
      currentFilters.colours = currentFilters.colours.filter(c => c !== col);
      const cb = document.querySelector(`.colour-filter-checkbox[value="${col}"]`);
      if (cb) cb.checked = false;
    } });
  });
  if (currentFilters.location !== 'All') {
    chips.push({ label: `In ${currentFilters.location}`, remove: () => {
      currentFilters.location = 'All';
      const loc = document.getElementById('location-filter-select');
      if (loc) loc.value = 'All';
    } });
  }

  container.innerHTML = chips.map((chip, idx) => `
    <button class="active-filter-chip" data-chip-idx="${idx}" aria-label="Remove filter: ${escapeHtml(chip.label)}">
      <span>${escapeHtml(chip.label)}</span>
      <span aria-hidden="true" class="text-xs ml-1 opacity-70">✕</span>
    </button>
  `).join('');

  container.querySelectorAll('[data-chip-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.chipIdx);
      if (chips[idx]) {
        chips[idx].remove();
        applyFiltersAndRender();
      }
    });
  });

  const clearContainer = document.getElementById('clear-filters-action-wrap');
  if (clearContainer) {
    if (chips.length > 0) {
      clearContainer.classList.remove('hidden');
    } else {
      clearContainer.classList.add('hidden');
    }
  }
}
