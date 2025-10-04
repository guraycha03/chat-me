import { createElement } from "../../utils/DOM.js";
import { createIcons, icons } from "lucide";

/**
 * Creates and appends a reusable back button.
 * @param {HTMLElement} container - The parent element to append the button to.
 * @param {string} [text='Back'] - The text to display on the button.
 * @param {Function} onClick - The function to call when the button is clicked.
 */
export function createBackButton(container, text = 'Back', onClick) {
  // Clear any existing back button
  removeBackButton(container);

  const buttonWrapper = createElement('div', { className: 'back-button-wrapper' });
  const button = createElement('button', { className: 'back-button' });
  button.innerHTML = `<i data-lucide="arrow-left"></i> <span>${text}</span>`;

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  buttonWrapper.appendChild(button);
  container.appendChild(buttonWrapper);
  createIcons({ icons, attrs: { 'stroke-width': 2.5 } });
}

/**
 * Removes the back button from its container.
 * @param {HTMLElement} container 
 */
export function removeBackButton(container) {
  const existingButton = container.querySelector('.back-button-wrapper');
  if (existingButton) {
    existingButton.remove();
  }
}