// src/features/home/home.view.js
import { renderPosts } from "../components/renderPosts.js";
import { mockFriends } from "../../data/friends.mock.js";
import { getCurrentUser } from "../../utils/storage.js";
import { createIcons, icons } from "lucide";
import "../layout/home.css";

export function renderHome(container) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    container.innerHTML = `<p class="p-4">Could not find user data. Please log in again.</p>`;
    return;
  }

  // 🔹 Get stored posts and users
  const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

  // 🔹 Combine mock friends and stored users into a single map
  const usersMap = {};
  [...storedUsers, ...mockFriends].forEach(u => (usersMap[u.id] = u));

  // 🔹 Gather posts from mock friends too
  const friendPosts = mockFriends.flatMap(friend =>
    (friend.posts || []).map(p => ({
      ...p,
      userId: friend.id, // tag friend to post
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

  // 🔹 Generate story HTML
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

  // 🔹 Render structure: Stories + Feed container
  container.innerHTML = `
    <div class="home-wrapper">
      <section class="stories-section">
        <h3>Stories</h3>
        <div class="stories-container">
          <div class="story-card create-story-card" id="create-story">
            <img src="${
              currentUser.avatar || "/assets/images/profile-placeholder.png"
            }" alt="Your Story" class="create-story-avatar">
            <div class="plus-icon">
              <i data-lucide="plus" style="width: 20px; height: 20px;"></i>
            </div>
            <span class="create-story-text">Create Story</span>
          </div>
          ${storiesHTML}
        </div>
      </section>

      <!-- ✅ Posts Feed -->
      <section id="feed-section" class="feed-section"></section>
    </div>
  `;

  // 🔹 Initialize icons
  createIcons({ icons });

  // 🔹 Render posts below stories using same layout as profile
  const feedContainer = container.querySelector("#feed-section");
  if (feedContainer) {
    renderPosts(feedContainer, sortedPosts, usersMap);
  }
}
