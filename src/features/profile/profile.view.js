import { getCurrentUser } from "../../utils/storage.js";
import { createIcons, icons } from "lucide";
import { renderInterestBadges } from "../components/interestBadge.js";
import { createPostElement } from "../components/postComponent.js";
import { renderEditProfile } from "./editProfile.js";
import "./profile.css";

export function renderProfile(container, person) {
  const userData = person || getCurrentUser();
  if (!userData) {
    container.innerHTML = "<p>User data not available.</p>";
    return;
  }

  userData.avatar ||= '/assets/images/profile-placeholder.png';
  userData.bio ||= "";
  userData.interests ||= [];

  let posts = [];
  if (userData.posts) {
    posts = userData.posts.map(p => ({ ...p, userId: userData.id }));
  } else {
    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts = allPosts.filter(p => p.userId === userData.id);
  }
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatNumber = (num) => num >= 1000 ? (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : num.toString();

  function renderView() {
    container.innerHTML = `
      <div class="profile-wrapper">
        <div class="profile-header">
          <div class="cover-photo" style="background:${userData.coverColor || 'var(--color-primary)'}"></div>
          <div class="profile-avatar-wrapper">
            <img src="${userData.avatar}" alt="Profile image" class="profile-avatar" />
            ${userData.id === getCurrentUser()?.id ? '<button id="change-avatar-btn"><i data-lucide="camera"></i></button>' : ''}
          </div>
        </div>

        <div class="profile-details">
          ${userData.id === getCurrentUser()?.id
            ? `<h2>${userData.firstName} ${userData.lastName}</h2><h3>@${userData.username}</h3>`
            : `<h2>${userData.name}</h2>`}
          <div class="profile-follow-stats">
            <div><strong>${formatNumber(userData.followers || 0)}</strong> Followers</div>
            <div><strong>${formatNumber(userData.following || 0)}</strong> Following</div>
          </div>
          <p class="profile-bio">${userData.bio}</p>
          <p>${renderInterestBadges(userData.interests)}</p>

          <div class="profile-actions-container">
            ${userData.id === getCurrentUser()?.id
              ? `<button id="edit-profile-btn" class="profile-action-btn"><i data-lucide="pencil"></i>Edit Profile</button>`
              : `<button id="add-friend-btn" class="profile-action-btn primary"><i data-lucide="user-plus"></i>Add Friend</button>`}
          </div>
        </div>

        <main class="profile-main">
          <section class="profile-posts">
            <h3>Posts</h3>
            <div class="posts-list"></div>
          </section>
        </main>
      </div>
    `;

    const postsListContainer = container.querySelector(".posts-list");
    postsListContainer.innerHTML = "";
    posts.forEach(post => postsListContainer.appendChild(createPostElement(post, userData, container)));

    createIcons({ icons });

    const editBtn = container.querySelector("#edit-profile-btn");
    if (editBtn) editBtn.addEventListener("click", () => renderEditProfile(container, userData, renderView));
  }

  renderView();
}
