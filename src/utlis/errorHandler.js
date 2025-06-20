import { showToast } from "../components/ui/toast.js";
import { renderErrorMessage } from "../components/messages/errorMessage.js";
import { renderValidationError } from "../components/messages/validationMessage.js";
import {
  clearValidationErrors,
  findFieldWrapper,
} from "../components/messages/formHelpers.js";

// ---- MAIN ERROR HANDLER ----
/**
 * Smart error handler that automatically handles any error type based on context
 * @param {*} error - Error to handle (string, Error object, API error, etc.)
 * @param {Object} [context={}] - Error handling context
 * @param {HTMLFormElement} [context.form] - Form element for validation errors
 * @param {HTMLElement} [context.container] - Container to show error message
 * @param {Function} [context.retryFn] - Function to call when user clicks retry
 * @param {string} [context.type="auto"] - How to display error: 'toast', 'auto'
 */
export function handleError(error, context = {}) {
  const { form, container, retryFn, type = "auto" } = context;

  const errorInfo = normalizeError(error);

  // Handle validation errors first
  if (errorInfo.validationErrors && form) {
    showValidationErrors(errorInfo.validationErrors, form);
    return;
  }

  //Handle based on context or type
  if (type === "toast" || (!container && !form)) {
    showErrorToast(errorInfo.message);
  } else if (container) {
    showErrorInContainer(errorInfo, container, retryFn);
  } else {
    showErrorToast(errorInfo.message);
  }
}

// ---- CONVENIENCE FUNCTIONS ----

/**
 * Shows an error message as a toast notification
 * @param {string|Error|Object} error - Error message or error object
 * @param {number} [duration=4000] - How long to show toast in milliseconds
 * @returns {HTMLElement} The created toast element
 */
export function showErrorToast(error, duration = 4000) {
  const message =
    typeof error === "string" ? error : normalizeError(error).message;
  return showToast(message, "error", duration);
}

/**
 * Displays validation errors on form fields - handles both API and client error formats
 * @param {Array|Object} errors - Validation errors in API format [{ field, message }] or client format { field: message }
 * @param {HTMLFormElement} form - Form element to show errors on
 */
export function showValidationErrors(errors, form) {
  if (!form) return;

  clearValidationErrors(form);

  //Convert both formats to consistent array
  const errorArray = Array.isArray(errors)
    ? errors
    : Object.entries(errors).map(([field, message]) => ({ field, message }));

  errorArray.forEach((err) => {
    if (!err.field) return;
    const input = form.querySelector(`[name="${CSS.escape(err.field)}"]`);
    if (input) {
      addFieldError(input, err.message);
    }
  });
}

/**
 * Clears all validation errors from a form
 * @param {HTMLFormElement} form - Form element to clear errors from
 */
export function clearFormErrors(form) {
  if (!form) return;
  clearValidationErrors(form);
}

// ---- INTERNAL FUNCTIONS ----

/**
 * Normalizes any error type into a consistent format with message and retry info
 * @param {*} error - Error to normalize (string, Error object, API error, etc.)
 * @returns {Object} Normalized error with { message, canRetry, validationErrors? }
 */
function normalizeError(error) {
  if (!error) return { message: "Unknown error occurred", canRetry: false };

  if (typeof error === "string") {
    return { message: error, canRetry: false };
  }

  //Already normalized
  if (error.message && typeof error.canRetry === "boolean") {
    return error;
  }

  if (isApiError(error)) {
    return normalizeApiError(error);
  } else {
    return normalizeClientError(error);
  }
}

/**
 * Detects if an error comes from API/backend based on its properties
 * @param {*} error - Error to check
 * @returns {boolean} True if error appears to be from API/backend
 */
function isApiError(error) {
  return !!(
    error?.statusCode ||
    error?.response ||
    error?.status ||
    error?.name === "TypeError" ||
    (error?.errors && Array.isArray(error.errors) && error.errors[0]?.field)
  );
}

/**
 * Normalizes API/backend errors into consistent format based on HTTP status codes
 * @param {Object} error - API error object with statusCode/status and message
 * @returns {Object} Normalized error with appropriate message and retry flag
 */
function normalizeApiError(error) {
  // Network/connection errors
  if (error.name === "TypeError" || !navigator.onLine) {
    return {
      message: "Unable to connect. Check your internet connection.",
      canRetry: true,
    };
  }

  if (error.name === "AbortError") {
    return {
      message: "Request timed out. Please try again.",
      canRetry: true,
    };
  }

  switch (error.statusCode || error.status) {
    case 400:
      return {
        message: error.message || "Invalid request. Please check your input.",
        canRetry: false,
      };
    case 401:
      return {
        message: "Please log in to continue.",
        canRetry: false,
      };
    case 403:
      return {
        message: "You don't have permission for this action.",
        canRetry: false,
      };
    case 404:
      return {
        message: "Resource not found.",
        canRetry: false,
      };
    case 409:
      return {
        message: error.message || "This conflicts with existing data.",
        canRetry: false,
      };
    case 422:
      return {
        message: "Please fix the errors below.",
        canRetry: false,
        validationErrors: error.errors || [],
      };
    case 429:
      return {
        message: "Too many requests. Please wait and try again.",
        canRetry: true,
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        message: "Server error. Please try again later.",
        canRetry: true,
      };
    default:
      return {
        message: error.message || "Something went wrong.",
        canRetry: error.statusCode >= 500,
      };
  }
}

/**
 * Normalizes client-side JavaScript errors into consistent format
 * @param {*} error - Client-side error (Error object or other)
 * @returns {Object} Normalized error with message and canRetry: false
 */
function normalizeClientError(error) {
  if (error instanceof Error) {
    return { message: error.message, canRetry: false };
  }

  return {
    message: error?.message || "An unexpected error occurred",
    canRetry: false,
  };
}

/**
 * Displays error message in a specific container with optional retry button
 * @param {Object} errorInfo - Normalized error object with message and canRetry
 * @param {HTMLElement} container - Container element to show error in
 * @param {Function} [retryFn=null] - Function to call when retry button is clicked
 * @returns {HTMLElement} The created error element
 */
function showErrorInContainer(errorInfo, container, retryFn = null) {
  if (!container) return showErrorToast(errorInfo.message);

  container.innerHTML = "";
  const errorEl = renderErrorMessage({
    message: errorInfo.message,
    onRetry: errorInfo.canRetry ? retryFn : null,
  });
  container.appendChild(errorEl);
  return errorEl;
}

/**
 * Adds validation error styling and message to a specific form field
 * @param {HTMLInputElement} input - Input element to add error to
 * @param {string} message - Error message to display
 */
function addFieldError(input, message) {
  const fieldWrapper = findFieldWrapper(input);
  if (!fieldWrapper) return;

  input.classList.add("field-error");
  input.setAttribute("aria-invalid", "true");

  const errorEl = renderValidationError(input.name, [
    { field: input.name, message },
  ]);

  if (errorEl) {
    input.setAttribute("aria-describedby", `${input.name}-error`);
    fieldWrapper.appendChild(errorEl);
  }
}
