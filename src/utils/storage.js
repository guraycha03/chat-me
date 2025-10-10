// src/utils/storage.js


const USERS_KEY = "myapp_users"; // storage key for all users
const CURRENT_KEY = "myapp_currentUser"; // storage key for current session



/* users */
export function getUsers() {
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const needsUpdate = users.some(u => !u.likedPosts || !u.friends || !u.pendingRequests);
  if (needsUpdate) {
    users = users.map(u => ({
      ...u,
      likedPosts: (u.likedPosts || []).map(id => String(id)),
      friends: u.friends || [],
      pendingRequests: u.pendingRequests || []
    }));
    saveUsers(users);
  }
  return users;
}
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function addUser(user) {
  const users = getUsers();
  const initializedUser = {
    ...user,
    likedPosts: user.likedPosts || [],
    friends: user.friends || [],
    pendingRequests: user.pendingRequests || []
  };
  users.push(initializedUser);
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
  const fullUser = {
    ...user,
    likedPosts: (user.likedPosts || []).map(id => String(id)),
    friends: user.friends || [],
    pendingRequests: user.pendingRequests || []
  };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(fullUser));
}
export function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
  if (user && (!user.likedPosts || !user.friends || !user.pendingRequests)) {
    const fullUser = {
      ...user,
      likedPosts: (user.likedPosts || []).map(id => String(id)),
      friends: user.friends || [],
      pendingRequests: user.pendingRequests || []
    };
    setCurrentUser(fullUser);
    return fullUser;
  }
  return user;
}
export function removeCurrentUser() {
  localStorage.removeItem(CURRENT_KEY);
}

// Update user data in users array and current session
export function updateUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.username === updatedUser.username);
  if (index !== -1) {
    const fullUpdated = {
      ...updatedUser,
      likedPosts: (updatedUser.likedPosts || []).map(id => String(id)),
      friends: updatedUser.friends || [],
      pendingRequests: updatedUser.pendingRequests || []
    };
    users[index] = fullUpdated;
    saveUsers(users);
    setCurrentUser(fullUpdated);
    // Dispatch event to notify components of user data update
    window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: fullUpdated }));
  }
}
