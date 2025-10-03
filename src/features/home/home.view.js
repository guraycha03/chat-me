// src/features/home/home.view.js

export function renderHome(container) {
  container.innerHTML = `
    <div class="home-wrapper">
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
}
