import { predefinedInterests } from "../../data/interests.js";
import { updateUser } from "../../utils/storage.js";
import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import "./editProfile.css";

export function renderEditProfile(container, userData, onCancel) {
  container.innerHTML = `
  <div class="edit-profile-wrapper">
    <div class="edit-profile-header">
      <div id="global-nav-bar">
        <div class="back-button-wrapper">
          <button class="back-button" id="back-btn">
            <i data-lucide="arrow-left"></i>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>

    <h1>Edit Profile</h1>

    <div class="edit-profile-center">
      <form class="edit-profile-form" id="edit-profile-form">
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea id="bio" name="bio" rows="4">${userData.bio || ''}</textarea>
        </div>

        <div class="interest-section">
          <div class="interest-title"><i data-lucide="heart"></i> Interests</div>
          <input type="text" placeholder="Search or add interest..." id="interest-search-input">
          <div id="interest-suggestions"></div>
          <div id="interests-badges-edit"></div>
        </div>

        <div class="form-actions">
          <button type="button" id="cancel-btn">Cancel</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
`;

  // === Back button action ===
  container.querySelector("#back-btn").addEventListener("click", onCancel);
  createIcons({ icons });

  // === Interests Management ===
  const interestsContainer = container.querySelector("#interests-badges-edit");
  const interestInput = container.querySelector("#interest-search-input");
  const suggestionList = container.querySelector("#interest-suggestions");

  function renderSelectedInterests() {
    interestsContainer.innerHTML = "";
    userData.interests.forEach(i => {
      const badge = createElement("span", { className: "interest-badge selected", innerText: i });
      const removeIcon = createElement("i", { "data-lucide": "x" });
      badge.appendChild(removeIcon);
      badge.addEventListener("click", () => {
        userData.interests = userData.interests.filter(inter => inter !== i);
        renderSelectedInterests();
      });
      interestsContainer.appendChild(badge);
    });
    createIcons({ icons });
  }

  function addInterest(interest) {
    if (!userData.interests.includes(interest)) {
      userData.interests.push(interest);
      renderSelectedInterests();
    }
    interestInput.value = "";
    suggestionList.innerHTML = "";
  }

  function updateSuggestions(query) {
    suggestionList.innerHTML = "";
    if (!query.trim()) return;

    const matches = predefinedInterests
      .filter(i => i.toLowerCase().includes(query.toLowerCase()))
      .filter(i => !userData.interests.includes(i))
      .slice(0, 5);

    matches.forEach(match => {
      const div = createElement("div", { className: "suggestion-item", innerText: match });
      div.addEventListener("click", () => addInterest(match));
      suggestionList.appendChild(div);
    });

    setupKeyboardNavigation();
  }

  // === Keyboard navigation inside suggestions ===
  function setupKeyboardNavigation() {
    let currentIndex = -1;
    const items = suggestionList.querySelectorAll(".suggestion-item");

    interestInput.onkeydown = (e) => {
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
        updateActiveItem();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateActiveItem();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentIndex >= 0) {
          addInterest(items[currentIndex].innerText);
        } else if (interestInput.value.trim() !== "") {
          addInterest(interestInput.value.trim());
        }
      }
    };

    function updateActiveItem() {
      items.forEach((item, idx) => {
        item.classList.toggle("active", idx === currentIndex);
        if (idx === currentIndex) {
          item.scrollIntoView({ block: "nearest" });
        }
      });
    }
  }

  // === Listeners ===
  interestInput.addEventListener("input", (e) => updateSuggestions(e.target.value));

  renderSelectedInterests();

  container.querySelector("#cancel-btn").addEventListener("click", onCancel);

  container.querySelector("#edit-profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    userData.bio = container.querySelector("#bio").value;
    updateUser(userData);
    showNotice("Profile updated!");
    onCancel();
  });
}
