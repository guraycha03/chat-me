import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { navigate } from "../../utils/navigationState.js";
import { predefinedInterests } from "../../data/interests.js";
import { updateUser, getCurrentUser } from "../../utils/storage.js";
import "./edit-profile.css";

export function renderEditProfile(container) {
  let currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "/login.html";
    return;
  }

  // Ensure interests array exists
  currentUser.interests = currentUser.interests || [];

  container.innerHTML = `
    <div class="edit-profile-wrapper">
      <header class="edit-profile-header">
        <h1>Edit Profile</h1>
      </header>
      <main class="edit-profile-main">
        <form class="edit-profile-form" id="edit-profile-form">
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself...">${currentUser.bio || ''}</textarea>
          </div>

          <!-- Interests Section -->
          <div class="interest-section">
            <div class="interest-title">
              <i data-lucide="heart"></i> Interests
            </div>
            <label>Interests:</label>
            <div class="interest-search-wrapper">
              <input type="text" placeholder="Search or add interest..." class="interest-search-input" id="interest-search-input">
              <div class="interest-suggestions" id="interest-suggestions"></div>
            </div>
            <div class="interests-badges-edit" id="interests-badges-edit"></div>
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

  // Interests functionality
  const interestSearchInput = container.querySelector("#interest-search-input");
  const suggestionList = container.querySelector("#interest-suggestions");
  const interestsContainer = container.querySelector("#interests-badges-edit");

  // Render initial interests as badges
  function renderSelectedInterests() {
    interestsContainer.innerHTML = "";
    currentUser.interests.forEach(interest => {
      const badge = createElement("span", {
        className: "interest-badge selected",
        innerText: interest
      });
      const removeIcon = createElement("i", { "data-lucide": "x" });
      badge.appendChild(removeIcon);
      badge.addEventListener("click", () => {
        currentUser.interests = currentUser.interests.filter(i => i !== interest);
        renderSelectedInterests();
        createIcons({ icons });
      });
      interestsContainer.appendChild(badge);
    });
    createIcons({ icons });
  }

  // Show matching suggestions
  function updateSuggestions(query) {
    suggestionList.innerHTML = "";
    if (!query) return;
    const matches = predefinedInterests.filter(i =>
      i.toLowerCase().includes(query.toLowerCase()) &&
      !currentUser.interests.includes(i)
    );
    matches.slice(0, 5).forEach(match => {
      const suggestion = createElement("div", {
        class: "suggestion-item",
        innerText: match
      });
      suggestion.addEventListener("click", () => {
        currentUser.interests.push(match);
        interestSearchInput.value = "";
        updateSuggestions("");
        renderSelectedInterests();
      });
      suggestionList.appendChild(suggestion);
    });
  }

  interestSearchInput.addEventListener("input", (e) => {
    updateSuggestions(e.target.value);
  });

  interestSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && interestSearchInput.value.trim() !== "") {
      e.preventDefault();
      const newInterest = interestSearchInput.value.trim();
      if (!currentUser.interests.includes(newInterest)) {
        currentUser.interests.push(newInterest);
        renderSelectedInterests();
      }
      interestSearchInput.value = "";
      updateSuggestions("");
    }
  });

  // Initial render of interests
  renderSelectedInterests();

  // Cancel button
  const cancelBtn = container.querySelector("#cancel-btn");
  cancelBtn.addEventListener("click", () => {
    navigate('profile');
  });

  // Form submit
  const form = container.querySelector("#edit-profile-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const updatedUser = {
      ...currentUser,
      bio: formData.get('bio'),
      interests: currentUser.interests, // Include updated interests
    };
    localStorage.setItem("myapp_currentUser", JSON.stringify(updatedUser));
    updateUser(updatedUser);
    showNotice("Profile updated successfully!");
    // Dispatch event to notify other parts of the app about user data update
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
    navigate('profile');
  });
}
