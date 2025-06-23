import { createIcon } from "../ui/icon.js";

/**
 * Creates an error message component with optional retry functionality
 * @param {Object} [options={}] - Error message configuration
 * @param {string} [options.message="An unexpected error occurred."] - Error message text to display
 * @param {string} [options.type="error"] - Error type for styling and icon selection
 * @param {Function} [options.onRetry=null] - Optional retry callback function
 * @returns {HTMLElement} Error message container element
 */
export function renderErrorMessage({
  message = "An unexpected error occurred.",
  type = "error",
  onRetry = null,
} = {}) {
  const container = document.createElement("div");
  container.className = `error-message error-type-${type}`;
  container.setAttribute("role", "alert");
  container.setAttribute("aria-live", "polite");

  const icon = createIcon(type, "error-icon");
  container.appendChild(icon);

  const messageElement = document.createElement("p");
  messageElement.className = "error-main-message";
  messageElement.textContent = message;
  container.appendChild(messageElement);

  if (onRetry) {
    container.appendChild(createRetryButton(onRetry));
  }

  return container;
}

/**
 * Creates a retry button with built-in async-safe logic.
 * Disables itself while retry function is in progress.
 *
 * @param {Function} onRetry - Retry function to call
 * @returns {HTMLButtonElement} Retry button element
 */
export function createRetryButton(onRetry) {
  const button = document.createElement("button");
  button.textContent = "Try Again";
  button.className = "retry-button";

  button.addEventListener("click", async () => {
    button.disabled = true;

    try {
      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      button.disabled = false;
      button.textContent = "Try Again";
    }
  });

  return button;
}
