// src/utils/storage.js


const USERS_KEY = "myapp_users"; // storage key for all users
const CURRENT_KEY = "myapp_currentUser"; // storage key for current session



/* users */
export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function userExists(usernameOrEmail) {
  return getUsers().some(u => u.username === usernameOrEmail || u.email === usernameOrEmail);

  
}

export function findUser(usernameOrEmail, password) {
  return getUsers().find(u =>
    (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
    u.password === password
  ) || null;

  
}



/* session */
export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
}
export function removeCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

// Update user data in users array and current session
export function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
  setCurrentUser(updatedUser);
  // Dispatch event to notify components of user data update
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedUser }));
}
