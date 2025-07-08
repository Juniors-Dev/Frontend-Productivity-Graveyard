import { api } from "../main.js";
import { renderMemorial } from "../components/features/memorial/memorial.js";

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
  } catch (err) {
    console.error(err);
  }
}

initMemorialPage();
