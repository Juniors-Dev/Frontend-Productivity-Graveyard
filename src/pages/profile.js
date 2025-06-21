// import { renderProfileProjectCard } from "../components/features/profileProjectCard/profileProjectCard.js";
import { renderProfile } from "../components/features/profile/profile.js";
import { api } from "../main.js";

// const profileData = {
//   picture: "src/assets/img/noimage.png",
//   name: "Johan Nordstrand",
//   nickname: "@rage_ypei",
//   location: "Norway",
//   buriedProjects: 12,
//   memberSince: "March 31, 2025",
// };

const user = await api.getCurrentUser();
// const userId = user.data.id;
// const usersProjects = await api.getAllProjects({ userId });
// const userStats = await api.getUserStats(userId);
renderProfile(user.data);
