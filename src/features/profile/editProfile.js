import { predefinedInterests } from "../../data/interests.js";
import { updateUser } from "../../utils/storage.js";
import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";

export function renderEditProfile(container, userData, onCancel) {
  container.innerHTML = `
    <div class="edit-profile-inline">
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
  `;

  createIcons({ icons });

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
        createIcons({ icons });
      });
      interestsContainer.appendChild(badge);
    });
    createIcons({ icons });
  }

  function updateSuggestions(query) {
    suggestionList.innerHTML = "";
    if (!query) return;
    predefinedInterests.filter(i => i.toLowerCase().includes(query.toLowerCase()) && !userData.interests.includes(i))
      .slice(0, 5)
      .forEach(match => {
        const div = createElement("div", { class: "suggestion-item", innerText: match });
        div.addEventListener("click", () => { userData.interests.push(match); renderSelectedInterests(); interestInput.value = ""; });
        suggestionList.appendChild(div);
      });
  }

  interestInput.addEventListener("input", (e) => updateSuggestions(e.target.value));
  interestInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && interestInput.value.trim() !== "") {
      e.preventDefault();
      const newInterest = interestInput.value.trim();
      if (!userData.interests.includes(newInterest)) userData.interests.push(newInterest);
      renderSelectedInterests();
      interestInput.value = "";
      updateSuggestions("");
    }
  });

  renderSelectedInterests();

  container.querySelector("#cancel-btn").addEventListener("click", onCancel);

  container.querySelector("#edit-profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    userData.bio = container.querySelector("#bio").value;
    updateUser(userData);
    showNotice("Profile updated!");
    onCancel(); // go back to profile view
  });
}
