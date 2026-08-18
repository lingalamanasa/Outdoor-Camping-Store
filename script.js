/* Stackly – Enhanced JavaScript */

// ===== PAGE SWITCHER =====
function switchPage(pageId) {
  const pages = document.querySelectorAll('.page-view');
  if (pages.length === 0) return;

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    pages.forEach(p => p.classList.remove('active'));
    target.classList.add('active');
  } else if (document.getElementById('page-home')) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');
    pageId = 'home';
  } else {
    // Single standalone page file (e.g. about.html, services.html, etc.)
    const firstPage = document.querySelector('.page-view');
    if (firstPage) {
      firstPage.classList.add('active');
      const idMatch = firstPage.id.replace('page-', '');
      if (idMatch) pageId = idMatch;
    }
  }

  // Hide top navbar on Dashboard pages as requested
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const noNavbarPages = ['dashboard', 'host-dashboard', 'user-dashboard'];
  if (navbar) {
    if (noNavbarPages.includes(pageId)) {
      navbar.style.display = 'none';
    } else {
      navbar.style.display = 'block';
    }
  }

  // Hide footer on Login, Signup, and Dashboard pages as requested
  const footer = document.getElementById('footer');
  const noFooterPages = ['login', 'signup', 'dashboard', 'host-dashboard', 'user-dashboard'];
  if (footer) {
    if (noFooterPages.includes(pageId)) {
      footer.style.display = 'none';
    } else {
      footer.style.display = 'block';
    }
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  if (pageId === 'dashboard' || pageId === 'host-dashboard') {
    if (typeof switchHostTab === 'function') switchHostTab('overview');
  }
  if (pageId === 'user-dashboard') {
    if (typeof switchTravelerTab === 'function') switchTravelerTab('overview');
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(l => l.classList.remove('active'));
  const activeNav = document.getElementById(`nav-${pageId}`);
  if (activeNav) activeNav.classList.add('active');

  document.getElementById('nav-links')?.classList.remove('open');
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`page-${hash}`)) {
    switchPage(hash);
  } else {
    // Auto-detect the page element present on the current HTML file
    const currentPageView = document.querySelector('.page-view.active') || document.querySelector('.page-view');
    if (currentPageView) {
      currentPageView.classList.add('active');
      const pageId = currentPageView.id.replace('page-', '');
      switchPage(pageId);
    } else {
      switchPage('home');
    }
  }

  // Explicit event listener for host dashboard logo & brand area (returns to Host Dashboard)
  const hostLogos = document.querySelectorAll('#page-dashboard .dash-logo, #page-dashboard .dash-sidebar-brand, #page-dashboard .dash-mobile-header-brand, #host-dash-sidebar .dash-sidebar-brand');
  hostLogos.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (document.getElementById('page-dashboard')) {
        switchPage('dashboard');
        if (typeof switchHostTab === 'function') switchHostTab('overview');
      } else {
        window.location.href = 'dashboard.html';
      }
    });
  });

  // Explicit event listener for traveler dashboard logo & brand area (returns to Traveler Dashboard)
  const userLogos = document.querySelectorAll('#page-user-dashboard .dash-logo, #page-user-dashboard .dash-sidebar-brand, #page-user-dashboard .dash-mobile-header-brand, #user-dash-sidebar .dash-sidebar-brand');
  userLogos.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (document.getElementById('page-user-dashboard')) {
        switchPage('user-dashboard');
        if (typeof switchTravelerTab === 'function') switchTravelerTab('overview');
      } else {
        window.location.href = 'user-dashboard.html';
      }
    });
  });

  // Explicit event listener for main navbar & footer Stackly logo to ensure clean navigation to home
  const mainSiteLogos = document.querySelectorAll('.navbar .logo, #logo-link, .footer-logo-link');
  mainSiteLogos.forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  });
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (['home', 'about', 'services', 'blog', 'contact', 'login', 'signup', 'dashboard', 'user-dashboard', 'host-dashboard'].includes(hash)) {
    switchPage(hash);
  }
});

// ===== RELOAD / OPEN DASHBOARD LOGO ACTION =====
function reloadCurrentDashboard(e) {
  if (e) e.preventDefault();
  if (document.getElementById('page-dashboard') && document.getElementById('page-dashboard').classList.contains('active')) {
    switchPage('dashboard');
    if (typeof switchHostTab === 'function') switchHostTab('overview');
  } else if (document.getElementById('page-user-dashboard') && document.getElementById('page-user-dashboard').classList.contains('active')) {
    switchPage('user-dashboard');
    if (typeof switchTravelerTab === 'function') switchTravelerTab('overview');
  } else if (window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'dashboard.html';
  } else if (window.location.pathname.includes('user-dashboard.html')) {
    window.location.href = 'user-dashboard.html';
  } else {
    window.location.href = 'index.html';
  }
  return false;
}

// ===== MOBILE DASHBOARD NAVIGATION TOGGLE =====
function toggleMobileDashNav(btn) {
  const sidebar = btn ? btn.closest('.dash-sidebar') : null;
  if (!sidebar) return;
  const nav = sidebar.querySelector('.sidebar-nav');
  if (nav) {
    nav.classList.toggle('open');
    btn.classList.toggle('active');
  }
}

// ===== HOST DASHBOARD SUBPANEL SWITCHER =====
function switchHostTab(tabId) {
  const links = document.querySelectorAll('#page-dashboard .sidebar-link');
  links.forEach(l => l.classList.remove('active'));
  const activeLink = document.getElementById(`host-nav-${tabId}`);
  if (activeLink) activeLink.classList.add('active');

  const panels = document.querySelectorAll('#page-dashboard .host-subpanel');
  panels.forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById(`host-panel-${tabId}`);
  if (targetPanel) targetPanel.classList.add('active');

  document.querySelectorAll('.dash-sidebar .sidebar-nav').forEach(n => n.classList.remove('open'));
  document.querySelectorAll('.dash-mobile-nav-toggle').forEach(t => t.classList.remove('active'));

  const mainContent = document.querySelector('#page-dashboard .dash-main-content');
  if (mainContent) mainContent.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ===== TRAVELER DASHBOARD SUBPANEL SWITCHER =====
function switchTravelerTab(tabId) {
  const links = document.querySelectorAll('#page-user-dashboard .sidebar-link');
  links.forEach(l => l.classList.remove('active'));
  const activeLink = document.getElementById(`user-nav-${tabId}`);
  if (activeLink) activeLink.classList.add('active');

  const panels = document.querySelectorAll('#page-user-dashboard .user-subpanel');
  panels.forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById(`user-panel-${tabId}`);
  if (targetPanel) targetPanel.classList.add('active');

  document.querySelectorAll('.dash-sidebar .sidebar-nav').forEach(n => n.classList.remove('open'));
  document.querySelectorAll('.dash-mobile-nav-toggle').forEach(t => t.classList.remove('active'));

  const mainContent = document.querySelector('#page-user-dashboard .dash-main-content');
  if (mainContent) mainContent.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ===== DASHBOARD TAB SWITCHER =====
function switchDashTab(tabId) {
  const tabs = document.querySelectorAll('.dash-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');

  const panels = document.querySelectorAll('.dash-panel');
  panels.forEach(p => p.classList.remove('active'));

  const targetPanel = document.getElementById(`dash-panel-${tabId}`);
  if (targetPanel) targetPanel.classList.add('active');
}

// ===== 404 SOCIAL MEDIA TRIGGER =====
function trigger404(e) {
  if (e) e.preventDefault();
  openModal('404');
}

// ===== INTERACTIVE BUTTON HANDLERS =====
function handleAddToCart(e, productName) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = '#52b788';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
  
  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `🛒 <strong>"${productName || 'Item'}"</strong> added to your cart!`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3000);
  }
}

function handleBookExpedition(e, tourTitle) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = '✓ Reserved!';
  btn.style.background = '#52b788';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);

  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `🏔️ Expedition <strong>"${tourTitle || 'Adventure'}"</strong> booked! Guide will contact you soon.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3500);
  }
}

function handleCustomRoute(e) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = '✓ GPX Requested!';
  btn.style.background = '#52b788';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);

  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `🗺️ Custom trail route request submitted! Check your email for GPX files.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3500);
  }
}

function handleSearchGear(e) {
  if (e) e.preventDefault();
  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `🔍 <strong>Search Filter Applied!</strong> Showing matched outdoor gear &amp; trips.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3000);
  }
}

function handleMemberSignup(e) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = '🎉 Membership Activated!';
  btn.style.background = '#52b788';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `⭐ <strong>Welcome to Stackly VIP Club!</strong> Your $49/yr membership is active.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3500);
  }
}

function handleForgotPassword(e) {
  if (e) e.preventDefault();
  const email = prompt('Enter your registered email address to reset password:');
  if (email) {
    alert(`A password reset link has been sent to ${email}. Please check your inbox.`);
  }
}

function handleReadGuide(e, title) {
  if (e) e.preventDefault();
  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `📖 <strong>"${title || 'Guide'}"</strong> opened in reader view.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3000);
  }
}

function handleGuideDownload(e) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = '✓ Downloaded!';
  btn.style.background = '#52b788';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
  const cartToast = document.getElementById('cart-toast');
  if (cartToast) {
    cartToast.innerHTML = `📥 <strong>Outdoor Guide PDF Downloaded!</strong> File saved to your downloads folder.`;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3000);
  }
}

function handleAddNewListing(e) {
  if (e) e.preventDefault();
  const propName = prompt('Enter new property/gear title to list on Stackly:');
  if (propName) {
    const cartToast = document.getElementById('cart-toast');
    if (cartToast) {
      cartToast.innerHTML = `🏠 <strong>"${propName}"</strong> submitted for host approval!`;
      cartToast.classList.add('show');
      setTimeout(() => cartToast.classList.remove('show'), 3500);
    }
  }
}

function handleDashboardAction(e, actionName) {
  if (e) e.preventDefault();
  const btn = e.target;
  const orig = btn.textContent;
  btn.textContent = `✓ ${actionName || 'Updated'}`;
  setTimeout(() => { btn.textContent = orig; }, 1800);
}

// ===== AUTH MODAL =====
let activeModal = null;

function openModal(type) {
  if (type === 'login' || type === 'signup') {
    switchPage(type);
    return;
  }
  closeModal(false);
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(`modal-${type}`);
  if (!modal || !backdrop) return;
  backdrop.classList.add('open');
  modal.classList.add('open');
  activeModal = type;
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }, 380);
}

function closeModal(animate = true) {
  const backdrop = document.getElementById('modal-backdrop');
  const modals = document.querySelectorAll('.auth-modal');
  backdrop?.classList.remove('open');
  modals.forEach(m => m.classList.remove('open'));
  activeModal = null;
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeModal) closeModal();
});

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

const signupPw = document.getElementById('signup-password');
if (signupPw) {
  signupPw.addEventListener('input', () => {
    const val = signupPw.value;
    const bar = document.querySelector('.pw-bar');
    if (!bar) return;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    const colors = ['#e84040', '#f4a636', '#e8c838', '#52b788'];
    const widths = ['25%', '50%', '75%', '100%'];
    bar.style.width = strength > 0 ? widths[strength - 1] : '0';
    bar.style.background = strength > 0 ? colors[strength - 1] : '';
  });
}

function updateDashboardName(name, userEmail, userRole) {
  if (!name || !name.trim()) return;
  const cleanName = name.trim();
  const cleanUname = cleanName.replace(/\s+/g, '_');

  const nameEls = document.querySelectorAll('.dash-user-disp-name');
  nameEls.forEach(el => el.textContent = cleanName);

  const unameEls = document.querySelectorAll('.dash-user-uname-disp');
  unameEls.forEach(el => el.textContent = cleanUname);

  if (userEmail && userEmail.trim()) {
    const emailEls = document.querySelectorAll('.dash-user-email-disp');
    emailEls.forEach(el => el.textContent = userEmail.trim());
  }

  if (userRole && userRole.trim()) {
    let roleText = 'Host Dashboard';
    const val = userRole.toLowerCase();
    if (val === 'adventurer' || val === 'traveler') {
      roleText = 'Traveler Dashboard';
    } else if (val === 'mountaineer' || val === 'guide') {
      roleText = 'Mountaineer Guide Dashboard';
    } else if (val === 'host' || val === 'property-owner') {
      roleText = 'Host Dashboard';
    } else if (val === 'gear-enthusiast' || val === 'gear-host') {
      roleText = 'Gear Collector Dashboard';
    } else {
      roleText = userRole.charAt(0).toUpperCase() + userRole.slice(1) + ' Dashboard';
    }

    const roleEls = document.querySelectorAll('.dash-sidebar-role-disp');
    roleEls.forEach(el => el.textContent = roleText);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]') || document.getElementById('login-submit-btn');
  const emailInput = e.target.querySelector('input[type="email"]');
  const unameInput = document.getElementById('lin-uname');
  const roleInput = document.getElementById('lin-role') || e.target.querySelector('select');
  
  let userName = '';
  if (unameInput && unameInput.value) {
    userName = unameInput.value;
  } else if (emailInput && emailInput.value) {
    userName = emailInput.value.split('@')[0];
    userName = userName.charAt(0).toUpperCase() + userName.slice(1);
  }

  const selectedRole = roleInput ? roleInput.value : '';
  const targetPage = (selectedRole === 'adventurer' || selectedRole === 'traveler') ? 'user-dashboard' : 'dashboard';

  if (btn) {
    const origText = btn.textContent;
    btn.textContent = '⏳ Logging in...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Welcome Back!';
      btn.style.background = '#52b788';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        if (userName) updateDashboardName(userName, emailInput ? emailInput.value : '', selectedRole);
        closeModal();
        e.target.reset();
        switchPage(targetPage);
      }, 1000);
    }, 1000);
  } else {
    if (userName) updateDashboardName(userName, emailInput ? emailInput.value : '', selectedRole);
    closeModal();
    switchPage(targetPage);
  }
}

function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]') || document.getElementById('signup-submit-btn');
  const fnameInput = document.getElementById('sup-fname') || e.target.querySelector('input[placeholder*="First"], input[type="text"]');
  const lnameInput = document.getElementById('sup-lname');
  const emailInput = document.getElementById('sup-email') || e.target.querySelector('input[type="email"]');
  const roleInput = document.getElementById('sup-role') || e.target.querySelector('select');
  
  let fullName = '';
  if (fnameInput && fnameInput.value) {
    fullName = fnameInput.value + (lnameInput && lnameInput.value ? ' ' + lnameInput.value : '');
  }

  const selectedRole = roleInput ? roleInput.value : '';
  const targetPage = (selectedRole === 'adventurer' || selectedRole === 'traveler') ? 'user-dashboard' : 'dashboard';

  if (btn) {
    const origText = btn.textContent;
    btn.textContent = '⏳ Creating Account...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '🎉 Account Created!';
      btn.style.background = '#52b788';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        if (fullName) updateDashboardName(fullName, emailInput ? emailInput.value : '', selectedRole);
        closeModal();
        e.target.reset();
        switchPage(targetPage);
      }, 1000);
    }, 1000);
  } else {
    if (fullName) updateDashboardName(fullName, emailInput ? emailInput.value : '', selectedRole);
    closeModal();
    switchPage(targetPage);
  }
}

// ===== CONTACT FORM SUBMIT =====
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('c-submit-btn');
  const original = btn.innerHTML;
  btn.textContent = '⏳ Sending Message...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Message Sent Successfully!';
    btn.style.background = '#52b788';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 2500);
  }, 1400);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger-btn');
const navLinksContainer = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scroll-top-btn')?.classList.toggle('visible', window.scrollY > 400);
});

const HAMBURGER_OPEN_SVG = `<svg class="hamburger-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const HAMBURGER_CLOSED_SVG = `<svg class="hamburger-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

hamburger?.addEventListener('click', () => {
  const isOpen = navLinksContainer.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  hamburger.innerHTML = isOpen ? HAMBURGER_OPEN_SVG : HAMBURGER_CLOSED_SVG;
});

// ===== HERO SLIDER (HOME PAGE) =====
const slides = document.querySelectorAll('.hero-slide');
const slideBtns = document.querySelectorAll('.slide-thumb');
let currentSlide = 0, slideInterval;

function goToSlide(idx) {
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  slideBtns[currentSlide]?.classList.remove('active');
  currentSlide = idx;
  slides[currentSlide].classList.add('active');
  slideBtns[currentSlide]?.classList.add('active');
}
function startSlider() { if (slides.length) slideInterval = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000); }
startSlider();
slideBtns.forEach((btn, idx) => btn.addEventListener('click', () => {
  clearInterval(slideInterval); goToSlide(idx); startSlider();
}));

// ===== ADD TO CART =====
const cartToast = document.getElementById('cart-toast');
document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#52b788';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
    if (cartToast) { cartToast.classList.add('show'); setTimeout(() => cartToast.classList.remove('show'), 2800); }
  });
});

// ===== BLOG CATEGORY FILTER TOGGLE =====
document.querySelectorAll('.bf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ===== NEWSLETTER =====
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('newsletter-submit-btn');
  const emailInput = document.getElementById('newsletter-email');
  btn.textContent = '🎉 Subscribed!';
  btn.style.background = '#52b788';
  emailInput.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ===== DASHBOARD MOBILE SLIDE-OUT DRAWER HANDLERS =====
function openDashDrawer() {
  document.querySelectorAll('.dash-sidebar').forEach(s => s.classList.add('drawer-open'));
  let backdrop = document.getElementById('dash-drawer-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'dash-drawer-backdrop';
    backdrop.className = 'dash-drawer-backdrop';
    backdrop.onclick = closeDashDrawer;
    document.body.appendChild(backdrop);
  }
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDashDrawer() {
  document.querySelectorAll('.dash-sidebar').forEach(s => s.classList.remove('drawer-open'));
  const backdrop = document.getElementById('dash-drawer-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
