// src/features/layout/sidebar.js
import { currentActive, navigate } from "../../utils/navigationState.js";

// Now accepts pageContent container and render functions to centralize navigation
export function createSidebar(container, pageContentEl, renderers) {
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  if (!currentUser) {
    window.location.href = "/login.html";
    return;
  }

  container.innerHTML = `
    <button class="close-btn" id="sidebar-close-btn">&times;</button>
    <div class="sidebar-content">
      <div class="user-info">
        <h2>${currentUser.username}</h2>
        <p>${currentUser.email}</p>
      </div>
      <nav class="menu">
        <button class="menu-item" id="nav-home">Home</button>
        <button class="menu-item" id="nav-people">People</button>
        <button class="menu-item" id="nav-messages">Messages</button>
        <button class="menu-item" id="nav-notifications">Notifications</button>
        <div class="divider"></div> <button class="menu-item" id="nav-profile">Profile</button>
        <button class="menu-item" id="nav-settings">Settings & Privacy</button>
        <button class="menu-item" id="nav-help">Help & Support</button>
        <button class="menu-item logout" id="nav-logout">Log Out</button>
      </nav>
    </div>
  `;

  container.classList.add("sidebar");

  // Set initial active state
  const menuItems = container.querySelectorAll('.menu-item:not(.logout)');
  menuItems.forEach(item => {
    const id = item.id.replace('nav-', '');
    if (id === currentActive) {
      item.classList.add('active');
    }
  });

  const burger = document.getElementById("burger-menu");
  const closeBtn = document.getElementById("sidebar-close-btn");
  const mainContent = document.querySelector(".main-content");
  
  // Helper functions for common actions
  const closeSidebar = () => {
    container.classList.remove("open");
    if (window.innerWidth < 900) {
      container.style.right = "-100%";
    }
  };

  const openSidebar = () => {
    container.classList.add("open");
    if (window.innerWidth < 900) {
      container.style.right = "0";
    }
  };


  const MOBILE_BREAKPOINT = 900;

  // Function to apply the correct layout based on screen width
  const applyLayout = () => {
    const screenWidth = window.innerWidth;
    
    // Reset any inline styles that might interfere with CSS media queries
    container.style.transition = '';
    mainContent.style.marginRight = '';

    if (screenWidth < MOBILE_BREAKPOINT) {
      // Mobile Layout: Sliding overlay menu
      closeSidebar();
      
      if (burger) {
        burger.onclick = openSidebar;
      }
      if (closeBtn) {
        closeBtn.onclick = closeSidebar;
      }

      // Close on outside click
      document.addEventListener("click", e => {
        if (container.classList.contains("open") && !container.contains(e.target) && e.target !== burger) {
          closeSidebar();
        }
      });
      container.addEventListener("click", e => e.stopPropagation());

    } else {
      // Desktop Layout: Always-open panel
      container.classList.remove("open"); 
      if (burger) {
        burger.onclick = null; 
      }
      if (closeBtn) {
        closeBtn.onclick = null; 
      }
      
      container.style.right = "0";
    }
  };
  
  // Function to update active state in sidebar
  function updateSidebarActive(activeId) {
    menuItems.forEach(item => {
      const id = item.id.replace('nav-', '');
      if (id === activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Attach navigation listeners for the sidebar menu
  document.getElementById("nav-home").addEventListener("click", () => {
    navigate('home');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-people").addEventListener("click", () => {
    navigate('people');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-messages").addEventListener("click", () => {
    navigate('messages');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-notifications").addEventListener("click", () => {
    navigate('notifications');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-profile").addEventListener("click", () => {
    navigate('profile');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });

  // Example logout listener
  document.getElementById("nav-logout").addEventListener("click", () => {
    localStorage.removeItem("myapp_currentUser");
    window.location.href = "/login.html";
  });


  // Listen for active nav changes from other components
  window.addEventListener('activeNavChanged', (e) => {
    updateSidebarActive(e.detail.active);
  });

  // Initial layout application
  applyLayout();
  // Re-apply layout on window resize to handle screen transitions
  window.addEventListener('resize', applyLayout);
}