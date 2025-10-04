// src/features/friends/friends.view.js
import { navigate } from "../../utils/navigationState.js";
import { mockFriends } from "../../data/friends.mock.js";

export async function renderFriends(container) {
  container.innerHTML = `
    <div class="friends-wrapper">
      <div class="friends-top">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input id="friends-search" placeholder="Search friends" />
        </div>
      </div>

      <div id="friends-list" class="friends-list"></div>
    </div>
  `;

  let users = mockFriends;

  // Initialize friendRequested state if not present
  users.forEach(u => { u.friendRequested = u.friendRequested ?? false; });

  localStorage.setItem("app_friends_cache", JSON.stringify(users));

  const listEl = container.querySelector("#friends-list");
  const searchInput = container.querySelector("#friends-search");

  function renderList(items) {
    listEl.innerHTML = items.map(u => `
      <div class="friend-item" data-id="${u.id}">
        <div class="avatar-wrap">
          <img src="${u.avatar}" alt="${u.name}" />
          ${u.online ? '<span class="online-dot"></span>' : ''}
        </div>
        <div class="friend-info">
          <div class="friend-name">${u.name}</div>
        </div>
        <div class="friend-actions">
          <button class="btn-add-friend ${u.friendRequested ? 'cancel' : ''}" title="${u.friendRequested ? 'Cancel Friend Request' : 'Add Friend'}">${u.friendRequested ? 'Cancel' : 'Add Friend'}</button>
          <button class="btn-chat" title="Open chat"><i data-lucide="message-circle"></i></button>
        </div>
      </div>
    `).join("");

    // wire each item
    listEl.querySelectorAll(".friend-item").forEach(el => {
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
            alert(`Friend request cancelled for ${friend.name}`);
          } else {
            friend.friendRequested = true;
            addFriendBtn.textContent = "Cancel";
            addFriendBtn.title = "Cancel Friend Request";
            alert(`Friend request sent to ${friend.name}`);
          }
          localStorage.setItem("app_friends_cache", JSON.stringify(users));
        }
      });
    });

    // re-create icons
    if (window.createIcons) createIcons({ icons }); // if you use lucide createIcons globally
  }

  renderList(users);

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return renderList(users);
    renderList(users.filter(u => u.name.toLowerCase().includes(q)));
  });
}