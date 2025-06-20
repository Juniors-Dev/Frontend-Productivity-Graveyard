import { createIcon } from "../ui/icon.js";

/**
 * Renders validation error messages for a specific form field
 * @param {string} field - The field name to show errors for
 * @param {Array} errors - Array of error objects with field and message properties
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.showIcon=true] - Whether to show error icons
 * @param {string} [options.className="field-validation-error"] - CSS class for the container
 * @returns {HTMLElement|null} Error container element or null if no errors found
 */
export function renderValidationError(field, errors, options = {}) {
  const { showIcon = true, className = "field-validation-error" } = options;

  const fieldErrors = Array.isArray(errors)
    ? errors.filter((e) => e.field === field)
    : [];

  if (!fieldErrors.length) return null;

  const container = document.createElement("div");
  container.className = className;
  container.setAttribute("role", "alert");
  container.setAttribute("aria-live", "polite");
  container.id = `${field}-error`;

  fieldErrors.forEach((error) => {
    const errorItem = document.createElement("div");
    errorItem.className = "validation-error-item";

    if (showIcon) {
      const icon = createIcon("error", "validation-error-icon");
      errorItem.appendChild(icon);
    }

    const messageEl = document.createElement("span");
    messageEl.className = "validation-error-text";
    messageEl.textContent = error.message;
    errorItem.appendChild(messageEl);

    container.appendChild(errorItem);
  });

  return container;
}
