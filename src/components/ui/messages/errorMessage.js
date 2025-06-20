/**
 * Creates a container-level error message component with optional retry button.
 *
 * @param {Object} options
 * @param {string} options.message - Main error message.
 * @param {Function|null} options.onRetry - Optional retry function.
 * @returns {HTMLElement} Error message DOM element.
 */
export function renderErrorMessage({
  message = "An unexpected error occurred.",
  onRetry = null,
} = {}) {
  const container = document.createElement("div");
  container.className = "error-message";

  const icon = document.createElement("div");
  icon.className = "error-icon";
  icon.textContent = "☠️"; //temporary
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
 * @param {Function} onRetry - Retry function to call.
 * @returns {HTMLButtonElement} Retry button.
 */
export function createRetryButton(onRetry) {
  const button = document.createElement("button");
  button.textContent = "Try Again";
  button.className = "retry-button";

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Retrying...";

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
