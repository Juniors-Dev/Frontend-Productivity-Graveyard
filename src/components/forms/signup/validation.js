// /**
//  * Form validation utility
//  * Handles client-side validation for signup form
//  */

// // DOM selectors - keep all at the top for easy reference
// const selectors = {
//   form: "#signup-form",
//   username: "#username",
//   email: "#email",
//   password: "#password",
//   confirmPassword: "#confirm-password",
//   terms: "#terms",
//   usernameError: "#username-error",
//   emailError: "#email-error",
//   passwordError: "#password-error",
//   confirmPasswordError: "#confirm-password-error",
//   termsError: "#terms-error",
// };

// // Validation criteria
// const validationRules = {
//   username: {
//     minLength: 3,
//     maxLength: 30,
//     pattern: /^[a-zA-Z0-9_-]+$/,
//     patternMessage:
//       "Username can only contain letters, numbers, underscores and hyphens",
//   },
//   password: {
//     minLength: 8,
//     hasUppercase: /[A-Z]/,
//     hasLowercase: /[a-z]/,
//     hasNumber: /[0-9]/,
//     hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
//   },
//   email: {
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//   },
// };

// /**
//  * Form validation module
//  * Validates input fields and provides user feedback
//  */
// const formValidation = (() => {
//   // Get DOM elements
//   const form = document.querySelector(selectors.form);

//   // Input elements
//   const usernameInput = document.querySelector(selectors.username);
//   const emailInput = document.querySelector(selectors.email);
//   const passwordInput = document.querySelector(selectors.password);
//   const confirmPasswordInput = document.querySelector(
//     selectors.confirmPassword,
//   );
//   const termsCheckbox = document.querySelector(selectors.terms);

//   // Error message elements
//   const usernameError = document.querySelector(selectors.usernameError);
//   const emailError = document.querySelector(selectors.emailError);
//   const passwordError = document.querySelector(selectors.passwordError);
//   const confirmPasswordError = document.querySelector(
//     selectors.confirmPasswordError,
//   );
//   const termsError = document.querySelector(selectors.termsError);

//   /**
//    * Validates username field
//    * @param {string} username - The username to validate
//    * @returns {object} - Validation result with isValid flag and message
//    */
//   const validateUsername = (username) => {
//     if (!username) {
//       return { isValid: false, message: "Username is required" };
//     }

//     if (username.length < validationRules.username.minLength) {
//       return {
//         isValid: false,
//         message: `Username must be at least ${validationRules.username.minLength} characters`,
//       };
//     }

//     if (username.length > validationRules.username.maxLength) {
//       return {
//         isValid: false,
//         message: `Username cannot exceed ${validationRules.username.maxLength} characters`,
//       };
//     }

//     if (!validationRules.username.pattern.test(username)) {
//       return {
//         isValid: false,
//         message: validationRules.username.patternMessage,
//       };
//     }

//     return { isValid: true, message: "" };
//   };

//   /**
//    * Validates email format
//    * @param {string} email - The email to validate
//    * @returns {object} - Validation result with isValid flag and message
//    */
//   const validateEmail = (email) => {
//     if (!email) {
//       return { isValid: false, message: "Email is required" };
//     }

//     if (!validationRules.email.pattern.test(email)) {
//       return { isValid: false, message: "Please enter a valid email address" };
//     }

//     return { isValid: true, message: "" };
//   };

//   /**
//    * Validates password strength
//    * @param {string} password - The password to validate
//    * @returns {object} - Validation result with isValid flag and message
//    */
//   const validatePassword = (password) => {
//     if (!password) {
//       return { isValid: false, message: "Password is required" };
//     }

//     if (password.length < validationRules.password.minLength) {
//       return {
//         isValid: false,
//         message: `Password must be at least ${validationRules.password.minLength} characters`,
//       };
//     }

//     const missingCriteria = [];

//     if (!validationRules.password.hasUppercase.test(password)) {
//       missingCriteria.push("an uppercase letter");
//     }

//     if (!validationRules.password.hasLowercase.test(password)) {
//       missingCriteria.push("a lowercase letter");
//     }

//     if (!validationRules.password.hasNumber.test(password)) {
//       missingCriteria.push("a number");
//     }

//     if (!validationRules.password.hasSpecialChar.test(password)) {
//       missingCriteria.push("a special character");
//     }

//     if (missingCriteria.length > 0) {
//       return {
//         isValid: false,
//         message: `Password must include ${missingCriteria.join(", ")}`,
//       };
//     }

//     return { isValid: true, message: "" };
//   };

//   /**
//    * Confirms that passwords match
//    * @param {string} password - The original password
//    * @param {string} confirmPassword - The confirmation password
//    * @returns {object} - Validation result with isValid flag and message
//    */
//   const validateConfirmPassword = (password, confirmPassword) => {
//     if (!confirmPassword) {
//       return { isValid: false, message: "Please confirm your password" };
//     }

//     if (password !== confirmPassword) {
//       return { isValid: false, message: "Passwords do not match" };
//     }

//     return { isValid: true, message: "" };
//   };

//   /**
//    * Validates terms checkbox
//    * @param {boolean} checked - Whether the terms checkbox is checked
//    * @returns {object} - Validation result with isValid flag and message
//    */
//   const validateTerms = (checked) => {
//     if (!checked) {
//       return {
//         isValid: false,
//         message: "You must accept the terms and conditions",
//       };
//     }

//     return { isValid: true, message: "" };
//   };

//   /**
//    * Updates the UI to show validation results
//    * @param {HTMLElement} inputElement - The input element
//    * @param {HTMLElement} errorElement - The error message element
//    * @param {object} validationResult - The validation result
//    */
//   const updateValidationUI = (inputElement, errorElement, validationResult) => {
//     if (validationResult.isValid) {
//       inputElement.classList.remove("is-invalid");
//       inputElement.classList.add("is-valid");
//       errorElement.textContent = "";
//     } else {
//       inputElement.classList.remove("is-valid");
//       inputElement.classList.add("is-invalid");
//       errorElement.textContent = validationResult.message;
//     }
//   };

//   /**
//    * Validates a specific field
//    * @param {string} fieldName - The name of the field to validate
//    * @returns {boolean} - Whether the field is valid
//    */
//   const validateField = (fieldName) => {
//     let validationResult = { isValid: true, message: "" };

//     switch (fieldName) {
//       case "username":
//         validationResult = validateUsername(usernameInput.value.trim());
//         updateValidationUI(usernameInput, usernameError, validationResult);
//         break;

//       case "email":
//         validationResult = validateEmail(emailInput.value.trim());
//         updateValidationUI(emailInput, emailError, validationResult);
//         break;

//       case "password":
//         validationResult = validatePassword(passwordInput.value);
//         updateValidationUI(passwordInput, passwordError, validationResult);

//         // Also validate confirm password if it has a value
//         if (confirmPasswordInput.value) {
//           const confirmResult = validateConfirmPassword(
//             passwordInput.value,
//             confirmPasswordInput.value,
//           );
//           updateValidationUI(
//             confirmPasswordInput,
//             confirmPasswordError,
//             confirmResult,
//           );
//         }
//         break;

//       case "confirmPassword":
//         validationResult = validateConfirmPassword(
//           passwordInput.value,
//           confirmPasswordInput.value,
//         );
//         updateValidationUI(
//           confirmPasswordInput,
//           confirmPasswordError,
//           validationResult,
//         );
//         break;

//       case "terms":
//         validationResult = validateTerms(termsCheckbox.checked);
//         updateValidationUI(termsCheckbox, termsError, validationResult);
//         break;
//     }

//     return validationResult.isValid;
//   };

//   /**
//    * Validates all form fields
//    * @returns {boolean} - Whether the form is valid
//    */
//   const validateForm = () => {
//     const usernameValid = validateField("username");
//     const emailValid = validateField("email");
//     const passwordValid = validateField("password");
//     const confirmPasswordValid = validateField("confirmPassword");
//     const termsValid = validateField("terms");

//     return (
//       usernameValid &&
//       emailValid &&
//       passwordValid &&
//       confirmPasswordValid &&
//       termsValid
//     );
//   };

//   /**
//    * Initializes form validation with event listeners
//    */
//   const init = () => {
//     if (!form) return;

//     // Add input event listeners for real-time validation
//     usernameInput.addEventListener("input", () => validateField("username"));
//     emailInput.addEventListener("input", () => validateField("email"));
//     passwordInput.addEventListener("input", () => validateField("password"));
//     confirmPasswordInput.addEventListener("input", () =>
//       validateField("confirmPassword"),
//     );
//     termsCheckbox.addEventListener("change", () => validateField("terms"));

//     // Add blur event listeners for validation when user leaves a field
//     usernameInput.addEventListener("blur", () => validateField("username"));
//     emailInput.addEventListener("blur", () => validateField("email"));
//     passwordInput.addEventListener("blur", () => validateField("password"));
//     confirmPasswordInput.addEventListener("blur", () =>
//       validateField("confirmPassword"),
//     );
//   };

//   // Public API
//   return {
//     init,
//     validateField,
//     validateForm,
//   };
// })();

// // Initialize validation
// document.addEventListener("DOMContentLoaded", formValidation.init);

// // Export for use in other modules
// export { formValidation };
