/* Stackly – Enhanced JavaScript */

// ===== PAGE SWITCHER =====
function switchPage(pageId) {
  const currentPath = window.location.pathname.toLowerCase();
  const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.endsWith('/outdoor-camping-store');
  
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    const pages = document.querySelectorAll('.page-view');
    pages.forEach(p => p.classList.remove('active'));
    target.classList.add('active');
  } else {
    // If navigating to home and already on home, do nothing
    if (pageId === 'home') {
      if (!isHomePage) {
        window.location.href = 'index.html';
      }
    } else if (pageId && pageId !== '') {
      const targetUrl = pageId.endsWith('.html') ? pageId : (pageId + '.html');
      if (!currentPath.endsWith(targetUrl.toLowerCase())) {
        window.location.href = targetUrl;
      }
    }
    return;
  }

  // Update active state on navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#page-${pageId}` || href === `${pageId}.html` || (pageId === 'home' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hide top navbar on Dashboard pages
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  const noNavbarPages = ['dashboard', 'host-dashboard', 'user-dashboard'];
  if (navbar) {
    navbar.style.display = noNavbarPages.includes(pageId) ? 'none' : 'block';
  }

  // Hide footer on Login, Signup, and Dashboard pages
  const footer = document.getElementById('footer');
  const noFooterPages = ['login', 'signup', 'dashboard', 'host-dashboard', 'user-dashboard'];
  if (footer) {
    footer.style.display = noFooterPages.includes(pageId) ? 'none' : 'block';
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
  const path = window.location.pathname.toLowerCase();

  // Initialize custom dropdowns and mobile menu across all pages
  if (typeof initCustomDropdowns === 'function') initCustomDropdowns();
  if (typeof initMobileMenu === 'function') initMobileMenu();

  // Ensure home page container is immediately active and visible
  const homeEl = document.getElementById('page-home');
  if (homeEl) {
    homeEl.classList.add('active');
    homeEl.style.display = 'block';
    homeEl.style.opacity = '1';
  }

  // Ensure all content and scroll elements are revealed
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-init').forEach(el => {
    el.classList.add('revealed');
  });

  // If we are on dedicated standalone pages, do not perform hash/SPA rerouting
  if (path.endsWith('login.html') || path.endsWith('signup.html') || path.endsWith('dashboard.html') || path.endsWith('user-dashboard.html')) {
    return;
  }

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`page-${hash}`)) {
    switchPage(hash);
  } else {
    const currentPageView = document.querySelector('.page-view.active') || document.querySelector('.page-view');
    if (currentPageView) {
      currentPageView.classList.add('active');
      const pageId = currentPageView.id.replace('page-', '');
      if (pageId !== 'home') {
        switchPage(pageId);
      }
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
  const mainSiteLogos = document.querySelectorAll('.navbar .logo, #logo-link, .footer-logo-link, .footer-brand');
  mainSiteLogos.forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  });

  // Dedicated listener for contact form submit to guarantee clean in-place success toast and no 404
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleContactSubmit(e);
    });
  }
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

// =====================================================
// CUSTOM RESPONSIVE DROPDOWN ENGINE (ACCESSIBLE + RESPONSIVE)
// =====================================================
function initCustomDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  dropdowns.forEach(dropdown => {
    if (dropdown._initialized) return;
    dropdown._initialized = true;

    const trigger = dropdown.querySelector('.custom-dropdown-trigger');
    const valueSpan = dropdown.querySelector('.custom-dropdown-value');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const menu = dropdown.querySelector('.custom-dropdown-menu');
    const options = dropdown.querySelectorAll('.custom-dropdown-option');

    if (!trigger || !menu) return;

    // Toggle dropdown on trigger click
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');

      // Close all other open dropdowns first
      closeAllDropdowns(dropdown);

      if (isOpen) {
        closeDropdown(dropdown);
      } else {
        openDropdown(dropdown);
      }
    });

    // Option selection
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectOption(dropdown, opt);
      });

      // Keyboard support on option
      opt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectOption(dropdown, opt);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = opt.nextElementSibling;
          if (next && next.classList.contains('custom-dropdown-option')) next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = opt.previousElementSibling;
          if (prev && prev.classList.contains('custom-dropdown-option')) {
            prev.focus();
          } else {
            trigger.focus();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeDropdown(dropdown);
          trigger.focus();
        }
      });
    });

    // Keyboard navigation on trigger button
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!dropdown.classList.contains('is-open')) {
          openDropdown(dropdown);
        }
        const selected = dropdown.querySelector('.custom-dropdown-option.is-selected') || options[0];
        if (selected) selected.focus();
      } else if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
        e.preventDefault();
        closeDropdown(dropdown);
      }
    });
  });
}

function openDropdown(dropdown) {
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const menu = dropdown.querySelector('.custom-dropdown-menu');
  if (!trigger || !menu) return;

  // Viewport boundary collision detection (open upward if cramped below)
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const menuHeight = menu.scrollHeight || 200;

  if (spaceBelow < menuHeight + 20 && rect.top > menuHeight) {
    dropdown.classList.add('open-upward');
  } else {
    dropdown.classList.remove('open-upward');
  }

  dropdown.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
}

function closeDropdown(dropdown) {
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  dropdown.classList.remove('is-open');
  dropdown.classList.remove('open-upward');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function closeAllDropdowns(exceptDropdown = null) {
  document.querySelectorAll('.custom-dropdown.is-open').forEach(dd => {
    if (dd !== exceptDropdown) closeDropdown(dd);
  });
}

function selectOption(dropdown, opt) {
  const valueSpan = dropdown.querySelector('.custom-dropdown-value');
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');
  const trigger = dropdown.querySelector('.custom-dropdown-trigger');
  const val = opt.getAttribute('data-value') || opt.textContent.trim();
  const label = opt.querySelector('span') ? opt.querySelector('span').textContent.trim() : opt.textContent.trim();

  if (hiddenInput) {
    hiddenInput.value = val;
    hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  if (valueSpan) {
    valueSpan.textContent = label;
    valueSpan.classList.remove('custom-dropdown-placeholder');
  }

  dropdown.querySelectorAll('.custom-dropdown-option').forEach(o => {
    o.classList.remove('is-selected');
    o.setAttribute('aria-selected', 'false');
    const checkIcon = o.querySelector('.option-check');
    if (checkIcon) checkIcon.style.display = 'none';
  });

  opt.classList.add('is-selected');
  opt.setAttribute('aria-selected', 'true');
  const check = opt.querySelector('.option-check');
  if (check) check.style.display = 'inline-block';

  closeDropdown(dropdown);
  if (trigger) trigger.focus();
}

// Global document click to close dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-dropdown')) {
    closeAllDropdowns();
  }
});

// Global escape key to close dropdowns
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllDropdowns();
  }
});

window.initCustomDropdowns = initCustomDropdowns;

// ===== GENERIC FALLBACK ACTION HANDLER (TOAST FEEDBACK, ZERO 404) =====
function trigger404(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  showAppToast('Action completed successfully!', 'fa-solid fa-circle-check');
}

// ===== UNIVERSAL APP TOAST NOTIFICATION HELPER =====
function showAppToast(message, iconClass = 'fa-solid fa-circle-check') {
  let toast = document.getElementById('app-action-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-action-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '28px';
    toast.style.right = '28px';
    toast.style.zIndex = '9999';
    toast.style.background = '#0b1f14';
    toast.style.color = '#ffffff';
    toast.style.padding = '14px 22px';
    toast.style.borderRadius = '999px';
    toast.style.border = '1.5px solid #52b788';
    toast.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.35)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="${iconClass}" style="color: #52b788; font-size: 16px;"></i> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3500);
}

// ===== INTERACTIVE BUTTON HANDLERS (NAVIGATE TO 404 ERROR PAGE) =====
function trigger404(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  window.location.href = '404.html';
}

function handleAddToCart(e, productName) {
  trigger404(e);
}

function handleBookExpedition(e, tourTitle) {
  trigger404(e);
}

function handleCustomRoute(e) {
  trigger404(e);
}

function handleReadGuide(e, title) {
  trigger404(e);
}

function handleGuideDownload(e) {
  trigger404(e);
}

function handleMemberSignup(e) {
  trigger404(e);
}

function handlePillClick(e, name) {
  trigger404(e);
}

function handleTermsClick(e) {
  trigger404(e);
}


// ===== BLOG CATEGORY FILTER HANDLER =====
function handleBlogFilter(e, category) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const btn = e ? (e.currentTarget || e.target) : null;
  const filterVal = category || (btn ? btn.textContent.trim().toLowerCase() : 'all');

  // Update active state on buttons
  document.querySelectorAll('.bf-btn').forEach(b => {
    b.classList.remove('active');
  });
  if (btn) {
    btn.classList.add('active');
  } else {
    document.querySelectorAll('.bf-btn').forEach(b => {
      const txt = b.textContent.trim().toLowerCase();
      if (txt.includes(filterVal) || (filterVal === 'all' && (txt.includes('all') || txt.includes('stories')))) {
        b.classList.add('active');
      }
    });
  }

  // Filter blog cards
  const cards = document.querySelectorAll('.blog-card, #page-blog .service-box');
  cards.forEach(card => {
    const cardCat = (card.getAttribute('data-category') || card.querySelector('.blog-category-badge')?.textContent || card.textContent).toLowerCase();
    
    let isMatch = false;
    if (filterVal.includes('all')) {
      isMatch = true;
    } else if (filterVal.includes('camping') || filterVal.includes('tips') || filterVal.includes('shelter')) {
      isMatch = cardCat.includes('camping') || cardCat.includes('tips') || cardCat.includes('shelter') || cardCat.includes('essentials');
    } else if (filterVal.includes('gear') || filterVal.includes('review') || filterVal.includes('guide')) {
      isMatch = cardCat.includes('gear') || cardCat.includes('review') || cardCat.includes('guide') || cardCat.includes('fitting');
    } else if (filterVal.includes('survival') || filterVal.includes('skills') || filterVal.includes('safety') || filterVal.includes('aid')) {
      isMatch = cardCat.includes('survival') || cardCat.includes('first aid') || cardCat.includes('safety') || cardCat.includes('skills');
    } else if (filterVal.includes('kitchen') || filterVal.includes('cooking') || filterVal.includes('food') || filterVal.includes('meals')) {
      isMatch = cardCat.includes('kitchen') || cardCat.includes('cook') || cardCat.includes('food') || cardCat.includes('meal');
    }

    if (isMatch) {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      setTimeout(() => {
        card.style.transition = 'all 0.28s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 20);
    } else {
      card.style.display = 'none';
    }
  });

  const filterLabel = btn ? btn.textContent.trim() : filterVal;
  showAppToast(`Filtered articles by <strong>"${filterLabel}"</strong>`, 'fa-solid fa-filter');
}

let _searchToastTimer = null;

function clearSearchError() {
  const errorMsg = document.getElementById('hsb-error-msg');
  const searchBar = document.getElementById('hero-search-bar');
  if (errorMsg) errorMsg.classList.remove('visible');
  if (searchBar) searchBar.classList.remove('has-error');
  document.querySelectorAll('.hsb-field').forEach(f => f.classList.remove('has-error'));
}

function handleSearchGear(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const whatInput     = document.getElementById('hsb-what');
  const whereInput    = document.getElementById('hsb-where');
  const durationInput = document.getElementById('hsb-duration');
  const errorMsg      = document.getElementById('hsb-error-msg');
  const searchBar     = document.getElementById('hero-search-bar');
  const fieldWhere    = document.getElementById('hsb-field-where') || whereInput?.closest('.hsb-field');
  const fieldWhat     = document.getElementById('hsb-field-what') || whatInput?.closest('.hsb-field');

  const what     = (whatInput?.value || '').trim();
  const where    = (whereInput?.value || '').trim();
  const duration = (durationInput?.value || '').trim();

  // If user clicks without entering input, show error matching reference image
  if (!what && !where && !duration) {
    if (errorMsg) {
      errorMsg.textContent = 'Please enter a valid destination.';
      errorMsg.classList.add('visible');
    }
    if (searchBar) {
      searchBar.classList.remove('has-error');
      void searchBar.offsetWidth; // trigger reflow for shake animation
      searchBar.classList.add('has-error');
    }
    if (fieldWhere) fieldWhere.classList.add('has-error');
    if (fieldWhat) fieldWhat.classList.add('has-error');
    if (whereInput) {
      whereInput.focus();
    } else if (whatInput) {
      whatInput.focus();
    }
    return;
  }

  // Clear any active error state
  clearSearchError();

  let cartToast = document.getElementById('cart-toast');
  if (!cartToast) {
    cartToast = document.createElement('div');
    cartToast.id = 'cart-toast';
    cartToast.className = 'cart-toast';
    document.body.appendChild(cartToast);
  }

  // Clear any existing hide-timer so repeated clicks always re-trigger
  if (_searchToastTimer) {
    clearTimeout(_searchToastTimer);
    _searchToastTimer = null;
  }

  const parts = [];
  if (what)     parts.push(`<em>${what}</em>`);
  if (where)    parts.push(`near <em>${where}</em>`);
  if (duration) parts.push(`for <em>${duration}</em>`);
  const msg = `🔍 <strong>Search Applied!</strong> Showing results for ${parts.join(' ')}.`;

  cartToast.innerHTML = msg;
  cartToast.classList.remove('show');
  void cartToast.offsetWidth;
  cartToast.classList.add('show');

  _searchToastTimer = setTimeout(() => {
    cartToast.classList.remove('show');
    _searchToastTimer = null;
  }, 3200);
}

// Auto-attach listeners to clear error only when user types
document.addEventListener('DOMContentLoaded', () => {
  ['hsb-what', 'hsb-where', 'hsb-duration'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const val = el.value.trim();
        if (val) clearSearchError();
      });
    }
  });
});


function handleForgotPassword(e) {
  trigger404(e);
}

function handleAddNewListing(e) {
  trigger404(e);
}

function handleDashboardAction(e, actionName) {
  trigger404(e);
}

function handleSocialAuth(e) {
  trigger404(e);
}

function handleSocialClick(e, platformName, url) {
  trigger404(e);
}

function handleSocialPhotoClick(e) {
  trigger404(e);
}

function handleContactAction(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  showAppToast('Message submitted! Our team will get back to you shortly.', 'fa-solid fa-paper-plane');
}

function handleTermsClick(e) {
  trigger404(e);
}

function handleStoreHoursClick(e) {
  trigger404(e);
}

function handleDirectionsClick(e) {
  trigger404(e);
}

function handleLiveChatClick(e) {
  trigger404(e);
}

function handleContactLocationClick(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  if (typeof switchPage === 'function' && document.getElementById('page-contact')) {
    switchPage('contact');
    setTimeout(() => {
      const locationSection = document.querySelector('#page-contact .bg-alt') || document.getElementById('page-contact');
      if (locationSection) {
        locationSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  } else {
    window.location.href = 'contact.html';
  }
}

// ===== AUTH MODAL =====
let activeModal = null;

function openModal(type) {
  if (type === '404') {
    window.location.href = '404.html';
    return;
  }
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
  let cleanName = (name && name.trim()) ? name.trim() : 'Manasasrinivas_Lingala';
  if (cleanName.toLowerCase().includes('lingalamanasa') || cleanName.toLowerCase().includes('lingala')) {
    cleanName = 'Manasasrinivas_Lingala';
  }
  const cleanUname = cleanName.replace(/\s+/g, '_').toUpperCase();

  const nameEls = document.querySelectorAll('.dash-user-disp-name');
  nameEls.forEach(el => el.textContent = cleanName);

  const unameEls = document.querySelectorAll('.dash-user-uname-disp');
  unameEls.forEach(el => el.textContent = cleanUname);

  if (userEmail && userEmail.trim()) {
    const emailEls = document.querySelectorAll('.dash-user-email-disp');
    emailEls.forEach(el => el.textContent = userEmail.trim());
  }
}

function switchDashTab(tabName, evt) {
  if (evt) { evt.preventDefault(); }

  // 1. Close mobile drawer if open
  closeDashDrawer();

  // 2. Map each tab to ALL possible panel IDs across every page
  const panelMap = {
    'overview': ['host-panel-overview', 'user-panel-overview'],
    'trips':    ['host-panel-properties', 'user-panel-rentals'],
    'saved':    ['host-panel-bookings', 'user-panel-expeditions'],
    'payments': ['host-panel-earnings', 'user-panel-wishlist'],
    'settings': ['host-panel-settings', 'user-panel-settings']
  };

  const targetPanels = panelMap[tabName] || panelMap['overview'];

  // 3. Remove active from ALL sidebar links, then add to clicked one
  document.querySelectorAll('.dash-sidebar .sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  // Mark links whose onclick contains this tabName as active
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const oc = link.getAttribute('onclick') || '';
    if (oc.includes("'" + tabName + "'")) {
      link.classList.add('active');
    }
  });

  // 4. Hide ALL subpanels
  document.querySelectorAll('.host-subpanel, .user-subpanel').forEach(panel => {
    panel.classList.remove('active');
    panel.style.display = 'none';
  });

  // 5. Show the matching panels
  targetPanels.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      el.style.display = 'block';
    }
  });

  // 6. Scroll to top
  const mc = document.querySelector('.page-view.active .dash-main-content') || document.querySelector('.dash-main-content');
  if (mc) { mc.scrollTop = 0; }
}

function switchHostTab(tabName, evt) {
  switchDashTab(tabName, evt);
}

function switchTravelerTab(tabName, evt) {
  switchDashTab(tabName, evt);
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

  const selectedRole = roleInput ? roleInput.value.toLowerCase() : '';
  let targetUrl = 'user-dashboard.html';
  if (selectedRole === 'admin') {
    targetUrl = 'dashboard.html';
  } else {
    targetUrl = 'user-dashboard.html';
  }

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
        if (targetUrl.includes('.html') && !targetUrl.startsWith('index.html')) {
          window.location.href = targetUrl;
        } else {
          switchPage('dashboard');
        }
      }, 800);
    }, 800);
  } else {
    if (userName) updateDashboardName(userName, emailInput ? emailInput.value : '', selectedRole);
    closeModal();
    if (targetUrl.includes('.html') && !targetUrl.startsWith('index.html')) {
      window.location.href = targetUrl;
    } else {
      switchPage('dashboard');
    }
  }
}

function selectRoleRadio(labelEl) {
  if (!labelEl) return;
  const container = labelEl.closest('.role-sheet-container') || document;
  container.querySelectorAll('.role-radio-item').forEach(item => item.classList.remove('selected'));
  labelEl.classList.add('selected');
  const radio = labelEl.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

function handleSignup(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]') || document.getElementById('signup-submit-btn');
  const fnameInput = document.getElementById('sup-fname') || e.target.querySelector('input[type="text"]');
  const emailInput = document.getElementById('sup-email') || e.target.querySelector('input[type="email"]');
  const roleInput = document.getElementById('sup-role') || e.target.querySelector('select');
  
  let fullName = '';
  if (fnameInput && fnameInput.value) {
    fullName = fnameInput.value;
  }

  const selectedRole = roleInput ? (roleInput.value || '').toLowerCase() : '';
  let targetUrl = 'user-dashboard.html';
  if (selectedRole === 'admin') {
    targetUrl = 'dashboard.html';
  } else {
    targetUrl = 'user-dashboard.html';
  }

  if (btn) {
    const origText = btn.textContent;
    btn.textContent = '⏳ Creating Account...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Account Created!';
      btn.style.background = '#52b788';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        if (fullName) updateDashboardName(fullName, emailInput ? emailInput.value : '', selectedRole);
        closeModal();
        if (targetUrl.includes('.html') && !targetUrl.startsWith('index.html')) {
          window.location.href = targetUrl;
        } else {
          switchPage('dashboard');
        }
      }, 800);
    }, 800);
  } else {
    if (fullName) updateDashboardName(fullName, emailInput ? emailInput.value : '', selectedRole);
    closeModal();
    if (targetUrl.includes('.html') && !targetUrl.startsWith('index.html')) {
      window.location.href = targetUrl;
    } else {
      switchPage('dashboard');
    }
  }
}

// ===== CONTACT FORM SUBMIT =====
function handleContactSubmit(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }

  const nameInput = document.getElementById('c-name');
  const emailInput = document.getElementById('c-email');
  const phoneInput = document.getElementById('c-phone');
  const msgInput = document.getElementById('c-msg');
  const submitBtn = document.getElementById('c-submit-btn');

  const senderName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Valued Explorer';
  const senderEmail = (emailInput && emailInput.value.trim()) ? emailInput.value.trim() : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message...';
  }

  setTimeout(() => {
    showAppToast(`✨ Message Sent! Thank you, ${senderName}. Our outdoor guide team has received your message and will reply to ${senderEmail || 'your email'} shortly.`, 'fa-solid fa-paper-plane');
    const form = document.getElementById('contact-form') || (e && e.target ? e.target.closest('form') : null);
    if (form) form.reset();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send message';
    }
  }, 450);

  return false;
}

// ===== NEWSLETTER SUBSCRIBE =====
function handleSubscribeNewsletter(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const input = e && e.target ? e.target.querySelector('input[type="email"]') : null;
  const emailVal = input ? input.value.trim() : '';
  showAppToast(`📩 Subscribed! Thank you for joining the Stackly Adventurers Club (${emailVal || 'your email'}).`, 'fa-solid fa-envelope-circle-check');
  if (input) input.value = '';
  return false;
}

// ===== NAVBAR SCROLL & MOBILE MENU =====
const HAMBURGER_OPEN_SVG = `<svg class="hamburger-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const HAMBURGER_CLOSED_SVG = `<svg class="hamburger-icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

function initMobileMenu() {
  const hamburgerBtns = document.querySelectorAll('.hamburger, #hamburger-btn');
  const navLinksContainer = document.getElementById('nav-links');

  hamburgerBtns.forEach(hamburger => {
    hamburger.onclick = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!navLinksContainer) return;
      const isOpen = navLinksContainer.classList.toggle('open');
      hamburgerBtns.forEach(btn => {
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        btn.innerHTML = isOpen ? HAMBURGER_OPEN_SVG : HAMBURGER_CLOSED_SVG;
      });
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
  });

  if (navLinksContainer) {
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          if (href.startsWith('#')) {
            closeMobileMenu();
            return;
          }
          e.preventDefault();
          closeMobileMenu();
          setTimeout(() => {
            window.location.href = href;
          }, 60);
        } else {
          closeMobileMenu();
        }
      });
    });
  }
}

function closeMobileMenu() {
  const navLinksContainer = document.getElementById('nav-links');
  const hamburgerBtns = document.querySelectorAll('.hamburger, #hamburger-btn');
  if (navLinksContainer) navLinksContainer.classList.remove('open');
  hamburgerBtns.forEach(btn => {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = HAMBURGER_CLOSED_SVG;
  });
  document.body.style.overflow = '';
}

// Global click outside to close mobile nav
document.addEventListener('click', (e) => {
  const navLinksContainer = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger-btn');
  if (navLinksContainer && navLinksContainer.classList.contains('open')) {
    if (!navLinksContainer.contains(e.target) && !hamburger?.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// Initialize on DOM load and immediately
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scroll-top-btn')?.classList.toggle('visible', window.scrollY > 400);
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
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const form = e ? (e.target.tagName === 'FORM' ? e.target : e.target.closest('form')) : document.getElementById('newsletter-form');
  const btn = form ? form.querySelector('button[type="submit"]') : document.getElementById('newsletter-submit-btn');
  const emailInput = form ? form.querySelector('input[type="email"]') : document.getElementById('newsletter-email');
  
  const emailVal = emailInput ? emailInput.value.trim() : '';
  if (!emailVal) {
    if (emailInput) emailInput.focus();
    return false;
  }

  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '🎉 Subscribed!';
    btn.style.background = '#52b788';
    btn.style.color = '#ffffff';
    if (emailInput) emailInput.value = '';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; }, 3500);
  }

  let cartToast = document.getElementById('cart-toast');
  if (!cartToast) {
    cartToast = document.createElement('div');
    cartToast.id = 'cart-toast';
    cartToast.className = 'cart-toast';
    document.body.appendChild(cartToast);
  }
  cartToast.innerHTML = `📩 <strong>Subscribed to Stackly!</strong> Confirmation sent to <em>${emailVal}</em>.`;
  cartToast.classList.remove('show');
  void cartToast.offsetWidth;
  cartToast.classList.add('show');
  setTimeout(() => cartToast.classList.remove('show'), 3500);
  return false;
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

// ===== COUNTER ANIMATION (mini-stat numbers count up on scroll) =====
(function initCounterAnimation() {
  function animateCounter(el, target, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  function runCounters() {
    document.querySelectorAll('.mini-val[data-target]').forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      animateCounter(el, parseInt(el.dataset.target, 10), 1800);
    });
  }

  // Use IntersectionObserver to trigger when stats bar enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.stats-mini-bar');
    if (bar) observer.observe(bar);
    else runCounters(); // fallback: run immediately if already visible
  });

  // Also trigger on page switch (SPA navigation)
  const origSwitch = window.switchPage;
  if (typeof origSwitch === 'function') {
    window.switchPage = function(pageId) {
      origSwitch(pageId);
      if (pageId === 'home') {
        setTimeout(() => {
          document.querySelectorAll('.mini-val[data-target]').forEach(el => delete el.dataset.animated);
          const bar = document.querySelector('.stats-mini-bar');
          if (bar) {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight) runCounters();
          }
        }, 400);
      }
    };
  }
})();

// ===== ADVANCED SCROLL REVEAL & STATS OBSERVER (2026 UPDATE) =====
(function initScrollAnimations() {
  function handleScrollAnimation() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.88) {
        el.classList.add('revealed');
      }
    });

    // Stat counter animation
    document.querySelectorAll('.stat-counter-number[data-count]').forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.95 && !counter.dataset.animated) {
        counter.dataset.animated = 'true';
        const target = parseFloat(counter.dataset.count) || 0;
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        const decimals = parseInt(counter.dataset.decimals || '0', 10);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          
          if (decimals > 0) {
            counter.textContent = prefix + current.toFixed(decimals) + suffix;
          } else {
            counter.textContent = prefix + Math.round(current).toLocaleString() + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (decimals > 0) {
              counter.textContent = prefix + target.toFixed(decimals) + suffix;
            } else {
              counter.textContent = prefix + target.toLocaleString() + suffix;
            }
          }
        }
        requestAnimationFrame(updateCounter);
      }
    });

    // Timeline line progress animation
    const timeline = document.querySelector('.timeline-wrapper');
    if (timeline) {
      const lineProg = timeline.querySelector('.timeline-line-progress');
      const nodes = timeline.querySelectorAll('.timeline-node-item');
      const rect = timeline.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.8) {
        if (lineProg) lineProg.style.height = '100%';
        nodes.forEach((node, idx) => {
          setTimeout(() => {
            node.classList.add('node-active');
            const box = node.querySelector('.timeline-node-box');
            if (box) box.classList.add('revealed');
          }, idx * 280);
        });
      }
    }
  }

  window.addEventListener('scroll', handleScrollAnimation, { passive: true });
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(handleScrollAnimation, 100);
  });
  window.addEventListener('load', () => {
    setTimeout(handleScrollAnimation, 200);
  });
  // Immediate trigger
  handleScrollAnimation();
})();

// ===== TOAST NOTIFICATION HELPER =====
function showToast(message, type = 'success', duration = 3200) {
  // Remove any existing toast
  const existing = document.getElementById('stackly-toast');
  if (existing) existing.remove();

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
  };
  const colors = {
    success: '#52b788',
    info:    '#60a5fa',
    warning: '#fbbf24'
  };

  const toast = document.createElement('div');
  toast.id = 'stackly-toast';
  toast.innerHTML = `<span style="color:${colors[type] || colors.success}; display:flex; align-items:center;">${icons[type] || icons.success}</span><span>${message}</span>`;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    zIndex: '99999',
    background: '#0f2218',
    border: `1.5px solid ${colors[type] || colors.success}`,
    borderRadius: '14px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    transition: 'opacity 0.35s ease, transform 0.35s ease',
    opacity: '0',
    transform: 'translateY(16px)',
    maxWidth: '360px'
  });

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  // Animate out and remove
  const timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);

  // Click to dismiss
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 400);
  });
}

