/**
 * Removes all validation error messages and styling from a form
 * @param {HTMLFormElement} form - The form element to clear errors from
 */
export function clearValidationErrors(form) {
  if (!form) return;

  const errorMessages = form.querySelectorAll(".field-validation-error");
  errorMessages.forEach((el) => el.remove());

  const errorInputs = form.querySelectorAll(".field-error");
  errorInputs.forEach((input) => {
    input.classList.remove("field-error");
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  });
}

/**
 * Finds the best container element for displaying validation error messages
 * @param {HTMLInputElement} input - The input element to find a wrapper for
 * @returns {HTMLElement} The wrapper element or input's parent if no wrapper found
 */
export function findFieldWrapper(input) {
  const selectors = [
    ".form-group",
    ".field-wrapper",
    ".input-group",
    ".form-field",
    ".input-wrapper",
  ];

  for (const selector of selectors) {
    const wrapper = input.closest(selector);
    if (wrapper) return wrapper;
  }

  return input.parentElement;
}
