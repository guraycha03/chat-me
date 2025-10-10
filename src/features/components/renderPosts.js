// components/renderPosts.js
import { getCurrentUser, updateUser } from "../../utils/storage.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";

export function renderPosts(container, posts, usersMap) {
  const currentUser = getCurrentUser();

  container.innerHTML = `
    <div class="posts-list">
      ${
        posts.length > 0
          ? posts.map(post => {
              const user = usersMap[post.userId] || {};
              const postDate = post.date
                ? new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown";

              const lightMutedColors = [
                "#dee3eeff", "#e8dcecff", "#e9ecddff", "#f8e7e0ffff", "#f4f2f7",
                "#dee9e6ff", "#ece5dbff", "#f3f6f2", "#e8f4f5ff", "#f5eedbff"
              ];
              const randomBg = lightMutedColors[Math.floor(Math.random() * lightMutedColors.length)];

              return `
                <div class="post-item" data-post-id="${post.id}">
                  <div class="post-header">
                    <img src="${user.avatar || '/assets/images/profile-placeholder.png'}"
                         alt="${user.name || 'User'}"
                         class="post-avatar" />
                    <div class="post-user-info">
                      <span class="post-username">
                        ${user.firstName || user.lastName
                          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                          : user.username || user.name || "Unknown User"}
                      </span>
                      <span class="post-date">${postDate}</span>
                    </div>
                  </div>
                  
                  <div class="post-body">
                    ${
                      post.images && post.images.length > 1
                        ? `
                          ${post.description ? `<p class="post-caption">${post.description}</p>` : ""}
                          <div class="post-carousel">
                            ${post.images.map(img => `<div class="carousel-slide"><img src="${img}" class="post-media" /></div>`).join("")}
                          </div>
                        `
                        : post.image
                          ? `
                            ${post.description ? `<p class="post-caption">${post.description}</p>` : ""}
                            <div class="post-media-wrapper">
                              <img src="${post.image}" class="post-media" />
                            </div>
                          `
                          : post.text
                            ? `<div class="text-post-card" style="background:${randomBg};"><p class="text-content">${post.text}</p></div>`
                            : ""
                    }
                  </div>

                  <div class="post-actions">
                    <button class="action-item like-btn" data-post-id="${post.id}">
                      <div class="icon-box"><i data-lucide="heart"></i></div>
                      <span class="like-count">${post.likes || 0}</span>
                    </button>
                  </div>
                </div>
              `;
            }).join("")
          : "<p>No posts available.</p>"
      }
    </div>
  `;

  createIcons({ icons });

  // ❤️ Like button sync
  const likeBtns = container.querySelectorAll(".like-btn");
  likeBtns.forEach(btn => {
    if (!currentUser) return;
    const postId = btn.dataset.postId;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    currentUser.likedPosts = currentUser.likedPosts || [];
    const uniqueKey = `${post.userId}:${post.id}`;
    const likeCountEl = btn.querySelector(".like-count");
    let likeCount = post.likes || 0;

    // Restore liked state
    if (currentUser.likedPosts.includes(uniqueKey)) btn.classList.add("liked");
    likeCountEl.textContent = likeCount;

    btn.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showNotice("Please log in to like posts");
        return;
      }

      currentUser.likedPosts = currentUser.likedPosts || [];
      const index = currentUser.likedPosts.indexOf(uniqueKey);

      if (index > -1) {
        currentUser.likedPosts.splice(index, 1);
        btn.classList.remove("liked");
        likeCount = Math.max(0, likeCount - 1);
      } else {
        currentUser.likedPosts.push(uniqueKey);
        btn.classList.add("liked");
        likeCount++;
      }

      // Update visual + persist
      likeCountEl.textContent = likeCount;
      post.likes = likeCount;

      // Save updated user data
      updateUser(currentUser);

      // Also persist post likes (if in localStorage)
      const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      const postIndex = allPosts.findIndex(p => p.id === post.id && p.userId === post.userId);
      if (postIndex > -1) {
        allPosts[postIndex].likes = likeCount;
        localStorage.setItem("posts", JSON.stringify(allPosts));
      }

      createIcons({ icons });
    });
  });
}
