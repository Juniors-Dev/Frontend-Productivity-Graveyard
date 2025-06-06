import { renderLoginForm } from "../components/forms/login/renderLoginForm.js";
import { createFormHandler } from "../components/forms/formHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (!main) {
    console.error("Main element not found");
    return;
  }

  const loginForm = renderLoginForm();
  createFormHandler("#login-form").init();
  main.appendChild(loginForm);
});
