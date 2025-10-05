import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { navigate } from "../../utils/navigationState.js";
import "./settings.css";

export function renderSettings(container) {
  container.innerHTML = `
    <div class="settings-wrapper">
      <header class="settings-header">
        <h1>Settings & Privacy</h1>
      </header>
      <main class="settings-main">
        <section class="settings-section">
          <h2>Account</h2>
          <ul class="settings-list">
            <li class="settings-item" id="edit-info">
              <i data-lucide="user"></i>
              <span>Edit Information</span>
              <i data-lucide="chevron-right"></i>
            </li>
            <li class="settings-item" id="change-password">
              <i data-lucide="lock"></i>
              <span>Change Password</span>
              <i data-lucide="chevron-right"></i>
            </li>
            <li class="settings-item" id="account-management">
              <i data-lucide="user-x"></i>
              <span>Account Management</span>
              <i data-lucide="chevron-right"></i>
            </li>
          </ul>
        </section>
        <section class="settings-section">
          <h2>Privacy</h2>
          <ul class="settings-list">
            <li class="settings-item" id="privacy-settings">
              <i data-lucide="shield"></i>
              <span>Privacy Settings</span>
              <i data-lucide="chevron-right"></i>
            </li>
            <li class="settings-item" id="blocked-users">
              <i data-lucide="user-minus"></i>
              <span>Blocked Users</span>
              <i data-lucide="chevron-right"></i>
            </li>
          </ul>
        </section>
        <section class="settings-section">
          <h2>Notifications</h2>
          <ul class="settings-list">
            <li class="settings-item" id="notification-preferences">
              <i data-lucide="bell"></i>
              <span>Notification Preferences</span>
              <i data-lucide="chevron-right"></i>
            </li>
            <li class="settings-item" id="push-notifications">
              <i data-lucide="smartphone"></i>
              <span>Push Notifications</span>
              <i data-lucide="chevron-right"></i>
            </li>
          </ul>
        </section>
        <section class="settings-section">
          <h2>Support</h2>
          <ul class="settings-list">
            <li class="settings-item" id="help-support">
              <i data-lucide="help-circle"></i>
              <span>Help & Support</span>
              <i data-lucide="chevron-right"></i>
            </li>
            <li class="settings-item" id="about">
              <i data-lucide="info"></i>
              <span>About</span>
              <i data-lucide="chevron-right"></i>
            </li>
          </ul>
        </section>
      </main>
    </div>
  `;

  // Initialize Lucide icons
  createIcons({ icons });

  // Add event listeners for settings items
  const editInfoBtn = container.querySelector("#edit-info");
  editInfoBtn.addEventListener("click", () => {
    // Navigate to edit info page
    navigate('edit-info');
  });

  const changePasswordBtn = container.querySelector("#change-password");
  changePasswordBtn.addEventListener("click", () => {
    showNotice("Change Password feature coming soon!");
  });

  const accountManagementBtn = container.querySelector("#account-management");
  accountManagementBtn.addEventListener("click", () => {
    showNotice("Account Management feature coming soon!");
  });

  const privacySettingsBtn = container.querySelector("#privacy-settings");
  privacySettingsBtn.addEventListener("click", () => {
    showNotice("Privacy Settings feature coming soon!");
  });

  const blockedUsersBtn = container.querySelector("#blocked-users");
  blockedUsersBtn.addEventListener("click", () => {
    showNotice("Blocked Users feature coming soon!");
  });

  const notificationPreferencesBtn = container.querySelector("#notification-preferences");
  notificationPreferencesBtn.addEventListener("click", () => {
    showNotice("Notification Preferences feature coming soon!");
  });

  const pushNotificationsBtn = container.querySelector("#push-notifications");
  pushNotificationsBtn.addEventListener("click", () => {
    showNotice("Push Notifications feature coming soon!");
  });

  const helpSupportBtn = container.querySelector("#help-support");
  helpSupportBtn.addEventListener("click", () => {
    showNotice("Help & Support feature coming soon!");
  });

  const aboutBtn = container.querySelector("#about");
  aboutBtn.addEventListener("click", () => {
    showNotice("About Chat Me: A social networking app.");
  });
}
