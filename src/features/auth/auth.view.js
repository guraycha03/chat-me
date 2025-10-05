// ...existing code...
import { addUser, userExists, findUser, setCurrentUser } from "../../utils/storage.js";

export function renderAuth(container) {
  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-image" aria-hidden="true"></div>

      <div class="container" id="auth-container">
        <div class="form-card">

          <!-- Login -->
          <form id="login-form" class="auth-form" novalidate>
            <h2>Login</h2>
            <div id="login-error" class="error" style="display:none;"></div>
            <div class="form-group">
              <label for="login-username">Username or Email</label>
              <input type="text" id="login-username" name="username" required minlength="3" placeholder="Enter your username or email" aria-required="true" />

              <label for="login-password">Password</label>
              <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

              <div class="password-wrapper">
                <input type="password" id="login-password" placeholder="Enter password" aria-required="true" />
                <img src="/assets/icons/visible.svg" class="toggle-password" data-target="login-password" alt="toggle password visibility" />
              </div>

              <div id="login-password-hint" class="password-hint" style="display:none;font-size:0.9rem;margin-top:6px;">
                <div style="color:#374151;margin-bottom:6px;">Password must include:</div>
                <ul id="pw-reqs" style="padding-left:18px;margin:0;color:#6b7280;">
                  <li style="margin-bottom:4px;" data-rule="length">At least 6 characters</li>
                  <li style="margin-bottom:4px;" data-rule="lower">A lowercase letter (a–z)</li>
                  <li style="margin-bottom:4px;" data-rule="upper">An uppercase letter (A–Z)</li>
                  <li data-rule="number">A number (0–9)</li>
                </ul>
              </div>

            </div>
            <button type="submit" class="primary">Log In</button>
            <div class="divider"><span>or</span></div>

            <div class="social-login">
              <button type="button" class="social-btn">
                <img src="/assets/icons/google.svg" alt="Google Icon"> Sign in with Google
              </button>
              <button type="button" class="social-btn">
                <img src="/assets/icons/facebook.svg" alt="Facebook Icon"> Sign in with Facebook
              </button>
            </div>

            <p class="switch-text">Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
          </form>

          <!-- Signup -->
          <form id="signup-form" class="auth-form" style="display:none;" novalidate>
            <h2>Sign Up</h2>
            <div id="signup-error" class="error" style="display:none;"></div>
            <div class="form-group">
              <label for="signup-firstname">First Name</label>
              <input type="text" id="signup-firstname" name="firstname" required placeholder="Your first name" />
              <label for="signup-lastname">Last Name</label>
              <input type="text" id="signup-lastname" name="lastname" required placeholder="Your last name" />
              <label for="signup-username">Username</label>
              <input type="text" id="signup-username" name="username" required minlength="3" placeholder="Choose a username" />
              <label for="signup-email">Email</label>
              <input type="email" id="signup-email" name="email" required placeholder="Your email address" />

              <label for="signup-password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="signup-password" name="password" required minlength="6" placeholder="Create a password" />
                <img src="/assets/icons/visible.svg" class="toggle-password" data-target="signup-password" alt="toggle password visibility" />
              </div>

              <label for="signup-password-confirm">Confirm Password</label>
              <div class="password-wrapper">
                <input type="password" id="signup-password-confirm" name="password-confirm" required placeholder="Confirm your password" />
                <img src="/assets/icons/visible.svg" class="toggle-password" data-target="signup-password-confirm" alt="toggle password visibility" />
              </div>

              <div id="signup-pw-hint" class="password-hint" style="display:none;font-size:0.9rem;margin-top:6px;color:#6b7280;">
                <div style="color:#374151;margin-bottom:6px;">Password must include:</div>
                <ul id="signup-pw-reqs" style="padding-left:18px;margin:0;color:#6b7280;">
                  <li data-rule="length">At least 6 characters</li>
                  <li data-rule="lower">A lowercase letter (a–z)</li>
                  <li data-rule="upper">An uppercase letter (A–Z)</li>
                  <li data-rule="number">A number (0–9)</li>
                </ul>
              </div>

              <div id="signup-pw-match" class="field-hint" style="display:none;color:#dc2626;font-size:0.9rem;margin-top:6px;">Passwords do not match.</div>

            </div>
            <button type="submit" class="primary">Sign Up</button>
            <div class="divider"><span>or</span></div>

            <div class="social-login">
              <button type="button" class="social-btn">
                <img src="/assets/icons/google.svg" alt="Google Icon"> Sign up with Google
              </button>
              <button type="button" class="social-btn">
                <img src="/assets/icons/facebook.svg" alt="Facebook Icon"> Sign up with Facebook
              </button>
            </div>

            <p class="switch-text">Already have an account? <a href="#" id="show-login">Log In</a></p>
          </form>

          <!-- Notice -->
          <div id="notice" class="notice" style="display:none;"></div>

        </div>
      </div>
    </div>
  `;

  const refs = {
    loginForm: container.querySelector("#login-form"),
    signupForm: container.querySelector("#signup-form"),
    loginError: container.querySelector("#login-error"),
    signupError: container.querySelector("#signup-error"),
    notice: container.querySelector("#notice"),
    formCard: container.querySelector(".form-card"),
    showSignup: container.querySelector("#show-signup"),
    showLogin: container.querySelector("#show-login"),
    loginUsername: container.querySelector("#login-username"),
    loginPassword: container.querySelector("#login-password"),
    loginPasswordHint: container.querySelector("#login-password-hint"),
    pwReqItems: container.querySelectorAll("#pw-reqs li"),
    signupFirstname: container.querySelector("#signup-firstname"),
    signupLastname: container.querySelector("#signup-lastname"),
    signupUsername: container.querySelector("#signup-username"),
    signupEmail: container.querySelector("#signup-email"),
    signupPassword: container.querySelector("#signup-password"),
    signupPasswordConfirm: container.querySelector("#signup-password-confirm"),
    signupPwReqItems: container.querySelectorAll("#signup-pw-reqs li"),
    signupPwHint: container.querySelector("#signup-pw-hint"),
    signupPwMatch: container.querySelector("#signup-pw-match"),
    toggleButtons: container.querySelectorAll(".toggle-password")
  };

  // ensure form-card can contain absolute notice when needed
  if (refs.formCard) {
    const currentPos = window.getComputedStyle(refs.formCard).position;
    if (currentPos === "static") {
      refs.formCard.style.position = "relative";
    }
  }

  // small timer handle so multiple notices don't overlap
  let noticeTimer = null;

  function showNotice(msg, type = "error", scope = "global") {
    if (!refs.notice) return;
    if (noticeTimer) {
      clearTimeout(noticeTimer);
      noticeTimer = null;
    }

    // Reset inline positioning and visual styles first
    refs.notice.style.position = "";
    refs.notice.style.top = "";
    refs.notice.style.left = "";
    refs.notice.style.transform = "";
    refs.notice.style.zIndex = "";
    refs.notice.style.margin = "";
    refs.notice.style.maxWidth = "";
    refs.notice.style.backgroundColor = "";
    refs.notice.style.boxShadow = "";
    refs.notice.style.padding = "";
    refs.notice.style.borderRadius = "";
    refs.notice.style.pointerEvents = "";

    // If requested, show notice centered within the form card and force it above other content
    if (scope === "form" && refs.formCard) {
      refs.notice.style.position = "absolute";
      refs.notice.style.top = "50%";
      refs.notice.style.left = "50%";
      refs.notice.style.transform = "translate(-50%, -50%)";
      // very high z-index to ensure it sits above form children
      refs.notice.style.zIndex = "9999";
      // ensure notice width looks good inside form
      refs.notice.style.maxWidth = "90%";
      // explicit visual styling so it's clearly above other text
      refs.notice.style.backgroundColor = "#ffffff";
      refs.notice.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
      refs.notice.style.padding = "12px 16px";
      refs.notice.style.borderRadius = "8px";
      refs.notice.style.pointerEvents = "auto";
    } else if (scope === "global") {
      // place global notices above everything, centered near the top
      refs.notice.style.position = "fixed";
      refs.notice.style.top = "16px";
      refs.notice.style.left = "50%";
      refs.notice.style.transform = "translateX(-50%)";
      refs.notice.style.zIndex = "9999";
      refs.notice.style.backgroundColor = "#ffffff";
      refs.notice.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
      refs.notice.style.padding = "10px 14px";
      refs.notice.style.borderRadius = "6px";
      refs.notice.style.pointerEvents = "auto";
      refs.notice.style.maxWidth = "90%";
    } else {
      // keep default/global positioning (likely CSS controlled)
      refs.notice.style.position = "";
    }

    refs.notice.textContent = msg;
    refs.notice.className = `notice ${type} show`;
    refs.notice.style.display = "block";

    noticeTimer = setTimeout(() => {
      hideNotice();
      noticeTimer = null;
    }, 3500);
  }

  function hideNotice() {
    if (!refs.notice) return;
    refs.notice.className = "notice";
    refs.notice.style.display = "none";
    // clear inline styles added for form-scoped or global notices
    refs.notice.style.position = "";
    refs.notice.style.top = "";
    refs.notice.style.left = "";
    refs.notice.style.transform = "";
    refs.notice.style.zIndex = "";
    refs.notice.style.maxWidth = "";
    refs.notice.style.backgroundColor = "";
    refs.notice.style.boxShadow = "";
    refs.notice.style.padding = "";
    refs.notice.style.borderRadius = "";
    refs.notice.style.pointerEvents = "";
  }

  // Toggle password visibility
  if (refs.toggleButtons && refs.toggleButtons.length) {
    refs.toggleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        if (input.type === "password") {
          input.type = "text";
          btn.src = "/assets/icons/visibility_off.svg";
        } else {
          input.type = "password";
          btn.src = "/assets/icons/visible.svg";
        }
      });
    });
  }

  // Switch forms
  if (refs.showSignup) {
    refs.showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      refs.loginForm.style.display = "none";
      refs.signupForm.style.display = "block";
      hideNotice();
    });
  }
  if (refs.showLogin) {
    refs.showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      refs.signupForm.style.display = "none";
      refs.loginForm.style.display = "block";
      hideNotice();
    });
  }

  // Password rule checker
  function checkPasswordRules(pw) {
    return {
      length: pw.length >= 6,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw)
    };
  }

  function updatePwReqUI(items, pw) {
    const result = checkPasswordRules(pw);
    if (!items) return;
    items.forEach(li => {
      const rule = li.dataset.rule;
      const ok = !!result[rule];
      li.style.color = ok ? "#16a34a" : "#6b7280";
      li.style.textDecoration = ok ? "line-through" : "none";
      li.setAttribute("aria-checked", ok ? "true" : "false");
    });
  }

  // Login field hints and validation
  if (refs.loginUsername) {
    refs.loginUsername.addEventListener("blur", () => {
      const v = refs.loginUsername.value.trim();
      if (!v) {
        refs.loginUsername.classList.add("input-invalid");
        refs.loginUsername.setAttribute("aria-invalid", "true");
        showNotice("Username is required.", "error", "form");
      } else {
        refs.loginUsername.classList.remove("input-invalid");
        refs.loginUsername.removeAttribute("aria-invalid");
      }
    });
    refs.loginUsername.addEventListener("input", () => {
      if (refs.loginUsername.value.trim()) {
        refs.loginUsername.classList.remove("input-invalid");
        refs.loginUsername.removeAttribute("aria-invalid");
        hideNotice();
      }
    });
  }

  if (refs.loginPassword) {
    refs.loginPassword.addEventListener("focus", () => {
      if (refs.loginPasswordHint) {
        refs.loginPasswordHint.style.display = "block";
        updatePwReqUI(refs.pwReqItems, refs.loginPassword.value);
      }
    });
    refs.loginPassword.addEventListener("input", () => {
      updatePwReqUI(refs.pwReqItems, refs.loginPassword.value);
      if (refs.loginPassword.value.trim()) {
        refs.loginPassword.classList.remove("input-invalid");
        refs.loginPassword.removeAttribute("aria-invalid");
        if (refs.loginError) {
          refs.loginError.style.display = "none";
          refs.loginError.textContent = "";
        }
        hideNotice();
      }
    });
    refs.loginPassword.addEventListener("blur", () => {
      const v = refs.loginPassword.value;
      const rules = checkPasswordRules(v);
      if (!v) {
        refs.loginPassword.classList.add("input-invalid");
        refs.loginPassword.setAttribute("aria-invalid", "true");
        // show required notice centered in form
        showNotice("Password is required.", "error", "form");
      } else if (!rules.length || !rules.lower || !rules.upper || !rules.number) {
        refs.loginPassword.classList.add("input-invalid");
        refs.loginPassword.setAttribute("aria-invalid", "true");
        if (refs.loginError) {
          refs.loginError.textContent = "Password does not meet requirements.";
          refs.loginError.style.display = "block";
        }
        // show rules notice centered inside the form
        showNotice("Password must be at least 6 chars and include upper, lower and number.", "error", "form");
      } else {
        refs.loginPassword.classList.remove("input-invalid");
        refs.loginPassword.removeAttribute("aria-invalid");
        if (refs.loginError) {
          refs.loginError.style.display = "none";
          refs.loginError.textContent = "";
        }
      }
    });
  }

  // Login submit validation
  if (refs.loginForm) {
    refs.loginForm.addEventListener("submit", (e) => {
      const username = refs.loginUsername ? refs.loginUsername.value.trim() : "";
      const password = refs.loginPassword ? refs.loginPassword.value : "";
      const invalidInputs = [];

      // Clear previous inline error styles
      [refs.loginUsername, refs.loginPassword].forEach(i => {
        if (!i) return;
        i.classList.remove("input-invalid");
        i.removeAttribute("aria-invalid");
        i.style.outline = "";
      });
      if (refs.loginError) {
        refs.loginError.style.display = "none";
        refs.loginError.textContent = "";
      }

      if (!username) {
        invalidInputs.push({ el: refs.loginUsername, msg: "Username or email is required." });
      } else if (username.length < 3) {
        invalidInputs.push({ el: refs.loginUsername, msg: "Username must be at least 3 characters." });
      }

      if (!password) {
        invalidInputs.push({ el: refs.loginPassword, msg: "Password is required." });
      } else {
        const rules = checkPasswordRules(password);
        if (!rules.length || !rules.lower || !rules.upper || !rules.number) {
          invalidInputs.push({ el: refs.loginPassword, msg: "Password must be at least 6 characters and include upper, lower and a number." });
        }
      }

      if (invalidInputs.length) {
        e.preventDefault();
        const first = invalidInputs[0];
        if (refs.loginError) {
          refs.loginError.textContent = first.msg;
          refs.loginError.style.display = "block";
        }
        invalidInputs.forEach(item => {
          if (!item.el) return;
          item.el.classList.add("input-invalid");
          item.el.setAttribute("aria-invalid", "true");
          item.el.style.outline = "2px solid rgba(220, 38, 38, 0.9)";
        });

        // show general fix notice globally
        showNotice("Please fix the highlighted fields before logging in.", "error", "global");

        // if the failing rule is password-specific, also show centered-in-form hint
        if (first.el === refs.loginPassword) {
          showNotice("Password is required.", "error", "form");
        }

        if (first.el) first.el.focus();
        return;
      }

      // allow submit -> controller/auth logic will handle authentication
    });
  }

  // Signup password rules UI & match handling
  if (refs.signupPassword) {
    refs.signupPassword.addEventListener("focus", () => {
      if (refs.signupPwHint) {
        refs.signupPwHint.style.display = "block";
        updatePwReqUI(refs.signupPwReqItems, refs.signupPassword.value);
      }
    });
    refs.signupPassword.addEventListener("input", () => {
      updatePwReqUI(refs.signupPwReqItems, refs.signupPassword.value);
      // if confirm already has value, re-check match
      if (refs.signupPasswordConfirm && refs.signupPasswordConfirm.value) {
        const match = refs.signupPassword.value === refs.signupPasswordConfirm.value;
        toggleSignupMatchUI(match);
      }
      clearSignupError();
    });
  }

  if (refs.signupPasswordConfirm) {
    refs.signupPasswordConfirm.addEventListener("input", () => {
      const pw = refs.signupPassword ? refs.signupPassword.value : "";
      const conf = refs.signupPasswordConfirm.value;
      if (!conf) {
        toggleSignupMatchUI(true, true); // hide message when empty
        return;
      }
      toggleSignupMatchUI(pw === conf);
      clearSignupError();
    });

    refs.signupPasswordConfirm.addEventListener("blur", () => {
      const pw = refs.signupPassword ? refs.signupPassword.value : "";
      const conf = refs.signupPasswordConfirm.value;
      if (!conf) {
        showSignupMatchMessage("Please confirm your password.");
        refs.signupPasswordConfirm.classList.add("input-invalid");
        refs.signupPasswordConfirm.setAttribute("aria-invalid", "true");
        return;
      }
      toggleSignupMatchUI(pw === conf);
    });
  }

  function toggleSignupMatchUI(match) {
    if (!refs.signupPwMatch) return;
    if (match) {
      refs.signupPwMatch.style.display = "none";
      refs.signupPasswordConfirm.classList.remove("input-invalid");
      refs.signupPasswordConfirm.removeAttribute("aria-invalid");
    } else {
      refs.signupPwMatch.textContent = "Passwords do not match.";
      refs.signupPwMatch.style.display = "block";
      refs.signupPasswordConfirm.classList.add("input-invalid");
      refs.signupPasswordConfirm.setAttribute("aria-invalid", "true");
    }
  }

  function showSignupMatchMessage(msg) {
    if (!refs.signupPwMatch) return;
    refs.signupPwMatch.textContent = msg;
    refs.signupPwMatch.style.display = "block";
  }

  function clearSignupError() {
    if (!refs.signupError) return;
    refs.signupError.style.display = "none";
    refs.signupError.textContent = "";
  }

  // Final signup submit validation
  if (refs.signupForm) {
    refs.signupForm.addEventListener("submit", (e) => {
      const pw = refs.signupPassword ? refs.signupPassword.value : "";
      const conf = refs.signupPasswordConfirm ? refs.signupPasswordConfirm.value : "";
      const pwRules = checkPasswordRules(pw);

      // basic checks before proceeding
      if (!pw || !conf) {
        e.preventDefault();
        if (!pw) {
          // show required password notice inside the form
          showNotice("Password is required.", "error", "form");
        } else {
          showSignupMatchMessage("Please confirm your password.");
        }
        return;
      }

      if (!pwRules.length || !pwRules.lower || !pwRules.upper || !pwRules.number) {
        e.preventDefault();
        if (refs.signupError) {
          refs.signupError.textContent = "Password must be at least 6 characters and include upper, lower and a number.";
          refs.signupError.style.display = "block";
        }
        // center the password requirements message within the signup form
        showNotice("Password does not meet requirements.", "error", "form");
        return;
      }

      if (pw !== conf) {
        e.preventDefault();
        if (refs.signupError) {
          refs.signupError.textContent = "Passwords do not match.";
          refs.signupError.style.display = "block";
        }
        toggleSignupMatchUI(false);
        refs.signupPasswordConfirm.focus();
        return;
      }

      // allow submit -> controller will handle user creation
      clearSignupError();
      toggleSignupMatchUI(true);
    });
  }

  return refs;
}

export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/";
}

