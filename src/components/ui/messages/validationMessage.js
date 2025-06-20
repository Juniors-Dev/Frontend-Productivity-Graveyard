/**
 * Renders an inline validation error for a specific form field.
 *
 * @param {string} field - Field name.
 * @param {Array} errors - Backend validation errors array.
 * @returns {HTMLElement|null} Validation error element or null if no error for field.
 */
export function renderValidationError(field, errors) {
  const fieldErrors = errors.filter((e) => e.field === field);
  if (!fieldErrors.length) return null;

  const el = document.createElement("p");
  el.className = "field-validation-error";
  el.textContent = fieldErrors[0].message;
  return el;
}
