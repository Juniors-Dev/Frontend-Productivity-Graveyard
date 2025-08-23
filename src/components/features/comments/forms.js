import { createEl } from "../../../utils/createEl.js";
import { validateComment } from "../../forms/validation.js";
import { showFieldError } from "../../forms/formUtils.js";

const FORM_CONFIGS = {
  reply: {
    className: "reply-form",
    textareaRows: 2,
    placeholder: "Write a reply...",
    submitText: "Reply",
    submitClass: "btn-beige btn-small",
    ariaLabel: "Write a reply",
    loadingText: "Posting...",
    errorMessage: "Unable to post your reply. Please try again.",
    showCancel: true,
    caretToEnd: false,
  },
  edit: {
    className: "edit-form",
    textareaRows: 3,
    placeholder: "Edit your comment…",
    submitText: "Save",
    submitClass: "btn-beige btn-small",
    ariaLabel: "Edit comment",
    loadingText: "Saving…",
    errorMessage: "Unable to save your changes. Please try again.",
    showCancel: true,
    caretToEnd: true,
  },
};

/**
 * Wire up all form behavior (validation, submission, loading states, etc.)
 * Shared between factory-created forms and HTML forms
 *
 * @param {Object} config - Configuration object
 * @param {'main'|'reply'|'edit'} config.type - Form type
 * @param {HTMLTextAreaElement} config.textarea - Textarea element
 * @param {HTMLButtonElement} config.submitBtn - Submit button element
 * @param {HTMLElement} config.errorElem - Element for displaying errors
 * @param {HTMLButtonElement} [config.cancelBtn] - Cancel button (reply/edit only)
 * @param {HTMLButtonElement} [config.clearBtn] - Clear button (main only)
 * @param {Function} config.onSubmit - Async function called on form submission
 * @param {Function} [config.onCancel] - Function called when form is cancelled
 * @param {Object} config.cfg - Form configuration object
 * @param {string} [config.initialValue=""] - Initial textarea value (for edit forms)
 * @returns {Function} Cleanup function to remove event listeners
 */
function wireFormBehavior({
  type,
  textarea,
  submitBtn,
  errorElem,
  cancelBtn,
  clearBtn,
  onSubmit,
  onCancel,
  cfg,
  initialValue = "",
}) {
  if (!textarea || !submitBtn || !errorElem) return () => {};

  const handleInput = () => {
    const res = validateComment(textarea.value.trim());
    showFieldError(textarea, errorElem, res);
    if (clearBtn) clearBtn.hidden = !textarea.value.trim();
  };

  const handleBlur = () => {
    if (type === "main" && !textarea.value.trim()) {
      textarea.classList.remove("is-invalid", "is-valid");
      textarea.setAttribute("aria-invalid", "false");
      errorElem.textContent = "";
    }
  };

  const handleKeydown = (e) => {
    if (cancelBtn && e.key === "Escape") {
      e.preventDefault();
      errorElem.textContent = "";
      onCancel?.();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    errorElem.textContent = "";
    onCancel?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    errorElem.textContent = "";
    const value = textarea.value.trim();
    const validation = validateComment(value);

    if (!validation.isValid) {
      showFieldError(textarea, errorElem, validation);
      textarea.focus();
      return;
    }

    showFieldError(textarea, errorElem, { isValid: true, message: "" });

    const prevLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    textarea.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;
    submitBtn.textContent = cfg.loadingText;

    try {
      const result = await onSubmit?.(value);
      if (result?.success) {
        if (type === "main") {
          textarea.value = "";
          textarea.classList.remove("is-valid", "is-invalid");
          textarea.setAttribute("aria-invalid", "false");
          if (clearBtn) clearBtn.hidden = true;
        }
        return;
      }
      const fallback = cfg.errorMessage || "Something went wrong.";
      showFieldError(textarea, errorElem, {
        isValid: false,
        message: result?.message || fallback,
      });
    } catch {
      errorElem.textContent =
        "We're having trouble connecting. Please check your internet and try again.";
    } finally {
      submitBtn.textContent = prevLabel;
      submitBtn.disabled = false;
      textarea.disabled = false;
      if (cancelBtn) cancelBtn.disabled = false;
      if (clearBtn) clearBtn.disabled = false;
      textarea.focus();
    }
  };

  textarea.addEventListener("input", handleInput);
  textarea.addEventListener("blur", handleBlur);
  if (cancelBtn) {
    cancelBtn.addEventListener("click", handleCancel);
  }

  const form = submitBtn.form || textarea.closest("form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
    if (cancelBtn) {
      form.addEventListener("keydown", handleKeydown);
    }
  }

  requestAnimationFrame(() => {
    textarea.focus();
    if (
      cfg.caretToEnd &&
      initialValue &&
      typeof textarea.setSelectionRange === "function"
    ) {
      const len = textarea.value.length;
      textarea.setSelectionRange(len, len);
    }
  });

  return () => {
    textarea.removeEventListener("input", handleInput);
    textarea.removeEventListener("blur", handleBlur);
    if (cancelBtn) {
      cancelBtn.removeEventListener("click", handleCancel);
    }
    if (form) {
      form.removeEventListener("submit", handleSubmit);
      if (cancelBtn) {
        form.removeEventListener("keydown", handleKeydown);
      }
    }
  };
}

/**
 * Factory for creating dynamic comment forms
 *
 * @param {Object} config - Configuration object
 * @param {'reply'|'edit'} config.type - Type of form to create
 * @param {Function} config.onSubmit - Async function called on form submission
 * @param {Function} config.onCancel - Function called when form is cancelled
 * @param {string} [config.initialValue=""] - Initial textarea value (for edit forms)
 * @param {string} [config.formId] - Optional ID for ARIA relationships
 * @returns {HTMLFormElement} Created form element
 */
function createCommentFormFactory({
  type,
  onSubmit,
  onCancel,
  initialValue = "",
  formId,
}) {
  const cfg = FORM_CONFIGS[type];
  if (!cfg) throw new Error(`Invalid form type: ${type}`);

  const form = createEl("form", {
    class: cfg.className,
    "data-form-type": type,
    ...(formId && { id: formId }),
  });

  const errorId = formId ? `${formId}-error` : undefined;
  const errorElem = createEl("div", {
    class: "form-message error",
    role: "alert",
    "aria-live": "polite",
    ...(errorId && { id: errorId }),
  });

  const textarea = createEl("textarea", {
    required: true,
    rows: cfg.textareaRows,
    maxlength: 2000,
    placeholder: cfg.placeholder,
    "aria-label": cfg.ariaLabel,
    "aria-invalid": "false",
    ...(errorId && { "aria-describedby": errorId }),
    ...(initialValue ? { value: initialValue } : {}),
  });

  const submitBtn = createEl(
    "button",
    {
      type: "submit",
      class: cfg.submitClass,
    },
    cfg.submitText,
  );

  const cancelBtn = createEl(
    "button",
    {
      type: "button",
      class: "btn-small",
    },
    "Cancel",
  );

  form.append(textarea, submitBtn, cancelBtn, errorElem);

  wireFormBehavior({
    type,
    textarea,
    submitBtn,
    errorElem,
    cancelBtn,
    clearBtn: null,
    onSubmit,
    onCancel,
    cfg,
    initialValue,
  });

  return form;
}

/**
 * Create a reply form with cancel button
 *
 * @param {Object} config - Configuration object
 * @param {Function} config.onSubmit - Async function called on form submission
 * @param {Function} config.onCancel - Function called when form is cancelled
 * @param {string} [config.formId] - Optional ID for ARIA relationships
 * @returns {HTMLFormElement} Reply form element
 */
export function createReplyForm({ onSubmit, onCancel, formId }) {
  return createCommentFormFactory({
    type: "reply",
    onSubmit,
    onCancel,
    formId,
  });
}

/**
 * Create an edit form with cancel button and caret positioning
 *
 * @param {Object} config - Configuration object
 * @param {string} [config.initialValue=""] - Initial textarea value
 * @param {Function} config.onSubmit - Async function called on form submission
 * @param {Function} config.onCancel - Function called when form is cancelled
 * @param {string} [config.formId] - Optional ID for ARIA relationships
 * @returns {HTMLFormElement} Edit form element
 */
export function createEditForm({
  initialValue = "",
  onSubmit,
  onCancel,
  formId,
}) {
  return createCommentFormFactory({
    type: "edit",
    onSubmit,
    onCancel,
    initialValue,
    formId,
  });
}

/**
 * Setup the main comment form that exists in HTML
 *
 * @param {Object} config - Configuration object
 * @param {Function} config.onSubmit - Async function called on form submission
 * @returns {Function} Cleanup function to remove event listeners and restore DOM
 */
export function setupMainCommentForm({ onSubmit }) {
  const form = document.getElementById("main-comment-form");
  const textarea = document.getElementById("main-comment-textarea");
  const submitBtn = document.getElementById("new-comment-submit");
  const errorElem = document.getElementById("main-comment-error");
  const clearBtn = form?.querySelector(".input-clear-btn");

  if (!form || !textarea || !submitBtn || !errorElem) {
    console.error("Main comment form elements not found in DOM");
    return () => {};
  }

  const handleClearClick = (e) => {
    e.preventDefault();
    textarea.value = "";
    textarea.classList.remove("is-valid", "is-invalid");
    textarea.setAttribute("aria-invalid", "false");
    errorElem.textContent = "";
    clearBtn.hidden = true;
    textarea.focus();
  };
  if (clearBtn) {
    clearBtn.addEventListener("click", handleClearClick);
  }

  const behaviorCleanup = wireFormBehavior({
    type: "main",
    textarea,
    submitBtn,
    errorElem,
    cancelBtn: null,
    clearBtn,
    onSubmit,
    onCancel: null,
    cfg: {
      loadingText: "Posting...",
      errorMessage: "Could not post your condolence. Please try again.",
      caretToEnd: false,
    },
    initialValue: "",
  });

  return () => {
    behaviorCleanup();

    clearBtn.removeEventListener("click", handleClearClick);
  };
}
