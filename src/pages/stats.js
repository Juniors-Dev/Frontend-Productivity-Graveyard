import { api } from "../main.js";
import { renderStatsGrid } from "../components/features/stats/statsCards.js";

async function loadStats() {
  try {
    const response = await api.getAllStats();

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch stats");
    }

    renderStatsGrid(response.data);

  } catch (error) {
    console.error("Failed to load stats:", error);
    const container = document.querySelector(".stats-overview-container");
    if (container) {
      container.innerHTML = `<p>Failed to load statistics.</p>`;
    }
  }
}

loadStats();