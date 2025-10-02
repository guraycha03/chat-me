import "../src/styles/global.css";
import { initAuth } from "./features/auth/auth.controller.js";
import { initHome } from "./features/home/home.controller.js";

const app = document.getElementById("app");

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const currentUser = JSON.parse(localStorage.getItem("myapp_currentUser"));

  if (currentUser) {
    initHome(app); // show home page
  } else {
    initAuth(app); // show login/signup form
  }
});


// Handle login/logout SPA-style
window.addEventListener("user:login", () => initHome(app));
window.addEventListener("user:logout", () => initAuth(app));
