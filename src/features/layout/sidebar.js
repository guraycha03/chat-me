// src/features/layout/sidebar.js

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
        <button class="menu-item" id="nav-notifications">Alerts</button>
        <div class="divider"></div> <button class="menu-item" id="nav-profile">Profile</button>
        <button class="menu-item" id="nav-settings">Settings & Privacy</button>
        <button class="menu-item" id="nav-help">Help & Support</button>
        <button class="menu-item logout" id="nav-logout">Log Out</button>
      </nav>
    </div>
  `;

  container.classList.add("sidebar");

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
  
  // Attach navigation listeners for the sidebar menu
  document.getElementById("nav-home").addEventListener("click", () => {
    renderers.renderHome(pageContentEl);
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-people").addEventListener("click", () => {
    renderers.renderPeople(pageContentEl);
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-messages").addEventListener("click", () => {
    renderers.renderMessages(pageContentEl);
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-notifications").addEventListener("click", () => {
    renderers.renderNotifications(pageContentEl);
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });

  // Example logout listener
  document.getElementById("nav-logout").addEventListener("click", () => {
    localStorage.removeItem("myapp_currentUser");
    window.location.href = "/login.html";
  });


  // Initial layout application
  applyLayout();
  // Re-apply layout on window resize to handle screen transitions
  window.addEventListener('resize', applyLayout);
}