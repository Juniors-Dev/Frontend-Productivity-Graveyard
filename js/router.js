import { renderProject } from "../src/components/projects/project.js";
import { renderProfile } from "../src/components/profile/profile.js";
import { renderLoginForm } from "../src/components/forms/login/loginForm.js";

export function router() {
  const pathname = window.location.pathname;
  console.log("Initial pathname:", pathname); // Debug log

  switch (pathname) {
    case "/login/":
    case "/login.html":
    case "/src/components/forms/login/login.html":
      renderLoginForm();
      break;
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
