// src/features/people/people.view.js
import { renderMessages } from "../messages/messages.view.js";
// choose one data source:
import { mockPeople } from "../../data/people.mock.js";
// or: import { generateFakeUsers } from "../../services/people.service.js";
// or: import { fetchRandomUsers } from "../../services/people.service.js";

export async function renderPeople(container) {
  container.innerHTML = `
    <div class="people-wrapper">
      <div class="people-top">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input id="people-search" placeholder="Search people" />
        </div>
        <button id="people-new" class="primary">New Message</button>
      </div>

      <div id="people-list" class="people-list"></div>
    </div>
  `;

  // load users (choose strategy)
  // let users = generateFakeUsers(30);
  // let users = await fetchRandomUsers(30);
  let users = mockPeople;

  // persist small cache so chat page can use
  localStorage.setItem("app_people_cache", JSON.stringify(users));

  const listEl = container.querySelector("#people-list");
  const searchInput = container.querySelector("#people-search");
  const newBtn = container.querySelector("#people-new");

  function renderList(items) {
    listEl.innerHTML = items.map(u => `
      <div class="people-item" data-id="${u.id}">
        <div class="avatar-wrap">
          <img src="${u.avatar}" alt="${u.name}" />
          ${u.online ? '<span class="online-dot"></span>' : ''}
        </div>
        <div class="people-info">
          <div class="people-name">${u.name}</div>
          <div class="people-bio">${u.bio || ''}</div>
        </div>
        <div class="people-actions">
          <button class="btn-chat" title="Open chat"><i data-lucide="message-circle"></i></button>
        </div>
      </div>
    `).join("");

    // wire each item
    listEl.querySelectorAll(".people-item").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = el.dataset.id;
        openChatWith(id);
      });
      const chatBtn = el.querySelector(".btn-chat");
      chatBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        openChatWith(el.dataset.id);
      });
    });

    // re-create icons
    if (window.createIcons) createIcons({ icons }); // if you use lucide createIcons globally
  }

  function openChatWith(userId) {
    // you can fetch the user from cache and then open message view
    const person = users.find(u => u.id === userId);
    // store selected user for messages page or call a render with args
    localStorage.setItem("active_chat_user", JSON.stringify(person));
    // if renderMessages accepts container and optional person, call it:
    renderMessages(document.getElementById("page-content"), person);
    // also set bottom nav active if needed (you may dispatch an event)
  }

  renderList(users);

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return renderList(users);
    renderList(users.filter(u => u.name.toLowerCase().includes(q) || (u.bio||'').toLowerCase().includes(q)));
  });

  newBtn.addEventListener("click", () => {
    // open a quick composer (simple)
    const name = prompt("Who do you want to message? (name)");
    if (!name) return;
    const temp = { id: `tmp_${Date.now()}`, name, avatar: `https://i.pravatar.cc/100?u=${Date.now()}`, bio: "", online: false };
    users.unshift(temp);
    renderList(users);
    localStorage.setItem("app_people_cache", JSON.stringify(users));
    openChatWith(temp.id);
  });
}
