// src/utils/navigationState.js
const STORAGE_KEY = 'chat-me-current-page';

export let currentActive = localStorage.getItem(STORAGE_KEY) || "home";

export function setCurrentActive(id) {
  currentActive = id;
  localStorage.setItem(STORAGE_KEY, id);
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('activeNavChanged', { detail: { active: id } }));
}
