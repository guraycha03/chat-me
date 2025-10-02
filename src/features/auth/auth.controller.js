// src/features/auth/auth.controller.js
import { renderAuth } from "./auth.view.js";
import {
  getUsers,
  addUser,
  userExists,
  findUser,
  setCurrentUser,
  getCurrentUser
} from "../../utils/storage.js";


export function initAuth(container = document.getElementById("app")) {
  if (!container) {
    console.error("Auth container not found!");
    return;
  }

  const current = getCurrentUser();
  if (current) {
    window.location.href = "/";
    return;
  }

  // Render the form
  const els = renderAuth(container);

  // Toggle forms
  els.showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    els.loginForm.style.display = "none";
    els.signupForm.style.display = "block";
  });

  els.showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    els.signupForm.style.display = "none";
    els.loginForm.style.display = "block";
  });

  // Signup and login listeners here...


  // Signup
  els.signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    els.signupError.style.display = "none";

    const username = els.signupUsername.value.trim();
    const email = els.signupEmail.value.trim();
    const password = els.signupPassword.value;
    const confirm = els.signupPasswordConfirm.value;

    if (!username || !email || !password) {
      els.signupError.innerText = "Please fill in all fields.";
      els.signupError.style.display = "block";
      return;
    }
    if (password !== confirm) {
      els.signupError.innerText = "Passwords do not match.";
      els.signupError.style.display = "block";
      return;
    }
    if (userExists(username) || getUsers().some(u => u.email === email)) {
      els.signupError.innerText = "Username or email already exists.";
      els.signupError.style.display = "block";
      return;
    }

    const newUser = { username, email, password };
    addUser(newUser);
    setCurrentUser(newUser);

    // Redirect to profile page
    window.location.href = "/";
  });

  // Login
    els.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    els.loginError.style.display = "none";

    const username = els.loginUsername.value.trim();
    const password = els.loginPassword.value;

    if (!username || !password) {
        els.loginError.innerText = "Please enter username/email and password.";
        els.loginError.style.display = "block";
        return;
    }

    const user = findUser(username, password);
    if (!user) {
        els.loginError.innerText = "Invalid username or password.";
        els.loginError.style.display = "block";
        return;
    }

    setCurrentUser(user); // ✅ stores as "myapp_currentUser"

    // Redirect to home page
    window.location.href = "/"; // ✅ ensure "/" loads home
    });

}
