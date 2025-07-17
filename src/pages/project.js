import { api } from "../main.js";
import { renderMemorial } from "../components/features/memorial/memorial.js";
import {
  renderComments,
  setupMainCommentForm,
} from "../components/features/comments/comments.js";

function getProjectIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadProject(projectId) {
  document.getElementById("memorial-loading").style.display = "";
  document.querySelector(".tombstone-content").style.display = "none";
  const errorMsg = document.getElementById("memorial-error");
  if (errorMsg) errorMsg.style.display = "none";

  try {
    const res = await api.getProject(projectId);
    if (!res.success || !res.data) {
      throw new Error("An error occurred, please refresh the page");
    }
    document.getElementById("memorial-loading").style.display = "none";
    document.querySelector(".tombstone-content").style.display = "";
    renderMemorial(res.data);
    return res.data;
  } catch (err) {
    document.getElementById("memorial-loading").style.display = "none";
    if (errorMsg) {
      errorMsg.textContent = "Failed to load project.";
      errorMsg.style.display = "";
    }
    console.error(err);
  }
}

async function loadComments(projectId, page = 1) {
  const commentsContainer = document.getElementById("comments-container");
  const commentsError = document.getElementById("comments-error");

  if (commentsContainer) commentsContainer.innerHTML = "";
  if (commentsError) commentsError.style.display = "none";

  try {
    const offset = (page - 1) * 10;
    const commentRes = await api.getProjectComments(projectId, {
      offset,
      limit: 10,
    });

    const comments =
      commentRes.success && Array.isArray(commentRes.data)
        ? commentRes.data
        : [];
    const total = commentRes.meta?.total || 0;
    const totalPages = Math.ceil(total / 10);

    const commentsList = renderComments({
      comments,
      page,
      totalPages,
      projectId,
      api,
      onPageChange: (newPage) => loadComments(projectId, newPage),
      onCommentAction: () => loadComments(projectId, 1),
    });

    if (commentsContainer) {
      commentsContainer.appendChild(commentsList);
    }
  } catch (err) {
    if (commentsError) {
      commentsError.textContent = "Failed to load comments.";
      commentsError.style.display = "";
      console.error(err);
    }
  }
}

async function initMemorialPage() {
  const projectId = getProjectIdFromURL();
  if (!projectId) {
    const errorMsg = document.querySelector(".memorial-error");
    if (errorMsg) {
      errorMsg.textContent = "No project ID provided.";
      errorMsg.style.display = "";
    }
    return;
  }

  try {
    await loadProject(projectId);

    setupMainCommentForm(projectId, () => loadComments(projectId, 1), api);

    await loadComments(projectId);
  } catch (err) {
    console.error(err);
  }
}

initMemorialPage();