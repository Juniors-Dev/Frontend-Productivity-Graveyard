/**
 * TODO:
 *   Improve error handling
 *   Loading states (skeleton?)
 *   Upvote functionality
 *   Check if owner or not (edit/delete buttons)
 *   Add profile link to username
 */

import { baseUrl } from "../../../utils/constants.js";
import { calculateLifespan, formatUnit } from "../../../utils/dateHandlers.js";

export function populateProjectDetails(project) {
  document.title = `${project.name} Memorial - Productivity Graveyard`;

  document.getElementById("project-title").textContent = project.name;
  document.getElementById("project-description").textContent =
    project.description || "";

  const tombstoneImg = document.getElementById("tombstone"); //move tombstone to card? add another img  for hero
  if (project.tombstone && project.tombstone.length > 0) {
    tombstoneImg.src = baseUrl + project.tombstone[0].imageUrl;
    tombstoneImg.alt = project.tombstone[0].name;
  } else {
    tombstoneImg.src = "/src/assets/img/skull.png";
    tombstoneImg.alt = "Default tombstone";
  }

  const { breakdown } = calculateLifespan(project);
  const lifespanText =
    `${formatUnit(breakdown.years, "year", "years")}${formatUnit(breakdown.months, "month", "months")}${formatUnit(breakdown.days, "day", "days")}`.trim() ||
    "Unknown";

  document.getElementById("project-lifespan-detail").textContent = lifespanText;

  document.getElementById("cause-of-death").textContent =
    project.causeOfDeath || "Unknown";
  document.getElementById("laid-to-rest").textContent = project.endDate
    ? new Date(project.endDate).toLocaleDateString()
    : "Unknown";

  if (project.user) {
    const userAvatar = document.getElementById("user-avatar");
    const username = document.getElementById("username");

    userAvatar.src = project.user.avatarUrl;
    userAvatar.alt = `${project.user.username} Avatar`;
    username.textContent = `@${project.user.username}`;
  }

  const upvoteText = document.getElementById("upvote-text");
  const upvoteButton = document.getElementById("upvote-button");

  upvoteText.textContent = `Like (${project.upvoteCount || 0})`; // (candle icon) Light a candle
  upvoteButton.dataset.projectId = project.id;

  if (project.eulogy) {
    document.getElementById("project-eulogy").textContent =
      `"${project.eulogy}"`;
    document.getElementById("eulogy-section").style.display = "block";
  }

  const typesContainer = document.getElementById("project-types");
  typesContainer.innerHTML = "";

  if (project.types && project.types.length > 0) {
    project.types.forEach((type) => {
      const tag = document.createElement("span");
      tag.className = "type-tag";
      tag.textContent = type.name || "Unknown Type";
      typesContainer.appendChild(tag);
    });
  } else {
    const tag = document.createElement("span");
    tag.className = "type-tag";
    tag.textContent = "No category";
    typesContainer.appendChild(tag);
  }

  const status = document.getElementById("project-status");
  const statusMap = {
    archived: { text: "Archived", class: "status-archived" },
    active: { text: "Active", class: "status-active" },
    buried: { text: "Buried", class: "status-buried" },
    completed: { text: "Completed", class: "status-completed" },
    inactive: { text: "Inactive", class: "status-inactive" },
    resurrected: { text: "Resurrected", class: "status-resurrected" },
  };

  const statusInfo = statusMap[project.status] || {
    text: "Archived",
    class: "status-archived",
  };
  status.textContent = statusInfo.text;
  status.className = `project-status ${statusInfo.class}`;

  // lifespan in hero section
  if (project.startDate && project.endDate) {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);

    const startFormat = startDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const endFormat = endDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    document.getElementById("project-lifespan").textContent =
      `${startFormat} - ${endFormat}`;
    document.getElementById("project-lifespan").style.display = "block";
  }
  document.getElementById("project-memorial").style.display = "block";
}

// Improve. Try again btn
export function showError(message) {
  const projectContent = document.getElementById("project-content");
  projectContent.innerHTML = `
    <div class="error-message">
      <h2>Error</h2>
      <p>${message}</p>
      <a href="/graveyard.html" class="btn-beige">Back to Graveyard</a>
    </div>
  `;
}
