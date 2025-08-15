import { baseUrl } from "../../../utils/constants.js";
import { calculateLifespan, formatUnit } from "../../../utils/dateHandlers.js";

export function profileProjectCard(project) {
  // Create a new project card container
  const projectCard = document.createElement("a");
  projectCard.href = `/project.html?id=${project.id}`;
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
  yearsCont.innerHTML = `<span class="years">Lifespan: </span><span>${formatUnit(years, "year", "years")}${formatUnit(months, "month", "months")}${formatUnit(days, "day", "days")}</span>`;
  const likes = document.createElement("button");
  likes.classList.add("btn-likes");

  likes.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Todo: Implement like functionality?
  });

  likes.innerHTML = `
      <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
      <span>${project.upvoteCount}</span>
    `;
  yearsLikes.appendChild(yearsCont);
  yearsLikes.appendChild(likes);

  // Assemble the project card
  projectCard.appendChild(projectImageContainer);
  projectCard.appendChild(projectInfo);
  projectInfo.appendChild(yearsLikes);

  // Append the project card to the recent funerals container
  return projectCard;
}

export function profileProjectCardSkeleton() {
  return `
    <div class="funeral-card skeleton-card">
      <div class="funeral-image">
        <div class="skeleton skeleton-img"></div>
      </div>
      <div class="project-info">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="yearslikes">
          <div>
            <span class="years skeleton skeleton-line" style="display: inline-block; width: 100px;"></span>
            <div class="skeleton skeleton-line" style="width: 140px;"></div>
          </div>
          <button class="btn-likes">
            <div class="skeleton skeleton-icon"></div>
            <div class="skeleton skeleton-tiny"></div>
          </button>
        </div>
      </div>
    </div>
  `;
  // return `<div class="funeral-card"><div class="funeral-image"><img class="skeleton skeleton-img" src="http://localhost:3000/images/usb_coffin.png" alt="USB Coffin Icon" width="120" height="120"></div><div class="project-info"><h3>Productivity Graveyard</h3><p>A humorous app to memorialize abandoned dev projects.</p></div><div class="yearslikes"><div><span class="years">Lifespan: </span><span>3 months 14 days </span></div><div class="btn-likes">
  //     <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px">
  //     <span>undefined</span>
  //   </div></div></div>`;
  // return `<div class="project-card skeleton-card skeleton-container">
  //             <div class="card-left">
  //               <div class="skeleton skeleton-img"></div>
  //               <div class="skeleton skeleton-title"></div>
  //               <div class="timeauthor">
  //                 <div class="skeleton skeleton-small"></div>
  //                 <div class="skeleton skeleton-small"></div>
  //               </div>
  //             </div>
  //             <div class="card-right">
  //               <div class="project-description">
  //                 <div class="skeleton skeleton-title"></div>
  //                 <div class="skeleton skeleton-text"></div>
  //               </div>
  //               <div
  //                 style="
  //                   display: flex;
  //                   flex-direction: row;
  //                   align-items: center;
  //                   gap: 20px;
  //                 "
  //               >
  //                 <div class="project-info">
  //                   <div class="skeleton skeleton-line"></div>
  //                   <div class="skeleton skeleton-line"></div>
  //                   <div class="skeleton skeleton-line"></div>
  //                 </div>
  //                 <div class="btn-likes">
  //                   <img
  //                     src="./src/assets/img/thumb.png"
  //                     alt="Like Icon"
  //                     class="like-icon"
  //                     width="25px"
  //                     height="25px"
  //                   />
  //                   <div class="skeleton skeleton-tiny"></div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>`;
}
