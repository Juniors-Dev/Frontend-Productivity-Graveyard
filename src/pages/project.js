import { api } from "../main.js";
import { renderMemorial } from "../components/features/memorial/memorial.js";
import { initComments } from "../components/features/comments/index.js";
import { authService } from "../components/forms/authService.js";

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
      throw new Error("Something went wrong. Please refresh the page or try again later.");
    }
    document.getElementById("memorial-loading").style.display = "none";
    document.querySelector(".tombstone-content").style.display = "";
    renderMemorial(res.data);
    return res.data;
  } catch (err) {
    document.getElementById("memorial-loading").style.display = "none";
    if (errorMsg) {
      errorMsg.textContent = "Unable to load this memorial. Please try refreshing the page.";
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
        errorMsg.innerHTML = `
        <p>We couldn't find this memorial.</p>
        <a href="/graveyard.html" class="btn-beige btn-small">Browse all memorials</a>
        `;
       errorMsg.style.display = "";
     }
     return;
   }
   try {
     await loadProject(projectId);
     
     const commentsContainer = document.getElementById("comments-container");
     const currentUser = authService.getCurrentUser();

    initComments({
       projectId,
       api,
       container: commentsContainer,
       currentUser
     });

   } catch (err) {
     console.error("Error initializing memorial page:", err);
   }
 }

 initMemorialPage();

