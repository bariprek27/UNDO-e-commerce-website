// UNDO — Sell Flow Logic

let previewImageData = "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80";

document.addEventListener('DOMContentLoaded', () => {
  bindFormInputs();
  bindImageUpload();
  bindSellSubmit();
});

function bindFormInputs() {
  const titleInp = document.getElementById('sell-title');
  const priceInp = document.getElementById('sell-price');
  const catInp = document.getElementById('sell-category');
  const condInp = document.getElementById('sell-condition');
  const brandInp = document.getElementById('sell-brand');
  const sizeInp = document.getElementById('sell-size');

  // Preview elements
  const prevTitle = document.getElementById('preview-title');
  const prevPrice = document.getElementById('preview-price');
  const prevCond = document.getElementById('preview-condition');
  const prevBrand = document.getElementById('preview-brand');
  const prevSize = document.getElementById('preview-size');

  if (titleInp && prevTitle) {
    titleInp.addEventListener('input', (e) => {
      prevTitle.textContent = e.target.value.trim() || 'Your Product Title';
    });
  }

  if (priceInp && prevPrice) {
    priceInp.addEventListener('input', (e) => {
      const val = Number(e.target.value) || 0;
      prevPrice.textContent = val > 0 ? formatPrice(val) : '₹0';
    });
  }

  if (condInp && prevCond) {
    condInp.addEventListener('change', (e) => {
      const val = e.target.value;
      prevCond.textContent = val;
      prevCond.className = `condition-badge ${getConditionClass(val)}`;
    });
  }

  if (brandInp && prevBrand) {
    brandInp.addEventListener('input', (e) => {
      prevBrand.textContent = e.target.value.trim() ? `Brand: ${e.target.value.trim()}` : '';
    });
  }

  if (sizeInp && prevSize) {
    sizeInp.addEventListener('input', (e) => {
      prevSize.textContent = e.target.value.trim() ? `Size: ${e.target.value.trim()}` : 'One Size';
    });
  }
}

function bindImageUpload() {
  const fileInput = document.getElementById('sell-file-input');
  const uploadZone = document.getElementById('sell-upload-zone');
  const prevImg = document.getElementById('preview-image');
  const uploadThumbs = document.getElementById('upload-preview-thumbnails');

  if (!uploadZone || !fileInput) return;

  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  // Preset demo image selector buttons
  document.querySelectorAll('[data-preset-img]').forEach(btn => {
    btn.addEventListener('click', () => {
      previewImageData = btn.dataset.presetImg;
      if (prevImg) prevImg.src = previewImageData;
      showToast('Sample listing photograph loaded', 'info');
    });
  });
}

function handleImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file (JPEG or PNG)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImageData = e.target.result;
    const prevImg = document.getElementById('preview-image');
    if (prevImg) prevImg.src = previewImageData;

    const uploadStatus = document.getElementById('upload-status-text');
    if (uploadStatus) uploadStatus.textContent = `Photo ready: ${file.name}`;
    showToast('Photo uploaded successfully', 'success');
  };
  reader.readAsDataURL(file);
}

function bindSellSubmit() {
  const form = document.getElementById('sell-listing-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateSellForm()) return;

    const title = document.getElementById('sell-title').value.trim();
    const category = document.getElementById('sell-category').value;
    const brand = document.getElementById('sell-brand').value.trim() || null;
    const price = Number(document.getElementById('sell-price').value);
    const origPrice = Number(document.getElementById('sell-orig-price').value) || null;
    const condition = document.getElementById('sell-condition').value;
    const conditionNote = document.getElementById('sell-cond-note').value.trim();
    const size = document.getElementById('sell-size').value.trim() || 'One Size';
    const colour = document.getElementById('sell-colour').value.trim() || 'Multicolour';
    const location = document.getElementById('sell-location').value.trim() || 'Bengaluru';
    const description = document.getElementById('sell-description').value.trim();

    // Create item record
    const newProduct = {
      id: 'user-' + Date.now().toString(36),
      name: title,
      category,
      brand,
      price,
      originalPrice: origPrice,
      condition,
      conditionNote,
      size,
      colour,
      seller: 'You (Demo Seller)',
      sellerRating: 5.0,
      location,
      description,
      image: previewImageData,
      altText: title,
      listingDate: new Date().toISOString().split('T')[0],
      verified: true,
      sustainabilityNote: 'Giving an existing piece another lifecycle through circular resale.',
      tags: [category.toLowerCase(), 'preloved', 'community']
    };

    // Save to LocalStorage
    addListing(newProduct);

    // Show success modal
    showListingSuccess(newProduct);
  });
}

function validateSellForm() {
  let valid = true;

  const title = document.getElementById('sell-title');
  const price = document.getElementById('sell-price');
  const desc = document.getElementById('sell-description');
  const cond = document.getElementById('sell-condition');

  if (!title.value.trim() || title.value.trim().length < 5) {
    setSellError('err-sell-title', 'Title must be at least 5 characters');
    valid = false;
  } else {
    clearSellError('err-sell-title');
  }

  if (!price.value || Number(price.value) <= 0) {
    setSellError('err-sell-price', 'Please enter a valid price in ₹');
    valid = false;
  } else {
    clearSellError('err-sell-price');
  }

  if (!cond.value) {
    setSellError('err-sell-condition', 'Please select item condition');
    valid = false;
  } else {
    clearSellError('err-sell-condition');
  }

  if (!desc.value.trim() || desc.value.trim().length < 15) {
    setSellError('err-sell-desc', 'Please provide a clear description (min 15 characters)');
    valid = false;
  } else {
    clearSellError('err-sell-desc');
  }

  return valid;
}

function setSellError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function clearSellError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

function showListingSuccess(product) {
  const modal = document.getElementById('sell-success-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const viewBtn = document.getElementById('modal-view-listing-btn');
    if (viewBtn) {
      viewBtn.href = `product.html?id=${encodeURIComponent(product.id)}`;
    }
  }
}
