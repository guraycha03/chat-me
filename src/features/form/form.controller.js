// src/features/form/form.controller.js
import { createElement } from "../../utils/DOM.js";

export function renderForm() {
  const app = document.getElementById("app");
  app.innerHTML = ""; // clear previous UI

  // Wrapper
  const wrapper = createElement("div", { class: "auth-wrapper" });

  // Left image section
  const imageSide = createElement("div", { class: "auth-image" });

  // Right side container
  const container = createElement("div", { class: "container" });

  // Card
  const card = createElement("div", { class: "form-card" });

  // Form
  const form = createElement("form", { id: "postForm" });
  const input = createElement("input", {
    type: "text",
    placeholder: "Write something..."
  });
  const button = createElement("button", {
    type: "submit",
    innerText: "Post"
  });

  form.append(input, button);
  card.appendChild(form);
  container.appendChild(card);

  // Append everything
  wrapper.append(imageSide, container);
  app.appendChild(wrapper);

  // Form submit logic
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift({ id: Date.now(), text });
    localStorage.setItem("posts", JSON.stringify(posts));

    input.value = "";
    window.dispatchEvent(new Event("storageUpdated"));
  });
}
