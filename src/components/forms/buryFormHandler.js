import {
  showMessage,
  showLoading,
  hideLoading,
  validateBuryForm,
} from "./formUtils.js";

export async function handleBurySubmit(event, api) {
  event.preventDefault();

  if (!validateBuryForm()) {
    const firstError = document.querySelector(".is-invalid");
    if (firstError) firstError.focus();
    return;
  }

  showLoading();

  try {
    const form = event.target;
    const formData = new FormData(form);

    // Collect project types
    const types = Array.from(
      form.querySelectorAll('input[name="types"]:checked'),
    ).map((cb) => parseInt(cb.value));

    const projectData = {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      eulogy: formData.get("eulogy").trim(),
      causeOfDeath: formData.get("causeOfDeath").trim(),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      types: types,
      tombstoneId: parseInt(formData.get("tombstoneId")),
      status: formData.get("status"),
    };

    const result = await api.createProject(projectData);

    if (!result.success) {
      throw new Error(result.message || "Failed to bury project");
    }

    showMessage(
      "Project buried successfully! Redirecting to graveyard...",
      false,
    );

    // Reset form
    form.reset();
    document.querySelectorAll(".is-valid, .is-invalid").forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });

    // Reset character counters
    document.getElementById("description-count").textContent = "0/500";
    document.getElementById("eulogy-count").textContent = "0/300";

    // Redirect to graveyard after success
    setTimeout(() => {
      window.location.href = "/graveyard.html";
    }, 2000);
  } catch (error) {
    console.error("Bury form submission error:", error);

    let errorMessage = "Failed to bury project. Please try again.";
    if (error.message) {
      errorMessage = error.message;
    }

    showMessage(errorMessage, true);
  } finally {
    hideLoading();
  }
}
