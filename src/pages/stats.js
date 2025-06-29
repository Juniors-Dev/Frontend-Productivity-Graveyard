import { api } from "../main.js";
import {
  renderStaticStatsGrid,
  populateStatsGrid,
  showAllStatsError,
} from "../components/features/stats/statsCards.js";

const containerSelector = ".stats-overview-container";

/**
 * Initializes the stats page with static layout
 */
function initializeStatsPage() {
  renderStaticStatsGrid(containerSelector);
  loadStats();
}

/**
 * Loads and displays statistics data from the API
 * @returns {Promise<void>} Promise that resolves when stats are loaded
 */
async function loadStats() {
  try {
    const response = await api.getAllStats();

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch stats");
    }

    const statsData = response.data || {};
    populateStatsGrid(statsData);
  } catch (error) {
    console.error("Failed to load stats:", error);
    showAllStatsError("—");
  }
}

initializeStatsPage();
