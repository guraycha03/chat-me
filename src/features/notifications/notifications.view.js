export function renderNotifications(container) {
  container.innerHTML = `
    <div class="notifications-wrapper">
      <main class="home-main">
        <div class="notifications-empty-state">
          <img src="/assets/images/notif-image.png" alt="Notifications illustration" class="notifications-illustration"/>
          <h2 class="notifications-title">Stay Connected!</h2>
          <p class="notifications-description">
            Your notifications hub is here. Get real-time updates on likes, comments, friend requests, and more. 
            When you have new alerts, they'll appear right here to keep you in the loop!
          </p>
        </div>
      </main>
    </div>
  `;
}
