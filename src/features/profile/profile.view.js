import { createSidebar } from "../layout/sidebar.js";

export function renderProfile(container) {
  container.innerHTML = `
    <div class="profile-wrapper">
      <header class="home-header">
        <h1>Profile</h1>
        <div class="burger-menu" id="burger-menu">&#9776;</div>
      </header>

      <main class="home-main">
        <div class="profile-card">
          <h2 id="username"></h2>
          <p><strong>Email:</strong> <span id="email"></span></p>
        </div>
      </main>
    </div>
  `;

  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  document.getElementById("username").textContent = currentUser.username;
  document.getElementById("email").textContent = currentUser.email;

  createSidebar(container); // sidebar is consistent
}
