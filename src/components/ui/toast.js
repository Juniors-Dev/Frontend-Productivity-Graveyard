import { createIcon } from "./icon.js";

/**
 * Shows a toast notification with automatic removal and hover pause functionality
 * @param {string} message - The message to display in the toast
 * @param {string} [type="info"] - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} [duration=3000] - How long to show toast in milliseconds
 * @returns {HTMLElement} The created toast element
 */
export function showToast(message, type = "info", duration = 3000) {
  const container = getToastContainer();
  const toast = renderToast({ message, type });

  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  const timeout = setTimeout(() => removeToast(toast), duration);

  // pause on hover
  toast.addEventListener("mouseenter", () => clearTimeout(timeout));
  toast.addEventListener("mouseleave", () => {
    setTimeout(() => removeToast(toast), 1000);
  });

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-show"));

  return toast;
}

/**
 * Creates a toast DOM element with specified configuration
 * @param {Object} [options={}] - Toast configuration
 * @param {string} options.message - Toast message text
 * @param {string} [options.type="info"] - Toast type: 'success', 'error', 'warning', 'info'
 * @param {boolean} [options.showIcon=true] - Whether to show an icon
 * @param {string} [options.className=""] - Additional CSS class
 * @returns {HTMLElement} Toast DOM element
 */
export function renderToast({
  message,
  type = "info",
  showIcon = true,
  className = "",
} = {}) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type} ${className}`.trim();
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  if (showIcon) {
    const icon = createIcon(type, "toast-icon");
    toast.appendChild(icon);
  }

  const messageEl = document.createElement("span");
  messageEl.className = "toast-message";
  messageEl.textContent = message;
  toast.appendChild(messageEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "x";
  toast.appendChild(closeBtn);

  return toast;
}

/**
 * Gets or creates the toast container element in the DOM
 * @returns {HTMLElement} Toast container element
 */
export function getToastContainer() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Removes a toast with fade-out animation
 * @param {HTMLElement} toast - Toast element to remove
 */
export function removeToast(toast) {
  if (!toast) return;

  toast.classList.add("toast-hide");
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}
