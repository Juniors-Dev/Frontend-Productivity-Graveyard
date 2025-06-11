import { baseUrl } from "../../../utlis/constants.js";

export function renderProjectCard(project) {
  // Create card container
  const card = document.createElement("div");
  card.className = "project-card";

  // Left side (card-left)
  const cardLeft = document.createElement("div");
  cardLeft.className = "card-left";
  const img = document.createElement("img");
  img.src = baseUrl + project.tombstone[0].imageUrl;
  img.alt = project.tombstone[0].name;
  cardLeft.appendChild(img);
  const title = document.createElement("h3");
  title.className = "project-title";
  title.textContent = project.title;
  cardLeft.appendChild(title);
  if (project.reason) {
    const reason = document.createElement("div");
    reason.className = "reason";
    reason.textContent = project.reason;
    cardLeft.appendChild(reason);
  }
  const timeauthor = document.createElement("div");
  timeauthor.className = "timeauthor";
  const lifespan = document.createElement("div");
  lifespan.className = "lifespan";
  lifespan.textContent = project.lifespan;
  const author = document.createElement("div");
  author.className = "author";
  author.textContent = project.author;
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
  h3.textContent = project.title;
  const p = document.createElement("p");
  p.id = "project-description";
  p.textContent = project.description;
  descWrap.appendChild(h3);
  descWrap.appendChild(p);
  cardRight.appendChild(descWrap);

  // Project-info and likes row
  const infoLikesRow = document.createElement("div");
  infoLikesRow.style.display = "flex";
  infoLikesRow.style.flexDirection = "row";
  infoLikesRow.style.alignItems = "center";
  infoLikesRow.style.gap = "20px";

  // Project-info section (with spans for API population)
  const info = document.createElement("div");
  info.className = "project-info";
  info.innerHTML = `
    <div><b>Burried By:</b> <span class="burried-by" id="burried-by">${project.burriedBy}</span></div>
    <div><b>Cause of death:</b> <span class="cause-of-death" id="cause-of-death">${project.causeOfDeath}</span></div>
    <div><b>Lifespan:</b> <span class="lifespan" id="lifespan">${project.lifespan}</span></div>
  `;
  infoLikesRow.appendChild(info);

  // Likes button
  const likes = document.createElement("div");
  likes.classList.add("btn-likes");
  likes.innerHTML = `
    <img src="./src/assets/img/thumb.png" alt="Like Icon" class="like-icon" width="25px" height="25px" />
    <span>${project.upvoteCount}</span>
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
