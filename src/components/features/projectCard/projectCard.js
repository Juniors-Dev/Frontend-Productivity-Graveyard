import { baseUrl } from "../../../utils/constants.js";
import {
  calculateLifespan,
  formatLifespan,
} from "../../../utils/dateHandlers.js";
import { createEl } from "../../../utils/createEl.js";

export function projectCard(project) {
  const wrapper = createEl("div", { class: "tombstone-wrapper" });

  // Top round cap
  const top = createEl("div", { class: "tombstone-top" });
  wrapper.appendChild(top);

  // Main body
  const body = createEl("div", { class: "tombstone-body" });

  const icon = createEl("img", {
    src: project.tombstone?.[0]?.imageUrl
      ? baseUrl + project.tombstone[0].imageUrl
      : "/src/assets/img/skull.png",
    alt: `${project.name} icon`,
    class: "tombstone-icon",
  });
  const name = createEl("h3", { class: "tombstone-title" }, project.name);
  const cause = createEl(
    "p",
    { class: "tombstone-cause" },
    project.causeOfDeath || "Unknown cause",
  );
  const lifespan = createEl(
    "p",
    { class: "tombstone-lifespan" },
    formatLifespan(calculateLifespan(project).totalDays),
  );

  const interactions = createEl("div", { class: "tombstone-interactions" });
  interactions.innerHTML = `
    <div class="likes">👍 ${project.upvoteCount || 0}</div>
    <div class="comments">💬 ${project.commentCount || 0}</div>
  `;

  const viewLink = createEl(
    "a",
    {
      href: `/project.html?id=${project.id}`,
      class: "btn-view-memorial",
    },
    "View Memorial",
  );

  [icon, name, cause, lifespan, interactions, viewLink].forEach((el) =>
    body.appendChild(el),
  );

  wrapper.appendChild(body);

  // Base
  const base = createEl("div", { class: "tombstone-base" });
  wrapper.appendChild(base);

  return wrapper;
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
