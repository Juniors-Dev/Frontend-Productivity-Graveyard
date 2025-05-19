// /**
//  * Form handler module
//  * Handles form submission and API interactions
//  */

// const formHandler = (() => {
//     // DOM selectors
//     const form = document.querySelector('#signup-form');
//     const submitButton = document.querySelector('.signup-button');

//     /**
//      * Serializes form data to JSON
//      * @param {HTMLFormElement} form - The form to serialize
//      * @returns {object} - The serialized form data
//      */
//     const serializeForm = (form) => {
//         const formData = new FormData(form);
//         const data = {};

//         for (const [key, value] of formData.entries()) {
//             data[key] = value;
//         }

//         return data;
//     };

//     /**
//      * Shows loading state on the form
//      */
//     const showLoading = () => {
//         submitButton.textContent = 'Processing...';
//         submitButton.disabled = true;
//         submitButton.classList.add('loading', 'active');
//     };

//     /**
//      * Hides loading state on the form
//      */
//     const hideLoading = () => {
//         submitButton.textContent = 'Signup';
//         submitButton.disabled = false;
//         submitButton.classList.remove('loading', 'active');
//     };

//     /**
//      * Displays a form submission result message
//      * @param {string} message - The message to display
//      * @param {boolean} isError - Whether the message is an error
//      */
//     const showMessage = (message, isError = false) => {
//         // Create message element
//         const messageElement = document.createElement('div');
//         messageElement.className = `form-message ${isError ? 'error' : 'success'}`;
//         messageElement.textContent = message;
//         messageElement.style.padding = '10px';
//         messageElement.style.marginTop = '20px';
//         messageElement.style.borderRadius = 'var(--border-radius)';
//         messageElement.style.textAlign = 'center';
//         messageElement.style.fontWeight = '500';

//         if (isError) {
//             messageElement.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
//             messageElement.style.color = 'var(--color-error)';
//             messageElement.style.border = '1px solid var(--color-error)';
//         } else {
//             messageElement.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
//             messageElement.style.color = '#28a745';
//             messageElement.style.border = '1px solid #28a745';
//         }

//         // Remove any existing messages
//         const existingMessage = form.querySelector('.form-message');
//         if (existingMessage) {
//             existingMessage.remove();
//         }

//         // Append message after form
//         form.appendChild(messageElement);

//         // Auto-remove after 5 seconds for success messages
//         if (!isError) {
//             setTimeout(() => {
//                 messageElement.style.opacity = '0';
//                 messageElement.style.transition = 'opacity 0.5s ease';

//                 setTimeout(() => {
//                     messageElement.remove();
//                 }, 500);
//             }, 5000);
//         }
//     };

//     /**
//      * Handles form submission and API interaction
//      * @param {Event} event - The form submission event
//      */
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Access the global validation function
//         const isValid = window.formValidation.validateForm();

//         if (!isValid) {
//             // Scroll to the first error
//             const firstError = document.querySelector('.is-invalid');
//             if (firstError) {
//                 firstError.focus();
//             }
//             return;
//         }

//         // Show loading state
//         showLoading();

//         // Get form data
//         const formData = serializeForm(form);

//         try {
//             // Simulate API call with a timeout
//             await new Promise(resolve => setTimeout(resolve, 1500));

//             // For demonstration purposes, let's simulate a successful API call
//             // In a real application, you would send data to your server

//             // Mock API call
//             /*
//             const response = await fetch('/api/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'Registration failed');
//             }

//             const data = await response.json();
//             */

//             // Show success message
//             showMessage('Account created successfully! Redirecting to login...', false);

//             // Clear form
//             form.reset();

//             // Remove valid/invalid classes
//             const inputs = form.querySelectorAll('input');
//             inputs.forEach(input => {
//                 input.classList.remove('is-valid', 'is-invalid');
//             });

//             // Redirect to login after a delay
//             setTimeout(() => {
//                 // In a real app, redirect to login page
//                 // window.location.href = '/login';
//                 console.log('Would redirect to login page');
//             }, 3000);

//         } catch (error) {
//             // Show error message
//             showMessage(error.message || 'An error occurred during registration. Please try again.', true);
//             console.error('Registration error:', error);
//         } finally {
//             // Hide loading state
//             hideLoading();
//         }
//     };

//     /**
//      * Initializes the form handler
//      */
//     const init = () => {
//         if (!form) return;

//         // Add form submission handler
//         form.addEventListener('submit', handleSubmit);

//         // Enable password visibility toggle (as an enhancement)
//         setupPasswordVisibility();
//     };

//     /**
//      * Sets up password visibility toggle functionality
//      */
//     const setupPasswordVisibility = () => {
//         // This could be implemented as an enhancement
//         // For now, we'll skip this to keep the code focused
//     };

//     // Public API
//     return {
//         init
//     };
// })();

// // Initialize form handler when DOM is ready
// document.addEventListener('DOMContentLoaded', formHandler.init);
