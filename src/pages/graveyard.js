import { renderProjectCard } from "../components/features/projectCard/projectCard.js";

// Example usage:
const exampleProject = {
  image: "./src/assets/img/skull.png",
  title: "TODO LIST V9",
  reason: "Got Bored",
  lifespan: "2001 - 2002",
  author: "-RAGE_YOEI",
  description:
    "It started like every other side project -- with hope, a clean main branch, and way too many Post-it notes. But after two days of enthusiastic planning and zero follow-through, it was left to rot in my project folder. I still believe in the idea. I just don't believe I'll ever open it again.",
  burriedBy: "@rage_ypei",
  causeOfDeath: "Shiny Object Synddasdasdasdasd asdasdrome",
  likes: 7,
};

const exampleProject1 = {
  image: "./src/assets/img/brain.png",
  title: "Brainstorm App",
  reason: "Got lost in the storm",
  lifespan: "2022 - 2024",
  author: "-AUTH_OR",
  description:
    "A project meant to revolutionize brainstorming sessions but ended up being a collection of half-baked ideas.",
  burriedBy: "@auth_or",
  causeOfDeath: "Caught in a shitstorm",
  likes: 11,
};
const exampleProject2 = {
  image: "./src/assets/img/clock.png",
  title: "Time Tracker",
  reason: "Time's up!",
  lifespan: "2021 - 2023",
  author: "-TYMWSTR",
  description:
    "An ambitious time-tracking app that ironically ran out of time to be completed.",
  burriedBy: "@time_waster",
  causeOfDeath: "Time management issues",
  likes: 9,
};

renderProjectCard(exampleProject);
renderProjectCard(exampleProject1);
renderProjectCard(exampleProject2);
