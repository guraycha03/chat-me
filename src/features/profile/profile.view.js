import { createSidebar } from "../layout/sidebar.js";
import { mockPeople } from "../../data/people.mock.js";

export function renderProfile(container) {
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  // Find user in mockPeople for avatar and bio fallback
  const userData = mockPeople.find(p => p.name === currentUser.username) || {};

  container.innerHTML = `
    <div class="profile-wrapper">
      <header class="profile-header">
        <div class="cover-photo"></div>
        <img src="${userData.avatar || 'https://via.placeholder.com/150'}" alt="${currentUser.username} avatar" class="profile-avatar" />
      </header>

      <div class="profile-details">
        <h2 id="username">${currentUser.username}</h2>
        <p class="profile-bio">${userData.bio || "No bio available."}</p>
        <button class="edit-profile-btn">Edit Profile</button>
      </div>

      <main class="profile-main">
        <div class="profile-stats">
          <div><strong>123</strong> Posts</div>
          <div><strong>456</strong> Followers</div>
          <div><strong>789</strong> Following</div>
        </div>
        <section class="profile-posts">
          <h3>Posts</h3>
          <div class="posts-grid">
            <div class="post-placeholder">Post 1</div>
            <div class="post-placeholder">Post 2</div>
            <div class="post-placeholder">Post 3</div>
            <div class="post-placeholder">Post 4</div>
          </div>
        </section>
      </main>
    </div>
  `;


}
