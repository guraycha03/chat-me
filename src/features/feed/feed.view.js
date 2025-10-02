import { createElement } from "../../utils/DOM.js";

export function renderFeed() {
  const app = document.getElementById("app");
  const feed = createElement("div", { id: "feed" });
  app.appendChild(feed);

  function updateFeed() {
    feed.innerHTML = "";
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.forEach(post => {
      const postEl = createElement("div", { className: "post", innerText: post.text });
      feed.appendChild(postEl);
    });
  }

  updateFeed();
  window.addEventListener("storageUpdated", updateFeed);
}
