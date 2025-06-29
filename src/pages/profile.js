import { renderProfileProjectCard } from "../components/features/profileProjectCard/profileProjectCard.js";
import { renderProfile } from "../components/features/profile/profile.js";
import { api } from "../main.js";

let user;
const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("id") || null;

if (userId) {
  user = await api.getUserById(userId);
} else {
  user = await api.getCurrentUser();
}

renderProfile(user.data);

const projectsContainer = document.querySelector(".users-projects");
user.data.projects.data.forEach((project) => {
  projectsContainer.append(renderProfileProjectCard(project));
});
