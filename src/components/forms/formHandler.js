import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
  validateFirstName,
  validateLastName,
} from "./validation.js";
import { authService } from "./authService.js";
import { header } from "../layout/index.js";

/**
 * Form handler factory
 * @param {string} formSelector - CSS selector for the form
 * @returns {object} - { init }
 */
export function createFormHandler(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return { init: () => {} };

  // Input elements
  const usernameInput = form.querySelector("#username");
  const firstNameInput = form.querySelector("#firstName");
  const lastNameInput = form.querySelector("#lastName");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const confirmPasswordInput = form.querySelector("#confirm-password");
  const termsCheckbox = form.querySelector("#terms");

  // Error message elements
  const usernameError = form.querySelector("#username-error");
  const firstNameError = form.querySelector("#firstName-error");
  const lastNameError = form.querySelector("#lastName-error");
  const emailError = form.querySelector("#email-error");
  const passwordError = form.querySelector("#password-error");
  const confirmPasswordError = form.querySelector("#confirm-password-error");
  const termsError = form.querySelector("#terms-error");

  // Button (works for both .signup-button and .login-button)
  const submitButton = form.querySelector(".signup-button, .login-button");

  // Determine form type
  const isSignupForm = submitButton?.classList.contains("signup-button");

  // --- UI Feedback ---
  function showError(input, errorElem, result) {
    if (!input || !errorElem) return;
    if (result.isValid) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      errorElem.textContent = "";
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      errorElem.textContent = result.message;
    }
  }

  // --- Field Validation ---
  function validateField(fieldName) {
    let result = { isValid: true, message: "" };
    switch (fieldName) {
      case "username":
        if (usernameInput)
          result = validateUsername(usernameInput.value.trim());
        showError(usernameInput, usernameError, result);
        break;
      case "firstName":
        if (firstNameInput)
          result = validateFirstName(firstNameInput.value.trim());
        showError(firstNameInput, firstNameError, result);
        break;
      case "lastName":
        if (lastNameInput)
          result = validateLastName(lastNameInput.value.trim());
        showError(lastNameInput, lastNameError, result);
        break;
      case "email":
        if (emailInput) result = validateEmail(emailInput.value.trim());
        showError(emailInput, emailError, result);
        break;
      case "password":
        if (passwordInput) result = validatePassword(passwordInput.value);
        showError(passwordInput, passwordError, result);
        // Also validate confirm password if it exists and has a value
        if (confirmPasswordInput && confirmPasswordInput.value) {
          const confirmResult = validateConfirmPassword(
            passwordInput.value,
            confirmPasswordInput.value,
          );
          showError(confirmPasswordInput, confirmPasswordError, confirmResult);
        }
        break;
      case "confirmPassword":
        if (confirmPasswordInput)
          result = validateConfirmPassword(
            passwordInput.value,
            confirmPasswordInput.value,
          );
        showError(confirmPasswordInput, confirmPasswordError, result);
        break;
      case "terms":
        if (termsCheckbox) result = validateTerms(termsCheckbox.checked);
        showError(termsCheckbox, termsError, result);
        break;
    }
    return result.isValid;
  }

  function validateForm() {
    // Only validate fields that exist in the form
    const usernameValid = usernameInput ? validateField("username") : true;
    const firstNameValid = firstNameInput ? validateField("firstName") : true;
    const lastNameValid = lastNameInput ? validateField("lastName") : true;
    const emailValid = emailInput ? validateField("email") : true;
    const passwordValid = passwordInput ? validateField("password") : true;
    const confirmPasswordValid = confirmPasswordInput
      ? validateField("confirmPassword")
      : true;
    const termsValid = termsCheckbox ? validateField("terms") : true;
    return (
      usernameValid &&
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      termsValid
    );
  }

  // --- Loading and Message UI ---
  function showLoading() {
    if (!submitButton) return;
    submitButton.textContent = isSignupForm
      ? "Creating account..."
      : "Logging in...";
    submitButton.disabled = true;
    submitButton.classList.add("loading", "active");
  }
  function hideLoading() {
    if (!submitButton) return;
    // Set button text based on form type
    submitButton.textContent = submitButton.classList.contains("signup-button")
      ? "Signup"
      : "Login";
    submitButton.disabled = false;
    submitButton.classList.remove("loading", "active");
  }
  function showMessage(message, isError = false) {
    let messageElement = form.querySelector(".form-message");
    if (!messageElement) {
      messageElement = document.createElement("div");
      messageElement.className = "form-message";
      form.appendChild(messageElement);
    }
    messageElement.className = `form-message ${isError ? "error" : "success"}`;
    messageElement.textContent = message;
    if (isError) {
      messageElement.style.backgroundColor = "rgba(255, 71, 87, 0.1)";
      messageElement.style.color = "var(--color-error)";
      messageElement.style.border = "1px solid var(--color-error)";
    } else {
      messageElement.style.backgroundColor = "rgba(40, 167, 69, 0.1)";
      messageElement.style.color = "#28a745";
      messageElement.style.border = "1px solid #28a745";
    }
    setTimeout(
      () => {
        messageElement.style.opacity = "0";
        messageElement.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          messageElement.remove();
        }, 500);
      },
      isError ? 5000 : 5000,
    );
  }

  function clearValidation() {
    form.querySelectorAll("input").forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  }

  // --- Form Submission ---
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      const firstError = form.querySelector(".is-invalid");
      if (firstError) firstError.focus();
      return;
    }

    showLoading();

    try {
      if (isSignupForm) {
        // Signup
        const result = await authService.register(
          usernameInput.value.trim(),
          firstNameInput.value.trim(),
          lastNameInput.value.trim(),
          emailInput.value.trim(),
          passwordInput.value,
        );

        if (!result.success) {
          const error = new Error(result.message || "Registration failed");
          error.status = result.statusCode;
          throw error;
        }

        const username = result.user?.username || usernameInput.value.trim();
        showMessage(
          `Welcome ${username}! Account created successfully. Redirecting to login...`,
          false,
        );
        form.reset();
        clearValidation();

        setTimeout(() => {
          window.location.href = "/login.html";
        }, 2000);
      } else {
        // Login
        const result = await authService.login(
          emailInput.value.trim(),
          passwordInput.value,
        );

        if (!result.success) {
          const error = new Error(result.message || "Login failed");
          error.status = result.statusCode;
          throw error;
        }

        showMessage(
          `Welcome back, ${result.user?.username || "User"}! Redirecting...`,
          false,
        );

        // after successful login:
        if (header) {
          header.renderNavLinks();
        }
        window.location.href = "/profile.html?welcome=true";
      }
    } catch (error) {
      console.error("Form submission error:", error, error.response);

      let errorMessage = error.message;
      switch (error.status) {
        case 409:
          errorMessage =
            error.message || "A user with this email already exists";
          break;
        case 401:
          errorMessage = error.message || "Invalid email or password";
          break;
        case 400:
          errorMessage =
            error.message || "Bad request. Please check your input.";
          break;
        default:
          errorMessage = "Unable to connect to server. Please try again.";
      }

      showMessage(errorMessage, true);
    } finally {
      hideLoading();
    }
  }

  // --- Event Listeners ---
  function init() {
    if (!form) return;

    // Initialize auth service (set token if exists)
    authService.init();

    // Form event listeners
    usernameInput?.addEventListener("input", () => validateField("username"));
    firstNameInput?.addEventListener("input", () => validateField("firstName"));
    lastNameInput?.addEventListener("input", () => validateField("lastName"));
    emailInput?.addEventListener("input", () => validateField("email"));
    passwordInput?.addEventListener("input", () => validateField("password"));
    confirmPasswordInput?.addEventListener("input", () =>
      validateField("confirmPassword"),
    );
    termsCheckbox?.addEventListener("change", () => validateField("terms"));
    form.addEventListener("submit", handleSubmit);
  }

  return { init };
}
