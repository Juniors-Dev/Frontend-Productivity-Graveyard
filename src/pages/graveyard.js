import {
  setPageState,
  setupGraveyardForms,
  fetchAndRenderProjects,
} from "../components/features/graveyard/index.js";

fetchAndRenderProjects();
setupGraveyardForms();
const toggleFiltersBtn = document.getElementById("toggle-filters");
const advancedFilters = document.getElementById("advanced-filters");

toggleFiltersBtn.addEventListener("click", () => {
  advancedFilters.classList.toggle("open");
  const isOpen = advancedFilters.classList.contains("open");
  toggleFiltersBtn.textContent = isOpen
    ? "Advanced Filters ▴"
    : "Advanced Filters ▾";
});

/* Form Handler */
const filterForm = document.getElementById("project-filters");
const searchForm = document.getElementById("search-form");
async function formHandler(e) {
  e.preventDefault();
  const formData = new FormData(filterForm);
  const data = Object.fromEntries(formData.entries());
  const selectedTypes = [...formData.getAll("types")].join(",");
  data.types = selectedTypes;
  const searchQuery = searchForm.query.value.trim();
  if (searchQuery) data.query = searchQuery;

  setPageState(data, () => {
    fetchAndRenderProjects();
  });
}

searchForm.addEventListener("submit", async (e) => {
  formHandler(e);
});

const clearSearchBtn = document.querySelector("#clear-search");
clearSearchBtn.addEventListener("click", async (e) => {
  searchForm.reset();
  formHandler(e);
});

addEventListener("popstate", () => {
  fetchAndRenderProjects();
});
