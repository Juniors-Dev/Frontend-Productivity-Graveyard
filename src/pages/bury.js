import { createFormHandler } from "../components/forms/formHandler.js";

// Set max date to today for both date inputs
const today = new Date().toISOString().split("T")[0];
document.getElementById("startDate").max = today;
document.getElementById("endDate").max = today;

// Character counting for textareas
function setupCharacterCount(textareaId, countId, maxLength) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(countId);

  textarea.addEventListener("input", () => {
    const currentLength = textarea.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;

    if (currentLength >= maxLength * 0.9) {
      counter.style.color = "#ff6b6b";
    } else {
      counter.style.color = "#666";
    }
  });
}

// Initialize character counters
setupCharacterCount("description", "description-count", 500);
setupCharacterCount("eulogy", "eulogy-count", 300);

// Date validation - end date must be after start date
function validateDates() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const endDateInput = document.getElementById("endDate");

  if (startDate && endDate) {
    if (new Date(endDate) <= new Date(startDate)) {
      endDateInput.setCustomValidity(
        "Project end date must be after start date",
      );
    } else {
      endDateInput.setCustomValidity("");
    }
  }
}

document.getElementById("startDate").addEventListener("change", validateDates);
document.getElementById("endDate").addEventListener("change", validateDates);

// Initialize form handler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  createFormHandler("#bury-project-form").init();
});
