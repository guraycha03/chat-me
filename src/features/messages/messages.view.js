// src/features/messages/messages.view.js
export function renderMessages(content) {
  content.innerHTML = `
    <div class="messages-wrapper">
      <!-- Header -->
      <header class="messages-header">
        <h1>Chats</h1>
        <div class="header-actions">
          <button aria-label="New Message"><i data-lucide="edit-3"></i></button>
        </div>
      </header>

      <!-- Search -->
      <div class="messages-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search messages or people" />
      </div>

      <!-- Active friends row -->
      <div class="active-friends">
        <div class="friend">
          <div class="avatar-wrap">
            <img src="https://i.pravatar.cc/60?img=11" alt="User" />
            <span class="online-dot"></span>
          </div>
          <small>Anna</small>
        </div>
        <div class="friend">
          <div class="avatar-wrap">
            <img src="https://i.pravatar.cc/60?img=12" alt="User" />
            <span class="online-dot"></span>
          </div>
          <small>John</small>
        </div>
        <div class="friend">
          <div class="avatar-wrap">
            <img src="https://i.pravatar.cc/60?img=13" alt="User" />
            <span class="online-dot"></span>
          </div>
          <small>Lisa</small>
        </div>
      </div>

      <!-- Chats list -->
      <main class="chat-list">
        <div class="chat-preview">
          <img src="https://i.pravatar.cc/60?img=21" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Jane Doe</h3>
            <p>Sure ☕ let's do it!</p>
          </div>
          <span class="chat-time">2m</span>
        </div>

        <div class="chat-preview">
          <img src="https://i.pravatar.cc/60?img=22" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Mike Ross</h3>
            <p>Check this out 🔥</p>
          </div>
          <span class="chat-time">15m</span>
        </div>

        <div class="chat-preview unread">
          <img src="https://i.pravatar.cc/60?img=23" alt="User" class="chat-avatar"/>
          <div class="chat-info">
            <h3>Sara Smith</h3>
            <p>Are we still on for tonight?</p>
          </div>
          <span class="chat-time">1h</span>
        </div>
      </main>
    </div>
  `;
}
