import { removeCurrentUser } from "../../utils/storage.js";

export function logout() {
  localStorage.removeItem("myapp_currentUser"); // ✅ correct key
  window.dispatchEvent(new Event("user:logout")); // SPA-style update
}

