import {
  showMessage,
  showLoading,
  hideLoading,
  showFieldError,
} from "./formUtils";

export async function handleBurySubmit(api) {
  event.preventDefault();

  if (!validateBuryForm()) {
    const firstError = document.querySelector(".is-invalid");
    if (firstError) firstError.focus();
    return;
  }

  showLoading();

  try {
    const form = event.target;
    const formData = new FormData(form);

    // Collect project types
    const types = Array.from(
      form.querySelectorAll('input[name="types"]:checked'),
    ).map((cb) => parseInt(cb.value));

    const projectData = {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      eulogy: formData.get("eulogy").trim(),
      causeOfDeath: formData.get("causeOfDeath").trim(),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      types: types,
      tombstoneId: parseInt(formData.get("tombstoneId")),
      status: formData.get("status"),
    };

    const result = await api.createProject(projectData);

    if (!result.success) {
      throw new Error(result.message || "Failed to bury project");
    }

    showMessage(
      "Project buried successfully! Redirecting to graveyard...",
      false,
    );

    // Reset form
    form.reset();
    document.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });

    // Reset character counters
    document.getElementById("description-count").textContent = "0/500";
    document.getElementById("eulogy-count").textContent = "0/300";

    // Redirect to graveyard after success
    setTimeout(() => {
      window.location.href = "/graveyard.html";
    }, 2000);
  } catch (error) {
    console.error("Bury form submission error:", error);

    let errorMessage = "Failed to bury project. Please try again.";
    if (error.message) {
      errorMessage = error.message;
    }

    showMessage(errorMessage, true);
  } finally {
    hideLoading();
  }
}

export function createBuryFormHandler(formSelector) {
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

export function validateBuryField(fieldName) {
  const form = document.querySelector("#bury-project-form");
  const input = form.querySelector(`[name="${fieldName}"]`);
  const errorElem = form.querySelector(`#${fieldName}-error`);

  if (!input || !errorElem) return { isValid: true, message: "" };

  let result = { isValid: true, message: "" };

  switch (fieldName) {
    case "name":
      if (!input.value.trim()) {
        result = { isValid: false, message: "Project name is required" };
      } else if (input.value.trim().length < 2) {
        result = {
          isValid: false,
          message: "Project name must be at least 2 characters",
        };
      }
      break;
    case "description":
      if (!input.value.trim()) {
        result = { isValid: false, message: "Project description is required" };
      } else if (input.value.trim().length < 10) {
        result = {
          isValid: false,
          message: "Description must be at least 10 characters",
        };
      }
      break;
    case "eulogy":
      if (!input.value.trim()) {
        result = { isValid: false, message: "Eulogy is required" };
      } else if (input.value.trim().length < 10) {
        result = {
          isValid: false,
          message: "Eulogy must be at least 10 characters",
        };
      }
      break;
    case "causeOfDeath":
      if (!input.value.trim()) {
        result = { isValid: false, message: "Cause of death is required" };
      }
      break;
    case "startDate":
      if (!input.value) {
        result = { isValid: false, message: "Start date is required" };
      }
      break;
    case "endDate":
      if (!input.value) {
        result = { isValid: false, message: "End date is required" };
      }
      break;
    case "types": {
      const checkedTypes = form.querySelectorAll('input[name="types"]:checked');
      if (checkedTypes.length === 0) {
        result = {
          isValid: false,
          message: "Please select at least one project category for filtering",
        };
      }
      break;
    }
    case "tombstoneId":
      if (!input.value) {
        result = { isValid: false, message: "Please select a card icon" };
      }
      break;
  }

  showFieldError(input, errorElem, result);
  return result;
}

function validateBuryForm() {
  const fields = [
    "name",
    "description",
    "eulogy",
    "causeOfDeath",
    "startDate",
    "endDate",
    "types",
    "tombstoneId",
  ];
  return fields.every((field) => validateBuryField(field).isValid);
}
