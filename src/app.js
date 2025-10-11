import { createSidebar } from "./features/layout/sidebar.js";
import { createBottomNav } from "./features/layout/bottomnav.js";
import { renderHome } from "./features/home/home.view.js";
import { renderFriends } from "./features/friends/friends.view.js";
import { renderMessages } from "./features/messages/messages.view.js";
import { renderNotifications } from "./features/notifications/notifications.view.js";
import { renderProfile } from "./features/profile/profile.view.js";
import { renderSearch } from "./features/search/search.view.js";
import { renderSettings } from "./features/settings/settings.view.js";
import { renderEditInfo } from "./features/edit-info/edit-info.view.js";
import { createIcons, icons } from "lucide";
import { currentActive, navigate } from "./utils/navigationState.js";
import { createBackButton, removeBackButton } from "./features/components/backButton.js";
import { mockFriends } from "./data/friends.mock.js";
import { getCurrentUser } from "./utils/storage.js"; 


export function initApp(container) {
  container.innerHTML = `
    <div class="app-wrapper">
      <aside id="sidebar"></aside>
      <div class="main-content">
        <header class="app-header">
          <div class="logo-wrapper">
            <img src="./assets/logo/chat-me-logo.png" alt="Chat Me Logo" class="logo-img" />
            <h1 class="logo-text">Chat Me</h1>
          </div>
          <div class="header-actions">
            <button class="header-search-btn" id="header-search-btn" title="Search">
              <i data-lucide="search"></i>
            </button>
            <img class="burger-menu" id="burger-menu" src="/assets/images/profile-placeholder.png" alt="Profile" />
          </div>
        </header>
        <div id="global-nav-bar"></div>
        <div class="content-wrapper">
          <div id="messages-panel"></div>
          <main id="page-content"></main>
        </div>
        <div id="bottom-nav"></div>
      </div>
    </div>
    <button class="floating-create-btn" id="floating-create-btn" aria-label="Create New Post">
        <i data-lucide="plus"></i>
    </button>
  `;

  const sidebarEl = document.getElementById("sidebar");
  const bottomNavEl = document.getElementById("bottom-nav");
  const pageContentEl = document.getElementById("page-content");
  const globalNavBarEl = document.getElementById("global-nav-bar");
  const fabBtn = document.getElementById("floating-create-btn");
  const messagesPanelEl = document.getElementById("messages-panel");

  // Initialize Lucide icons for the FAB
  createIcons({ icons, attrs: { 'stroke-width': 2 } });

  // Initialize sidebar with responsive logic AND ALL navigation items
  createSidebar(sidebarEl, pageContentEl, { renderHome, renderFriends, renderMessages, renderNotifications, renderProfile, renderSearch, renderSettings });

  // --- Back Button Management ---
  function manageBackButton(show, text = 'Back') {
    if (show) {
      createBackButton(globalNavBarEl, text, () => history.back());
    } else {
      removeBackButton(globalNavBarEl);
    }
  }

  // 🟢 After rendering HTML:
  const burgerMenu = document.getElementById("burger-menu");
  const currentUser = getCurrentUser();

  // Set avatar initially
  if (burgerMenu && currentUser?.avatar) {
    burgerMenu.src = currentUser.avatar;
  }

 window.addEventListener("userDataUpdated", () => {
  if (!burgerMenu) return;
  burgerMenu.classList.add("updating");
  const updatedUser = getCurrentUser();
  setTimeout(() => {
    burgerMenu.src = updatedUser?.avatar || "/assets/images/profile-placeholder.png";
    burgerMenu.classList.remove("updating");
  }, 200);
});


  // Listen for explicit back button management requests from components
  window.addEventListener('manageBackButton', (e) => {
    manageBackButton(e.detail.show, e.detail.text);
  });

  // Function to toggle bottom nav display based on screen size
  const toggleBottomNav = () => {
    if (window.innerWidth < 900) {
      bottomNavEl.style.display = "flex";
      createBottomNav(bottomNavEl, pageContentEl); // Pass page content for navigation
      fabBtn.style.display = "none"; // FAB is part of bottom nav on mobile
    } else {
      bottomNavEl.style.display = "none";
      fabBtn.style.display = "flex"; // Show FAB on wide screens
    }
  };

  // Function to toggle messages panel based on screen size
  const toggleMessagesPanel = () => {
    if (window.innerWidth >= 1200) {
      messagesPanelEl.style.display = "flex";
      renderMessages(messagesPanelEl); // Render messages view in the panel
    } else {
      messagesPanelEl.style.display = "none";
    }
  };

  // Attach FAB click listener (example: alert or open a modal)
  fabBtn.addEventListener("click", () => {
      alert("Create button clicked! (Wide Screen FAB)");
  });

  // Attach header search button listener
  const headerSearchBtn = document.getElementById("header-search-btn");
  headerSearchBtn.addEventListener("click", () => {
    navigate('search');
  });

  // Initial call and listener for responsiveness
  toggleBottomNav();
  toggleMessagesPanel();
  window.addEventListener('resize', toggleBottomNav);
  window.addEventListener('resize', toggleMessagesPanel);

  // --- Centralized Page Rendering Function ---
  function renderPage(page, userId) {
    switch (page) {
      case "home": renderHome(pageContentEl); manageBackButton(false); break;
      case "friends": renderFriends(pageContentEl); manageBackButton(false); break;
      case "messages": renderMessages(pageContentEl); manageBackButton(false); break;
      case "notifications": renderNotifications(pageContentEl); manageBackButton(false); break;
      case "search": renderSearch(pageContentEl); manageBackButton(false); break;
      case "profile":
        const person = userId ? mockFriends.find(u => u.id === userId) : null;
        renderProfile(pageContentEl, person);
        manageBackButton(false);
        break;
      case "settings": renderSettings(pageContentEl); manageBackButton(false); break;
      case "edit-info": renderEditInfo(pageContentEl); manageBackButton(true, 'Edit Information'); break;
      default: renderHome(pageContentEl); manageBackButton(false); break;
    }
  }

  // Parse URL parameters for initial page
  const urlParams = new URLSearchParams(window.location.search);
  const pageFromUrl = urlParams.get('page');
  const userIdFromUrl = urlParams.get('userId');

  // Determine initial page: URL takes precedence, then localStorage
  const initialPage = pageFromUrl || currentActive;
  const initialUserId = userIdFromUrl || null;

  // Render initial page
  renderPage(initialPage, initialUserId);

  // If loaded from URL, update localStorage and push state
  if (pageFromUrl) {
    // Import setCurrentActive
    import('./utils/navigationState.js').then(({ setCurrentActive }) => {
      setCurrentActive(initialPage);
    });
    // Push state to history
    history.replaceState({ page: initialPage, userId: initialUserId }, '', window.location.href);
  }

  // --- SPA Routing ---
  window.addEventListener('navigate', (e) => {
    const { page, userId } = e.detail;
    const url = userId ? `?page=${page}&userId=${userId}` : `?page=${page}`;
    
    // Add a new state to the browser's history
    history.pushState({ page, userId }, '', url);
    renderPage(page, userId);
  });

  // Listen for browser back/forward button clicks
  window.addEventListener('popstate', (e) => {
    if (e.state) {
      renderPage(e.state.page, e.state.userId);
    }
  });
}
