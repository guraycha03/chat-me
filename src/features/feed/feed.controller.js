// src/features/feed/feed.controller.js
import { getCurrentUser, removeCurrentUser } from "../../utils/storage.js";
import { toBase64 } from "../../utils/convert.js";

/* Simple in-file post storage helpers */
const POSTS_KEY = "myapp_posts";
function getPosts() { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]"); }
function savePosts(posts) { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); }
function addPost(post) { const p = getPosts(); p.unshift(post); savePosts(p); }

export function initFeed(container = document.getElementById("app")) {
  // render header + composer + feed
  container.innerHTML = `
    <div class="app-header">
      <h2>Chat Me</h2>
      <div class="header-right">
        <span id="welcome-name"></span>
        <button id="logout-btn" class="btn-ghost">Log out</button>
      </div>
    </div>

    <div id="composer-container"></div>
    <div id="feed-container"></div>
  `;

  const user = getCurrentUser();
  container.querySelector("#welcome-name").textContent = user?.username || "Guest";

  // composer
  const composer = container.querySelector("#composer-container");
  composer.innerHTML = `
    <form id="post-form">
      <textarea id="post-text" rows="3" placeholder="What's on your mind?"></textarea>
      <input type="file" id="post-image" accept="image/*" style="margin-top: 10px;">
      <button type="submit">Post</button>
    </form>
  `;
  composer.querySelector("#post-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const textEl = composer.querySelector("#post-text");
    const imageEl = composer.querySelector("#post-image");
    const text = textEl.value.trim();
    const file = imageEl.files[0];
    if (!text && !file) return;

    let image = null;
    if (file) {
      image = await toBase64(file);
    }

    const post = {
      id: Date.now(),
      author: user.username,
      text,
      image,
      createdAt: new Date().toISOString(),
      reactions: {}
    };
    addPost(post);
    textEl.value = "";
    imageEl.value = "";
    renderFeed();
  });

  // logout button
  container.querySelector("#logout-btn").addEventListener("click", () => {
    removeCurrentUser();
    window.dispatchEvent(new Event("user:logout"));
  });

  renderFeed();

  function renderFeed() {
    const feedContainer = container.querySelector("#feed-container");
    const posts = getPosts();
    if (!posts.length) {
      feedContainer.innerHTML = `<p class="muted">No posts yet — be the first!</p>`;
      return;
    }
    feedContainer.innerHTML = posts.map(post => `
      <div class="post-card" data-id="${post.id}">
        <div class="post-author">${escapeHtml(post.author)}</div>
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="Post image" /></div>` : ""}
        <div class="post-text">${escapeHtml(post.text)}</div>
        <div class="post-meta">${new Date(post.createdAt).toLocaleString()}</div>
      </div>
    `).join("");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s]));
}
