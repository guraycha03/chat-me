
import { currentActive, navigate } from "../../utils/navigationState.js";
import { createIcons, icons } from "lucide";
import { removeCurrentUser } from "../../utils/storage.js";

export function createSidebar(container, pageContentEl, renderers) {
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  if (!currentUser) {
    window.location.href = "/login.html";
    return;
  }

  container.innerHTML = `
    <button class="close-arrow-btn" id="sidebar-close-arrow-btn" aria-label="Close sidebar"><i data-lucide="arrow-left"></i></button>
    <button class="collapse-btn" id="sidebar-collapse-btn" aria-label="Collapse sidebar"><i data-lucide="chevron-left"></i></button>
    <div class="sidebar-content">
      <div class="user-info" aria-label="User information" tabindex="0">
        <img src="/assets/images/profile-placeholder.png" alt="Profile Avatar" class="sidebar-avatar">
        <div class="user-text">
          <h2>${currentUser.username}</h2>
          <p>${currentUser.email}</p>
        </div>
      </div>
      <nav class="menu" aria-label="Main navigation">
        <button class="menu-item" id="nav-home" aria-current="page"><i data-lucide="home"></i><span>Home</span></button>
        <button class="menu-item" id="nav-friends"><i data-lucide="users"></i><span>Friends</span></button>
        <button class="menu-item" id="nav-messages"><i data-lucide="message-circle"></i><span>Messages</span></button>
        <button class="menu-item" id="nav-notifications"><i data-lucide="bell"></i><span>Notifications</span></button>
        <button class="menu-item" id="nav-search"><i data-lucide="search"></i><span>Search</span></button>
        <div class="divider" role="separator"></div>
        <button class="menu-item" id="nav-profile"><i data-lucide="user"></i><span>Profile</span></button>
        <button class="menu-item" id="nav-settings"><i data-lucide="settings"></i><span>Settings & Privacy</span></button>
        <button class="menu-item" id="nav-help"><i data-lucide="help-circle"></i><span>Help & Support</span></button>
        <button class="menu-item logout" id="nav-logout"><i data-lucide="log-out"></i><span>Log Out</span></button>
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
      item.setAttribute('aria-current', 'page');
    } else {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    }
  });

  // Add click listener to user-info for navigation to profile
  const userInfo = container.querySelector('.user-info');
  userInfo.addEventListener('click', () => {
    navigate('profile');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });

  const burger = document.getElementById("burger-menu");
  const closeBtn = document.getElementById("sidebar-close-arrow-btn");
  const collapseBtn = document.getElementById("sidebar-collapse-btn");
  const mainContent = document.querySelector(".main-content");

  let isCollapsed = false;

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

      collapseBtn.style.display = "none";

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

      if (screenWidth >= 1200) {
        collapseBtn.style.display = "block";
        if (isCollapsed) {
          container.classList.add("collapsed");
          collapseBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
        } else {
          container.classList.remove("collapsed");
          collapseBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
        }
        createIcons({ icons, attrs: { 'stroke-width': 2 } });
      } else {
        collapseBtn.style.display = "none";
        container.classList.remove("collapsed");
      }
    }
  };

  // Function to update active state in sidebar
  function updateSidebarActive(activeId) {
    menuItems.forEach(item => {
      const id = item.id.replace('nav-', '');
      if (id === activeId) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }

  // Attach navigation listeners for the sidebar menu
  document.getElementById("nav-home").addEventListener("click", () => {
    navigate('home');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-friends").addEventListener("click", () => {
    navigate('friends');
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
  document.getElementById("nav-search").addEventListener("click", () => {
    navigate('search');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-profile").addEventListener("click", () => {
    navigate('profile');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-settings").addEventListener("click", () => {
    navigate('settings');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });
  document.getElementById("nav-help").addEventListener("click", () => {
    navigate('help');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });

  // Logout listener
  document.getElementById("nav-logout").addEventListener("click", () => {
    removeCurrentUser();
    window.dispatchEvent(new Event("user:logout"));
  });

  // Listen for active nav changes from other components
  window.addEventListener('activeNavChanged', (e) => {
    updateSidebarActive(e.detail.active);
  });

  // Function to update user info in sidebar
  function updateUserInfo() {
    const updatedUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
    if (updatedUser) {
      const userText = container.querySelector('.user-text');
      if (userText) {
        userText.querySelector('h2').textContent = updatedUser.username;
        userText.querySelector('p').textContent = updatedUser.email;
      }
    }
  }

  // Listen for user data updates
  window.addEventListener('userDataUpdated', updateUserInfo);

  // Initial layout application
  applyLayout();
  collapseBtn.addEventListener("click", () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      container.classList.add("collapsed");
      collapseBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
    } else {
      container.classList.remove("collapsed");
      collapseBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
    }
    createIcons({ icons, attrs: { 'stroke-width': 2 } });
  });
}
