import { getCurrentUser, updateUser } from "../../utils/storage.js";
import { showNotice } from "../../utils/notification.js";
import { createIcons, icons } from "lucide";


/**
 * Renders a single post item element
 * @param {Object} post - Post object
 * @param {Object} userData - User data (post owner)
 * @param {HTMLElement} profileContainer - Container to render profiles
 * @returns {HTMLElement} Post element
 */

function formatCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

export function createPostElement(post, userData, profileContainer) {
  const postEl = document.createElement("div");
  postEl.className = "post-item";
  postEl.dataset.postId = post.id;

  const postDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Unknown";

  // Light muted backgrounds
  const lightMutedColors = [
    "#dee3eeff", "#e8dcecff", "#e9ecddff", "#f8e7e0ffff", "#f4f2f7",
    "#dee9e6ff", "#ece5dbff", "#f3f6f2", "#e8f4f5ff", "#f5eedbff"
  ];
  const randomBg = lightMutedColors[Math.floor(Math.random() * lightMutedColors.length)];

  // --- HTML structure ---
  postEl.innerHTML = `
    <div class="post-header">
      <img src="${userData.avatar || '/assets/images/profile-placeholder.png'}" 
           alt="${userData.username}'s avatar" 
           class="post-avatar"/>
      <div class="post-user-info">
        <span class="post-username">${userData.name || userData.username}</span>
        <span class="post-date">${postDate}</span>
      </div>
    </div>

    <div class="post-body">
      ${post.description ? `<p class="post-caption">${post.description}</p>` : ""}
      ${post.text
        ? `<div class="text-post-card" style="background:${randomBg};"><p class="text-content">${post.text}</p></div>`
        : post.images && post.images.length > 1
          ? `<div class="post-carousel">
               ${post.images.map(img => `<div class="carousel-slide"><img src="${img}" alt="Post image"/></div>`).join("")}
             </div>
             <div class="carousel-dots">
               ${post.images.map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`).join("")}
             </div>`
          : post.image
            ? `<div class="post-media-wrapper"><img src="${post.image}" alt="Post image" class="post-media"/></div>`
            : ""
      }
    </div>

    <div class="post-actions">
        <button class="action-item like-btn" data-post-id="${post.id}">
            <div class="icon-box"><i data-lucide="heart"></i></div>
            <span class="like-count">${formatCount(post.likes || 0)}</span>

        </button>
        <button class="action-item comment-btn" data-post-id="${post.id}">
            <div class="icon-box"><i data-lucide="message-circle"></i></div>
            <span class="comment-count">${formatCount(post.comments || 0)}</span>
        </button>
        <button class="action-item share-btn" data-post-id="${post.id}">
            <div class="icon-box"><i data-lucide="share-2"></i></div>
            <span class="share-count">${formatCount(post.shares || 0)}</span>
        </button>
    </div>
  `;

  // --- Avatar click logic: go to user profile ---
  const avatarEl = postEl.querySelector(".post-avatar");
  avatarEl.style.cursor = "pointer";
  avatarEl.addEventListener("click", () => {
    const userId = userData.id;
    if (userId) {
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'profile', userId } }));
    } else {
      // Fallback to current user's profile if no id
      window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'profile' } }));
    }
  });

  // --- Like button logic ---
  const likeBtn = postEl.querySelector(".like-btn");
  const likeCountEl = likeBtn.querySelector(".like-count");
  const currentUser = getCurrentUser();

  if (currentUser) {
    currentUser.likedPosts = currentUser.likedPosts || [];
    const uniqueKey = `${userData.id}:${post.id}`;
    let isLiked = currentUser.likedPosts.includes(uniqueKey);
    let likeCount = post.likes || 0;

    if (isLiked) likeBtn.classList.add("liked");

    likeBtn.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showNotice("Please log in to like posts");
        return;
      }

      const index = currentUser.likedPosts.indexOf(uniqueKey);

      if (index > -1) {
        currentUser.likedPosts.splice(index, 1);
        likeBtn.classList.remove("liked");
        likeCount = Math.max(0, likeCount - 1);
      } else {
        currentUser.likedPosts.push(uniqueKey);
        likeBtn.classList.add("liked");
        likeCount++;
      }

      likeCountEl.textContent = formatCount(likeCount);

      post.likes = likeCount;
      updateUser(currentUser);

      const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      const postIndex = allPosts.findIndex(p => p.id === post.id && p.userId === userData.id);
      if (postIndex > -1) {
        allPosts[postIndex].likes = likeCount;
        localStorage.setItem("posts", JSON.stringify(allPosts));
      }

      window.dispatchEvent(new CustomEvent("postLikeUpdated", {
        detail: { postId: post.id, userId: userData.id, likes: likeCount }
      }));

      createIcons({ icons });
    });
  }

  // --- Comment and Share placeholders ---
  const commentBtn = postEl.querySelector(".comment-btn");
  commentBtn?.addEventListener("click", () => showNotice("Comments feature coming soon 💬"));

  const shareBtn = postEl.querySelector(".share-btn");
  shareBtn?.addEventListener("click", () => showNotice("Share feature coming soon 🔁"));

  // Initialize icons
  createIcons({ icons });

  return postEl;
}
