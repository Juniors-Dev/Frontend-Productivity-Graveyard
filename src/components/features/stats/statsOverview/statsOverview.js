export function renderStatsOverview(statsData) {
  const container = document.querySelector(".stats-overview-container");
  if (!container) return;

  const statsGrid = document.createElement("div");
  statsGrid.className = "stats-grid";

  const statCards = [
    {
      title: "BURIED TODAY",
      value: statsData.buriedToday || "6",
      icon: "/src/assets/img/skull.png",
    },
    {
      title: "AVG LIFESPAN",
      value: statsData.avgLifespan || "3 MONTHS",
      icon: "/src/assets/img/clock.png",
    },
    {
      title: "TOTAL USERS",
      value: statsData.totalUsers || "6",
      icon: "/src/assets/img/grimreaper.png",
    },
    {
      title: "TOTAL BURIED",
      value: statsData.totalBuried || "245",
      icon: "/src/assets/img/thombstone.png",
    },
    {
      title: "TOTAL LIKES GIVEN",
      value: statsData.totalLikes || "6",
      icon: "/src/assets/img/thumb.png",
    },
  ];

  statCards.forEach((stat) => {
    const card = createStatCard(stat);
    statsGrid.appendChild(card);
  });

  container.appendChild(statsGrid);
}

function createStatCard({ title, value, icon }) {
  const card = document.createElement("div");
  card.className = "stat-card";

  card.innerHTML = `
    <div class="stat-content">
      <div class="stat-text">
        <div class="stat-title">${title}</div>
        <div class="stat-value">${value}</div>
      </div>
      <div class="stat-icon">
        <img src="${icon}" alt="${title}" />
      </div>
    </div>
  `;

  return card;
}
