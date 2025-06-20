import { renderProfileProjectCard } from "../components/features/profileProjectCard/profileProjectCard.js";
import { renderProfile } from "../components/features/profile/profile.js";

const profileData = {
  picture: "./src/assets/img/noimage.png",
  name: "Johan Nordstrand",
  nickname: "@rage_ypei",
  location: "Norway",
  buriedProjects: 12,
  memberSince: "March 31, 2025",
};

renderProfile(profileData);

// Example usage:
const projectSkull = {
  image: "./src/assets/img/skull.png",
  title: "TODO LIST V9",
  description:
    "It started like every other side project - with hope, a clean main branch, and way too many Post-it notes. But after two days of enthusiastic planning and zero follow-through, it was left to rot in my project folder. I still believe in the idea. I just don't believe I'll ever open it again.",
  years: "2023–2025",
  likes: 13,
};

const projectBrain = {
  image: "./src/assets/img/brain.png",
  title: "Brainstorm App",
  description:
    "A project meant to revolutionize brainstorming sessions but ended up being a collection of half-baked ideas.",
  years: "2022–2024",
  likes: 8,
};

const projectClock = {
  image: "./src/assets/img/clock.png",
  title: "Time Tracker",
  description:
    "An ambitious time-tracking app that ironically ran out of time to be completed.",
  years: "2021–2023",
  likes: 5,
};

// Render all projects
renderProfileProjectCard(projectSkull);
renderProfileProjectCard(projectBrain);
renderProfileProjectCard(projectClock);
