// UNDO — Account & Profile Page Logic (Demo State)

document.addEventListener('DOMContentLoaded', () => {
  initAccountView();
  bindAuthForms();
});

function initAccountView() {
  const user = getUser();
  const authPane = document.getElementById('account-auth-pane');
  const profilePane = document.getElementById('account-profile-pane');

  if (!user) {
    if (authPane) authPane.classList.remove('hidden');
    if (profilePane) profilePane.classList.add('hidden');
  } else {
    if (authPane) authPane.classList.add('hidden');
    if (profilePane) profilePane.classList.remove('hidden');
    renderUserProfile(user);
    renderOrderHistory();
    renderUserListings();
  }
}

function renderUserProfile(user) {
  const nameEl = document.getElementById('profile-display-name');
  const emailEl = document.getElementById('profile-display-email');
  const avatarEl = document.getElementById('profile-avatar-letter');

  if (nameEl) nameEl.textContent = user.name || 'Community Member';
  if (emailEl) emailEl.textContent = user.email || 'demo@undo.market';
  if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

  // Logout button
  const logoutBtn = document.getElementById('btn-account-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logoutUser();
      showToast('Signed out of demo account', 'info');
      initAccountView();
    });
  }
}

function renderOrderHistory() {
  const container = document.getElementById('account-orders-list');
  const emptyOrders = document.getElementById('account-orders-empty');
  if (!container) return;

  const orders = getOrders();
  if (orders.length === 0) {
    container.innerHTML = '';
    if (emptyOrders) emptyOrders.classList.remove('hidden');
    return;
  }

  if (emptyOrders) emptyOrders.classList.add('hidden');
  container.innerHTML = orders.map(order => `
    <div class="bg-white border border-ivory-dark rounded p-4 mb-4">
      <div class="flex flex-wrap items-center justify-between pb-3 border-b border-ivory-dark gap-2">
        <div>
          <span class="font-semibold text-charcoal text-sm">${escapeHtml(order.orderId)}</span>
          <span class="text-xs text-grey ml-2">• Placed on ${escapeHtml(order.date)}</span>
        </div>
        <span class="text-xs font-semibold px-2 py-1 bg-sage text-forest rounded">Delivered / In Transit (Demo)</span>
      </div>
      <div class="py-3 flex flex-col gap-2">
        ${order.items.map(it => `
          <div class="flex items-center gap-3 text-sm">
            <img src="${escapeHtml(it.image)}" class="w-10 h-12 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
            <div class="flex-1">
              <p class="font-medium text-charcoal line-clamp-1">${escapeHtml(it.name)}</p>
              <p class="text-xs text-grey">Condition: ${escapeHtml(it.condition)}</p>
            </div>
            <span class="font-semibold">${formatPrice(it.price)}</span>
          </div>
        `).join('')}
      </div>
      <div class="pt-3 border-t border-ivory-dark flex justify-between items-center text-sm">
        <span class="text-grey">Total Paid (Simulated):</span>
        <span class="font-semibold text-charcoal text-base">${formatPrice(order.total)}</span>
      </div>
    </div>
  `).join('');
}

function renderUserListings() {
  const container = document.getElementById('account-listings-list');
  const emptyListings = document.getElementById('account-listings-empty');
  if (!container) return;

  const listings = getListings();
  if (listings.length === 0) {
    container.innerHTML = '';
    if (emptyListings) emptyListings.classList.remove('hidden');
    return;
  }

  if (emptyListings) emptyListings.classList.add('hidden');
  container.innerHTML = listings.map(l => `
    <div class="flex items-center justify-between gap-4 p-3 bg-white border border-ivory-dark rounded mb-2 text-sm">
      <div class="flex items-center gap-3">
        <img src="${escapeHtml(l.image)}" class="w-12 h-14 object-cover rounded bg-sage" onerror="this.src='assets/images/fallback.svg'">
        <div>
          <p class="font-medium text-charcoal line-clamp-1">${escapeHtml(l.name)}</p>
          <span class="condition-badge ${getConditionClass(l.condition)} mt-1">${escapeHtml(l.condition)}</span>
        </div>
      </div>
      <div class="text-right">
        <p class="font-semibold text-charcoal">${formatPrice(l.price)}</p>
        <a href="product.html?id=${escapeHtml(l.id)}" class="text-xs text-forest hover:underline">View Piece</a>
      </div>
    </div>
  `).join('');
}

function bindAuthForms() {
  // Toggle between Sign In & Sign Up tabs
  const tabSignIn = document.getElementById('tab-sign-in');
  const tabSignUp = document.getElementById('tab-sign-up');
  const formSignIn = document.getElementById('form-sign-in');
  const formSignUp = document.getElementById('form-sign-up');

  if (tabSignIn && tabSignUp) {
    tabSignIn.addEventListener('click', () => {
      tabSignIn.classList.add('border-forest', 'text-forest');
      tabSignIn.classList.remove('border-transparent', 'text-grey');
      tabSignUp.classList.remove('border-forest', 'text-forest');
      tabSignUp.classList.add('border-transparent', 'text-grey');
      formSignIn.classList.remove('hidden');
      formSignUp.classList.add('hidden');
    });

    tabSignUp.addEventListener('click', () => {
      tabSignUp.classList.add('border-forest', 'text-forest');
      tabSignUp.classList.remove('border-transparent', 'text-grey');
      tabSignIn.classList.remove('border-forest', 'text-forest');
      tabSignIn.classList.add('border-transparent', 'text-grey');
      formSignUp.classList.remove('hidden');
      formSignIn.classList.add('hidden');
    });
  }

  // Handle Demo Sign In
  if (formSignIn) {
    formSignIn.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signin-email').value.trim();
      if (!email) {
        showToast('Please enter an email address', 'error');
        return;
      }
      setUser({
        name: email.split('@')[0],
        email: email,
        joined: new Date().toLocaleDateString('en-IN')
      });
      showToast('Welcome back to UNDO!', 'success');
      initAccountView();
    });
  }

  // Handle Demo Sign Up
  if (formSignUp) {
    formSignUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      if (!name || !email) {
        showToast('Please fill all required fields', 'error');
        return;
      }
      setUser({
        name: name,
        email: email,
        joined: new Date().toLocaleDateString('en-IN')
      });
      showToast('Account created! Welcome to the circular fashion movement.', 'success');
      initAccountView();
    });
  }
}
