import {
  projectCard,
  projectCardSkeleton,
} from "../components/features/projectCard/projectCard.js";
import { pagination } from "../components/features/pagination/pagination.js";
import { api } from "../main.js";

const urlParams = new URLSearchParams(window.location.search);
let order = urlParams.get("order") || "desc";
let orderBy = urlParams.get("orderBy") || "createdAt";
let query = urlParams.get("query") || "";
let types = urlParams.get("types") || "";
let limit = parseInt(urlParams.get("limit"), 10) || 10;
if (limit > 100) {
  limit = 100;
}
let currentPage =
  Math.floor(
    (parseInt(urlParams.get("offset"), 10) || 0) /
      (parseInt(urlParams.get("limit"), 10) || 10),
  ) + 1;

const projectsContainer = document.querySelector(".project-container");
const paginationContainer = document.querySelector(".pagination");

function showSkeletons(count = limit) {
  projectsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    projectsContainer.innerHTML += projectCardSkeleton();
  }
}

async function fetchAndRenderProjects(page = 1) {
  showSkeletons();
  try {
    const offset = (page - 1) * limit;
    const url = new URL(window.location);
    url.searchParams.set("offset", offset);
    window.history.pushState({}, "", url);
    let options = { offset, limit, types, order, orderBy };
    query?.length ? (options.query = query) : delete options.query;
    const res = await api.getAllProjects(options);

    console.log(res);

    const projects = res.data || [];
    const total = res.meta?.total || 0;
    const totalPages = Math.ceil(total / limit);

    projectsContainer.innerHTML = "";

    if (projects.length === 0) {
      projectsContainer.innerHTML =
        "<p>No projects found. Try another page.</p>";
    } else {
      projects.forEach((project) => {
        projectsContainer.append(projectCard(project));
      });
    }

    pagination({
      current: currentPage,
      total: totalPages,
      container: paginationContainer,
      onPageChange: (newPage) => {
        currentPage = newPage;
        fetchAndRenderProjects(newPage);
      },
    });
  } catch (err) {
    console.log(err);
    projectsContainer.innerHTML =
      "<p>An error occurred fetching projects, please refresh the page.</p>";
  }
}

fetchAndRenderProjects(currentPage);

/* Modal for filter */
const dialog = document.querySelector("dialog");
const typesCheckboxes = document.querySelector("#types");
const dialogCloseBtn = document.querySelector("#close-dialog");
const dialogOpenBtn = document.querySelector("#open-dialog");
dialogOpenBtn.addEventListener("click", () => {
  dialog.showModal();
});

dialogCloseBtn.addEventListener("click", () => {
  dialog.close();
});

/* Form Setup */
const orderSelector = document.querySelector("#order-selector");
orderSelector.value = order;
const orderBySelector = document.querySelector("#orderby-selector");
orderBySelector.value = orderBy;
const limitSelector = document.querySelector("#limit-selector");
limitSelector.value = limit;

const typesRes = await api.getAllTypes();
let typesArray = [];
if (typesRes.success) {
  typesArray = typesRes.data;
}

typesArray.forEach((type) => {
  const label = document.createElement("label");
  label.setAttribute("for", `type-${type.id}`);
  label.style.display = "block"; // if you want each on a new line

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "types";
  checkbox.value = type.id;
  checkbox.id = `type-${type.id}`;

  const selectTypes = types.split(",");
  if (selectTypes.includes(`${type.id}`)) {
    checkbox.checked = true;
  }

  label.appendChild(checkbox);
  label.append(` ${type.name}`);
  typesCheckboxes.appendChild(label);
});

/* Form Handler */
const filterForm = document.getElementById("project-filters");
const searchForm = document.getElementById("search-form");
searchForm.query.value = query;
async function formHandler(e) {
  e.preventDefault();
  const formData = new FormData(filterForm);
  let searchQuery = searchForm.query.value;
  const data = Object.fromEntries(formData.entries());

  const selectedTypes = formData.getAll("types").join(",");
  data.types = selectedTypes;
  if (searchQuery.trim().length > 0) {
    data.query = searchQuery;
  } else {
    delete data.query;
  }
  console.log(data.query);
  const url = new URL(window.location);
  url.searchParams.forEach((_, key) => url.searchParams.delete(key));
  for (const [key, value] of Object.entries(data)) {
    url.searchParams.set(key, value);
  }

  window.history.pushState({}, "", url);
  order = data.order;
  orderBy = data.orderBy;
  query = data.query;
  types = selectedTypes;
  limit = data.limit;
  currentPage = 1;

  fetchAndRenderProjects(currentPage);
  dialog.close();
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
  query = "";
  formHandler(e);
  console.log(query);
});
