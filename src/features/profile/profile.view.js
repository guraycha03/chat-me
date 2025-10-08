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
          <img src="${userData.avatar}" alt="${userData.name} avatar" class="profile-avatar" style="position: absolute; top: 200px; left: 2rem; ${userData.avatar !== '/assets/images/profile-placeholder.png' ? 'background: white;' : ''}" />
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
          <section class="profile-posts">
            <h3>Posts</h3>

            <div class="posts-list">
              ${posts.length > 0
                ? posts.map(post => {
                    const postDate = post.date
                      ? (() => {
                          const dateObj = new Date(post.date);
                          const months = [
                            "Jan", "Feb", "Mar", "Apr", "May", "June",
                            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
                          ];
                          return `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
                        })()
                      : "Unknown";



                    return `
                      <div class="post-item" key="${post.id}">
                        <div class="post-header">
                          <img src="${userData.avatar}" alt="${userData.name} avatar" class="post-avatar" />
                          <div class="post-user-info">
                            <span class="post-username">${userData.name || `${userData.firstName || ""} ${userData.lastName || ""}`}</span>
                            <span class="post-date">${postDate}</span>
                          </div>
                        </div>

                        <div class="post-body">
                          ${post.images && post.images.length > 1
                            ? `
                                ${post.description ? `<p class="post-caption">${post.description}</p>` : ""}
                                <div class="post-carousel" data-post-id="${post.id}">
                                  ${post.images
                                    .map(
                                      (img) => `
                                        <div class="carousel-slide">
                                          <img src="${img}" alt="Post image" class="post-media" />
                                        </div>
                                      `
                                    )
                                    .join("")}
                                </div>
                                <div class="carousel-dots" id="dots-${post.id}">
                                  ${post.images.map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`).join("")}
                                </div>
                              `



                            : post.image
                              ? `
                                ${post.description ? `<p class="post-caption">${post.description}</p>` : ""}
                                <div class="post-media-wrapper">
                                  <img src="${post.image}" alt="Post image" class="post-media" />
                                </div>
                              `
                            : post.text
                              ? `<p class="text-content">${post.text}</p>`
                              : ""
                          }

                        </div>

                        <!-- ✅ Add this new section -->
                        <!-- ✅ Enhanced post action bar -->
                        <div class="action-item like-action">
                          <div class="icon-box"><i data-lucide="heart"></i></div>
                          <span>${post.likes || 0}</span>
                        </div>
                        <div class="action-item">
                          <div class="icon-box"><i data-lucide="message-circle"></i></div>
                          <span>${post.comments || 0}</span>
                        </div>
                        <div class="action-item">
                          <div class="icon-box"><i data-lucide="forward"></i></div>
                          <span>${post.shares || 0}</span>
                        </div>



                      </div>
                    `;




                  }).join("")
                : "<p>No posts available.</p>"}
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

    // 🟣 Carousel scroll detection for dot indicators
    const carousels = container.querySelectorAll(".post-carousel");
    carousels.forEach((carousel) => {
      const dots = carousel.nextElementSibling?.querySelectorAll(".dot");
      if (!dots) return;

      carousel.addEventListener("scroll", () => {
        const scrollLeft = carousel.scrollLeft;
        const slideWidth = carousel.clientWidth;
        const currentIndex = Math.round(scrollLeft / slideWidth);

        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === currentIndex);
        });
      });
    });


    // ❤️ Like button toggle logic
    const likeButtons = container.querySelectorAll(".like-action");
    likeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const countEl = btn.querySelector("span");
        let count = parseInt(countEl.textContent);

        // Toggle liked state
        const isLiked = btn.classList.toggle("liked");
        if (isLiked) count++;
        else count--;

        countEl.textContent = count;

        // Re-render icons to ensure Lucide SVG refreshes
        createIcons({ icons });

        // ✅ Apply color to the newly rendered SVG
        const svg = btn.querySelector("svg");
        if (svg) {
          if (isLiked) {
            svg.style.stroke = "#e74c3c";
            svg.style.fill = "#e74c3c";
          } else {
            svg.style.stroke = "#888";
            svg.style.fill = "none";
          }
        }



      });
    });


    // Add event listener for Add Story button
    const addStoryBtn = container.querySelector("#add-story-btn");
    if (addStoryBtn) {
      addStoryBtn.addEventListener("click", () => showNotice("Add story clicked!"));
    }
    // Add event listener for Edit Profile button
    const editBtn = container.querySelector(".edit-profile-btn");
    if (editBtn) {
      // Edit profile button removed as per user request, no event listener added
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

    // Interests section
    const interestsSection = createElement("div", { class: "interest-section" });

    // Interest title
    const interestTitle = createElement("div", { class: "interest-title" });
    interestTitle.innerHTML = '<i data-lucide="heart"></i> Interests';
    interestsSection.appendChild(interestTitle);

    // Interests input with search and badges
    const interestsLabel = createElement("label", { innerText: "Interests:" });
    const interestSearchWrapper = createElement("div", { class: "interest-search-wrapper" });
    const interestSearchInput = createElement("input", {
      type: "text",
      placeholder: "Search or add interest...",
      class: "interest-search-input"
    });
    const suggestionList = createElement("div", { class: "interest-suggestions" });
    const interestsContainer = createElement("div", { class: "interests-badges-edit" });

    // Render initial interests as badges
    function renderSelectedInterests() {
      interestsContainer.innerHTML = "";
      userData.interests.forEach(interest => {
        const badge = createElement("span", {
          className: "interest-badge selected",
          innerText: interest
        });
        const removeIcon = createElement("i", { "data-lucide": "x" });
        badge.appendChild(removeIcon);
        badge.addEventListener("click", () => {
          userData.interests = userData.interests.filter(i => i !== interest);
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
        !userData.interests.includes(i)
      );
      matches.slice(0, 5).forEach(match => {
        const suggestion = createElement("div", {
          class: "suggestion-item",
          innerText: match
        });
        suggestion.addEventListener("click", () => {
          userData.interests.push(match);
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
        if (!userData.interests.includes(newInterest)) {
          userData.interests.push(newInterest);
          renderSelectedInterests();
        }
        interestSearchInput.value = "";
        updateSuggestions("");
      }
    });

    interestSearchWrapper.append(interestSearchInput, suggestionList);
    interestsLabel.append(interestSearchWrapper, interestsContainer);
    interestsSection.appendChild(interestsLabel);

    // Save and Cancel buttons
    const saveBtn = createElement("button", { type: "submit", innerText: "Save" });
    const cancelBtn = createElement("button", { type: "button", innerText: "Cancel" });

    form.append(interestsSection, saveBtn, cancelBtn);
    container.appendChild(form);

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
