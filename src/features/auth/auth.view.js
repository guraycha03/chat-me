// src/features/auth/auth.view.js


import { addUser, userExists, findUser, setCurrentUser } from "../../utils/storage.js";

export function renderAuth(container) {
  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-image" aria-hidden="true"></div>

      <div class="container" id="auth-container">
        <div class="form-card">

          <!-- Login -->
          <form id="login-form" class="auth-form">
            <h2>Login</h2>
            <div id="login-error" class="error" style="display:none;"></div>
            <div class="form-group">
              <label for="login-username">Username or Email</label>
              <input type="text" id="login-username" name="username" required minlength="3" placeholder="Enter your username or email" />
              <label for="login-password">Password</label>
              <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

            <div class="password-wrapper">
            <input type="password" id="login-password" placeholder="Enter password" />
            <img src="/assets/icons/visible.png" class="toggle-password" data-target="login-password" />
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
          <form id="signup-form" class="auth-form" style="display:none;">
            <h2>Sign Up</h2>
            <div id="signup-error" class="error" style="display:none;"></div>
            <div class="form-group">
              <label for="signup-username">Username</label>
              <input type="text" id="signup-username" name="username" required minlength="3" placeholder="Choose a username" />
              <label for="signup-email">Email</label>
              <input type="email" id="signup-email" name="email" required placeholder="Your email address" />
              
              <label for="signup-password">Password</label>    
                <div class="password-wrapper">
                <input type="password" id="signup-password" name="password" required minlength="6" placeholder="Create a password" />
                <img src="/assets/icons/visible.png" class="toggle-password" data-target="signup-password" />
                </div>

                <label for="signup-password-confirm">Confirm Password</label>
                <div class="password-wrapper">
                <input type="password" id="signup-password-confirm" name="password-confirm" required placeholder="Confirm your password" />
                <img src="/assets/icons/visible.png" class="toggle-password" data-target="signup-password-confirm" />
                </div>



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
    showSignup: container.querySelector("#show-signup"),
    showLogin: container.querySelector("#show-login"),
    loginUsername: container.querySelector("#login-username"),
    loginPassword: container.querySelector("#login-password"),
    signupUsername: container.querySelector("#signup-username"),
    signupEmail: container.querySelector("#signup-email"),
    signupPassword: container.querySelector("#signup-password"),
    signupPasswordConfirm: container.querySelector("#signup-password-confirm"),
    toggleButtons: container.querySelectorAll(".toggle-password")
  };

    refs.toggleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      btn.src = "/assets/icons/visibility_off.png";
    } else {
      input.type = "password";
      btn.src = "/assets/icons/visible.png";
    }
  });
});

  // Switch forms
  refs.showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    refs.loginForm.style.display = "none";
    refs.signupForm.style.display = "block";
    hideNotice();
  });

  refs.showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    refs.signupForm.style.display = "none";
    refs.loginForm.style.display = "block";
    hideNotice();
  });

  function showNotice(msg, type = "error") {
    refs.notice.textContent = msg;
    refs.notice.className = `notice ${type} show`;
    setTimeout(() => {
      refs.notice.className = `notice ${type}`;
    }, 3000);
  }

  function hideNotice() {
    refs.notice.className = "notice";
  }

  return refs;
}

export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/";
}
