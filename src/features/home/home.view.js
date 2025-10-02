// src/features/home/home.view.js

import { createSidebar } from "../layout/sidebar.js";

export function renderHome(container) {
  container.innerHTML = `
    <div class="home-wrapper">
      <header class="home-header">
        <h1>My App</h1>
        <div class="burger-menu" id="burger-menu">&#9776;</div>
      </header>

      <main class="home-main">
        <div class="cards-container">
          <div class="card">Card 1</div>
          <div class="card">Card 2</div>
          <div class="card">Card 3</div>
          <div class="card">Card 4</div>
          <div class="card">Card 5</div>
        </div>
      </main>
    </div>
  `;

  createSidebar(container); // add sidebar to this page
}

