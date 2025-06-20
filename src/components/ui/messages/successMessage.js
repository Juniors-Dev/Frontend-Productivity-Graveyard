/**
 * Renders a success message with optional auto-hide.
 * For form submissions, save confirmations, etc.
 *
 * Can be used directly for standalone success rendering.
 * Alternatively, use showSuccess() from utils/messages.js for convenience.
 *
 * @param {Object} options
 * @param {string} options.message - Message text.
 * @param {boolean} [options.autoHide=false] - Whether to auto-hide after delay.
 * @param {number} [options.hideDelay=3000] - Delay before auto-hiding.
 * @returns {HTMLElement} Success message DOM element.
 */
export function renderSuccessMessage({
  message = "Success!",
  className = "success-message",
  autoHide = false,
  hideDelay = 3000,
} = {}) {
  const container = document.createElement("div");
  container.className = className;

  const messageElement = document.createElement("p");
  messageElement.className = "success-text";
  messageElement.textContent = message;

  container.appendChild(messageElement);

  if (autoHide) {
    setTimeout(() => {
      container.style.opacity = "0";
      container.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }, 300);
    }, hideDelay);
  }

  return container;
}
