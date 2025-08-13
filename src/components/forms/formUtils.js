//These are form utils mostly used for Burypage, but can be modifed to be dynamic and use for all forms

export function showFieldError(input, errorElem, result) {
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

export function showLoading() {
  const submitButton = document.querySelector(".bury-button");
  if (submitButton) {
    submitButton.textContent = "Burying Project...";
    submitButton.disabled = true;
    submitButton.classList.add("loading", "active");
  }
}

export function showMessage(message, isError = false) {
  const form = document.querySelector("#bury-project-form");
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
    isError ? 5000 : 3000,
  );
}

export function hideLoading() {
  const submitButton = document.querySelector(".bury-button");
  if (submitButton) {
    submitButton.textContent = "Bury My Project";
    submitButton.disabled = false;
    submitButton.classList.remove("loading", "active");
  }
}

export function validateDates() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const endDateInput = document.getElementById("endDate");

  if (startDate && endDate) {
    if (new Date(endDate) <= new Date(startDate)) {
      endDateInput.setCustomValidity(
        "Project end date must be after start date",
      );
    } else {
      endDateInput.setCustomValidity("");
    }
  }
}
