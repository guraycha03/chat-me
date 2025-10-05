import { predefinedInterests } from "../../data/interests.js";
import { updateUser, getCurrentUser } from "../../utils/storage.js";
import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { renderInterestBadges } from "../components/interestBadge.js";

export function renderProfile(container, person) {
  let userData = person;
  let posts = [];

  const globalNavBarEl = document.getElementById("global-nav-bar");
  if (!person) {
    // For current user profile
    userData = getCurrentUser();
    if (!userData) {
      container.innerHTML = "<p>User data not available.</p>";
      return;
    }
    // Set defaults for own profile data
    // userData.name = userData.username; // removed to keep firstName and lastName separate
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
          <img src="${userData.avatar}" alt="${userData.name} avatar" class="profile-avatar" style="position: absolute; top: 200px; left: 2rem;" />
${userData.id === getCurrentUser()?.id ? `<button id="change-avatar-btn" title="Change Profile Image" style="position: absolute; top: 254px; left: 106px; background: #a3b18a; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3); color: #e6f0d4; z-index: 30;">
            <i data-lucide="camera" style="width: 20px; height: 20px;"></i>
          </button>` : ''}
        </header>

        <div class="profile-details">
          ${userData.id === getCurrentUser()?.id ? `
            <h2 id="fullname">${userData.firstName || ''} ${userData.lastName || ''}</h2>
            <h3 id="username">@${userData.username || ''}</h3>
          ` : `
            <h2 id="username">${userData.name}</h2>
          `}
          <div class="profile-follow-stats">
            <div><strong>${followersCount}</strong> Followers</div>
            <div><strong>${followingCount}</strong> Following</div>
          </div>
          <p class="profile-bio">${userData.bio}</p>
          <p>${renderInterestBadges(userData.interests)}</p>
          ${userData.id === getCurrentUser()?.id ? `
            <div class="profile-actions-container">
              <button class="profile-action-btn primary" id="add-story-btn">
                <i data-lucide="plus"></i>
                <span>Add story</span>
              </button>
              <button class="profile-action-btn edit-profile-btn">
                <i data-lucide="pencil"></i>
                <span>Edit info</span>
              </button>
            </div>
          ` : ''}
        </div>

        <main class="profile-main">
          <div class="profile-stats">
            <div><strong>${postsCount}</strong> Posts</div>
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

    // Initialize lucide icons for the new buttons
    createIcons({ icons });

    // Add event listener for Add Story button
    const addStoryBtn = container.querySelector("#add-story-btn");
    if (addStoryBtn) {
      addStoryBtn.addEventListener("click", () => showNotice("Add story clicked!"));
    }
    // Add event listener for Edit Profile button
    const editBtn = container.querySelector(".edit-profile-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        isEditing = true;
        // Show back button for the edit form
        const event = new CustomEvent('manageBackButton', { detail: { show: true, text: 'Edit Profile' } });
        window.dispatchEvent(event);

        renderEditForm();
      });
    }

    // Add event listener for Change Avatar button
    const changeAvatarBtn = container.querySelector("#change-avatar-btn");
    if (changeAvatarBtn) {
      changeAvatarBtn.addEventListener("click", () => {
        // Create hidden file input
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              userData.avatar = event.target.result;
              updateUser(userData);
              renderView();
              showNotice("Profile image updated!");
            };
            reader.readAsDataURL(file);
          }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
      });
    }
  }

  function renderEditForm() {
    container.innerHTML = "";

    const form = createElement("form", { class: "edit-profile-form" });

    // First Name input
    const firstNameLabel = createElement("label", { innerText: "First Name:" });
    const firstNameInput = createElement("input", { type: "text", value: userData.firstName || "" });
    firstNameLabel.appendChild(firstNameInput);

    // Last Name input
    const lastNameLabel = createElement("label", { innerText: "Last Name:" });
    const lastNameInput = createElement("input", { type: "text", value: userData.lastName || "" });
    lastNameLabel.appendChild(lastNameInput);

    // Username input
    const usernameLabel = createElement("label", { innerText: "Username:" });
    const usernameInput = createElement("input", { type: "text", value: userData.username || userData.name || "" });
    usernameLabel.appendChild(usernameInput);

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
        className: `interest-badge interest-badge--editable ${userData.interests.includes(interest) ? "selected" : ""}`,
        innerText: interest,
        tabIndex: 0,
        role: "button",
        "aria-pressed": userData.interests.includes(interest) ? "true" : "false"
      });

      badge.addEventListener("click", () => {
        const isSelected = badge.classList.toggle("selected");
        badge.setAttribute("aria-pressed", isSelected);
        userData.interests = Array.from(interestsContainer.querySelectorAll('.interest-badge.selected'))
                                  .map(b => b.innerText);
      });

      interestsContainer.appendChild(badge);
    });

    interestsLabel.appendChild(interestsContainer);

    // Save and Cancel buttons
    const saveBtn = createElement("button", { type: "submit", innerText: "Save" });
    const cancelBtn = createElement("button", { type: "button", innerText: "Cancel" });

    form.append(firstNameLabel, lastNameLabel, usernameLabel, bioLabel, avatarLabel, bgColorLabel, interestsLabel, saveBtn, cancelBtn);
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

      // Hide back button when cancelling edit
      const event = new CustomEvent('manageBackButton', { detail: { show: false } });
      window.dispatchEvent(event);

      renderView();
    });

    // Form submit handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Update userData from inputs
      userData.firstName = firstNameInput.value.trim();
      userData.lastName = lastNameInput.value.trim();
      userData.username = usernameInput.value.trim();
      userData.bio = bioInput.value.trim();

      // Persist changes
      updateUser(userData);

      isEditing = false;

      // Hide back button after saving
      const event = new CustomEvent('manageBackButton', { detail: { show: false } });
      window.dispatchEvent(event);

      renderView();
    });
  }

  // Listen for user data updates and re-render if it's the current user's profile
  const handleUserDataUpdate = (e) => {
    if (!person) { // Only for own profile
      userData = getCurrentUser();
      renderView();
    }
  };
  window.addEventListener('userDataUpdated', handleUserDataUpdate);

  renderView();
}
