import { predefinedInterests } from "../../data/interests.js";
import { updateUser, getCurrentUser } from "../../utils/storage.js";
import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";
import { showNotice } from "../../utils/notification.js";
import { renderInterestBadges } from "../components/interestBadge.js";
import "./profile.css";

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
    userData.avatar = userData.avatar || '/assets/images/profile-placeholder.png';
    posts = userData.posts || [];
  }

  const postsCount = posts.length;
  const followersCount = userData.followers || 0;
  const followingCount = userData.following || 0;

  // Function to format numbers as K for thousands
  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  // Flag to track edit mode
  let isEditing = false;

  function renderView() {
    console.log("Profile avatar URL:", userData.avatar);
    console.log("Full userData:", userData);
    container.innerHTML = `
      <div class="profile-wrapper">
        <div class="profile-header">
          <div class="cover-photo"></div>
          <div class="profile-avatar-wrapper">
            <img src="${userData.avatar}" alt="Profile image" class="profile-avatar" onerror="this.src='/assets/images/profile-placeholder.png'" />
            <button id="change-avatar-btn" title="Change Profile Image">
              <i data-lucide="camera"></i>
            </button>
          </div>
        </div>

        <div class="profile-details">
          ${userData.id === getCurrentUser()?.id ? `
            <h2 id="fullname">${userData.firstName || ''} ${userData.lastName || ''}</h2>
            <h3 id="username">@${userData.username || ''}</h3>
          ` : `
            <h2 id="username">${userData.name}</h2>
          `}
          <div class="profile-follow-stats">
            <div><strong>${formatNumber(followersCount)}</strong> Followers</div>
            <div><strong>${formatNumber(followingCount)}</strong> Following</div>
          </div>
          <p class="profile-bio">${userData.bio}</p>
          <p>${renderInterestBadges(userData.interests)}</p>
          ${userData.id === getCurrentUser()?.id ? `
            <div class="profile-actions-container">
              <button class="profile-action-btn primary" id="add-story-btn">
                <i data-lucide="plus"></i>
                <span>Add story</span>
              </button>
              <button class="profile-action-btn edit-profile-btn" id="edit-profile-btn">
                <i data-lucide="pencil"></i>
                <span>Edit Profile</span>
              </button>
            </div>
          ` : `
            <div class="profile-actions-container">
              <button class="profile-action-btn primary" id="add-friend-btn">
                <i data-lucide="user-plus"></i>
                <span>Add Friend</span>
              </button>
              <button class="profile-action-btn" id="message-btn">
                <i data-lucide="message-circle"></i>
                <span>Message</span>
              </button>
            </div>
          `}
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
                          <img src="${userData.avatar}" alt="${userData.name} avatar" class="post-avatar" onerror="this.src='/assets/images/profile-placeholder.png'" />
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
                        <div class="post-actions">
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
      // Upper half background color, lower half blends into the page
      coverPhoto.style.background = userData.coverColor || "var(--color-primary)";
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
    const editBtn = container.querySelector("#edit-profile-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        isEditing = true;
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

    // Add event listener for Add Friend button
    const addFriendBtn = container.querySelector("#add-friend-btn");
    if (addFriendBtn) {
      addFriendBtn.addEventListener("click", () => showNotice("Add friend clicked!"));
    }
    // Add event listener for Message button
    const messageBtn = container.querySelector("#message-btn");
    if (messageBtn) {
      messageBtn.addEventListener("click", () => showNotice("Message clicked!"));
    }
  }

  

  function renderEditForm() {
    container.innerHTML = `
      <div class="edit-profile-inline">
        <form class="edit-profile-form" id="edit-profile-form">
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" name="bio" rows="4" placeholder="Tell us about yourself...">${userData.bio || ''}</textarea>
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

    // Initial render of interests
    renderSelectedInterests();

    // Cancel button
    const cancelBtn = container.querySelector("#cancel-btn");
    cancelBtn.addEventListener("click", () => {
      isEditing = false;
      renderView();
    });

    // Form submit
    const form = container.querySelector("#edit-profile-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      userData.bio = formData.get('bio');
      // interests are already updated in userData
      updateUser(userData);
      showNotice("Profile updated successfully!");
      isEditing = false;
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
