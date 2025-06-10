import { renderSignupForm } from "../components/forms/signup/renderSignupForm.js";
import { createFormHandler } from "../components/forms/formHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  if (!main) {
    console.error("Main element not found");
    return;
  }

  const signupForm = renderSignupForm();
  main.appendChild(signupForm);
  createFormHandler("#signup-form").init();
});
