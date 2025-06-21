import { formatLifespan } from "../../../utlis/formatters.js";

/**
 * Creates a skeleton loading version of a stat card
 * @returns {string} HTML string for skeleton stat card
 */
export function createStatCardSkeleton(index) {
  const cardClass = index % 2 === 0 ? "card-even" : "card-odd";

  return `
    <div class="stat-card skeleton-card skeleton-container ${cardClass}">
      <div class="stat-content">
        <div class="stat-text">
          <div class="skeleton skeleton-stat-title"></div>
          <div class="skeleton skeleton-stat-value"></div>
        </div>
        <div class="stat-icon">
          <div class="skeleton skeleton-stat-icon"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a single stat card component
 * @param {Object} stat - The stat data
 * @param {string} stat.title - The stat title
 * @param {string} stat.value - The stat value
 * @param {string} stat.icon - The icon path
 * @returns {HTMLElement} The stat card element
 */
function createStatCard({ title, value, icon }, index) {
  const card = document.createElement("div");
  card.className = "stat-card";

  card.setAttribute("role", "group");
  card.setAttribute("aria-labelledby", `stat-title-${index}`);
  card.setAttribute("tabindex", "0");

  if (index % 2 === 0) {
    card.classList.add("card-even");
  } else {
    card.classList.add("card-odd");
  }

  card.innerHTML = `
    <div class="stat-content">
      <div class="stat-text">
        <div class="stat-title">${title}</div>
        <div class="stat-value">${value}</div>
      </div>
      <div class="stat-icon">
        <img src="${icon}" alt="${title}" onerror="this.style.display='none'" />
      </div>
    </div>
  `;

  return card;
}

/**
 * Renders multiple stat cards in a grid layout
 * @param {Object} statsData - The stats data object
 * @param {string|HTMLElement} containerSelector - Container selector or element
 * @param {Object} options - Rendering options
 */

export function renderStatsGrid(
  statsData,
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
      title: "BURIED TODAY:",
      value: statsData.funeralsToday?.toString() || "0",
      icon: "/src/assets/img/Tombstone_skull.png",
    },
    {
      title: "AVG LIFESPAN:",
      value: formatLifespan(statsData.averageLifespan) || "0 days",
      icon: "/src/assets/img/clock.png",
    },
    {
      title: "TOTAL USERS:",
      value: statsData.totalUsers?.toString() || "0",
      icon: "/src/assets/img/grimreaper-let.png",
    },
    {
      title: "TOTAL BURIED:",
      value: statsData.totalProjects?.toString() || "0",
      icon: "/src/assets/img/Tombstone_Grass.png",
    },
    {
      title: "TOTAL LIKES GIVEN:",
      value: statsData.totalVotes?.toString() || "0",
      icon: "/src/assets/img/thumb.png",
    },
  ];

  //Create and append cards
  statCards.forEach((stat, index) => {
    const card = createStatCard(stat, index);
    statsGrid.appendChild(card);
  });

  //Clear container and append grid
  container.innerHTML = "";
  container.appendChild(statsGrid);
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

  //Create cards from array
  statsArray.forEach((stat) => {
    const card = createStatCard(stat);
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
