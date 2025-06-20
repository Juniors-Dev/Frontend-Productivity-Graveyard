import { createIcon } from "../ui/icon.js";

/**
 * Creates a success message element with optional auto-hide functionality
 * @param {Object} [options={}] - Success message configuration
 * @param {string} [options.message="Success!"] - Success message text
 * @param {string} [options.className="success-message"] - CSS class for the container
 * @param {boolean} [options.autoHide=true] - Whether to automatically hide the message
 * @param {number} [options.hideDelay=3000] - Delay before auto-hiding in milliseconds
 * @param {boolean} [options.showIcon=true] - Whether to show a success icon
 * @returns {HTMLElement} Success message container element
 */
export function renderSuccessMessage({
  message = "Success!",
  className = "success-message",
  autoHide = true,
  hideDelay = 3000,
  showIcon = true,
} = {}) {
  const container = document.createElement("div");
  container.className = className;
  container.setAttribute("role", "status");
  container.setAttribute("aria-live", "polite");

  if (showIcon) {
    const icon = createIcon("success", "success-icon");
    container.appendChild(icon);
  }

  const messageElement = document.createElement("p");
  messageElement.className = "success-text";
  messageElement.textContent = message;
  container.appendChild(messageElement);

  if (autoHide) {
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, hideDelay);
  }

  return container;
}

/**
 * Creates an inline success message for forms with fade-out animation
 * @param {string} message - Success message text to display
 * @param {HTMLElement} targetElement - Element to append the success message to
 * @returns {HTMLElement} The created inline success element
 */
export function renderInlineSuccess(message, targetElement) {
  const existing = targetElement.querySelector(".inline-success");
  if (existing) existing.remove();

  const successEl = document.createElement("div");
  successEl.className = "inline-success";

  const icon = createIcon("success", "success-icon");
  const messageEl = document.createElement("span");
  messageEl.textContent = message;

  successEl.appendChild(icon);
  successEl.appendChild(messageEl);

  targetElement.appendChild(successEl);

  setTimeout(() => {
    if (successEl.parentNode) {
      successEl.style.opacity = "0";
      setTimeout(() => successEl.remove(), 300);
    }
  }, 3000);

  return successEl;
}
