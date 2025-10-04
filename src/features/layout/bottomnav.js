// src/features/layout/bottomnav.js
import { renderHome } from "../home/home.view.js";
import { renderProfile } from "../profile/profile.view.js";
import { renderPeople } from "../people/people.view.js";
import { renderMessages } from "../messages/messages.view.js";
import { renderNotifications } from "../notifications/notifications.view.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { currentActive, setCurrentActive } from "../../utils/navigationState.js";

export function createBottomNav(container, pageContentEl) {
  // Clear container to prevent duplicate nav bars on resize
  if (container.querySelector(".bottom-nav")) return; 

  const bottomNavHTML = `
  <nav class="bottom-nav">
    <button id="bottom-home" class="bottom-nav-item" aria-label="Home">
      <i data-lucide="home"></i>
      <small>Home</small>
    </button>
    <button id="bottom-people" class="bottom-nav-item" aria-label="People">
      <i data-lucide="users"></i>
      <small>People</small>
    </button>
    <button id="bottom-create" class="bottom-nav-item create-btn" aria-label="Create">
      <i data-lucide="plus"></i>
    </button>
    <button id="bottom-messages" class="bottom-nav-item" aria-label="Messages">
      <i data-lucide="message-circle"></i>
      <small>Messages</small>
    </button>
    <button id="bottom-notifications" class="bottom-nav-item" aria-label="Notifications">
      <i data-lucide="bell"></i>
      <small>Notifications</small>
    </button>

    <div class="nav-indicator"></div>
  </nav>
`;

  container.innerHTML = bottomNavHTML; // Use innerHTML to replace content
  createIcons({ icons });

  const nav = container.querySelector(".bottom-nav");
  const navItems = nav.querySelectorAll(".bottom-nav-item:not(.create-btn)");
  const indicator = nav.querySelector(".nav-indicator");

  function moveIndicator(item) {
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offsetLeft = itemRect.left - navRect.left;
    const offsetWidth = itemRect.width;

    indicator.style.width = `${offsetWidth}px`;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
  }

  // Function to update active state
  function updateActiveState(activeId) {
    navItems.forEach(btn => {
      const id = btn.id.replace("bottom-", "");
      if (id === activeId) {
        btn.classList.add("active");
        moveIndicator(btn);
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Restore correct active state
  updateActiveState(currentActive);

  // Attach click handlers
  navItems.forEach(item => {
    const id = item.id.replace("bottom-", "");

    item.addEventListener("click", () => {
      setCurrentActive(id);
    });
  });

  // Listen for active nav changes from other components
  window.addEventListener('activeNavChanged', (e) => {
    updateActiveState(e.detail.active);
  });

  // Navigation actions (using pageContentEl)
  document.getElementById("bottom-home").addEventListener("click", () => {
    renderHome(pageContentEl);
  });
  document.getElementById("bottom-people").addEventListener("click", () => {
    renderPeople(pageContentEl);
  });
  document.getElementById("bottom-messages").addEventListener("click", () => {
    renderMessages(pageContentEl);
  });
  document.getElementById("bottom-notifications").addEventListener("click", () => {
    renderNotifications(pageContentEl);
  });
  
  // Mobile Create Button Action (can be a quick action or modal)
  document.getElementById("bottom-create").addEventListener("click", () => {
      showNotice("Create button clicked! (Mobile Bottom Nav)");
  });


  // ✅ make sure Home is highlighted when app loads (or on first run)
  const homeBtn = document.getElementById("bottom-home");
  if (homeBtn) {
    homeBtn.classList.add("active");
    moveIndicator(homeBtn);
  }
}
