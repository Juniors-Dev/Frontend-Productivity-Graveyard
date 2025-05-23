import { createFormHandler } from "../formHandler.js";

/**
 * Renders a complete signup form and returns the main container element
 * @param {HTMLElement} [targetElement=null] - Optional target element to append to
 * @returns {HTMLElement} - The main form container element
 */
export function renderSignupForm(targetElement = null) {
  //create main container
  const mainElement = document.createElement("main");

  // create container div
  const containerDiv = document.createElement("div");
  containerDiv.className = "container";

  // create form container
  const formContainerDiv = document.createElement("div");
  formContainerDiv.className = "form-container";

  // create heading
  const heading = document.createElement("h1");
  heading.className = "heading-1";
  heading.textContent = "Signup";

  // create tagline
  const tagline = document.createElement("p");
  tagline.className = "tagline";
  tagline.textContent = "Final resting place of good intentions.";

  // create form
  const form = document.createElement("form");
  form.id = "signup-form";
  form.setAttribute("novalidate", "");

  // add form fields
  form.appendChild(createFormField("username", "text", "Username", "username"));
  form.appendChild(createFormField("email", "email", "Email", "email"));
  form.appendChild(
    createFormField("password", "password", "Password", "new-password"),
  );
  form.appendChild(
    createFormField(
      "confirm-password",
      "password",
      "Confirm Password",
      "new-password",
      "confirmPassword",
    ),
  );
  form.appendChild(createCheckboxField());
  form.appendChild(createSubmitButton());

  // Add sign in link
  const signinLinkWrapper = document.createElement("div");
  signinLinkWrapper.className = "text-center signin-link-wrapper";
  const signinLink = document.createElement("a");
  signinLink.href = "../login/login.html";
  signinLink.className = "signup-link";
  signinLink.textContent = "Already have an account? Sign in";
  signinLinkWrapper.appendChild(signinLink);
  form.appendChild(signinLinkWrapper);

  // create decorative elements
  const grimReaper = document.createElement("div");
  grimReaper.className = "grim-reaper";

  // build the DOM structure
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
    document.body.appendChild(mainElement);
  }

  // Initialize validation and handlers for this form
  createFormHandler("#signup-form").init();

  // Consider also exporting these functions if using strict modules
  setTimeout(() => {
    if (typeof window.formValidation !== "undefined") {
      window.formValidation.init();
    }

    if (typeof window.formHandler !== "undefined") {
      window.formHandler.init();
    }
  }, 0);

  return mainElement;
}

/**
 * Creates a form field with label, input, and error message
 * @param {string} id - Input element ID
 * @param {string} type - Input type
 * @param {string} placeholder - Input placeholder text
 * @param {string} autocomplete Autocomplete attribute value
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
 * Creates the checkbox field for terms acceptance
 * @return {HTMLDivElement} - Checkbox form group
 */
function createCheckboxField() {
  // create form group
  const formGroup = document.createElement("div");
  formGroup.className = "form-group checkbox-group";

  // create the terms of service link
  const termsLink = document.createElement("a");
  termsLink.href = "termsofservice.html";
  termsLink.textContent = "Read Terms of Service";
  termsLink.className = "terms-link";
  termsLink.target = "_blank";
  termsLink.rel = "noopener noreferrer";

  // create custom checkbox wrapper
  const customCheckbox = document.createElement("div");
  customCheckbox.className = "custom-checkbox";

  // create checkbox input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "terms";
  checkbox.name = "terms";
  checkbox.required = true;

  // create label
  const label = document.createElement("label");
  label.setAttribute("for", "terms");
  label.className = "body-text";
  label.textContent = "Accept terms and conditions";

  // create error message
  const errorMessage = document.createElement("span");
  errorMessage.className = "error-message";
  errorMessage.id = "terms-error";

  // build structure
  customCheckbox.appendChild(checkbox);
  customCheckbox.appendChild(label);

  formGroup.appendChild(termsLink);
  formGroup.appendChild(customCheckbox);
  formGroup.appendChild(errorMessage);

  return formGroup;
}

/**
 * Creates the submit button
 * @returns {HTMLButtonElement} - submit button
 */
function createSubmitButton() {
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "signup-button body-text";
  button.textContent = "Signup";

  return button;
}
