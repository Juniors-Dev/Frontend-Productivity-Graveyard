import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
} from "./validation.js";

/**
 * Form handler factory
 * @param {string} formSelector - CSS selector for the form
 * @returns {object} - { init }
 */
export function createFormHandler(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return { init: () => {} };

  // Input elements (may not all exist)
  const usernameInput = form.querySelector("#username");
  const emailInput = form.querySelector("#email");
  const passwordInput = form.querySelector("#password");
  const confirmPasswordInput = form.querySelector("#confirm-password");
  const termsCheckbox = form.querySelector("#terms");

  // Error message elements (may not all exist)
  const usernameError = form.querySelector("#username-error");
  const emailError = form.querySelector("#email-error");
  const passwordError = form.querySelector("#password-error");
  const confirmPasswordError = form.querySelector("#confirm-password-error");
  const termsError = form.querySelector("#terms-error");

  // Button (works for both .signup-button and .login-button)
  const submitButton = form.querySelector(".signup-button, .login-button");

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
    const emailValid = emailInput ? validateField("email") : true;
    const passwordValid = passwordInput ? validateField("password") : true;
    const confirmPasswordValid = confirmPasswordInput
      ? validateField("confirmPassword")
      : true;
    const termsValid = termsCheckbox ? validateField("terms") : true;
    return (
      usernameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      termsValid
    );
  }

  // --- Loading and Message UI ---
  function showLoading() {
    if (!submitButton) return;
    submitButton.textContent = "Processing...";
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

  // --- Form Submission ---
  async function handleSubmit(event) {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      const firstError = form.querySelector(".is-invalid");
      if (firstError) firstError.focus();
      return;
    }
    showLoading();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showMessage(
        submitButton.classList.contains("signup-button")
          ? "Account created successfully! Redirecting to login..."
          : "Login successful! Redirecting...",
        false,
      );
      form.reset();
      form.querySelectorAll("input").forEach((input) => {
        input.classList.remove("is-valid", "is-invalid");
      });
      setTimeout(() => {
        // window.location.href = '/login';
        console.log("Would redirect to login page");
      }, 3000);
    } catch (error) {
      showMessage(
        error.message || "An error occurred during submission.",
        true,
      );
      console.error("Form error:", error);
    } finally {
      hideLoading();
    }
  }

  // --- Event Listeners ---
  function init() {
    if (!form) return;
    usernameInput?.addEventListener("input", () => validateField("username"));
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
