// UNDO — Checkout Flow Logic (Demo Multi-Step)

let currentStep = 1;
const checkoutData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: 'Karnataka',
  pincode: '',
  deliveryMethod: 'standard',
  paymentMethod: 'upi-demo'
};

document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  if (cart.length === 0 && !window.location.hash.includes('confirmed')) {
    window.location.href = 'cart.html';
    return;
  }

  renderCheckoutSummary();
  bindStepControls();
  checkIfConfirmedHash();
});

function renderCheckoutSummary() {
  const container = document.getElementById('checkout-items-summary');
  if (!container) return;

  const cart = getCart();
  const allProducts = [...UNDO_PRODUCTS, ...getListings()];
  let subtotal = 0;

  container.innerHTML = cart.map(cartItem => {
    const p = allProducts.find(item => item.id === cartItem.id);
    if (!p) return '';
    subtotal += p.price;
    return `
      <div class="flex items-center justify-between text-sm py-2 border-b border-ivory-dark">
        <div class="flex items-center gap-3">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="w-10 h-12 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
          <div>
            <p class="font-medium text-charcoal line-clamp-1">${escapeHtml(p.name)}</p>
            <p class="text-xs text-grey">${escapeHtml(p.condition)}</p>
          </div>
        </div>
        <span class="font-semibold">${formatPrice(p.price)}</span>
      </div>
    `;
  }).join('');

  const shippingCost = subtotal >= 1500 ? 0 : (checkoutData.deliveryMethod === 'express' ? 179 : 99);
  const total = subtotal + shippingCost;

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function bindStepControls() {
  // Step 1 to 2
  const toStep2Btn = document.getElementById('btn-to-step-2');
  if (toStep2Btn) {
    toStep2Btn.addEventListener('click', () => {
      if (validateStep1()) {
        goToStep(2);
      }
    });
  }

  // Step 2 to 3
  const toStep3Btn = document.getElementById('btn-to-step-3');
  if (toStep3Btn) {
    toStep3Btn.addEventListener('click', () => {
      if (validateStep2()) {
        goToStep(3);
      }
    });
  }

  // Step 3 to 4
  const toStep4Btn = document.getElementById('btn-to-step-4');
  if (toStep4Btn) {
    toStep4Btn.addEventListener('click', () => {
      // save selected delivery method
      const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
      if (selectedDelivery) {
        checkoutData.deliveryMethod = selectedDelivery.value;
      }
      renderCheckoutSummary();
      goToStep(4);
    });
  }

  // Back buttons
  document.querySelectorAll('[data-back-to-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = Number(btn.dataset.backToStep);
      goToStep(step);
    });
  });

  // Final Place Order Button
  const placeOrderBtn = document.getElementById('btn-place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      if (selectedPayment) {
        checkoutData.paymentMethod = selectedPayment.value;
      }
      processSimulatedOrder();
    });
  }
}

function validateStep1() {
  let valid = true;
  const name = document.getElementById('input-name');
  const email = document.getElementById('input-email');
  const phone = document.getElementById('input-phone');

  // Name validation
  if (!name.value.trim()) {
    setError('err-name', 'Please enter your full name');
    valid = false;
  } else {
    clearError('err-name');
    checkoutData.name = name.value.trim();
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    setError('err-email', 'Please enter a valid email address');
    valid = false;
  } else {
    clearError('err-email');
    checkoutData.email = email.value.trim();
  }

  // Phone validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone.value.trim() || !phoneRegex.test(phone.value.replace(/[^0-9]/g, ''))) {
    setError('err-phone', 'Please enter a valid 10-digit mobile number');
    valid = false;
  } else {
    clearError('err-phone');
    checkoutData.phone = phone.value.trim();
  }

  return valid;
}

function validateStep2() {
  let valid = true;
  const address = document.getElementById('input-address');
  const city = document.getElementById('input-city');
  const pincode = document.getElementById('input-pincode');
  const state = document.getElementById('input-state');

  if (!address.value.trim()) {
    setError('err-address', 'Street address is required');
    valid = false;
  } else {
    clearError('err-address');
    checkoutData.address = address.value.trim();
  }

  if (!city.value.trim()) {
    setError('err-city', 'City is required');
    valid = false;
  } else {
    clearError('err-city');
    checkoutData.city = city.value.trim();
  }

  const pinRegex = /^\d{6}$/;
  if (!pincode.value.trim() || !pinRegex.test(pincode.value.trim())) {
    setError('err-pincode', 'Please enter a valid 6-digit postal PIN code');
    valid = false;
  } else {
    clearError('err-pincode');
    checkoutData.pincode = pincode.value.trim();
  }

  if (state) checkoutData.state = state.value;

  return valid;
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    el.classList.add('hidden');
  }
}

function goToStep(step) {
  currentStep = step;

  // Toggle step panes
  document.querySelectorAll('.checkout-step-pane').forEach(pane => {
    pane.classList.add('hidden');
  });

  const activePane = document.getElementById(`step-pane-${step}`);
  if (activePane) activePane.classList.remove('hidden');

  // Update progress bar
  document.querySelectorAll('.checkout-step').forEach((el, idx) => {
    const s = idx + 1;
    if (s < step) {
      el.classList.remove('is-active');
      el.classList.add('is-done');
    } else if (s === step) {
      el.classList.add('is-active');
      el.classList.remove('is-done');
    } else {
      el.classList.remove('is-active', 'is-done');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function processSimulatedOrder() {
  const placeOrderBtn = document.getElementById('btn-place-order');
  if (placeOrderBtn) {
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = `<span class="spinner mr-2" style="width:16px;height:16px;border-width:2px;"></span> Simulating Order...`;
  }

  setTimeout(() => {
    const orderId = generateOrderId();
    const cart = getCart();
    const allProducts = [...UNDO_PRODUCTS, ...getListings()];
    const orderItems = cart.map(item => allProducts.find(p => p.id === item.id)).filter(Boolean);

    const subtotal = orderItems.reduce((acc, p) => acc + p.price, 0);
    const shipping = subtotal >= 1500 ? 0 : (checkoutData.deliveryMethod === 'express' ? 179 : 99);
    const total = subtotal + shipping;

    const orderRecord = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: orderItems,
      total,
      shippingAddress: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state} - ${checkoutData.pincode}`,
      contact: `${checkoutData.name} (${checkoutData.phone})`,
      paymentMethod: checkoutData.paymentMethod.toUpperCase()
    };

    // Store in orders
    addOrder(orderRecord);

    // Empty cart only after successful order
    clearCart();

    // Show Confirmation Pane
    showConfirmationScreen(orderRecord);
  }, 900);
}

function showConfirmationScreen(order) {
  // Hide checkout panes and summary
  document.querySelectorAll('.checkout-step-pane').forEach(pane => pane.classList.add('hidden'));
  const rightCol = document.getElementById('checkout-right-summary');
  if (rightCol) rightCol.classList.add('hidden');
  const stepsBar = document.getElementById('checkout-steps-bar');
  if (stepsBar) stepsBar.classList.add('hidden');

  const confPane = document.getElementById('step-pane-confirmation');
  if (confPane) {
    confPane.classList.remove('hidden');

    const orderIdDisplay = document.getElementById('conf-order-id');
    if (orderIdDisplay) orderIdDisplay.textContent = order.orderId;

    const orderTotalDisplay = document.getElementById('conf-order-total');
    if (orderTotalDisplay) orderTotalDisplay.textContent = formatPrice(order.total);

    const orderAddressDisplay = document.getElementById('conf-order-address');
    if (orderAddressDisplay) orderAddressDisplay.textContent = order.shippingAddress;

    const orderItemsContainer = document.getElementById('conf-order-items');
    if (orderItemsContainer) {
      orderItemsContainer.innerHTML = order.items.map(item => `
        <div class="flex items-center gap-3 py-2 border-b border-ivory-dark text-sm">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-12 h-14 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
          <div class="flex-1">
            <p class="font-medium text-charcoal">${escapeHtml(item.name)}</p>
            <p class="text-xs text-grey">Condition: ${escapeHtml(item.condition)}</p>
          </div>
          <span class="font-semibold">${formatPrice(item.price)}</span>
        </div>
      `).join('');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkIfConfirmedHash() {
  if (window.location.hash === '#confirmed') {
    const orders = getOrders();
    if (orders.length > 0) {
      showConfirmationScreen(orders[0]);
    }
  }
}
