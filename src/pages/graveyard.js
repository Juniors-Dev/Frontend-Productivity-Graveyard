import {
  projectCard,
  projectCardSkeleton,
} from "../components/features/projectCard/projectCard.js";
import { api } from "../main.js";

const projectsContainer = document.querySelector(".project-container");
const paginationContainer = document.querySelector(".pagination");

const limit = 10;
let currentPage = 1;

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
    const res = await api.getAllProjects({ offset, limit });

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

    renderPagination(page, totalPages);
  } catch (err) {
    console.log(err);
    projectsContainer.innerHTML =
      "<p>An error occurred fetching projects, please refresh the page.</p>";
  }
}

function getPagination(current, total) {
  const delta = 1;
  const range = [];
  const result = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        result.push(l + 1);
      } else if (i - l > 2) {
        result.push("...");
      }
    }
    result.push(i);
    l = i;
  }

  return result;
}

function renderPagination(current, total) {
  paginationContainer.innerHTML = "";

  // Add Prev button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "« Prev";
  prevBtn.classList.add("page-btn");
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener("click", () => {
    if (current > 1) {
      currentPage = current - 1;
      fetchAndRenderProjects(currentPage);
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Get compact pagination numbers
  const pages = getPagination(current, total);

  for (let p of pages) {
    if (p === "...") {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.classList.add("page-ellipsis");
      paginationContainer.appendChild(dots);
    } else {
      const btn = document.createElement("button");
      btn.textContent = p;
      btn.classList.add("page-btn");
      if (p === current) btn.classList.add("active");
      btn.addEventListener("click", () => {
        if (currentPage !== p) {
          currentPage = p;
          fetchAndRenderProjects(p);
        }
      });
      paginationContainer.appendChild(btn);
    }
  }

  // Add Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next »";
  nextBtn.classList.add("page-btn");
  nextBtn.disabled = current === total;
  nextBtn.addEventListener("click", () => {
    if (current < total) {
      currentPage = current + 1;
      fetchAndRenderProjects(currentPage);
    }
  });
  paginationContainer.appendChild(nextBtn);
}

fetchAndRenderProjects();
