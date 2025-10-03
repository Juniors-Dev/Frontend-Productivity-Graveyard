import { getPageState } from "./getPageState.js";
import { setPageState } from "./setPageState.js";
import { renderIndicators } from "./renderIndicators.js";
import {
  projectCard,
  projectCardSkeleton,
} from "../projectCard/projectCard.js";
import { showSkeletons } from "./showSkeletons.js";
import { pagination } from "../pagination/pagination.js";
import { api } from "../../../main.js";

/**
 * Fetch projects from the API and render them into the graveyard page.
 *
 * - Reads pagination + filter state from the current URL.
 * - Shows skeleton placeholders while loading.
 * - Requests the project list from the API with the correct query params.
 * - Renders project cards or a “no projects” message.
 * - Sets up pagination controls and wires them to update the URL and re-render.
 *
 * @async
 * @function fetchAndRenderProjects
 * @returns {Promise<void>} Resolves after the DOM is updated.
 *
 * @example
 * await fetchAndRenderProjects();
 */
export async function fetchAndRenderProjects() {
  const projectsContainer = document.querySelector(".project-container");
  const paginationContainer = document.querySelector(".pagination");
  const { order, orderBy, query, types, limit, offset, currentPage } =
    getPageState();
  renderIndicators();
  showSkeletons(limit, projectsContainer, projectCardSkeleton);
  try {
    const options = { offset, limit, types, order, orderBy };
    if (query?.length) options.query = query;
    const res = await api.getAllProjects(options);

    const projects = res.data || [];
    const total = res.meta?.total || 0;
    const totalPages = Math.ceil(total / limit);

    projectsContainer.innerHTML = "";

    if (projects.length === 0) {
      projectsContainer.innerHTML =
        "<p>No projects found. Try another page.</p>";
    } else {
      projects.forEach((project) => {
        projectsContainer.append(projectCard(project));
      });
    }

    pagination({
      current: currentPage,
      total: totalPages,
      container: paginationContainer,
      onPageChange: (newPage) => {
        setPageState({ offset: (newPage - 1) * limit }, fetchAndRenderProjects);
      },
    });
  } catch {
    projectsContainer.innerHTML =
      "<p>An error occurred fetching projects, please refresh the page.</p>";
  }
}
