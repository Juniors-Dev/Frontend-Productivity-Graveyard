import { api } from "../main.js";
import {
  renderStatsGrid,
  createStatCardSkeleton,
} from "../components/features/stats/statsCards.js";

const containerSelector = ".stats-overview-container";
const cardLimit = 6;

/**
 * Shows skeleton loading state for stats grid
 * @param {number} cardCount - Number of skeleton cards to show
 */
function showStatsSkeletons(count = cardLimit) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const skeletonGrid = document.createElement("div");
  skeletonGrid.className = "stats-grid";

  for (let i = 0; i < count; i++) {
    skeletonGrid.innerHTML += createStatCardSkeleton(i);
  }

  container.innerHTML = "";
  container.appendChild(skeletonGrid);
}

/**
 * Loads and displays statistics data from the API
 * @returns {Promise<void>} Promise that resolves when stats are loaded
 */
async function loadStats() {
  showStatsSkeletons(5);
  try {
    const response = await api.getAllStats();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch stats");
    }

    const statsData = response.data || {};

    renderStatsGrid(statsData, containerSelector);
  } catch (error) {
    console.error("Failed to load stats:", error);
    const container = document.querySelector(".stats-overview-container");
    if (container) {
      container.innerHTML = `<p>Failed to load statistics.</p>`;
    }
  }
}

loadStats();
