import { requireAuth } from "../components/forms/authService.js";
import api from "../utils/apiClient.js";
import { baseUrl } from "../utils/constants.js";
import { createBuryFormHandler } from "../components/features/bury/createBuryFormHandler.js";
import { setupCategoryDropdown } from "../components/features/bury/dropDown.js";
import { setupTombstoneCarousel } from "../components/features/bury/carousel.js";
import {
  validateBuryField,
  validateDates,
} from "../components/forms/formUtils.js";
import { handleBurySubmit } from "../components/forms/buryFormHandler.js";

// Load project types and tombstones dynamically
async function loadFormOptions() {
  try {
    const [typesRes, tombstonesRes] = await Promise.all([
      api.getAllTypes(),
      api.getAllTombstones(),
    ]);

    console.log(typesRes);
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

async function initBuryPage() {
  await loadFormOptions();
  setupCategoryDropdown();
  setupTombstoneCarousel();
  createBuryFormHandler(
    "#bury-project-form",
    handleBurySubmit,
    validateBuryField,
    api,
  ).init();
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
document.getElementById("startDate").addEventListener("change", validateDates);
document.getElementById("endDate").addEventListener("change", validateDates);
