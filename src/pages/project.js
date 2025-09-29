import { api } from "../main.js";
import { renderMemorial } from "../components/features/memorial/memorial.js";
import { initComments } from "../components/features/comments/index.js";
import { authService } from "../components/forms/authService.js";
import { showPageError } from "../utils/errorFallback.js";

function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProject(projectId) {
  const loadingEl = document.getElementById("memorial-loading");
  const contentEl = document.querySelector(".tombstone-content");
  const errorEl = document.getElementById("memorial-error");

  if (loadingEl) loadingEl.hidden = false;
  if (contentEl) contentEl.hidden = true;
  if (errorEl) errorEl.hidden = true;

  try {
    const res = await api.getProject(projectId);
    if (!res.success || !res.data) {
      throw new Error("Failed to load project data from server.");
    }

    if (loadingEl) loadingEl.hidden = true;
    if (contentEl) contentEl.hidden = false;

    renderMemorial(res.data);
    return res.data;
  } catch (err) {
    if (loadingEl) loadingEl.hidden = true;
    if (contentEl) contentEl.hidden = true;

    if (errorEl) {
      errorEl.textContent =
        "Something went wrong. Please refresh the page or try again later.";
      errorEl.hidden = false;
    } else {
      showPageError();
    }
    console.error(err);
  }
}

async function initMemorialPage() {
  const projectId = getProjectIdFromURL();
  if (!projectId) {
    const errorEl = document.getElementById("memorial-error");

    if (errorEl) {
      errorEl.innerHTML = `
        <p>We couldn't find this memorial.</p>
        <a href="/graveyard.html" class="btn-beige btn-small">Browse all memorials</a>
        `;
      errorEl.hidden = false;
    } else {
      showPageError();
    }
    return;
  }

  try {
    await loadProject(projectId);

    const commentsContainer = document.getElementById("comments-container");
    const currentUser = authService.getCurrentUser();

    initComments({ projectId, api, container: commentsContainer, currentUser });
  } catch (err) {
    console.error("Error initializing memorial page:", err);
    showPageError();
  }
}

initMemorialPage();
