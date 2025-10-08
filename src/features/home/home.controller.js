// src/features/home/home.controller.js
import { renderHome } from "./home.view.js";
import "../layout/home.css";

export function initHome(container) {
  renderHome(container);
}
