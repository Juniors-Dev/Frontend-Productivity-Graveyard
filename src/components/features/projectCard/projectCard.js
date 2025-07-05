import { baseUrl } from "../../../utlis/constants.js";
// import { calculateLifespan, formatUnit } from "../../../utlis/dateHandlers.js";
import { calculateLifespan } from "../../../utlis/dateHandlers.js";

// export function projectCard(project) {
//   // Create card container
//   const card = document.createElement("div");
//   card.className = "project-card";

//   // Left side (card-left)
//   const cardLeft = document.createElement("div");
//   cardLeft.className = "card-left";
//   const img = document.createElement("img");
//   if (project.tombstone && project.tombstone[0]) {
//     img.src = baseUrl + project.tombstone[0].imageUrl;
//     img.alt = project.tombstone[0].name;
//   } else {
//     img.src = "/src/assets/img/skull.png";
//     img.alt = "skull";
//   }

//   cardLeft.appendChild(img);
//   const title = document.createElement("p");
//   title.className = "project-title";
//   title.textContent = project.name;
//   cardLeft.appendChild(title);
//   if (project.causeOfDeath) {
//     const reason = document.createElement("div");
//     reason.className = "reason";
//     reason.textContent = project.causeOfDeath;
//     cardLeft.appendChild(reason);
//   }
//   const timeauthor = document.createElement("div");
//   timeauthor.className = "timeauthor";
//   const lifespan = document.createElement("div");
//   lifespan.className = "lifespan";
//   const { totalDays, breakdown } = calculateLifespan(project);
//   lifespan.textContent = formatUnit(totalDays, "day", "days");

//   const author = document.createElement("div");
//   author.className = "author";
//   author.textContent = project.user.username;
//   timeauthor.appendChild(lifespan);
//   timeauthor.appendChild(author);
//   cardLeft.appendChild(timeauthor);

//   // Right side (card-right)
//   const cardRight = document.createElement("div");
//   cardRight.className = "card-right";
//   const descWrap = document.createElement("div");
//   descWrap.className = "project-description";
//   const h3 = document.createElement("h3");
//   h3.id = "project-title";
//   h3.textContent = project.name;
//   const p = document.createElement("p");
//   p.id = "project-description";
//   p.textContent = project.description;
//   descWrap.appendChild(h3);
//   descWrap.appendChild(p);
//   cardRight.appendChild(descWrap);

//   // Project-info and likes row
//   const infoLikesRow = document.createElement("div");
//   infoLikesRow.style.display = "flex";
//   infoLikesRow.style.flexDirection = "row";
//   infoLikesRow.style.alignItems = "center";
//   infoLikesRow.style.gap = "20px";

//   // Project-info section (with spans for API population)
//   const info = document.createElement("div");
//   info.className = "project-info";

//   info.innerHTML = `
//   <div><b>Burried By:</b> <span class="burried-by" id="burried-by">${project.user?.username || "-"}</span></div>
//   <div><b>Cause of death:</b> <span class="cause-of-death" id="cause-of-death">${project.causeOfDeath}</span></div>
//   <div><b>Lifespan:</b> <span class="lifespan" id="lifespan">
//     ${formatUnit(breakdown.years, "year", "years")}
//     ${formatUnit(breakdown.months, "month", "months")}
//     ${formatUnit(breakdown.days, "day", "days")}
//   </span></div>
// `;
//   infoLikesRow.appendChild(info);

//   // Likes button
//   const likes = document.createElement("div");
//   likes.classList.add("btn-likes");
//   likes.innerHTML = `
//     <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
//     <span>${project.upvoteCount}</span>
//   `;
//   infoLikesRow.appendChild(likes);

//   cardRight.appendChild(infoLikesRow);

//   card.appendChild(cardLeft);
//   card.appendChild(cardRight);

//   // Append to .container
//   const container = document.querySelector(".container");
//   if (container) container.appendChild(card);

//   return card;
// }

export function projectCard(project) {
  const card = document.createElement("div");
  card.className = "tombstone-card";

  // Icon
  const icon = document.createElement("img");
  icon.src = project.tombstone?.[0]?.imageUrl
    ? baseUrl + project.tombstone[0].imageUrl
    : "/src/assets/img/skull.png";
  icon.alt = `${project.name} icon`;
  icon.className = "tombstone-icon";
  card.appendChild(icon);

  // Name
  const name = document.createElement("h3");
  name.className = "tombstone-title";
  name.textContent = project.name;
  card.appendChild(name);

  // Cause of Death
  const cause = document.createElement("p");
  cause.className = "tombstone-cause";
  cause.textContent = project.causeOfDeath || "Unknown cause";
  card.appendChild(cause);

  // Lifespan
  const lifespan = document.createElement("p");
  lifespan.className = "tombstone-lifespan";
  lifespan.textContent = calculateLifespan(project).formatted;
  card.appendChild(lifespan);

  // Interactions (likes + comments)
  const interactions = document.createElement("div");
  interactions.className = "tombstone-interactions";
  interactions.innerHTML = `
    <div class="likes">
      👍 ${project.upvoteCount || 0}
    </div>
    <div class="comments">
      💬 ${project.commentCount || 0}
    </div>
  `;
  card.appendChild(interactions);

  // View Memorial Link
  const viewLink = document.createElement("a");
  viewLink.href = `/project.html?id=${project.id}`;
  viewLink.className = "btn-view-memorial";
  viewLink.textContent = "View Memorial";
  card.appendChild(viewLink);

  return card;
}

export function projectCardSkeleton() {
  return `<div class="project-card skeleton-card skeleton-container">
              <div class="card-left">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="timeauthor">
                  <div class="skeleton skeleton-small"></div>
                  <div class="skeleton skeleton-small"></div>
                </div>
              </div>
              <div class="card-right">
                <div class="project-description">
                  <div class="skeleton skeleton-title"></div>
                  <div class="skeleton skeleton-text"></div>
                </div>
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 20px;
                  "
                >
                  <div class="project-info">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                  </div>
                  <div class="btn-likes">
                    <img
                      src="./src/assets/img/thumb.png"
                      alt="Like Icon"
                      class="like-icon"
                      width="25px"
                      height="25px"
                    />
                    <div class="skeleton skeleton-tiny"></div>
                  </div>
                </div>
              </div>
            </div>`;
}
