import { api } from "../main.js";
import { renderProjectCard } from "../components/features/projectCard/projectCard.js";

let projects = localStorage.getItem("projects")
  ? JSON.parse(localStorage.getItem("projects"))
  : null;
let stats = localStorage.getItem("stats")
  ? JSON.parse(localStorage.getItem("stats"))
  : null;

if (!projects) {
  projects = await api.getAllProjects();
  stats = await api.getAllStats();

  localStorage.setItem("projects", JSON.stringify(projects));
  localStorage.setItem("stats", JSON.stringify(stats));
}

const projectsContatiner = document.querySelector("#recent-projects");

await projects.data.forEach((project) => {
  projectsContatiner.append(renderProjectCard(project));
});
