import { createEl } from "../../../utils/createEl.js";
import { validateComment } from "../../forms/validation.js";

export function createMainCommentForm({ onSubmit }) {
  const form = createEl("form", {
    class: "comment-form",
    id: "main-comment-form",
  });

  const textarea = createEl("textarea", {
    id: "main-comment-textarea",
    placeholder: "Write a condolence...",
    rows: 4,
    maxlength: 2000,
    required: true,
    "aria-label": "Write a condolence",
  });

  const submitBtn = createEl(
    "button",
    { type: "submit", class: "btn-beige btn-small", id: "new-comment-submit" },
    "Post Condolence",
  );

  const errorElem = createEl("div", {
    class: "form-message error",
    id: "main-comment-error",
    role: "alert",
    "aria-live": "polite",
  });

  textarea.addEventListener("input", () => {
    const result = validateComment(textarea.value.trim());
    if (result.isValid) {
      textarea.classList.remove("is-invalid");
      textarea.classList.add("is-valid");
      errorElem.textContent = "";
    } else {
      textarea.classList.remove("is-valid");
      textarea.classList.add("is-invalid");
      errorElem.textContent = result.message;
    }
  });

  textarea.addEventListener("blur", () => {
    if (!textarea.value.trim()) {
      textarea.classList.remove("is-invalid", "is-valid");
      errorElem.textContent = "";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorElem.textContent = "";

    const value = textarea.value.trim();
    const validation = validateComment(value);

    if (!validation.isValid) {
      textarea.classList.add("is-invalid");
      errorElem.textContent = validation.message;
      textarea.focus();
      return;
    }

    submitBtn.disabled = true;
    textarea.disabled = true;
    errorElem.textContent = "";

    try {
      const result = await onSubmit(value);
      if (result?.success) {
        textarea.value = "";
        textarea.classList.remove("is-valid", "is-invalid");
      } else {
        errorElem.textContent =
          result?.error ||
          "Sorry, we couldn't post your condolence. Please try again.";
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      errorElem.textContent = "Something went wrong. Please try again.";
    } finally {
      submitBtn.disabled = false;
      textarea.disabled = false;
      textarea.focus();
    }
  });

  form.append(textarea, submitBtn, errorElem);
  return form;
}

//TODO: Create reply/edit forms
