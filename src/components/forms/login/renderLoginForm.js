import { createFormHandler } from "../formHandler.js";

/**
 * Renders a basic login form and returns the main container element
 * @param {HTMLElement} [targetElement=null] - Optional target element to append to
 * @returns {HTMLElement} - The main form container element
 */
export function renderLoginForm(targetElement = null) {
  // Create main container
  const mainElement = document.createElement("section");

  // Create container div
  const containerDiv = document.createElement("div");
  containerDiv.className = "container";

  // Create form container
  const formContainerDiv = document.createElement("div");
  formContainerDiv.className = "form-container";

  // Create heading
  const heading = document.createElement("h1");
  heading.className = "heading-1";
  heading.textContent = "Login";

  // Create tagline
  const tagline = document.createElement("p");
  tagline.className = "tagline";
  tagline.textContent = "Final resting place of good intentions.";

  // Create form
  const form = document.createElement("form");
  form.id = "login-form";
  form.setAttribute("novalidate", "");

  // Add form fields - email and password only for login
  form.appendChild(createFormField("email", "email", "Email", "email"));
  form.appendChild(
    createFormField("password", "password", "Password", "current-password"),
  );

  // Create forgot password link
  const forgotPasswordLink = document.createElement("a");
  forgotPasswordLink.href = "#";
  forgotPasswordLink.className = "forgot-password-link";
  forgotPasswordLink.textContent = "Forgot your password?";

  // Add forgot password link to form
  const forgotPasswordWrapper = document.createElement("div");
  forgotPasswordWrapper.className = "text-center forgot-password-wrapper";
  forgotPasswordWrapper.appendChild(forgotPasswordLink);
  form.appendChild(forgotPasswordWrapper);

  // Add login button
  form.appendChild(createLoginButton());

  // Create "Or signup" link
  const signupLinkWrapper = document.createElement("div");
  signupLinkWrapper.className = "text-center signup-link-wrapper";

  const signupLink = document.createElement("a");
  signupLink.href = "/signup.html";
  signupLink.className = "signup-link";
  signupLink.textContent = "Or signup";

  signupLinkWrapper.appendChild(signupLink);
  form.appendChild(signupLinkWrapper);

  // Create decorative elements
  const grimReaper = document.createElement("div");
  grimReaper.className = "grim-reaper";

  // Build the DOM structure
  formContainerDiv.appendChild(heading);
  formContainerDiv.appendChild(tagline);
  formContainerDiv.appendChild(form);

  containerDiv.appendChild(formContainerDiv);

  mainElement.appendChild(containerDiv);
  mainElement.appendChild(grimReaper);

  // If a target element is provided, append or replace
  if (targetElement) {
    // Clear the target element first
    targetElement.innerHTML = "";
    targetElement.appendChild(mainElement);
  } else {
    // If no target provided, append to body
    document.body.appendChild(mainElement);
  }

  // Initialize validation and handlers for this form
  createFormHandler("#login-form").init();

  return mainElement;
}

/**
 * Creates a form field with label, input, and error message
 * @param {string} id - Input element ID
 * @param {string} type - Input type
 * @param {string} placeholder - Input placeholder text
 * @param {string} autocomplete - Autocomplete attribute value
 * @param {string} [name] - Input name (defaults to ID if not provided)
 * @returns {HTMLDivElement} - Form group element
 */
function createFormField(id, type, placeholder, autocomplete, name = id) {
  // create form group
  const formGroup = document.createElement("div");
  formGroup.className = "form-group";

  // create label
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.className = "visually-hidden";
  label.textContent = placeholder;

  // create input wrapper
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";

  // create icon and input container
  const iconInputContainer = document.createElement("div");
  iconInputContainer.className = "input-icon-container";
  iconInputContainer.style.position = "relative";
  iconInputContainer.style.width = "100%";
  iconInputContainer.style.display = "flex";
  iconInputContainer.style.alignItems = "center";

  // create icon
  const icon = document.createElement("span");
  icon.className = `input-icon ${id}-icon`;
  icon.setAttribute("aria-hidden", "true");

  // create input
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.name = name;
  input.placeholder = placeholder;
  input.required = true;
  input.autocomplete = autocomplete;

  // create error message
  const errorMessage = document.createElement("span");
  errorMessage.className = "error-message";
  errorMessage.id = `${id}-error`;

  // build structure
  iconInputContainer.appendChild(icon);
  iconInputContainer.appendChild(input);
  inputWrapper.appendChild(iconInputContainer);
  inputWrapper.appendChild(errorMessage);

  formGroup.appendChild(label);
  formGroup.appendChild(inputWrapper);

  return formGroup;
}

/**
 * Creates the login button
 * @returns {HTMLButtonElement} - Login button
 */
function createLoginButton() {
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "login-button body-text";
  button.textContent = "Login";

  return button;
}
