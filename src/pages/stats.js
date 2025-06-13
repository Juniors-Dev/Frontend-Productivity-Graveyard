import { renderStatsOverview } from "../components/features/stats/statsOverview/statsOverview.js";

const mockStatsData = {
  buriedToday: 6,
  avgLifespan: "3 MONTHS",
  totalUsers: 6,
  totalBuried: 245,
  totalLikes: 6,
};

renderStatsOverview(mockStatsData);
