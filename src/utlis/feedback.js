import { renderErrorMessage } from "../components/ui/error/ErrorMessage.js";
import { renderValidationError } from "../components/ui/messages/validationMessage.js";
import { renderSuccessMessage } from "../components/ui/messages/successMessage.js";

/**
 * Normalizes API errors into a consistent format for the frontend.
 * Extracts user-friendly messages and validation errors, while hiding internal system details.
 * Called by showApiError() before rendering.
 *
 * @param {Object} error - Error object thrown by ApiClient or fetch.
 * @returns {{ message: string, errors: Array, canRetry?: boolean }}
 *          Normalized error object for frontend UI components.
 */

export function handleApiError(error) {
  if (!error) return { message: "Unknown error", errors: [] };

  const result = {
    message: "An unexpected error occurred",
    errors: [],
    canRetry: false,
  };

  if (error.errors) {
    result.errors = error.errors;
  }

  switch (error.statusCode) {
    case 400:
      result.message = error.message || "Validation failed";
      break;
    case 401:
      result.message = "Please log in to continue";
      break;
    case 403:
      result.message = "You do not have permission to perform this action";
      break;
    case 404:
      result.message = "The resource you requested could not be found";
      break;
    default:
      if (error.statusCode >= 500) {
        result.message =
          "Something went wrong on our server. Please try again later.";
        result.canRetry = true;
      }
      break;
  }
  
  if (
    error.statusCode >= 500 ||
    !error.statusCode ||
    error.name === "TypeError"
  ) {
    result.canRetry = true;
  }

  return result;
}

/**
 * Renders API error messages into a container element.
 * Automatically attaches retry button if retryFunction provided and error is retryable.
 *
 * @param {Object} error - The error object thrown from API call.
 * @param {HTMLElement} container - The container DOM element where error should render.
 * @param {Function|null} retryFunction - Optional retry callback function.
 */
export function showApiError(error, container, retryFunction = null) {
  const errorInfo = handleApiError(error);

  container.innerHTML = "";

  const errorEl = renderErrorMessage({
    message: errorInfo.message,
    onRetry: errorInfo.canRetry ? retryFunction : null,
  });
  container.appendChild(errorEl);
}

/**
 * Applies backend validation errors inline next to form fields.
 *
 * PURPOSE:
 * Renders server-side (backend schema) validation errors that
 * client-side validation may have missed or been bypassed. Backend validation
 * is authoritative — this ensures frontend always reflects final API validation.
 *
 * WHEN TO USE:
 * Call this when API returns 400 validation errors (error.statusCode === 400)
 *
 * @param {HTMLFormElement} form - The form element containing fields.
 * @param {Array} errors - Array of backend validation errors ({ field, message } objects).
 */
export function showFieldValidationErrors(form, errors) {
  if (!form || !errors || errors.length === 0) return;

  errors.forEach((err) => {
    if (!err.field) return;

    const input = form.querySelector(`[name="${CSS.escape(err.field)}"]`);
    if (!input) return;

    const fieldWrapper =
      input.closest(".form-group, .field-wrapper, .input-group") ||
      input.parentElement;

    if (!fieldWrapper) return;

    const existingError = fieldWrapper.querySelector(".field-validation-error");
    if (existingError) existingError.remove();

    const errorElement = renderValidationError(err.field, errors);
    fieldWrapper.appendChild(errorElement);
  });
}

/**
 * Simple success helper that uses the appropriate success component.
 *
 * @param {string} message - Success message
 * @param {HTMLElement} container - Where to show the success
 * @param {boolean} [autoHide=true] - Whether to auto-hide
 * @returns {void}
 */

export function showSuccess(message, container, autoHide = true) {
  container.innerHTML = "";
  const successEl = renderSuccessMessage({
    message,
    autoHide,
    hideDelay: 3000,
  });
  container.appendChild(successEl);
}
