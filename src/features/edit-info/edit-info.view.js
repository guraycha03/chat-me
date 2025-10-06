import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { navigate } from "../../utils/navigationState.js";
import "./edit-info.css";

export function renderEditInfo(container) {
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));
  if (!currentUser) {
    window.location.href = "/login.html";
    return;
  }

  container.innerHTML = `
    <div class="edit-info-wrapper">
      <header class="edit-info-header">
        <h1>Edit Information</h1>
      </header>
      <main class="edit-info-main">
        <form class="edit-info-form" id="edit-info-form">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" name="firstName" value="${currentUser.firstName || ''}" required>
 n
          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" name="lastName" value="${currentUser.lastName || ''}" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="${currentUser.email || ''}" required>
          </div>
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself...">${currentUser.bio || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" value="${currentUser.phone || ''}">
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" name="location" value="${currentUser.location || ''}" placeholder="City, Country">
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" id="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </main>
    </div>
  `;

  // Initialize Lucide icons
  createIcons({ icons });

  // Cancel button
  const cancelBtn = container.querySelector("#cancel-btn");
  cancelBtn.addEventListener("click", () => {
    navigate('settings');
  });

  // Form submit
  const form = container.querySelector("#edit-info-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updatedUser = {
      ...currentUser,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      bio: formData.get('bio'),
      phone: formData.get('phone'),
      location: formData.get('location'),
    };
    localStorage.setItem("myapp_currentUser", JSON.stringify(updatedUser));
    showNotice("Information updated successfully!");
    // Dispatch event to notify other parts of the app about user data update
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
    navigate('settings');
  });
}
