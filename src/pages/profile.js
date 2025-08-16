import {
  profileProjectCard,
  profileProjectCardSkeleton,
} from "../components/features/profileProjectCard/profileProjectCard.js";
import { renderProfile } from "../components/features/profile/profile.js";
import { api } from "../main.js";
import { pagination } from "../components/features/pagination/pagination.js";
import { requireAuth } from "../components/forms/authService.js";
import { setupEditProfileUI } from "../components/features/profile/setupEditProfileUI.js";

const projectsContainer = document.querySelector(".users-projects");
const paginationContainer = document.querySelector(".pagination");

let user;
let currentPage = 1;
let limit = 10;

function showSkeletons(count) {
  projectsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    projectsContainer.innerHTML += profileProjectCardSkeleton();
  }
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

async function initProfilePage() {
  try {
    // Check if user id is included in URL
    const urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get("id") || null;

    showSkeletons(10);

    // Fetch user data
    if (userId) {
      user = await api.getUserById(userId);
    } else {
      user = await api.getCurrentUser();
    }

    if (!user.success) {
      throw new Error("Failed to fetch user");
    }

    // Render user details
    renderProfile(user.data);
    const viewingOwnProfile = !userId;

    //render the setupEditProfileUI
    setupEditProfileUI(user.data, viewingOwnProfile, api, renderProfile);

    // Render projects
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
}

// Protect the page and initialize when authenticated
requireAuth(initProfilePage);
