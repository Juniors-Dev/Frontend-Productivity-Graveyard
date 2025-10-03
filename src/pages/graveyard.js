import {
  setPageState,
  setupGraveyardForms,
  fetchAndRenderProjects,
} from "../components/features/graveyard/index.js";
import { setupCategoryDropdown } from "../components/features/bury/dropDown.js";

fetchAndRenderProjects();
setupGraveyardForms();
setupCategoryDropdown();

/* Form Handler */
const filterForm = document.getElementById("project-filters");
const searchForm = document.getElementById("search-form");

async function formHandler(e) {
  e.preventDefault();
  const formData = new FormData(filterForm);
  const data = Object.fromEntries(formData.entries());

  // collect selected categories
  const selectedTypes = [...formData.getAll("types")].join(",");
  data.types = selectedTypes;

  // search query
  const searchQuery = searchForm.query.value.trim();
  if (searchQuery) data.query = searchQuery;

  setPageState(data, () => {
    fetchAndRenderProjects();
  });

  // update dropdown label text
  updateCategoryDropdownLabel();
}

// Utility: update dropdown button label
function updateCategoryDropdownLabel() {
  const checked = [
    ...document.querySelectorAll(
      '#categoryDropdownMenu input[type="checkbox"]:checked',
    ),
  ];
  const toggle = document.getElementById("categoryDropdownToggle");
  if (!toggle) return;
  if (checked.length === 0) {
    toggle.textContent = "Select Categories";
  } else {
    toggle.textContent =
      checked.length === 1
        ? checked[0].nextSibling.textContent.trim()
        : `${checked.length} categories selected`;
  }
}

searchForm.addEventListener("submit", (e) => {
  formHandler(e);
});

const clearSearchBtn = document.querySelector("#clear-search");
clearSearchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchForm.reset();
  formHandler(e);
});

const clearFilterBtn = document.querySelector("#clear-filters");
clearFilterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterForm.reset();

  // clear dropdown checkboxes
  document
    .querySelectorAll('#categoryDropdownMenu input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false));

  // reset button text
  const toggle = document.getElementById("categoryDropdownToggle");
  if (toggle) toggle.textContent = "Select Categories";

  formHandler(e);
});

addEventListener("popstate", () => {
  fetchAndRenderProjects();
  updateCategoryDropdownLabel();
});
