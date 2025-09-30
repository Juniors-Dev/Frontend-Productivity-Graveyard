import { createEl } from "../../../utils/createEl.js";
import { baseUrl } from "../../../utils/constants.js";
import { api } from "../../../main.js";
import { authService } from "../../forms/authService.js";
import { createIcon } from "../../ui/icon.js";

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

  const likesBtn = createEl("button", {
    class: `likes upvote-btn${project.userHasVoted ? " voted" : ""}`,
    "aria-label": "Upvote this project",
    "aria-pressed": project.userHasVoted ? "true" : "false",
    type: "button",
  });
  const likeIconWrap = createEl("span", { class: "icon" });
  likeIconWrap.appendChild(createIcon("upvote", { size: 30 }));
  likesBtn.appendChild(likeIconWrap);
  const likesCountEl = createEl(
    "span",
    { class: "likes-count" },
    project.upvoteCount,
  );
  likesBtn.appendChild(likesCountEl);

  if (!user?.id) {
    likesBtn.disabled = true;
    likesBtn.title = "Login to upvote";
    likesBtn.style.opacity = "0.6";
    likesBtn.style.cursor = "not-allowed";
  }
  if (user?.id) {
    likesBtn.addEventListener("click", async () => {
      if (errorMsg) errorMsg.textContent = "";
      try {
        const res = await api.toggleUpvote(project.id);
        if (res?.success) {
          likesBtn.classList.toggle("voted", res.data.upvoted);
          likesCountEl.textContent = res.data.count;
        } else if (errorMsg) {
          errorMsg.textContent = res?.message || "Failed to upvote project.";
        }
      } catch (err) {
        if (errorMsg) errorMsg.textContent = "Error toggling upvote.";
        console.error(err);
      }
    });
  }

  const commentsBtn = createEl("button", {
    class: "comments comment-btn",
    "aria-label": "Write a comment",
    type: "button",
  });
  const commentIconWrap = createEl("span", { class: "icon" });
  commentIconWrap.appendChild(createIcon("comment", { size: 30 }));
  commentsBtn.appendChild(commentIconWrap);
  commentsBtn.appendChild(
    createEl("span", { class: "comments-count" }, project.commentCount),
  );

  if (!user?.id) {
    commentsBtn.disabled = true;
    commentsBtn.title = "Login to comment";
    commentsBtn.style.opacity = "0.6";
    commentsBtn.style.cursor = "not-allowed";
  } else {
    commentsBtn.addEventListener("click", () => {
      const form = document.querySelector(".comment-form textarea");
      if (form) {
        form.focus();
        form.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  interactions.append(likesBtn, commentsBtn);
}

function renderControls(project, controls, errorMsg) {
  if (!controls) return;
  controls.innerHTML = "";

  const user = authService.getCurrentUser();
  if (user?.id === project.user.id) {
    const editBtn = createEl("button", {
      class: "btn-small btn-icon",
      title: "Edit",
      type: "button",
    });
    editBtn.appendChild(createIcon("edit", { size: 22 }));
    editBtn.addEventListener("click", () => {
      // openMemorialEditModal(project, editBtn, renderMemorial, api)
    });

    const deleteBtn = createEl("button", {
      class: "btn-small btn-icon btn-danger",
      title: "Delete",
      type: "button",
    });
    deleteBtn.appendChild(createIcon("delete", { size: 22 }));
    deleteBtn.addEventListener("click", async () => {
      if (errorMsg) errorMsg.textContent = "";
      if (!confirm("Are you sure you want to delete this memorial?")) return;

      try {
        deleteBtn.disabled = true;
        const res = await api.deleteProject(project.id);
        if (res?.success) {
          window.location.href = "/graveyard.html";
        } else if (errorMsg) {
          errorMsg.textContent = res?.message || "Failed to delete memorial.";
        }
      } catch (err) {
        if (errorMsg)
          errorMsg.textContent = "Something went wrong while deleting.";
        console.error(err);
      } finally {
        deleteBtn.disabled = false;
      }
    });
    controls.append(editBtn, deleteBtn);
  }
}
