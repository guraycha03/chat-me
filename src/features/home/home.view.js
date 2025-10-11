// src/features/home/home.view.js
import { getCurrentUser } from "../../utils/storage.js";
import { createIcons, icons } from "lucide";
import "../layout/home.css";
import { createPostElement } from "../components/postComponent.js"; // reusable post component
import { mockFriends } from "../../data/friends.mock.js";

export function renderHome(container) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    container.innerHTML = `<p class="p-4">Could not find user data. Please log in again.</p>`;
    return;
  }

  // 🔹 Get stored posts and users
  const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

  // 🔹 Combine mock friends and stored users into a map
  const usersMap = {};
  [...storedUsers, ...mockFriends].forEach(u => (usersMap[u.id] = u));

  // 🔹 Gather posts from mock friends
  const friendPosts = mockFriends.flatMap(friend =>
    (friend.posts || []).map(p => ({
      ...p,
      userId: friend.id,
    }))
  );

  // 🔹 Combine all posts (your posts + friends' posts)
  const allPosts = [...storedPosts, ...friendPosts];

  // 🔹 Sort posts by date (newest first)
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // 🔹 Filter friends who have stories
  const friendsWithStories = mockFriends.filter(
    friend => friend.stories && friend.stories.length > 0
  );

  // 🔹 Generate stories HTML
  const storiesHTML = friendsWithStories
    .map(friend => {
      const nameParts = friend.name.trim().split(" ");
      const nameHTML =
        nameParts.length > 1
          ? nameParts.map(part => `<div>${part}</div>`).join("")
          : `<div class="single-line-name">${friend.name}</div>`;

      return `
        <div class="story-card has-story" data-user-id="${friend.id}" style="background-image: url('${friend.stories[0]}')">
          <img src="${friend.avatar}" alt="${friend.name}" class="story-avatar">
          <span class="story-username">${nameHTML}</span>
        </div>
      `;
    })
    .join("");

  // 🔹 Render homepage structure
  container.innerHTML = `
    <div class="home-wrapper">
      <section class="stories-section">
        <h3>Stories</h3>
        <div class="stories-container">
          <div class="story-card create-story-card" id="create-story">
            <img src="${currentUser.avatar || "/assets/images/profile-placeholder.png"}" alt="Your Story" class="create-story-avatar">
            <div class="plus-icon">
              <i data-lucide="plus" style="width: 20px; height: 20px;"></i>
            </div>
            <span class="create-story-text">Create Story</span>
          </div>
          ${storiesHTML}
        </div>
      </section>

      <!-- Posts Feed -->
      <section id="feed-section" class="feed-section"></section>
    </div>
  `;

  // 🔹 Initialize icons
  createIcons({ icons });

  // 🔹 Render posts using shared post component
  const feedContainer = container.querySelector("#feed-section");
  feedContainer.innerHTML = ""; // clear previous content if any
  sortedPosts.forEach(post => {
    const userData = usersMap[post.userId] || { name: "Unknown", avatar: "/assets/images/profile-placeholder.png" };
    const postEl = createPostElement(post, userData);
    feedContainer.appendChild(postEl);
  });

  // 🔹 Auto-sync likes across homepage if liked from profile page or anywhere
  window.addEventListener("postLikeUpdated", (e) => {
    const { postId, likes } = e.detail;
    feedContainer.querySelectorAll(`.post-item[data-post-id="${postId}"] .like-count`)
      .forEach(el => el.textContent = likes);
  });

  // 🔹 Add "Create Story" button click (placeholder)
  const createStoryBtn = container.querySelector("#create-story");
  if (createStoryBtn) {
    createStoryBtn.addEventListener("click", () => {
      alert("Create Story clicked!");
    });
  }

  // 🔹 Add floating create button (desktop only)
if (window.innerWidth >= 900) {
  const existingFab = document.querySelector(".floating-create-btn");
  if (!existingFab) {
    const fab = document.createElement("button");
    fab.className = "floating-create-btn";
    fab.innerHTML = `<i data-lucide="plus"></i>`;
    document.body.appendChild(fab);

    createIcons({ icons });

    fab.addEventListener("click", () => {
      alert("Create Post clicked!");
      // you can replace this alert with your create post modal or redirect
    });
  }
}

// 🔹 Remove floating button when leaving Home page
window.addEventListener("navigate", (e) => {
  if (e.detail.page !== "home") {
    const fab = document.querySelector(".floating-create-btn");
    if (fab) fab.remove();
  }
});


}
