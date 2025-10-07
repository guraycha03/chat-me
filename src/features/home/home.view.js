// src/features/home/home.view.js

import { mockFriends } from '../../data/friends.mock.js';

export function renderHome(container) {
  // Filter friends who have stories
  const friendsWithStories = mockFriends.filter(friend => friend.stories && friend.stories.length > 0);

  // Generate story HTML
  const storiesHTML = friendsWithStories.map(friend => `
    <div class="story">
      <img src="${friend.stories[0]}" alt="${friend.name}">
      <span class="story-name">${friend.name}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="home-wrapper">
      <main class="home-main">
        <div class="story-container">
          <div class="story create-story">
            <img src="/assets/images/users/profile-19.png" alt="Your Story">
            <div class="create-icon">+</div>
            <span class="story-name">Create Story</span>
          </div>
          ${storiesHTML}
        </div>
      </main>
    </div>
  `;
}
