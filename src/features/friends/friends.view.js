// src/features/friends/friends.view.js
import { navigate } from "../../utils/navigationState.js";
import { mockFriends } from "../../data/friends.mock.js";
import { showNotice } from "../../utils/notification.js";

export async function renderFriends(container) {
  container.innerHTML = `
    <div class="people-wrapper">
      <h1>Friends</h1>
      <div id="friends-list" class="people-list"></div>
    </div>
  `;

  let users = mockFriends;

  // Load from cache or initialize
  const cached = localStorage.getItem("app_friends_cache");
  if (cached) {
    users = JSON.parse(cached);
  } else {
    users.forEach(u => { u.friendRequested = u.friendRequested ?? false; });
  }

  // Shuffle the users array for random order on refresh
  users = users.sort(() => Math.random() - 0.5);

  const listEl = container.querySelector("#friends-list");

  // Create loading indicator element
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-more";
  loadingIndicator.textContent = "Loading more friends...";
  loadingIndicator.style.display = "none"; // hidden initially
  listEl.appendChild(loadingIndicator);

  let isLoading = false;

  function renderList(items) {
    // Render friend items only, loading indicator stays as last child
    listEl.innerHTML = items.map(u => `
      <div class="people-item" data-id="${u.id}">
        <div class="avatar-wrap">
          <img src="${u.avatar}" alt="${u.name}" />
          ${u.online ? '<span class="online-dot"></span>' : ''}
        </div>
        <div class="people-info">
          <div class="people-name">${u.name}</div>
        </div>
        <div class="people-actions">
          <button class="btn-add-friend ${u.friendRequested ? 'cancel' : ''}" title="${u.friendRequested ? 'Cancel Friend Request' : 'Add Friend'}">${u.friendRequested ? 'Cancel' : 'Add Friend'}</button>
        </div>
      </div>
    `).join("");
    // Append loading indicator as last child
    listEl.appendChild(loadingIndicator);

    // wire each item
    listEl.querySelectorAll(".people-item").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = el.dataset.id;
        const friend = users.find(u => u.id === id);
        if (friend) {
          navigate('profile', { userId: friend.id });
        }
      });
      const chatBtn = el.querySelector(".btn-chat");
      chatBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const friend = users.find(u => u.id === id);
        if (friend) {
          navigate('messages', { userId: friend.id });
        }
      });
      const addFriendBtn = el.querySelector(".btn-add-friend");
      addFriendBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const friend = users.find(u => u.id === id);
        if (friend) {
          if (friend.friendRequested) {
            friend.friendRequested = false;
            addFriendBtn.textContent = "Add Friend";
            addFriendBtn.title = "Add Friend";
            addFriendBtn.classList.remove('cancel');
            showNotice(`Friend request cancelled for ${friend.name}`);
          } else {
            friend.friendRequested = true;
            addFriendBtn.textContent = "Cancel";
            addFriendBtn.title = "Cancel Friend Request";
            addFriendBtn.classList.add('cancel');
            showNotice(`Friend request sent to ${friend.name}`);
          }
          localStorage.setItem("app_friends_cache", JSON.stringify(users));
        }
      });
    });

    // re-create icons
    if (window.createIcons) createIcons({ icons }); // if you use lucide createIcons globally
  }

  // Function to simulate loading more friends
  async function loadMoreFriends() {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.style.display = "block";

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate adding more friends (duplicate mockFriends for demo)
    const newFriends = mockFriends.map(f => ({ ...f, id: f.id + "_new_" + Date.now() }));
    users = users.concat(newFriends);
    renderList(users);

    loadingIndicator.style.display = "none";
    isLoading = false;
  }

  // Scroll event listener to detect near bottom
  listEl.addEventListener("scroll", () => {
    const scrollThreshold = 50; // px from bottom to trigger load
    if (listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - scrollThreshold) {
      loadMoreFriends();
    }
  });

  renderList(users);
}
