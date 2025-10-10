// src/features/home/home.view.js
import { mockFriends } from '../../data/friends.mock.js';
import { getCurrentUser } from '../../utils/storage.js';
import { createIcons, icons } from 'lucide';
import { initFeed } from '../feed/feed.controller.js'; // ✅ import feed
import '../layout/home.css';

export function renderHome(container) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    container.innerHTML = `<p class="p-4">Could not find user data. Please log in again.</p>`;
    return;
  }

  // Filter friends who have stories
  const friendsWithStories = mockFriends.filter(friend => friend.stories && friend.stories.length > 0);

  // Generate story HTML
  const storiesHTML = friendsWithStories.map(friend => {
    const nameParts = friend.name.trim().split(' ');
    let nameHTML = '';
    if (nameParts.length > 1) {
      nameHTML = nameParts.map(part => `<div>${part}</div>`).join('');
    } else {
      nameHTML = `<div class="single-line-name">${friend.name}</div>`;
    }
    return `
      <div class="story-card has-story" data-user-id="${friend.id}" style="background-image: url('${friend.stories[0]}')">
        <img src="${friend.avatar}" alt="${friend.name}" class="story-avatar">
        <span class="story-username">${nameHTML}</span>
      </div>
    `;
  }).join('');

  // Render structure: stories + feed
  container.innerHTML = `
    <div class="home-wrapper">
      <section class="stories-section">
        <h3>Stories</h3>
        <div class="stories-container">
          <div class="story-card create-story-card" id="create-story">
            <img src="${currentUser.avatar || '/assets/images/profile-placeholder.png'}" alt="Your Story" class="create-story-avatar">
            <div class="plus-icon">
              <i data-lucide="plus" style="width: 20px; height: 20px;"></i>
            </div>
            <span class="create-story-text">Create Story</span>
          </div>
          ${storiesHTML}
        </div>
      </section>

      <!-- ✅ Add feed container -->
      <section id="feed-section" class="feed-section"></section>
    </div>
  `;

  // Initialize icons
  createIcons({ icons });

  // ✅ Render feed (posts) inside feed-section
  const feedContainer = container.querySelector("#feed-section");
  if (feedContainer) {
    initFeed(feedContainer);
  }
}
