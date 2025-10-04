import { predefinedInterests } from "../../data/interests.js";
import { updateUser, getCurrentUser } from "../../utils/storage.js";
import { createElement } from "../../utils/DOM.js";
import { createBackButton } from "../components/backButton.js";
import { renderInterestBadges } from "../components/interestBadge.js";

export function renderProfile(container, person) {
  let userData = person;
  let posts = [];

  if (!person) {
    // For current user profile
    userData = getCurrentUser();
    if (!userData) {
      container.innerHTML = "<p>User data not available.</p>";
      return;
    }
    // Set defaults for own profile data
    userData.name = userData.username;
    userData.avatar = userData.avatar || '/assets/images/profile-placeholder.png';
    userData.bio = userData.bio || "No bio available.";
    userData.birthday = userData.birthday || "Unknown";
    userData.interests = userData.interests || [];
    // For own profile, get posts from localStorage
    posts = JSON.parse(localStorage.getItem("posts") || "[]");
  } else {
    // For other people's profiles
    posts = userData.posts || [];
  }

  const postsCount = posts.length;
  const followersCount = userData.followers || 0;
  const followingCount = userData.following || 0;

  // Flag to track edit mode
  let isEditing = false;

  function renderView() {
    container.innerHTML = `
      <div class="profile-wrapper">
        <header class="profile-header">
          <div class="cover-photo"></div>
          <img src="${userData.avatar}" alt="${userData.name} avatar" class="profile-avatar" />
        </header>

        <div class="profile-details">
          <h2 id="username">${userData.name}</h2>
          <p class="profile-bio">${userData.bio}</p>
          <p><strong>Interests:</strong> ${renderInterestBadges(userData.interests)}</p>
          ${userData.id === getCurrentUser()?.id ? '<button class="edit-profile-btn">Edit Profile</button>' : ''}
        </div>

        <main class="profile-main">
          <div class="profile-stats">
            <div><strong>${postsCount}</strong> Posts</div>
            <div><strong>${followersCount}</strong> Followers</div>
            <div><strong>${followingCount}</strong> Following</div>
          </div>
          <section class="profile-posts">
            <h3>Posts</h3>
            <div class="posts-grid">
              ${posts.length > 0 ? posts.map(post => `
                <div class="post-item" key="${post.id}">
                  ${post.image ? `<img src="${post.image}" alt="Post image" />` : ""}
                  <p>${post.description || ""}</p>
                  <p>${post.text || ""}</p>
                </div>
              `).join("") : "<p>No posts available.</p>"}
            </div>
          </section>
        </main>
      </div>
    `;

    // Set dynamic cover background
    const coverPhoto = container.querySelector(".cover-photo");
    if (coverPhoto) {
      coverPhoto.style.background = userData.coverColor || "linear-gradient(135deg, #d1ddf1 0%, #96add4 100%)";
    }

    // Add back button using reusable component
    const header = container.querySelector(".profile-header");
    createBackButton(header, () => {
      // Go back in history
      history.back();
    });

    // Add event listener for Edit Profile button
    const editBtn = container.querySelector(".edit-profile-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        isEditing = true;
        renderEditForm();
      });
    }
  }

  function renderEditForm() {
    container.innerHTML = "";

    const form = createElement("form", { class: "edit-profile-form" });

    // Bio input
    const bioLabel = createElement("label", { innerText: "Bio:" });
    const bioInput = createElement("textarea", { rows: 3, value: userData.bio });
    bioLabel.appendChild(bioInput);

    // Profile Image upload
    const avatarLabel = createElement("label", { innerText: "Profile Image:" });
    const avatarInput = createElement("input", { type: "file", accept: "image/*" });
    avatarLabel.appendChild(avatarInput);

    // Background color picker
    const bgColorLabel = createElement("label", { innerText: "Background Color:" });
    const bgColorInput = createElement("input", { type: "color", value: userData.coverColor || "#96add4" });
    bgColorLabel.appendChild(bgColorInput);

    // Interests badges editable
    const interestsLabel = createElement("label", { innerText: "Interests:" });
    const interestsContainer = createElement("div", { class: "interests-badges-edit" });

    predefinedInterests.forEach(interest => {
      const badge = createElement("span", {
        className: "interest-badge-edit" + (userData.interests.includes(interest) ? " selected" : ""),
        innerText: interest,
        tabIndex: 0,
        role: "button",
        "aria-pressed": userData.interests.includes(interest) ? "true" : "false"
      });

      badge.addEventListener("click", () => {
        if (userData.interests.includes(interest)) {
          userData.interests = userData.interests.filter(i => i !== interest);
          badge.classList.remove("selected");
          badge.setAttribute("aria-pressed", "false");
        } else {
          userData.interests.push(interest);
          badge.classList.add("selected");
          badge.setAttribute("aria-pressed", "true");
        }
      });

      interestsContainer.appendChild(badge);
    });

    interestsLabel.appendChild(interestsContainer);

    // Save and Cancel buttons
    const saveBtn = createElement("button", { type: "submit", innerText: "Save" });
    const cancelBtn = createElement("button", { type: "button", innerText: "Cancel" });

    form.append(bioLabel, avatarLabel, bgColorLabel, interestsLabel, saveBtn, cancelBtn);
    container.appendChild(form);

    // Preview uploaded image
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          userData.avatar = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Update background color on change
    bgColorInput.addEventListener("input", (e) => {
      userData.coverColor = e.target.value;
    });

    // Cancel button handler
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      isEditing = false;
      renderView();
    });

    // Form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newBio = bioInput.value.trim();

      // Update userData
      userData.bio = newBio;

      // Persist changes
      updateUser(userData);

      isEditing = false;
      renderView();
    });
  }

  renderView();
}

