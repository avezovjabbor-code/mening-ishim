/**
 * FreshMart Mobile Grocery App - Interactive Controller
 */

// Application State
const appState = {
  currentScreen: 'screen-onboarding',
  cartCount: 1,
  cartTotal: 25.00,
  orderQty: 1,
  activeProduct: {
    id: 'apple',
    title: 'Red Apple',
    price: 25.00,
    img: 'images/apple.jpg',
    desc: "Eng saralangan va tabiiy shirin qizil olma. Bog'dan to'g'ridan-to'g'ri yangi uzilgan, vitaminlar va antioksidantlarga boy, xushbo'y va shirin ta'mga ega."
  },
  includeStrawberryExtra: true,
  extraPrice: 5.00
};

// DOM Elements
const screenOnboarding = document.getElementById('screen-onboarding');
const screenHome = document.getElementById('screen-home');
const screenOrder = document.getElementById('screen-order');

const btnTabOnboarding = document.getElementById('btn-tab-onboarding');
const btnTabHome = document.getElementById('btn-tab-home');
const btnTabOrder = document.getElementById('btn-tab-order');

const btnGetStarted = document.getElementById('btn-get-started');
const btnOrderBack = document.getElementById('btn-order-back');

// Product Detail Elements
const detailProductImg = document.getElementById('detail-product-img');
const detailProductTitle = document.getElementById('detail-product-title');
const detailProductPrice = document.getElementById('detail-product-price');
const detailProductDesc = document.getElementById('detail-product-desc');
const detailQtyVal = document.getElementById('detail-qty-val');
const btnQtyMinus = document.getElementById('btn-qty-minus');
const btnQtyPlus = document.getElementById('btn-qty-plus');
const qtyMinusIcon = document.getElementById('qty-minus-icon');
const chkStrawberryExtra = document.getElementById('chk-strawberry-extra');
const btnAddToCart = document.getElementById('btn-add-to-cart');

// Cart & Navigation Badges
const mobileCartBadge = document.getElementById('mobile-cart-badge');
const desktopCartCount = document.getElementById('desktop-cart-count');
const desktopCartTotal = document.getElementById('desktop-cart-total');

// Search & Filter
const searchInput = document.getElementById('search-input');
const productsGrid = document.getElementById('products-grid');
const categoryPills = document.querySelectorAll('.cat-pill');

// Bottom Nav
const navHome = document.getElementById('nav-home');
const navPickup = document.getElementById('nav-pickup');
const navSearch = document.getElementById('nav-search');
const navChat = document.getElementById('nav-chat');
const navProfile = document.getElementById('nav-profile');

// Real-time clock for status bar
function updateClock() {
  const clockEl = document.getElementById('status-time-display');
  if (clockEl) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

// Switch Screens
function showScreen(screenId) {
  const allScreens = [screenOnboarding, screenHome, screenOrder];
  allScreens.forEach(sc => {
    if (sc) sc.classList.remove('active');
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    appState.currentScreen = screenId;
  }

  // Update Desktop control buttons
  const tabButtons = [btnTabOnboarding, btnTabHome, btnTabOrder];
  tabButtons.forEach(btn => {
    if (btn) {
      if (btn.getAttribute('data-target') === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // Update Bottom Nav active state
  if (screenId === 'screen-home') {
    setActiveBottomNav(navHome);
  } else if (screenId === 'screen-order') {
    setActiveBottomNav(navPickup);
  }
}

function setActiveBottomNav(activeItem) {
  const navItems = [navHome, navPickup, navSearch, navChat, navProfile];
  navItems.forEach(item => {
    if (item) item.classList.remove('active');
  });
  if (activeItem) activeItem.classList.add('active');
}

// Show Toast message
function showToast(message, icon = '✅') {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  const iconEl = toast.querySelector('.toast-icon');
  const msgEl = toast.querySelector('.toast-msg');
  if (iconEl) iconEl.textContent = icon;
  if (msgEl) msgEl.textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Update Cart Display
function updateCartUI() {
  if (mobileCartBadge) mobileCartBadge.textContent = appState.cartCount;
  if (desktopCartCount) desktopCartCount.textContent = `${appState.cartCount} ta`;
  if (desktopCartTotal) desktopCartTotal.textContent = `$${appState.cartTotal.toFixed(2)}`;
}

// Update Order Quantity UI
function updateOrderUI() {
  if (detailQtyVal) detailQtyVal.textContent = appState.orderQty;

  // Change minus icon between trash and standard minus
  if (qtyMinusIcon) {
    if (appState.orderQty <= 1) {
      qtyMinusIcon.innerHTML = `
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      `;
    } else {
      qtyMinusIcon.innerHTML = `<line x1="5" y1="12" x2="19" y2="12"></line>`;
    }
  }

  // Recalculate price in detail
  let basePrice = appState.activeProduct.price;
  let totalItemPrice = (basePrice * appState.orderQty);
  if (chkStrawberryExtra && chkStrawberryExtra.checked) {
    totalItemPrice += appState.extraPrice;
  }
  if (detailProductPrice) {
    detailProductPrice.textContent = `$${basePrice.toFixed(0)}`;
  }
}

// Open Product Detail Screen with specific product data
function openProductDetail(productData) {
  appState.activeProduct = productData;
  appState.orderQty = 1;

  if (detailProductImg) detailProductImg.src = productData.img;
  if (detailProductTitle) detailProductTitle.textContent = productData.title;
  if (detailProductDesc) detailProductDesc.textContent = productData.desc || "Yangi va tabiiy meva.";
  if (detailProductPrice) detailProductPrice.textContent = `$${Number(productData.price).toFixed(0)}`;

  updateOrderUI();
  showScreen('screen-order');
}

// ==========================================
// Event Listeners Initialization
// ==========================================

// Desktop screen switch tabs
[btnTabOnboarding, btnTabHome, btnTabOrder].forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      showScreen(target);
    });
  }
});

// 1. Onboarding Get Started Button
if (btnGetStarted) {
  btnGetStarted.addEventListener('click', () => {
    showScreen('screen-home');
    showToast("Xush kelibsiz! Eng yangi mevalarni tanlang ✨", "🍎");
  });
}

// 2. Order Back Button
if (btnOrderBack) {
  btnOrderBack.addEventListener('click', () => {
    showScreen('screen-home');
  });
}

// 3. Product Cards Click & Quick Add
if (productsGrid) {
  productsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    // Check if clicked the Quick Add (+) button
    const addBtn = e.target.closest('[data-action="quick-add"]');
    if (addBtn) {
      e.stopPropagation();
      const title = card.getAttribute('data-title');
      const price = parseFloat(card.getAttribute('data-price')) || 10;
      appState.cartCount += 1;
      appState.cartTotal += price;
      updateCartUI();
      showToast(`${title} savatga qo'shildi!`, "🛒");
      return;
    }

    // Check if clicked heart button
    const heartBtn = e.target.closest('.heart-fav-btn');
    if (heartBtn) {
      e.stopPropagation();
      heartBtn.classList.toggle('active');
      const title = card.getAttribute('data-title');
      if (heartBtn.classList.contains('active')) {
        showToast(`${title} sevimlilarga qo'shildi!`, "❤️");
      }
      return;
    }

    // Otherwise open product detail page
    const prodData = {
      id: card.getAttribute('data-id'),
      title: card.getAttribute('data-title'),
      price: parseFloat(card.getAttribute('data-price')) || 25,
      img: card.getAttribute('data-img'),
      desc: card.getAttribute('data-desc')
    };
    openProductDetail(prodData);
  });
}

// 4. Quantity Increment / Decrement
if (btnQtyPlus) {
  btnQtyPlus.addEventListener('click', () => {
    appState.orderQty += 1;
    updateOrderUI();
  });
}

if (btnQtyMinus) {
  btnQtyMinus.addEventListener('click', () => {
    if (appState.orderQty > 1) {
      appState.orderQty -= 1;
      updateOrderUI();
    } else {
      showToast("Miqdor 1 dan kam bo'la olmaydi", "ℹ️");
    }
  });
}

// 5. Ingredient Checkbox Toggle
if (chkStrawberryExtra) {
  chkStrawberryExtra.addEventListener('change', () => {
    updateOrderUI();
    if (chkStrawberryExtra.checked) {
      showToast("Strawberrry masallig'i qo'shildi (+ $5.00)", "🍓");
    }
  });
}

// 6. Detail Add To Cart
if (btnAddToCart) {
  btnAddToCart.addEventListener('click', () => {
    let itemPrice = appState.activeProduct.price * appState.orderQty;
    if (chkStrawberryExtra && chkStrawberryExtra.checked) {
      itemPrice += appState.extraPrice;
    }
    appState.cartCount += appState.orderQty;
    appState.cartTotal += itemPrice;
    updateCartUI();
    showToast(`${appState.activeProduct.title} (${appState.orderQty} ta) savatga qo'shildi!`, "🎉");
  });
}

// 7. Search Filter in Home
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = productsGrid.querySelectorAll('.product-card');

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      if (title.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// 8. Categories Filter
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    categoryPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const category = pill.getAttribute('data-category');
    showToast(`"${pill.textContent.trim()}" bo'limi tanlandi`, "📂");
  });
});

// 9. Bottom Navigation Actions
if (navHome) {
  navHome.addEventListener('click', () => {
    showScreen('screen-home');
  });
}

if (navPickup) {
  navPickup.addEventListener('click', () => {
    showScreen('screen-order');
  });
}

if (navSearch) {
  navSearch.addEventListener('click', () => {
    showScreen('screen-home');
    if (searchInput) {
      searchInput.focus();
    }
  });
}

if (navChat) {
  navChat.addEventListener('click', () => {
    setActiveBottomNav(navChat);
    showToast("Mijozlarni qo'llab-quvvatlash xizmati doimo aloqada 💬", "👨‍💻");
  });
}

if (navProfile) {
  navProfile.addEventListener('click', () => {
    setActiveBottomNav(navProfile);
    showToast("Profil bo'limi: 4517 Washington Ave", "👤");
  });
}

// Promo banner button
const btnPromoOpen = document.getElementById('btn-promo-open');
if (btnPromoOpen) {
  btnPromoOpen.addEventListener('click', () => {
    showToast("Yangi buyurtmalaringiz uchun 3 ta bepul yetkazib berish faollashtirildi! 🚀", "🎁");
  });
}

// Notification button
const btnNotification = document.getElementById('btn-notification');
if (btnNotification) {
  btnNotification.addEventListener('click', () => {
    showToast("Sizda yangi chegirmalar va bildirishnomalar mavjud!", "🔔");
  });
}

// Initial UI Setup
updateCartUI();
updateOrderUI();
