/*
TODO:
* Improve error handling and loading states
* Add a share btn?
* Use a modal form for edit instead of redirecting to edit page?
*/

import { createEl } from "../../../utils/createEl.js";
import { baseUrl } from "../../../utils/constants.js";
import { api } from "../../../main.js";
import { authService } from "../../forms/authService.js";
import {
  initMemorialEditModal,
  openMemorialEditModal,
} from "./editMemorial.js";

export function renderMemorial(project) {
  populateStaticFields(project);
  renderTags(project.types, document.querySelector(".tombstone-types"));
  renderInteractions(
    project,
    document.querySelector(".tombstone-interactions"),
    document.querySelector(".memorial-error"),
  );
  renderControls(
    project,
    document.querySelector(".memorial-controls.right"),
    document.querySelector(".memorial-error"),
  );
  const errorMsg = document.querySelector(".memorial-error");
  if (errorMsg) errorMsg.textContent = "";
}

initMemorialEditModal({ api, renderMemorial });

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function populateStaticFields(project) {
  const icon = document.querySelector(".tombstone-icon");
  const title = document.querySelector(".tombstone-title");
  const buriedBy = document.querySelector(".tombstone-buried-by");
  const cause = document.querySelector(".tombstone-cause");
  const startDate = document.querySelector(".tombstone-start");
  const endDate = document.querySelector(".tombstone-end");
  const description = document.querySelector(".tombstone-description");
  const eulogyTitle = document.querySelector(".tombstone-eulogy-title");
  const eulogy = document.querySelector("blockquote");

  if (icon) {
    let imageUrl = "/src/assets/img/skull.png";
    if (Array.isArray(project.tombstone) && project.tombstone[0]?.imageUrl) {
      imageUrl = baseUrl + project.tombstone[0].imageUrl;
    } else if (project.tombstone?.imageUrl) {
      imageUrl = baseUrl + project.tombstone.imageUrl;
    }
    icon.src = imageUrl;
    icon.alt = project.name + " icon";
  }
  if (title) title.textContent = project.name || "";
  if (buriedBy) {
    buriedBy.textContent = "";
    const label = createEl("span", { className: "buried-by-label" });
    label.textContent = "Buried by ";
    const link = createEl("a", {
      className: "buried-by-link",
      href: `/profile.html?id=${encodeURIComponent(project.user.id)}`,
    });
    link.textContent = `@${project.user.username}`;
    buriedBy.appendChild(label);
    buriedBy.appendChild(link);
  }
  if (cause) {
    cause.innerHTML =
      `<span class="cause-label">Cause of death: </span>` +
      `<span class="cause-value">${project.causeOfDeath || "-"}</span>`;
  }
  if (startDate)
    startDate.innerHTML = `<span class="lifespan-label">Start</span> <span class="lifespan-date">${formatDate(project.startDate)}</span>`;
  if (endDate)
    endDate.innerHTML = `<span class="lifespan-label">End</span> <span class="lifespan-date">${formatDate(project.endDate)}</span>`;
  if (description) description.textContent = project.description || "";
  if (eulogyTitle && project.eulogy) {
    eulogyTitle.textContent = "Eulogy";
  } else if (eulogyTitle) {
    eulogyTitle.textContent = "";
  }
  if (eulogy) eulogy.textContent = project.eulogy ? `"${project.eulogy}"` : "";
}

function renderTags(types, typesList) {
  if (!typesList) return;
  typesList.innerHTML = "";
  // Deduplicate - (until backend fix)
  const seen = new Set();
  (types || []).forEach((type) => {
    const name = typeof type === "object" ? type.name : type;
    if (name && !seen.has(name)) {
      seen.add(name);
      const li = createEl("li", { class: "tombstone-type" }, name);
      typesList.appendChild(li);
    }
  });
}

function renderInteractions(project, interactions, errorMsg) {
  if (!interactions) return;
  interactions.innerHTML = "";

  const user = authService.getCurrentUser();

  // Upvote button
  const likesBtn = createEl("button", {
    class: `likes upvote-btn${project.userHasVoted ? " voted" : ""}`,
    "aria-label": "Upvote this project",
    "aria-pressed": project.userHasVoted ? "true" : "false",
    type: "button",
  });
  likesBtn.innerHTML = `
    <span class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(224,199,158,1)" width="30" height="30"><path d="M2 8.99997H5V21H2C1.44772 21 1 20.5523 1 20V9.99997C1 9.44769 1.44772 8.99997 2 8.99997ZM7.29289 7.70708L13.6934 1.30661C13.8693 1.13066 14.1479 1.11087 14.3469 1.26016L15.1995 1.8996C15.6842 2.26312 15.9026 2.88253 15.7531 3.46966L14.5998 7.99997H21C22.1046 7.99997 23 8.8954 23 9.99997V12.1043C23 12.3656 22.9488 12.6243 22.8494 12.8658L19.755 20.3807C19.6007 20.7554 19.2355 21 18.8303 21H8C7.44772 21 7 20.5523 7 20V8.41419C7 8.14897 7.10536 7.89462 7.29289 7.70708Z"></path></svg>
    </span>
    <span class="likes-count">${project.upvoteCount}</span>
  `;
  if (!user || !user.id) {
    likesBtn.disabled = true;
    likesBtn.title = "Login to upvote";
    likesBtn.style.opacity = "0.6";
    likesBtn.style.cursor = "not-allowed";
  }
  likesBtn.onclick = async () => {
    if (!user || !user.id) return;
    if (errorMsg) errorMsg.textContent = "";
    try {
      const res = await api.toggleUpvote(project.id);
      if (res.success) {
        likesBtn.classList.toggle("voted", res.data.upvoted);
        likesBtn.querySelector(".likes-count").textContent = res.data.count;
      } else if (errorMsg) {
        errorMsg.textContent = res.message || "Failed to upvote project.";
      }
    } catch (err) {
      if (errorMsg) errorMsg.textContent = "Error toggling upvote.";
      console.error(err);
    }
  };

  // Comment button
  const commentsBtn = createEl("button", {
    class: "comments comment-btn",
    "aria-label": "Write a comment",
    type: "button",
  });
  commentsBtn.innerHTML = `
    <span class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(224,199,158,1)" width="30" height="30"><path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z"></path></svg>
    </span>
    <span class="comments-count">${project.commentCount}</span>
  `;
  if (!user || !user.id) {
    commentsBtn.disabled = true;
    commentsBtn.title = "Login to comment";
    commentsBtn.style.opacity = "0.6";
    commentsBtn.style.cursor = "not-allowed";
  } else {
    commentsBtn.onclick = () => {
      const form = document.querySelector(".comment-form textarea");
      if (form) {
        form.focus();
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };
  }

  interactions.appendChild(likesBtn);
  interactions.appendChild(commentsBtn);
}

function renderControls(project, controls, errorMsg) {
  if (!controls) return;
  controls.innerHTML = "";

  const user = authService.getCurrentUser();
  if (user?.id === project.user.id) {
    // Edit
    const editBtn = createEl("button", {
      class: "btn-small btn-icon",
      title: "Edit",
      onclick: () =>
        openMemorialEditModal(project, editBtn, renderMemorial, api),
    });
    editBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(165, 165, 165, 1)" width="22" height="22"><path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path></svg>
  `;
    // Delete
    const deleteBtn = createEl("button", {
      class: "btn-small btn-icon",
      title: "Delete",
      onclick: async () => {
        if (errorMsg) errorMsg.textContent = "";
        if (confirm("Are you sure you want to delete this memorial?")) {
          try {
            const res = await api.deleteProject(project.id);
            if (res.success) {
              window.location.href = "/graveyard.html";
            } else if (errorMsg) {
              errorMsg.textContent =
                res.message || "Failed to delete memorial.";
            }
          } catch (err) {
            if (errorMsg)
              errorMsg.textContent = "Something went wrong while deleting.";
            console.error(err);
          }
        }
      },
    });
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(165, 165, 165, 1)" width="22" height="22"><path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9ZM9 12V18H11V12H9ZM13 12V18H15V12H13Z"></path></svg>
    `;
    controls.append(editBtn, deleteBtn);
  }
}
