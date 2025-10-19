
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
    <button class="collapse-btn" id="sidebar-collapse-btn" aria-label="Toggle sidebar"><i data-lucide="chevron-left"></i></button>
    <div class="sidebar-content">
      <div class="user-info" aria-label="User information" tabindex="0">
        <img src="${currentUser.avatar || '/assets/images/profile-placeholder.png'}" alt="Profile Avatar" class="sidebar-avatar">
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

  const MOBILE_BREAKPOINT = 900;

  // Add click listener to user-info for navigation to profile
  const userInfo = container.querySelector('.user-info');
  userInfo.addEventListener('click', () => {
    navigate('profile');
    if (window.innerWidth < MOBILE_BREAKPOINT) closeSidebar();
  });

  const burger = document.getElementById("burger-menu");
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

 

  // Function to apply the correct layout based on screen width
  const applyLayout = () => {
    const screenWidth = window.innerWidth;

    // Reset any inline styles that might interfere with CSS media queries
    container.style.transition = '';
    mainContent.style.marginRight = '';

    if (screenWidth < MOBILE_BREAKPOINT) {
      // Mobile Layout: Sliding overlay menu
      closeSidebar();

      collapseBtn.style.display = "block";
      collapseBtn.innerHTML = '<i data-lucide="arrow-left"></i>';
      collapseBtn.onclick = closeSidebar;
      container.classList.remove("collapsed");
      isCollapsed = false;

      if (burger) {
        burger.onclick = openSidebar;
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

      container.style.right = "0";

      if (screenWidth >= 1200) {
        // Wide screen: Hide collapse button, always open
        collapseBtn.style.display = "none";
        container.classList.remove("collapsed");
        isCollapsed = false;
      } else {
        // Medium desktop: Show collapse button
        collapseBtn.style.display = "flex";
        collapseBtn.onclick = () => {
          isCollapsed = !isCollapsed;
          if (isCollapsed) {
            container.classList.add("collapsed");
            collapseBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
          } else {
            container.classList.remove("collapsed");
            collapseBtn.innerHTML = '<i data-lucide="chevron-left"></i>';
          }
          createIcons({ icons, attrs: { 'stroke-width': 2 } });
        };

        if (isCollapsed) {
          container.classList.add("collapsed");
        } else {
          container.classList.remove("collapsed");
        }
      }

      container.style.right = "0";
      container.classList.remove("open");

      createIcons({ icons, attrs: { 'stroke-width': 2 } });

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

    // Hide Messages button on wide screens since messages panel is always open
    const messagesBtn = document.getElementById("nav-messages");
    if (messagesBtn) {
      if (window.innerWidth >= 1200) {
        messagesBtn.style.display = 'none';
      } else {
        messagesBtn.style.display = '';
      }
    }
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

  // Handle window resize to update messages button visibility
  window.addEventListener('resize', () => {
    updateSidebarActive(currentActive);
    // If resizing to wide screen while on messages page, navigate to home to avoid duplication
    if (window.innerWidth >= 1200 && currentActive === 'messages') {
      navigate('home');
    }
  });

  // Initial application of hiding logic
  updateSidebarActive(currentActive);

  // Function to update user info in sidebar
  function updateUserInfo() {
    const updatedUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
    if (updatedUser) {
      const userText = container.querySelector('.user-text');
      if (userText) {
        userText.querySelector('h2').textContent = updatedUser.username;
        userText.querySelector('p').textContent = updatedUser.email;
      }
      const avatarImg = container.querySelector('.sidebar-avatar');
      if (avatarImg) {
        avatarImg.src = updatedUser.avatar || '/assets/images/profile-placeholder.png';
      }
    }
  }

  // Listen for user data updates
  window.addEventListener('userDataUpdated', updateUserInfo);

  // Initial layout application
  applyLayout();
}
