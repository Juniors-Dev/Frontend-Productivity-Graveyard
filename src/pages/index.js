import { api } from "../main.js";
import {
  renderProjectCard,
  renderProjectCardSkeleton,
} from "../components/features/projectCard/projectCard.js";

const projectsContainer = document.querySelector("#recent-projects-container");
const statsSpans = {
  buriedToday: document.getElementById("buried-today"),
  totalBuried: document.getElementById("total-buried"),
  avgLifespan: document.getElementById("avg-lifespan"),
};

// Show skeletons while loading
for (let i = 0; i < 4; i++) {
  projectsContainer.innerHTML += renderProjectCardSkeleton();
}

try {
  const [projects, statsRes] = await Promise.all([
    api.getAllProjects({ limit: 4, orderBy: "upvoteCount" }),
    api.getAllStats(),
  ]);

  // Clear skeletons
  projectsContainer.innerHTML = "";

  // Render projects
  if (Array.isArray(projects.data) && projects.data.length > 0) {
    projects.data.forEach((project) => {
      projectsContainer.append(renderProjectCard(project));
    });
  } else {
    projectsContainer.innerHTML = `<p>No projects found.</p>`;
  }

  // Render stats
  const stats = statsRes.data || {};
  statsSpans.buriedToday.innerText = stats.funeralsToday ?? "–";
  statsSpans.totalBuried.innerText = stats.totalProjects ?? "–";
  statsSpans.avgLifespan.innerText =
    stats.averageLifespan != null
      ? `${Math.round(Number(stats.averageLifespan))} days`
      : "-";
} catch (err) {
  console.error("Failed to load homepage data:", err);

  projectsContainer.innerHTML = `<p class="error">Failed to load projects. Try refreshing.</p>`;

  Object.values(statsSpans).forEach((el) => {
    if (el) el.innerText = "-";
  });
}
