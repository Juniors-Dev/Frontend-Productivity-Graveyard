import { createEl } from "../../../utils/createEl.js";
import { validateComment } from "../../forms/validation.js";    

/**
 * Create the main comment form for posting new root comments
 * @param {Object} config - Configuration object
 * @param {Function} config.onSubmit - Async function called on form submission with message text
 * @returns {HTMLFormElement} The main comment form element
 */
export function createMainCommentForm({ onSubmit }) {
  const form = createEl("form", { class: "comment-form", id: "main-comment-form" });

  const textarea = createEl("textarea", {
    id: "main-comment-textarea",
      placeholder: "Write a condolence...",
      rows: 4,
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
        errorElem.textContent = result?.error || "Sorry, we couldn't post your condolence. Please try again.";
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
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

/**
 * Create a reply form for responding to comments
 * @param {Object} config - Configuration object
 * @param {Function} config.onSubmit - Async function called on form submission with message text
 * @param {Function} config.onCancel - Function called when form is cancelled
 * @param {string} [config.formId] - Optional ID for the form element
 * @returns {HTMLFormElement} The reply form element
 */
export function createReplyForm({ onSubmit, onCancel, formId }) {
  const form = createEl("form", {
    class: "reply-form",
    id: formId || undefined,
  });

  const textarea = createEl("textarea", {
    required: true,
    rows: 2,
    placeholder: "Write a reply...",
    "aria-label": "Write a reply",
  });
  const errorElem = createEl("div", { class: "form-message error", role: "alert", "aria-live": "assertive" });
  const submitBtn = createEl(
    "button",
    { type: "submit", class: "btn-beige btn-small" },
    "Reply",
  );
  const cancelBtn = createEl(
    "button",
    { type: "button", class: "btn-small" },
    "Cancel",
  );

  form.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      errorElem.textContent = "";
      onCancel?.();
    }
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

  cancelBtn.onclick = (e) => {
    e.preventDefault();
    onCancel?.();
  };

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
    const prevLabel = submitBtn.textContent;
    submitBtn.textContent = "Posting…";
    try {
      const result = await onSubmit?.(value);
      if (result?.success) {
        return;
      }
      errorElem.textContent = result?.error || "Could not post reply.";
    } catch {
      errorElem.textContent = "Something went wrong.";
    } finally {
      submitBtn.textContent = prevLabel;
      submitBtn.disabled = false;
      textarea.disabled = false;
    }
  });

  form.append(textarea, submitBtn, cancelBtn, errorElem);
  setTimeout(() => textarea.focus(), 0);
  return form;
}

/**
 * Create an edit form for modifying existing comments
 * @param {Object} config - Configuration object
 * @param {string} [config.initialValue=""] - Initial text value for the textarea
 * @param {Function} config.onSubmit - Async function called on form submission with message text
 * @param {Function} config.onCancel - Function called when form is cancelled
 * @param {string} [config.formId] - Optional ID for the form element
 * @returns {HTMLFormElement} The edit form element
 */
export function createEditForm({ initialValue = "", onSubmit, onCancel, formId }) {
  const form = createEl("form", {
    class: "edit-form",
    id: formId || undefined,
  });

  const textarea = createEl("textarea", {
    required: true,
    rows: 3,
    value: initialValue,
    "aria-label": "Edit comment",
  });
  const errorElem = createEl("div", { class: "form-message error", role: "alert", "aria-live": "assertive" });
  const saveBtn = createEl(
    "button",
    { type: "submit", class: "btn-beige btn-small" },
    "Save",
  );
  const cancelBtn = createEl(
    "button",
    { type: "button", class: "btn-small" },
    "Cancel",
  );

  form.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      errorElem.textContent = "";
      onCancel?.();
    }
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

  cancelBtn.onclick = (e) => {
    e.preventDefault();
    onCancel?.();
  };

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
    saveBtn.disabled = true;
    textarea.disabled = true;
    const prevLabel = saveBtn.textContent;
    saveBtn.textContent = "Saving…";
    try {
      const result = await onSubmit?.(value);
      if (result?.success) {
        return;
      }
      errorElem.textContent = result?.error || "Could not update comment.";
    } catch {
      errorElem.textContent = "Something went wrong.";
    } finally {
      saveBtn.textContent = prevLabel;
      saveBtn.disabled = false;
      textarea.disabled = false;
    }
  });

  form.append(textarea, saveBtn, cancelBtn, errorElem);
  setTimeout(() => {
    textarea.focus();
    const len = textarea.value.length;
    textarea.setSelectionRange(len, len);
  }, 0);
  return form;
}