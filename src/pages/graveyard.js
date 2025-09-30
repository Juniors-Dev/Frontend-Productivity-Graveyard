import {
  setPageState,
  setupGraveyardForms,
  fetchAndRenderProjects,
} from "../components/features/graveyard/index.js";

fetchAndRenderProjects();

/* Modal for filter */
const dialog = document.querySelector("dialog");
const dialogCloseBtn = document.querySelector("#close-dialog");
const dialogOpenBtn = document.querySelector("#open-dialog");
dialogOpenBtn.addEventListener("click", () => {
  dialog.showModal();
});

dialogCloseBtn.addEventListener("click", () => {
  dialog.close();
});

/* Form Setup */

setupGraveyardForms();

/* Form Handler */
const filterForm = document.getElementById("project-filters");
const searchForm = document.getElementById("search-form");
async function formHandler(e) {
  e.preventDefault();
  const formData = new FormData(filterForm);
  const data = Object.fromEntries(formData.entries());
  data.types = formData.getAll("types").join(",");
  const searchQuery = searchForm.query.value.trim();
  if (searchQuery) data.query = searchQuery;

  setPageState(data, () => {
    fetchAndRenderProjects();
    dialog.close();
  });
}

filterForm.addEventListener("submit", async (e) => {
  formHandler(e);
});

searchForm.addEventListener("submit", async (e) => {
  formHandler(e);
});

const clearFilterBtn = document.querySelector("#clear-filters");
clearFilterBtn.addEventListener("click", async (e) => {
  filterForm.reset();
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
