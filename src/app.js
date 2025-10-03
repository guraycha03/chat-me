// src/app.js
import { createSidebar } from "./features/layout/sidebar.js";
import { createBottomNav } from "./features/layout/bottomnav.js";
import { renderHome } from "./features/home/home.view.js";
import { renderPeople } from "./features/people/people.view.js";
import { renderMessages } from "./features/messages/messages.view.js";
import { renderNotifications } from "./features/notifications/notifications.view.js";
import { renderProfile } from "./features/profile/profile.view.js";
import { createIcons, icons } from "lucide";


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
  const fabBtn = document.getElementById("floating-create-btn");

  // Initialize Lucide icons for the FAB
  createIcons({ icons, attrs: { 'stroke-width': 2 } });
  
  // Initialize sidebar with responsive logic AND ALL navigation items
  createSidebar(sidebarEl, pageContentEl, { renderHome, renderPeople, renderMessages, renderNotifications, renderProfile }); 

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

  // Initial page render
  renderHome(pageContentEl);
}
