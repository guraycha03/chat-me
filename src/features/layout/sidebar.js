import { renderHome } from "../home/home.view.js";
import { renderProfile } from "../profile/profile.view.js";

export function createSidebar(container) {
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  if (!currentUser) {
    window.location.href = "/login.html";
    return;
  }

  const sidebarHTML = `
    <div class="sidebar" id="sidebar">
      <div class="close-btn" id="close-sidebar">&times;</div>
      <div class="sidebar-content">
        <div class="user-info">
          <h2>${currentUser.username}</h2>
          <p>${currentUser.email}</p>
        </div>
        <nav class="menu">
          <button class="menu-item" id="nav-home">Home</button>
          <button class="menu-item" id="nav-profile">Profile</button>
          <button class="menu-item" id="nav-settings">Settings & Privacy</button>
          <button class="menu-item" id="nav-help">Help & Support</button>
          <button class="menu-item logout" id="nav-logout">Log Out</button>
        </nav>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("afterbegin", sidebarHTML);

  const sidebar = container.querySelector("#sidebar");
  const burger = container.querySelector("#burger-menu");
  const closeBtn = container.querySelector("#close-sidebar");

  const navHome = container.querySelector("#nav-home");
  const navProfile = container.querySelector("#nav-profile");
  const navSettings = container.querySelector("#nav-settings");
  const navHelp = container.querySelector("#nav-help");
  const navLogout = container.querySelector("#nav-logout");

  // Toggle sidebar
  burger.addEventListener("click", e => {
    sidebar.classList.toggle("open");
    e.stopPropagation();
  });

  // Close sidebar with X button
  closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));

  // Close sidebar when clicking outside
  document.addEventListener("click", e => {
    if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== burger) {
      sidebar.classList.remove("open");
    }
  });

  // Prevent closing when clicking inside sidebar
  sidebar.addEventListener("click", e => e.stopPropagation());

  // Navigation
  navHome.addEventListener("click", () => {
    sidebar.classList.remove("open");
    renderHome(container);
  });

  navProfile.addEventListener("click", () => {
    sidebar.classList.remove("open");
    renderProfile(container);
  });

  navSettings.addEventListener("click", () => alert("Settings & Privacy page is coming soon!"));
  navHelp.addEventListener("click", () => alert("Help & Support page is coming soon!"));

  navLogout.addEventListener("click", () => {
    localStorage.removeItem("myapp_currentUser");
    window.dispatchEvent(new Event("user:logout"));
  });
}
