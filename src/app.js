import { createSidebar } from "./features/layout/sidebar.js";
import { createBottomNav } from "./features/layout/bottomnav.js";
import { renderHome } from "./features/home/home.view.js";
import { renderPeople } from "./features/people/people.view.js";
import { renderMessages } from "./features/messages/messages.view.js";
import { renderNotifications } from "./features/notifications/notifications.view.js";
import { renderProfile } from "./features/profile/profile.view.js";
import { createIcons, icons } from "lucide";
import { currentActive } from "./utils/navigationState.js";
import { createBackButton, removeBackButton } from "./features/components/backButton.js";
import { mockPeople } from "./data/people.mock.js";


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
          <div class="burger-menu" id="burger-menu">&#9776;</div>
        </header>
        <div id="global-nav-bar"></div>
        <main id="page-content"></main>
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

  // Initialize Lucide icons for the FAB
  createIcons({ icons, attrs: { 'stroke-width': 2 } });

  // Initialize sidebar with responsive logic AND ALL navigation items
  createSidebar(sidebarEl, pageContentEl, { renderHome, renderPeople, renderMessages, renderNotifications, renderProfile });

  // --- Back Button Management ---
  function manageBackButton(show, text = 'Back') {
    if (show) {
      createBackButton(globalNavBarEl, text, () => history.back());
    } else {
      removeBackButton(globalNavBarEl);
    }
  }

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

  // Attach FAB click listener (example: alert or open a modal)
  fabBtn.addEventListener("click", () => {
      alert("Create button clicked! (Wide Screen FAB)");
  });

  // Initial call and listener for responsiveness
  toggleBottomNav();
  window.addEventListener('resize', toggleBottomNav);

  // --- Centralized Page Rendering Function ---
  function renderPage(page, userId) {
    switch (page) {
      case "home": renderHome(pageContentEl); manageBackButton(false); break;
      case "people": renderPeople(pageContentEl); manageBackButton(false); break;
      case "messages": renderMessages(pageContentEl); manageBackButton(false); break;
      case "notifications": renderNotifications(pageContentEl); manageBackButton(false); break;
      case "profile":
        const person = userId ? mockPeople.find(u => u.id === userId) : null;
        renderProfile(pageContentEl, person);
        manageBackButton(!!userId, 'Profile');
        break;
      default: renderHome(pageContentEl); manageBackButton(false); break;
    }
  }

  // Initial page render based on saved currentActive state
  switch (currentActive) {
    case "home":
      renderHome(pageContentEl);
      manageBackButton(false);
      break;
    case "people":
      renderPeople(pageContentEl);
      manageBackButton(false);
      break;
    case "messages":
      renderMessages(pageContentEl);
      manageBackButton(false);
      break;
    case "notifications":
      renderNotifications(pageContentEl);
      manageBackButton(false);
      break;
    case "profile":
      renderProfile(pageContentEl);
      manageBackButton(false);
      break;
    default:
      renderHome(pageContentEl);
      manageBackButton(false);
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
