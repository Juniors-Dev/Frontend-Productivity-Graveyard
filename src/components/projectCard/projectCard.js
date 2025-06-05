import { fetchProjects } from "./fetchProjects.js";

export function renderProjectCard(project) {
  // Create card container
  const card = document.createElement("div");
  card.className = "project-card";

  // Left side (card-left)
  const cardLeft = document.createElement("div");
  cardLeft.className = "card-left";
  const img = document.createElement("img");
  img.src = project.image;
  img.alt = project.title;
  img.width = 120;
  img.height = 120;
  cardLeft.appendChild(img);
  const title = document.createElement("h3");
  title.className = "project-title";
  title.textContent = project.title;
  cardLeft.appendChild(title);
  if (project.causeOfDeath) {
    const causeLabel = document.createElement("div");
    causeLabel.className = "cause-label";
    causeLabel.innerHTML = "<b>Cause of death:</b>";
    cardLeft.appendChild(causeLabel);
    const reason = document.createElement("div");
    reason.className = "reason";
    reason.textContent = project.causeOfDeath;
    cardLeft.appendChild(reason);
    // Lifespan below cause of death
    const lifespan = document.createElement("div");
    lifespan.className = "lifespan";
    lifespan.textContent = project.lifespan;
    cardLeft.appendChild(lifespan);
  }

  // Right side (card-right)
  const cardRight = document.createElement("div");
  cardRight.className = "card-right";
  cardRight.style.display = "flex";
  cardRight.style.flexDirection = "column";
  cardRight.style.justifyContent = "space-between";
  cardRight.style.height = "300px"; // Set a fixed height to anchor top and bottom

  // Description at the top
  const descWrap = document.createElement("div");
  descWrap.className = "project-description";
  descWrap.style.marginBottom = "auto"; // Use auto to push infoLikesRow to the bottom
  const p = document.createElement("p");
  p.id = "project-description";
  p.textContent = project.description;
  descWrap.appendChild(p);
  cardRight.appendChild(descWrap);

  // Project-info and likes row at the bottom
  const infoLikesRow = document.createElement("div");
  infoLikesRow.style.display = "flex";
  infoLikesRow.style.flexDirection = "row";
  infoLikesRow.style.alignItems = "center";
  infoLikesRow.style.gap = "20px";
  infoLikesRow.style.marginTop = "auto";

  // Project-info section (with spans for API population)
  const info = document.createElement("div");
  info.className = "project-info";
  info.innerHTML = `
    <div><b>Burried By:</b> <span class="burried-by" id="burried-by">${project.burriedBy}</span></div>
    <div class="types"><b>Type:</b> <span id="types">${project.types}</span></div>
  `;
  infoLikesRow.appendChild(info);

  // Likes button
  const likes = document.createElement("div");
  likes.classList.add("btn-likes");
  likes.innerHTML = `
    <img src="./assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
    <span>${project.likes}</span>
  `;
  infoLikesRow.appendChild(likes);

  cardRight.appendChild(infoLikesRow);

  card.appendChild(cardLeft);
  card.appendChild(cardRight);

  // Append to .container
  const container = document.querySelector(".container");
  if (container) container.appendChild(card);
}

// Fetch and render all projects from API on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  fetchProjects()
    .then((response) => {
      // The API returns an object with a 'data' array
      const projects = response.data;
      if (Array.isArray(projects)) {
        projects.forEach((apiProject) => {
          // Map API fields to the expected fields for renderProjectCard
          renderProjectCard({
            image: "./assets/img/skull.png", // fallback or map if available
            title: apiProject.name,
            reason: apiProject.eulogy || "", // or another field if more appropriate
            lifespan: `${apiProject.startDate ? apiProject.startDate.slice(0, 4) : ""} - ${apiProject.endDate ? apiProject.endDate.slice(0, 4) : ""}`,
            author: apiProject.user?.username
              ? `-${apiProject.user.username}`
              : "-Unknown",
            description: apiProject.description,
            burriedBy: apiProject.user?.username || "Unknown",
            causeOfDeath: apiProject.causeOfDeath,
            types: apiProject.types.map((types) => types.name).join(", "),
            likes: apiProject.upvoteCount || 0,
          });
        });
      }
    })
    .catch((error) => {
      console.error("Failed to fetch and render projects:", error);
    });
});
