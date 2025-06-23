import { formatLifespan } from "../../../utlis/formatters.js";

/**
 * Creates a single stat card component with static structure
 * @param {Object} stat - The stat data
 * @param {string} stat.title - The stat title
 * @param {string} stat.value - The stat value
 * @param {string} stat.icon - The icon path
 * @param {string} stat.id - Identifier for targeting the stat value
 * @param {number} index - Card index for styling and accessibility IDs
 * @param {boolean} isLoading - Whether to show loading state
 * @returns {HTMLElement} The stat card element
 */
function createStatCard({ title, value, icon, id }, index, isLoading = false) {
  const card = document.createElement("div");
  card.className = "stat-card";

  card.setAttribute("role", "group");
  card.setAttribute("aria-labelledby", `stat-title-${index}`);
  card.setAttribute("tabindex", "0");

  const cardClass = index % 2 === 0 ? "card-even" : "card-odd";
  card.classList.add(cardClass);

  const displayValue = isLoading
    ? '<span class="stat-loading">...</span>'
    : value || "0";

  card.innerHTML = `
    <div class="stat-content">
      <div class="stat-text">
        <div class="stat-title" id="stat-title-${index}">${title}</div>
        <div class="stat-value" data-value-target="${id}">${displayValue}</div>
      </div>
      <div class="stat-icon">
        <img id="stat-icon-${index}" src="${icon}" alt="${title}" onerror="this.style.display='none'" />
      </div>
    </div>
  `;

  return card;
}

/**
 * Updates a specific stat card's value
 * @param {string} statId - The stat ID to update
 * @param {string} value - The new value to display
 */
export function updateStatValue(statId, value) {
  const valueElement = document.querySelector(
    `[data-value-target="${statId}"]`,
  );
  if (valueElement) {
    valueElement.textContent = value;
  }
}

/**
 * Updates multiple stat values at once
 * @param {Object} statsData
 */
export function updateMultipleStats(statsData) {
  Object.entries(statsData).forEach(([statId, value]) => {
    updateStatValue(statId, value);
  });
}

/**
 * Renders the static stats grid with loading states
 * @param {string|HTMLElement} containerSelector - Container selector or element
 * @param {Object} options - Rendering options
 */
export function renderStaticStatsGrid(
  containerSelector = ".stats-overview-container",
  options = {},
) {
  const container =
    typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector;

  if (!container) return;

  const statsGrid = document.createElement("div");
  statsGrid.className = options.gridClass || "stats-grid";

  const statCards = [
    {
      id: "funeralsToday",
      title: "BURIED TODAY:",
      value: null,
      icon: "/src/assets/img/Tombstone_skull.png",
    },
    {
      id: "averageLifespan",
      title: "AVG LIFESPAN:",
      value: null,
      icon: "/src/assets/img/clock.png",
    },
    {
      id: "totalUsers",
      title: "TOTAL USERS:",
      value: null,
      icon: "/src/assets/img/grimreaper-let.png",
    },
    {
      id: "totalProjects",
      title: "TOTAL BURIED:",
      value: null,
      icon: "/src/assets/img/Tombstone_Grass.png",
    },
    {
      id: "totalVotes",
      title: "TOTAL LIKES GIVEN:",
      value: null,
      icon: "/src/assets/img/thumb.png",
    },
    {
      id: "topBurialDay",
      title: "DEADLIEST DAY:",
      value: null,
      icon: "/src/assets/img/skull.png",
    },
    {
      id: "totalComments",
      title: "TOTAL COMMENTS:",
      value: null,
      icon: "/src/assets/img/brain.png",
    },
    {
      id: "topBurialMonth",
      title: "DEADLIEST MONTH:",
      value: null,
      icon: "/src/assets/img/skull.png",
    },
  ];

  // Create cards in loading state
  statCards.forEach((stat, index) => {
    const card = createStatCard(stat, index, true);
    statsGrid.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(statsGrid);

  return statsGrid;
}

/**
 * Populates the static grid with actual data
 * @param {Object} statsData - The stats data from API
 */
export function populateStatsGrid(statsData) {
  const updates = {
    funeralsToday: statsData.funeralsToday?.toString() || "0",
    averageLifespan: formatLifespan(statsData.averageLifespan) || "0 days",
    totalUsers: statsData.totalUsers?.toString() || "0",
    totalProjects: statsData.totalProjects?.toString() || "0",
    totalVotes: statsData.totalVotes?.toString() || "0",
    topBurialDay: statsData.topBurialDay?.toString() || "",
    topBurialMonth: statsData.topBurialMonth?.toString() || "",
    totalComments: statsData.totalComments?.toString() || "0",
  };

  updateMultipleStats(updates);
}

/**
 * Shows loading state for specific stats
 * @param {Array<string>} statIds - Array of stat IDs to show loading for
 */
export function showStatsLoading(statIds) {
  statIds.forEach((statId) => {
    const valueElement = document.querySelector(
      `[data-value-target="${statId}"]`,
    );
    if (valueElement) {
      valueElement.innerHTML = '<span class="stat-loading">...</span>';
    }
  });
}

/**
 * Shows error state for all stats in the grid
 * @param {string} errorText - Error text to display
 */
export function showAllStatsError(errorText = "—") {
  const allValueElements = document.querySelectorAll("[data-value-target]");
  allValueElements.forEach((element) => {
    element.innerHTML = `<span class="stat-error">${errorText}</span>`;
  });
}

/**
 * Renders stat cards in a flexible layout
 * @param {Array} statsArray - Array of stat objects
 * @param {string|HTMLElement} containerSelector - Container selector or element
 * @param {Object} options - Rendering options
 */
export function renderStatsCards(statsArray, containerSelector, options = {}) {
  const container =
    typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector;

  if (!container) return;

  const cardsContainer = document.createElement("div");
  cardsContainer.className = options.containerClass || "stats-cards-container";

  statsArray.forEach((stat, index) => {
    const card = createStatCard(stat, index);
    if (options.cardClass) {
      card.classList.add(options.cardClass);
    }
    cardsContainer.appendChild(card);
  });

  if (options.clearContainer !== false) {
    container.innerHTML = "";
  }
  container.appendChild(cardsContainer);

  return cardsContainer;
}

/**
 * Renders a single stat card
 * @param {Object} stat - The stat data
 * @param {string|HTMLElement} containerSelector - Container selector or element
 * @param {Object} options - Rendering options
 */
export function renderSingleStatCard(stat, containerSelector, options = {}) {
  const container =
    typeof containerSelector === "string"
      ? document.querySelector(containerSelector)
      : containerSelector;

  if (!container) return;

  const card = createStatCard(stat);

  if (options.cardClass) {
    card.classList.add(options.cardClass);
  }

  if (options.clearContainer !== false) {
    container.innerHTML = "";
  }

  container.appendChild(card);
  return card;
}
