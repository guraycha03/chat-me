import "../src/styles/global.css";
import { initAuth } from "./features/auth/auth.controller.js";
import { initApp } from "./app.js"; // ✅ import initApp

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));

  if (currentUser) {
    initApp(app); // ✅ full shell with nav + sidebar
  } else {
    initAuth(app); // show login/signup form
  }
});

// SPA login/logout handlers
window.addEventListener("user:login", () => initApp(app));
window.addEventListener("user:logout", () => initAuth(app));
