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
  return `
            <div class="tombstone-wrapper">
              <div class="tombstone-top"></div>
              <div class="tombstone-body">
                <div class="skeleton skeleton-img tombstone-icon"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-line tombstone-cause"></div>
                <div class="skeleton skeleton-line tombstone-lifespan"></div>
                <div class="tombstone-interactions">
              <div class="likes">👍 <div class="skeleton skeleton-small"></div></div>
              <div class="comments">💬<div class="skeleton skeleton-small"></div></div>
              </div>
                <div href="/project.html?class="btn-view-memorial skeleton-button"></div>
              </div>
              <div class="tombstone-base"></div>
            </div>
            `;
}
