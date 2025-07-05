import { requireAuth } from "../components/forms/authService.js";
import api from "../utlis/apiClient.js";
import { baseUrl } from "../utlis/constants.js";

// Load project types and tombstones dynamically
async function loadFormOptions() {
  try {
    const [typesRes, tombstonesRes] = await Promise.all([
      api.getAllTypes(),
      api.getAllTombstones(),
    ]);

    // Load project types into dropdown menue
    if (typesRes.success && typesRes.data) {
      const dropdownMenu = document.getElementById("categoryDropdownMenu");
      if (dropdownMenu) {
        dropdownMenu.innerHTML = "";
        typesRes.data.forEach((type) => {
          const label = document.createElement("label");
          label.className = "dropdown-checkbox-label";
          label.innerHTML = `
            <input type="checkbox" value="${type.id}" name="types" class="dropdown-checkbox" />
            ${type.name}
          `;
          dropdownMenu.appendChild(label);
        });
      }
    }

    // Load tombstones into carousel
    if (tombstonesRes.success && tombstonesRes.data) {
      const carousel = document.getElementById("tombstoneCarousel");
      if (carousel) {
        carousel.innerHTML = "";
        tombstonesRes.data.forEach((tombstone) => {
          const div = document.createElement("div");
          div.className = "tombstone-option custom-radio";
          div.innerHTML = `
            <input type="radio" id="tombstone-${tombstone.id}" name="tombstoneId" value="${tombstone.id}" required />
            <label for="tombstone-${tombstone.id}" class="tombstone-label">
              <img src="${baseUrl}${tombstone.imageUrl}" alt="${tombstone.name}" class="tombstone-image" />
              <span class="tombstone-name">${tombstone.name}</span>
            </label>
          `;
          carousel.appendChild(div);
        });
      }
    }
  } catch (error) {
    console.error("Failed to load form options:", error);
  }
}

// Dropdown open/close and selection display logic
function setupCategoryDropdown() {
  const dropdown = document.getElementById("categoryDropdown");
  const toggle = document.getElementById("categoryDropdownToggle");
  const menu = document.getElementById("categoryDropdownMenu");

  // Open/close dropdown
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  // Update button text with selected categories
  menu.addEventListener("change", () => {
    const checked = menu.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      toggle.textContent = "Select Categories";
    } else {
      const names = Array.from(checked).map((cb) =>
        cb.parentElement.textContent.trim(),
      );
      toggle.textContent = names.join(", ");
    }
  });
}

// Carousel scroll and selection logic
function setupTombstoneCarousel() {
  const carousel = document.getElementById("tombstoneCarousel");
  const leftBtn = document.getElementById("carouselLeftBtn");
  const rightBtn = document.getElementById("carouselRightBtn");

  // Scroll amount per click
  const scrollAmount = 180;

  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  // Highlight selected icon
  carousel.addEventListener("change", (e) => {
    if (e.target.name === "tombstoneId") {
      Array.from(carousel.children).forEach((child) =>
        child.classList.remove("selected"),
      );
      const selected = e.target.closest(".tombstone-option");
      if (selected) selected.classList.add("selected");
    }
  });

  // On page load, highlight the pre-selected icon if any
  setTimeout(() => {
    const checked = carousel.querySelector('input[type="radio"]:checked');
    if (checked) {
      const selected = checked.closest(".tombstone-option");
      if (selected) selected.classList.add("selected");
    }
  }, 100);
}

async function initBuryPage() {
  await loadFormOptions();
  setupCategoryDropdown();
  setupTombstoneCarousel();
  createBuryFormHandler("#bury-project-form").init();
}
requireAuth(initBuryPage);

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

// Bury form specific validation
function validateBuryField(fieldName) {
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

function showFieldError(input, errorElem, result) {
  if (!input || !errorElem) return;

  if (result.isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    errorElem.textContent = "";
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    errorElem.textContent = result.message;
  }
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

function showLoading() {
  const submitButton = document.querySelector(".bury-button");
  if (submitButton) {
    submitButton.textContent = "Burying Project...";
    submitButton.disabled = true;
    submitButton.classList.add("loading", "active");
  }
}

function hideLoading() {
  const submitButton = document.querySelector(".bury-button");
  if (submitButton) {
    submitButton.textContent = "Bury My Project";
    submitButton.disabled = false;
    submitButton.classList.remove("loading", "active");
  }
}

function showMessage(message, isError = false) {
  const form = document.querySelector("#bury-project-form");
  let messageElement = form.querySelector(".form-message");

  if (!messageElement) {
    messageElement = document.createElement("div");
    messageElement.className = "form-message";
    form.appendChild(messageElement);
  }

  messageElement.className = `form-message ${isError ? "error" : "success"}`;
  messageElement.textContent = message;

  if (isError) {
    messageElement.style.backgroundColor = "rgba(255, 71, 87, 0.1)";
    messageElement.style.color = "var(--color-error)";
    messageElement.style.border = "1px solid var(--color-error)";
  } else {
    messageElement.style.backgroundColor = "rgba(40, 167, 69, 0.1)";
    messageElement.style.color = "#28a745";
    messageElement.style.border = "1px solid #28a745";
  }

  setTimeout(
    () => {
      messageElement.style.opacity = "0";
      messageElement.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        messageElement.remove();
      }, 500);
    },
    isError ? 5000 : 3000,
  );
}

async function handleBurySubmit(event) {
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

function createBuryFormHandler(formSelector) {
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
