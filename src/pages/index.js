import { api } from "../main.js";
import { renderProjectCard } from "../components/features/projectCard/projectCard.js";

let projects = localStorage.getItem("projects")
  ? JSON.parse(localStorage.getItem("projects"))
  : null;
let stats = localStorage.getItem("stats")
  ? JSON.parse(localStorage.getItem("stats"))
  : null;

if (!projects) {
  projects = await api.getAllProjects({ limit: 4 });
  stats = await api.getAllStats();

  localStorage.setItem("projects", JSON.stringify(projects));
  localStorage.setItem("stats", JSON.stringify(stats));
}

const projectsContatiner = document.querySelector("#recent-projects-container");

await projects.data.forEach((project) => {
  projectsContatiner.append(renderProjectCard(project));
});

document.getElementById("buried-today").innerText = stats.data.funeralsToday;
document.getElementById("total-buried").innerText = stats.data.totalProjects;
document.getElementById("avg-lifespan").innerText =
  Math.round(Number(stats.data.averageLifespan)) + " days";
