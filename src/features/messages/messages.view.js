import { createIcons, icons } from "lucide";
import { mockFriends } from "../../data/friends.mock.js";



export function renderMessages(content) {
  // ✅ Filter online friends only
  const activeFriends = mockFriends.filter(friend => friend.online);

  // ✅ Generate HTML for active friends
  const activeFriendsHTML = activeFriends
    .map(
      (friend) => `
      <div class="friend">
        <div class="avatar-wrap">
          <img src="${friend.avatar}" alt="${friend.name}" />
          <span class="online-dot"></span>
        </div>
        <small>${friend.name.split(" ")[0]}</small>
      </div>
    `
    )
    .join("");

  // ✅ Build full page layout
  content.innerHTML = `
    <div class="messages-wrapper">
      <header class="messages-header">
        <h1>Chats</h1>
        <div class="header-actions">
          <button class="new-message-btn" aria-label="New Message">
            <i data-lucide="edit-3"></i>
          </button>
        </div>
      </header>

     
      <div class="messages-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search messages or friends" />
      </div>

      <div class="active-friends">
        ${activeFriendsHTML.length > 0 ? activeFriendsHTML : "<p>No friends online</p>"}
      </div>

   
      <main class="chat-list">
        <div class="chat-preview">
          <img src="/assets/images/users/kaia.png" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Kaia</h3>
            <p>asan ka na??</p>
          </div>
          <span class="chat-time">2m</span>
        </div>

        <div class="chat-preview">
          <img src="/assets/images/users/jace-garcia.png" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Jace Garcia</h3>
            <p>Check this out 🔥</p>
          </div>
          <span class="chat-time">15m</span>
        </div>

        <div class="chat-preview unread">
          <img src="/assets/images/users/avery.png" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Avery Ramirez</h3>
            <p>Are we still on for tonight?</p>
          </div>
          <span class="chat-time">1h</span>
        </div>
      </main>
    </div>
  `;

  // ✅ Initialize Lucide icons after render
  createIcons({ icons });
}
