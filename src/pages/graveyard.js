import {
  setPageState,
  setupGraveyardForms,
  fetchAndRenderProjects,
} from "../components/features/graveyard/index.js";

fetchAndRenderProjects();
setupGraveyardForms();

/* Form Handler */
const filterForm = document.getElementById("filters-form");

async function formHandler(e) {
  e.preventDefault();
  const formData = new FormData(filterForm);
  const data = Object.fromEntries(formData.entries());

  data.types = formData.getAll("types").join(",");
  if (data.query && !data.query.trim()) delete data.query;

  setPageState(data, fetchAndRenderProjects);
}

filterForm.addEventListener("submit", formHandler);
filterForm.addEventListener("reset", () => {
  setPageState({}, fetchAndRenderProjects);
});

addEventListener("popstate", () => {
  fetchAndRenderProjects();
});
