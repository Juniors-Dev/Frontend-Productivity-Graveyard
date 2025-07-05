import { baseUrl } from "../../../utlis/constants.js";
import { calculateLifespan, formatUnit } from "../../../utlis/dateHandlers.js";

export function projectCard(project) {
  // Create card container
  const card = document.createElement("div");
  card.className = "project-card";

  // Left side (card-left)
  const cardLeft = document.createElement("div");
  cardLeft.className = "card-left";
  const img = document.createElement("img");
  if (project.tombstone && project.tombstone[0]) {
    img.src = baseUrl + project.tombstone[0].imageUrl;
    img.alt = project.tombstone[0].name;
  } else {
    img.src = "/src/assets/img/skull.png";
    img.alt = "skull";
  }

  cardLeft.appendChild(img);
  const title = document.createElement("p");
  title.className = "project-title";
  title.textContent = project.name;
  cardLeft.appendChild(title);
  if (project.causeOfDeath) {
    const reason = document.createElement("div");
    reason.className = "reason";
    reason.textContent = project.causeOfDeath;
    cardLeft.appendChild(reason);
  }
  const timeauthor = document.createElement("div");
  timeauthor.className = "timeauthor";
  const lifespan = document.createElement("div");
  lifespan.className = "lifespan";
  const { totalDays, breakdown } = calculateLifespan(project);
  lifespan.textContent = formatUnit(totalDays, "day", "days");

  const author = document.createElement("div");
  author.className = "author";
  author.textContent = project.user?.username || "Unknown";
  timeauthor.appendChild(lifespan);
  timeauthor.appendChild(author);
  cardLeft.appendChild(timeauthor);

  // Right side (card-right)
  const cardRight = document.createElement("div");
  cardRight.className = "card-right";
  const descWrap = document.createElement("div");
  descWrap.className = "project-description";
  const h3 = document.createElement("h3");
  h3.id = "project-title";
  h3.textContent = project.name;
  const p = document.createElement("p");
  p.id = "project-description";
  p.textContent = project.description;
  descWrap.appendChild(h3);
  descWrap.appendChild(p);

  // Add eulogy if available
  if (project.eulogy) {
    const eulogyP = document.createElement("p");
    eulogyP.id = "project-eulogy";
    eulogyP.className = "project-eulogy";
    eulogyP.textContent = `"${project.eulogy}"`;
    eulogyP.style.fontStyle = "italic";
    eulogyP.style.marginTop = "0.5rem";
    eulogyP.style.color = "#cab38e";
    descWrap.appendChild(eulogyP);
  }

  cardRight.appendChild(descWrap);

  // Project-info and likes row
  const infoLikesRow = document.createElement("div");
  infoLikesRow.style.display = "flex";
  infoLikesRow.style.flexDirection = "row";
  infoLikesRow.style.alignItems = "center";
  infoLikesRow.style.gap = "20px";

  // Project-info section (using textContent for security)
  const info = document.createElement("div");
  info.className = "project-info";

  const buriedByDiv = document.createElement("div");
  buriedByDiv.innerHTML = `<b>Burried By:</b> <span class="burried-by" id="burried-by">${project.user?.username || "-"}</span>`;

  const causeOfDeathDiv = document.createElement("div");
  causeOfDeathDiv.innerHTML = `<b>Cause of death:</b> <span class="cause-of-death" id="cause-of-death">${project.causeOfDeath || "-"}</span>`;

  const lifespanDiv = document.createElement("div");
  lifespanDiv.innerHTML = `<b>Lifespan:</b> <span class="lifespan" id="lifespan">
    ${formatUnit(breakdown.years, "year", "years")}
    ${formatUnit(breakdown.months, "month", "months")}
    ${formatUnit(breakdown.days, "day", "days")}
  </span>`;

  info.appendChild(buriedByDiv);
  info.appendChild(causeOfDeathDiv);
  info.appendChild(lifespanDiv);

  infoLikesRow.appendChild(info);

  // Likes button
  const likes = document.createElement("div");
  likes.classList.add("btn-likes");
  likes.innerHTML = `
    <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
    <span>${project.upvoteCount || 0}</span>
  `;
  infoLikesRow.appendChild(likes);

  cardRight.appendChild(infoLikesRow);

  card.appendChild(cardLeft);
  card.appendChild(cardRight);

  // Append to .container
  const container = document.querySelector(".container");
  if (container) container.appendChild(card);

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
