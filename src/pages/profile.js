import {
  profileProjectCard,
  profileProjectCardSkeleton,
} from "../components/features/profileProjectCard/profileProjectCard.js";
import { renderProfile } from "../components/features/profile/profile.js";
import { api } from "../main.js";
import { pagination } from "../components/features/pagination/pagination.js";

const projectsContainer = document.querySelector(".users-projects");
function showSkeletons(count) {
  projectsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    projectsContainer.innerHTML += profileProjectCardSkeleton();
  }
}
let user;
let currentPage = 1;
let limit = 10;
const paginationContainer = document.querySelector(".pagination");
try {
  //check if user id is included
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("id") || null;
  showSkeletons(10);
  if (userId) {
    user = await api.getUserById(userId);
  } else {
    user = await api.getCurrentUser();
  }

  if (!user.success) {
    throw new Error("Failed to fetch user");
  }

  //render users details
  renderProfile(user.data);

  //render projects

  projectsContainer.innerHTML = "";
  user.data.projects.data.forEach((project) => {
    projectsContainer.append(profileProjectCard(project));
  });

  console.log(user.data.projects);

  const { hasNext, total } = user.data.projects.meta;

  let totalPages = Math.ceil(total / limit);

  if (hasNext) {
    pagination({
      current: currentPage,
      total: totalPages,
      container: paginationContainer,
      onPageChange: (newPage) => {
        currentPage = newPage;
        fetchAndRenderProjects(newPage);
      },
    });
  }
} catch (err) {
  console.log(err);
  projectsContainer.innerHTML =
    "<p>An error occurred fetching the user and their projects, please refresh the page.</p>";
}

async function fetchAndRenderProjects(page) {
  try {
    showSkeletons(10);
    const offset = (page - 1) * limit;
    const projects = await api.getAllProjects({
      userId: user.data.id,
      limit,
      offset,
    });
    if (!projects.success) {
      projectsContainer.innerHTML =
        "<p>An error occurred fetching projects, please refresh the page.</p>";
      return;
    }
    projectsContainer.innerHTML = "";
    if (projects.data.length > 0) {
      projects.data.forEach((project) => {
        projectsContainer.append(profileProjectCard(project));
      });
      pagination({
        current: currentPage,
        total: Math.ceil(projects.meta.total / limit),
        container: paginationContainer,
        onPageChange: (newPage) => {
          currentPage = newPage;
          fetchAndRenderProjects(newPage);
        },
      });
    } else {
      projectsContainer.innerHTML =
        "<p>No projects found, bury a regret today!.</p>";
    }
  } catch (err) {
    console.log(err);
    projectsContainer.innerHTML =
      "<p>An error occurred fetching projects, please refresh the page.</p>";
  }
}
