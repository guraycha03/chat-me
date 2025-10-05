// src/features/search/search.view.js
import { navigate } from "../../utils/navigationState.js";
import { mockFriends } from "../../data/friends.mock.js";
import { createIcons, icons } from "lucide";

export async function renderSearch(container) {
  container.innerHTML = `
    <div class="people-wrapper">
      <div class="people-top">
        <div class="search-wrap">
          <i data-lucide="search"></i>
          <input id="search-input" placeholder="Search people" />
          <button class="search-submit-btn" id="search-btn" title="Search"><i data-lucide="search"></i></button>
        </div>
      </div>

      <div id="search-results" class="people-list"></div>
    </div>
  `;

  // Initialize icons
  createIcons({ icons });

  const users = mockFriends;
  const listEl = container.querySelector("#search-results");
  const searchInput = container.querySelector("#search-input");
  const searchBtn = container.querySelector("#search-btn");

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
          <button class="btn btn-secondary btn-view-profile" title="View Profile">View Profile</button>
        </div>
      </div>
    `).join("");

    // wire each item
    listEl.querySelectorAll(".people-item").forEach(el => {
      el.addEventListener("click", (e) => {
        const id = el.dataset.id;
        const user = users.find(u => u.id === id);
        if (user) {
          navigate('profile', { userId: user.id });
        }
      });
      const viewBtn = el.querySelector(".btn-view-profile");
      viewBtn?.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const id = el.dataset.id;
        const user = users.find(u => u.id === id);
        if (user) {
          navigate('profile', { userId: user.id });
        }
      });
    });

    // re-create icons
    if (window.createIcons) createIcons({ icons }); // if you use lucide createIcons globally
  }

  // Initially show all or empty?
  renderList([]); // Start empty, show results on input

  function performSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      renderList([]);
      return;
    }
    renderList(users.filter(u => u.name.toLowerCase().includes(q)));
  }

  searchInput.addEventListener("input", performSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  searchBtn.addEventListener("click", performSearch);
}
