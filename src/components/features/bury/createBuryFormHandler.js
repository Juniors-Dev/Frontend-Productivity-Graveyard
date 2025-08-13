export function createBuryFormHandler(
  formSelector,
  handleBurySubmit,
  validateBuryField,
) {
  const form = document.querySelector(formSelector);
  if (!form) return { init: () => {} };

  function init() {
    if (!form) return;

    // Add event listeners for real-time validation
    const fields = [
      "name",
      "description",
      "eulogy",
      "causeOfDeath",
      "startDate",
      "endDate",
    ];
    fields.forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        input.addEventListener("input", () => validateBuryField(field));
        input.addEventListener("blur", () => validateBuryField(field));
      }
    });

    // Special handling for checkboxes and radio buttons
    const typeCheckboxes = form.querySelectorAll('input[name="types"]');
    typeCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => validateBuryField("types"));
    });

    const tombstoneRadios = form.querySelectorAll('input[name="tombstoneId"]');
    tombstoneRadios.forEach((radio) => {
      radio.addEventListener("change", () => validateBuryField("tombstoneId"));
    });

    // Form submission
    form.addEventListener("submit", handleBurySubmit);
  }

  return { init };
}
