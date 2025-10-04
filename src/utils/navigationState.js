// src/utils/navigationState.js
const STORAGE_KEY = 'chat-me-current-page';

export let currentActive = localStorage.getItem(STORAGE_KEY) || "home";

export function setCurrentActive(id) {
  currentActive = id;
  localStorage.setItem(STORAGE_KEY, id);
  // Dispatch custom event to notify other components
  window.dispatchEvent(new CustomEvent('activeNavChanged', { detail: { active: id } }));
}

export function navigate(page, params = {}) {
  const state = { page, ...params };
  const hash = `#${page}${params.userId ? `/${params.userId}` : ''}`;
  history.pushState(state, '', hash);
  if (['home', 'people', 'messages', 'notifications'].includes(page)) {
    setCurrentActive(page);
  }
  // Dispatch event for rendering
  window.dispatchEvent(new CustomEvent('navigate', { detail: state }));
}
