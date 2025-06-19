export function renderProfileProjectCard(project) {
  // Create a new project card container
  const projectCard = document.createElement("div");
  projectCard.classList.add("funeral-card");

  // Add project image
  const projectImageContainer = document.createElement("div");
  projectImageContainer.classList.add("funeral-image");
  const projectImage = document.createElement("img");
  projectImage.src = project.image || "./src/assets/img/skull.png";
  projectImage.alt = `${project.title} Icon`;
  projectImage.width = 120;
  projectImage.height = 120;
  projectImageContainer.appendChild(projectImage);

  // Add project info
  const projectInfo = document.createElement("div");
  projectInfo.classList.add("project-info");
  const projectHeader = document.createElement("h3");
  projectHeader.textContent = project.title;
  const projectDescription = document.createElement("p");
  projectDescription.textContent = project.description;
  projectInfo.appendChild(projectHeader);
  projectInfo.appendChild(projectDescription);

  // Add years and likes
  const yearsLikes = document.createElement("div");
  yearsLikes.classList.add("yearslikes");
  const years = document.createElement("div");
  years.innerHTML = `<span class="years">Years: </span><span>${project.years}</span>`;
  const likes = document.createElement("div");
  likes.classList.add("btn-likes");
  likes.innerHTML = `
      <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
      <span>${project.likes}</span>
    `;
  yearsLikes.appendChild(years);
  yearsLikes.appendChild(likes);

  // Assemble the project card
  projectCard.appendChild(projectImageContainer);
  projectCard.appendChild(projectInfo);
  projectCard.appendChild(yearsLikes);

  // Append the project card to the recent funerals container
  return projectCard;
}
