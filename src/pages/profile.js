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
//check if user id is included
const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("id") || null;
showSkeletons(10);
if (userId) {
  user = await api.getUserById(userId);
} else {
  user = await api.getCurrentUser();
}

//render users details
renderProfile(user.data);

//render projects

projectsContainer.innerHTML = "";
user.data.projects.data.forEach((project) => {
  projectsContainer.append(profileProjectCard(project));
});

console.log(user.data.projects);

const { hasNext, limit, total } = user.data.projects.meta;
let currentPage = 1;
let totalPages = Math.ceil(total / limit);
const paginationContainer = document.querySelector(".pagination");
if (hasNext) {
  pagination({
    current: currentPage,
    total: totalPages,
    container: paginationContainer,
    onPageChange: (newPage) => {
      currentPage = newPage;
      //fetchAndRenderProjects(newPage);
    },
  });
}

// async function fetchAndRenderProjects(pageNumber) {}
