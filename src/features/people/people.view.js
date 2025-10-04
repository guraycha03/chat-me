// src/features/people/people.view.js
import { navigate } from "../../utils/navigationState.js";
import { mockPeople } from "../../data/people.mock.js";

export async function renderPeople(container) {
  container.innerHTML = `
    <div class="people-wrapper">
      <div class="people-top">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input id="people-search" placeholder="Search people" />
        </div>
      </div>

      <div id="people-list" class="people-list"></div>
    </div>
  `;

  let users = mockPeople;

  // Initialize friendRequested state if not present
  users.forEach(u => { u.friendRequested = u.friendRequested ?? false; });

  localStorage.setItem("app_people_cache", JSON.stringify(users));

  const listEl = container.querySelector("#people-list");
  const searchInput = container.querySelector("#people-search");

  function renderList(items) {
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
          <button class="btn-chat" title="Open chat"><i data-lucide="message-circle"></i></button>
        </div>
      </div>
    `).join("");

    // wire each item
    listEl.querySelectorAll(".people-item").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = el.dataset.id;
        const person = users.find(u => u.id === id);
        if (person) {
          navigate('profile', { userId: person.id });
        }
      });
      const chatBtn = el.querySelector(".btn-chat");
      chatBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const person = users.find(u => u.id === id);
        if (person) {
          navigate('messages', { userId: person.id });
        }
      });
      const addFriendBtn = el.querySelector(".btn-add-friend");
      addFriendBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const person = users.find(u => u.id === id);
        if (person) {
          if (person.friendRequested) {
            person.friendRequested = false;
            addFriendBtn.textContent = "Add Friend";
            addFriendBtn.title = "Add Friend";
            alert(`Friend request cancelled for ${person.name}`);
          } else {
            person.friendRequested = true;
            addFriendBtn.textContent = "Cancel";
            addFriendBtn.title = "Cancel Friend Request";
            alert(`Friend request sent to ${person.name}`);
          }
          localStorage.setItem("app_people_cache", JSON.stringify(users));
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
