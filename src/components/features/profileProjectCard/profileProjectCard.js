import { baseUrl } from "../../../utlis/constants.js";
import { calculateLifespan, formatUnit } from "../../../utlis/dateHandlers.js";

export function renderProfileProjectCard(project) {
  // Create a new project card container
  const projectCard = document.createElement("div");
  projectCard.classList.add("funeral-card");

  // Add project image
  const projectImageContainer = document.createElement("div");
  projectImageContainer.classList.add("funeral-image");
  const projectImage = document.createElement("img");
  projectImage.src = project.tombstone[0].imageUrl
    ? baseUrl + project.tombstone[0].imageUrl
    : "./src/assets/img/skull.png";
  projectImage.alt = `${project.tombstone[0].name || "skull"} Icon`;
  projectImage.width = 120;
  projectImage.height = 120;
  projectImageContainer.appendChild(projectImage);

  // Add project info
  const projectInfo = document.createElement("div");
  projectInfo.classList.add("project-info");
  const projectHeader = document.createElement("h3");
  projectHeader.textContent = project.name;
  const projectDescription = document.createElement("p");
  projectDescription.textContent = project.description;
  projectInfo.appendChild(projectHeader);
  projectInfo.appendChild(projectDescription);

  // Add years and likes
  const lifespan = calculateLifespan(project);
  const { years, months, days } = lifespan.breakdown;

  const yearsLikes = document.createElement("div");
  yearsLikes.classList.add("yearslikes");
  const yearsCont = document.createElement("div");
  years.innerHTML = `<span class="years">Lifespan: </span><span>${formatUnit(years, "year", "years")}${formatUnit(months, "month", "months")}${formatUnit(days, "day", "days")}</span>`;
  const likes = document.createElement("div");
  likes.classList.add("btn-likes");
  likes.innerHTML = `
      <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
      <span>${project.likes}</span>
    `;
  yearsLikes.appendChild(yearsCont);
  yearsLikes.appendChild(likes);

  // Assemble the project card
  projectCard.appendChild(projectImageContainer);
  projectCard.appendChild(projectInfo);
  projectCard.appendChild(yearsLikes);

  // Append the project card to the recent funerals container
  return projectCard;
}
