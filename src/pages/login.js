import { createFormHandler } from "../components/forms/formHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  createFormHandler("#login-form").init();
});
