import { renderProject } from "../src/components/projects/project.js";
import { renderProfile } from "../src/components/profile/profile.js";

export function router() {
  const pathname = window.location.pathname;
  console.log("Initial pathname:", pathname); // Debug log

  switch (pathname) {
    case "/profile/":
    case "/profile.html":
      renderProfile();
      renderProject();
      break;
    default:
      console.error("No matching route found for pathname:", pathname); // Debug log
      break;
  }
}
