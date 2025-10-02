import { renderProfile } from "./profile.view.js";

export function initProfile(container = document.getElementById("app")) {
  if (!container) return;
  renderProfile(container);
}

document.addEventListener("DOMContentLoaded", () => initProfile());
