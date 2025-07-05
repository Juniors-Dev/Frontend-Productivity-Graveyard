/**
 * TODO:
 *   Improve error handling
 *   Loading states (skeleton?)
 *   Upvote functionality
 *   Check if owner or not (edit/delete buttons)
 *   Add profile link to username
 *   Comments integration
 */

import {
  populateProjectDetails,
  showError,
} from "../components/features/projectDetails/projectDetails.js";
import { api } from "../main.js";

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

async function fetchAndRenderProject(id) {
  try {
    const response = await api.getProject(id);

    if (response.success && response.data) {
      populateProjectDetails(response.data);
    } else {
      showError("Project not found");
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    showError("Failed to load project");
  }
}

fetchAndRenderProject(projectId);
