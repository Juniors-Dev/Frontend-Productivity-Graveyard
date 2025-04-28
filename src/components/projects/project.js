function renderProject(project) {
  // Create a new project card container
  const projectCard = document.createElement("div");
  projectCard.classList.add("funeral-card");

  // Add project image
  const projectImageContainer = document.createElement("div");
  projectImageContainer.classList.add("funeral-image");
  const projectImage = document.createElement("img");
  projectImage.src = project.image || "./assets/img/skull.png";
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
      <img src="./assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
      <span>${project.likes}</span>
    `;
  yearsLikes.appendChild(years);
  yearsLikes.appendChild(likes);

  // Assemble the project card
  projectCard.appendChild(projectImageContainer);
  projectCard.appendChild(projectInfo);
  projectCard.appendChild(yearsLikes);

  // Append the project card to the recent funerals container
  const recentFuneralsContainer = document.querySelector(".recent-funerals");
  recentFuneralsContainer.appendChild(projectCard);
}

// Example usage:
const projectSkull = {
  image: "./assets/img/skull.png",
  title: "TODO LIST V9",
  description:
    "It started like every other side project - with hope, a clean main branch, and way too many Post-it notes. But after two days of enthusiastic planning and zero follow-through, it was left to rot in my project folder. I still believe in the idea. I just don't believe I'll ever open it again.",
  years: "2023–2025",
  likes: 13,
};

const projectBrain = {
  image: "./assets/img/brain.png",
  title: "Brainstorm App",
  description:
    "A project meant to revolutionize brainstorming sessions but ended up being a collection of half-baked ideas.",
  years: "2022–2024",
  likes: 8,
};

const projectClock = {
  image: "./assets/img/clock.png",
  title: "Time Tracker",
  description:
    "An ambitious time-tracking app that ironically ran out of time to be completed.",
  years: "2021–2023",
  likes: 5,
};

// Render all projects
renderProject(projectSkull);
renderProject(projectBrain);
renderProject(projectClock);
