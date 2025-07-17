import { authService } from "../../forms/authService.js";
import { createEl } from "../../../utils/createEl.js";
import { pagination } from "../pagination/pagination.js";
import { validateComment } from "../../forms/validation.js";
import { timeAgo } from "../../../utils/dateHandlers.js";

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function closeAllCommentForms() {
  document
    .querySelectorAll(".reply-form, .edit-form")
    .forEach((form) => form.remove());
}

/**
 * Adds a new comment to the DOM without requiring a page refresh
 * @param {Object} newComment - The comment object returned from the API
 * @param {string|null} parentId - ID of parent comment if this is a reply, null for root comments
 * @param {Object} api - API client instance for making requests
 * @param {string} projectId - ID of the project the comment belongs to
 */
function addNewCommentToDOM(newComment, parentId, api, projectId) {
  const commentElement = renderComment({
    comment: newComment,
    projectId: projectId,
    onCommentAction: () => {},
    api: api,
    page: 1,
  });

  if (parentId) {
    const parentComment = document.querySelector(
      `[data-comment-id="${parentId}"]`,
    );
    let repliesContainer = parentComment.querySelector(".comment-replies");

    if (!repliesContainer) {
      repliesContainer = document.createElement("div");
      repliesContainer.className = "comment-replies";
      parentComment.appendChild(repliesContainer);
    }

    repliesContainer.appendChild(commentElement);
  } else {
    const commentsList = document.querySelector(".comments-list");
    const emptyMessage = commentsList.querySelector(".comments-empty");

    if (emptyMessage) {
      emptyMessage.remove();
    }
    commentsList.insertBefore(commentElement, commentsList.firstChild);
  }
}

// =============================================================================
// COMMENTS RENDERING
// =============================================================================

/**
 * Creates the main comments container with pagination
 * @param {Object} config - Configuration object
 * @param {Array} config.comments - Array of comment objects to render
 * @param {number} config.page - Current page number
 * @param {number} config.totalPages - Total number of pages
 * @param {Function} config.onPageChange - Callback for pagination changes
 * @param {Function} config.onCommentAction - Callback for comment actions
 * @param {string} config.projectId - ID of the project
 * @param {Object} config.api - API client instance
 * @returns {HTMLElement} The comments list container element
 */
export function renderComments({
  comments,
  page,
  totalPages,
  onPageChange,
  onCommentAction,
  projectId,
  api,
}) {
  const commentsList = createEl("div", { class: "comments-list" });

  if (comments.length) {
    comments.forEach((comment) => {
      commentsList.append(
        renderComment({ comment, projectId, onCommentAction, api, page }),
      );
    });
  } else {
    commentsList.append(
      createEl(
        "div",
        { class: "comments-empty" },
        "No condolences... not even fake ones.",
      ),
    );
  }

  if (totalPages > 1) {
    const paginationContainer = createEl("div", { class: "pagination" });
    pagination({
      current: page,
      total: totalPages,
      container: paginationContainer,
      onPageChange,
    });
    commentsList.append(paginationContainer);
  }

  return commentsList;
}

/**
 * Renders an individual comment with all its features
 * @param {Object} config - Configuration object
 * @param {Object} config.comment - The comment object to render
 * @param {string} config.projectId - ID of the project
 * @param {Function} config.onCommentAction - Callback for comment actions
 * @param {Object} config.api - API client instance
 * @param {number} config.page - Current page number
 * @returns {HTMLElement} The rendered comment element
 */
function renderComment({ comment, projectId, onCommentAction, api, page }) {
  const user = authService.getCurrentUser();

  const isDeleted =
    comment.isDeleted || comment.message === "[deleted]" || !comment.User;

  const el = createEl("div", {
    class: isDeleted ? "comment deleted" : "comment",
    "data-comment-id": comment.id,
  });

  if (isDeleted) {
    const metaRow = createEl("div", { class: "comment-meta" });
    const userSection = createEl("div");
    const deletedLabel = createEl(
      "span",
      { class: "comment-username" },
      "Condolence deleted",
    );
    const time = createEl(
      "span",
      { class: "comment-time" },
      timeAgo(comment.createdAt),
    );

    userSection.append(deletedLabel);
    metaRow.append(userSection, time);

    const msg = createEl("div", { class: "comment-message" }, "[deleted]");
    el.append(metaRow, msg);

    if (Array.isArray(comment.replies) && comment.replies.length > 0) {
      const repliesContainer = createEl("div", { class: "comment-replies" });

      comment.replies.forEach((reply) => {
        repliesContainer.append(
          renderComment({
            comment: reply,
            projectId,
            onCommentAction,
            api,
            page,
          }),
        );
      });

      el.append(repliesContainer);
    }

    return el;
  }

  const initialsName =
    comment.User?.fullName || comment.User?.username || "User";
  const avatarUrl =
    comment.User?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(initialsName)}&background=random`;

  const avatar = createEl("img", {
    class: "comment-avatar",
    src: avatarUrl,
    alt: comment.User?.username || "User avatar",
  });

  const userName = createEl(
    "span",
    { class: "comment-username" },
    comment.User?.username || "Anonymous",
  );

  const time = createEl(
    "span",
    { class: "comment-time" },
    timeAgo(comment.createdAt),
  );

  const userSection = createEl("div");
  userSection.append(avatar, userName);

  const metaRow = createEl("div", { class: "comment-meta" });
  metaRow.append(userSection, time);

  let msg = createEl("div", { class: "comment-message" }, comment.message);
  const actions = createEl("div", { class: "comment-actions" });
  const leftActions = createEl("div");
  const rightActions = createEl("div");

  //Reply button (only for root comments and authenticated users)
  if (user && user.id && comment.parentId === null) {
    const replyBtn = createEl("button", { class: "btn-small" }, "Reply");
    replyBtn.onclick = () => {
      closeAllCommentForms();
      if (!el.querySelector(".reply-form")) {
        const form = renderReplyForm({
          projectId,
          parentId: comment.id,
          api,
        });
        el.append(form);
        form.querySelector("textarea").focus();
      }
    };
    leftActions.append(replyBtn);
  }

  // Add edit and delete buttons (only for comment owners)
  if (user && user.id && comment.User && comment.User.id === user.id) {
    //edit
    const editBtn = createEl("button", { class: "btn-small" }, "Edit");
    editBtn.onclick = () => {
      closeAllCommentForms();
      if (el.querySelector(".edit-form")) return;
      const editForm = renderEditForm({
        comment,
        api,
        onSave: (updated) => {
          msg.textContent = updated.message;
          el.removeChild(editForm);
          msg.style.display = "";
        },
        page,
      });
      el.insertBefore(editForm, msg);
      msg.style.display = "none";
      editForm.querySelector("textarea").focus();
    };
    rightActions.append(editBtn);

    //delete
    const deleteBtn = createEl("button", { class: "btn-small" }, "Delete");
    const actionError = createEl("span", { class: "form-message error" });

    deleteBtn.onclick = async () => {
      if (confirm("Are you sure you want to delete this comment?")) {
        deleteBtn.disabled = true;
        try {
          const res = await api.deleteComment(comment.id);
          if (res.success) {
            el.classList.add("deleted");

            const avatar = el.querySelector(".comment-avatar");
            const username = el.querySelector(".comment-username");
            if (avatar) avatar.style.display = "none";
            if (username) username.textContent = "Comment deleted";

            msg.textContent = "[deleted]";
            msg.classList.add("deleted");

            actions.style.display = "none";
          } else {
            actionError.textContent =
              res.message || "Failed to delete comment.";
          }
        } catch (err) {
          actionError.textContent = err?.message || "Error deleting comment.";
          console.error(err);
        }
        deleteBtn.disabled = false;
      }
    };
    rightActions.append(deleteBtn, actionError);
  }

  actions.append(leftActions, rightActions);
  el.append(metaRow, msg, actions);

  if (Array.isArray(comment.replies) && comment.replies.length > 0) {
    const repliesContainer = createEl("div", { class: "comment-replies" });

    comment.replies.forEach((reply) => {
      repliesContainer.append(
        renderComment({
          comment: reply,
          projectId,
          onCommentAction,
          api,
          page,
        }),
      );
    });

    el.append(repliesContainer);
  }

  return el;
}

// =============================================================================
// COMMENT FORMS
// =============================================================================

/**
 * Handles authentication state and form submission
 * @param {string} projectId - ID of the project to create comments for
 * @param {Function} onCommentAction - Callback function to execute after comment actions
 * @param {Object} api - API client instance for making requests
 */
export function setupMainCommentForm(projectId, onCommentAction, api) {
  const user = authService.getCurrentUser();
  const formContainer = document.getElementById("comment-form-container");
  const loginHint = document.getElementById("comments-login-hint");

  if (!formContainer || !loginHint) return;

  if (user && user.id) {
    formContainer.style.display = "block";
    loginHint.style.display = "none";

    const form = document.getElementById("main-comment-form");
    const textarea = document.getElementById("main-comment-textarea");
    const errorElem = document.getElementById("main-comment-error");
    const submitBtn = document.getElementById("new-comment-submit");

    if (!form || !textarea || !errorElem || !submitBtn) return;

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
      errorElem.textContent = "";
      textarea.classList.remove("is-invalid", "is-valid");
    });

    form.onsubmit = async (e) => {
      e.preventDefault();
      const value = textarea.value.trim();
      const result = validateComment(value);

      if (!result.isValid) {
        textarea.classList.remove("is-valid");
        textarea.classList.add("is-invalid");
        errorElem.textContent = result.message;
        textarea.focus();
        return;
      }

      submitBtn.disabled = true;
      errorElem.textContent = "";

      try {
        const res = await api.createProjectComment(projectId, {
          message: value,
          parentId: null,
        });

        if (res.success) {
          errorElem.textContent = "";
          textarea.value = "";
          textarea.classList.remove("is-valid", "is-invalid");
          addNewCommentToDOM(res.data, null, api, projectId);
        } else {
          errorElem.textContent = res.message || "Failed to submit comment.";
        }
      } catch (err) {
        errorElem.textContent = "Error submitting comment.";
        console.error(err);
      }

      if (submitBtn) submitBtn.disabled = false;
    };
  } else {
    formContainer.style.display = "none";
    loginHint.style.display = "block";
  }
}

/**
 * Creates a generic comment form (reply or edit)
 * @param {Object} config - Configuration object
 * @param {string} config.type - Form type: 'reply' or 'edit'
 * @param {string} config.placeholder - Textarea placeholder text
 * @param {string} config.submitText - Submit button text
 * @param {string} config.initialValue - Initial textarea value (for edit forms)
 * @param {Function} config.onSubmit - Submit handler function
 * @param {Function} config.onCancel - Cancel handler function
 * @returns {HTMLElement} The form element
 */
function createCommentForm({
  type,
  placeholder,
  submitText,
  initialValue = "",
  onSubmit,
  onCancel,
}) {
  const form = createEl("form", { class: `${type}-form` });

  const textarea = createEl("textarea", {
    required: true,
    rows: 2,
    placeholder,
    maxlength: 2000,
    value: initialValue,
    "aria-label": type === "reply" ? "Write a reply" : "Edit comment",
    "aria-describedby": `${type}-form-error`,
  });

  const errorElem = createEl("div", {
    class: "form-message error",
    id: `${type}-form-error`,
    role: "alert",
    "aria-live": "polite",
  });

  const submitBtn = createEl(
    "button",
    { type: "submit", class: "btn-small" },
    submitText,
  );

  const cancelBtn = createEl(
    "button",
    { type: "button", class: "btn-small" },
    "Cancel",
  );

  form.append(textarea, submitBtn, cancelBtn, errorElem);

  setupFormEventHandlers(
    form,
    textarea,
    errorElem,
    submitBtn,
    cancelBtn,
    onSubmit,
    onCancel,
  );

  return form;
}

/**
 * Sets up all common event handlers for comment forms
 */
function setupFormEventHandlers(
  form,
  textarea,
  errorElem,
  submitBtn,
  cancelBtn,
  onSubmit,
  onCancel,
) {
  cancelBtn.onclick = (e) => {
    e.preventDefault();
    errorElem.textContent = "";
    onCancel();
  };

  form.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      errorElem.textContent = "";
      onCancel();
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

  form.onsubmit = async (e) => {
    e.preventDefault();
    const value = textarea.value.trim();
    const result = validateComment(value);

    if (!result.isValid) {
      textarea.classList.add("is-invalid");
      errorElem.textContent = result.message;
      textarea.focus();
      return;
    }

    submitBtn.disabled = true;
    errorElem.textContent = "";

    try {
      await onSubmit(value, errorElem);
    } catch (err) {
      errorElem.textContent = "An unexpected error occurred.";
      console.error(err);
    }

    submitBtn.disabled = false;
  };
}

/**
 * Renders a reply form for responding to comments
 * @param {Object} config - Configuration object
 * @param {string} config.projectId - ID of the project
 * @param {string} config.parentId - ID of the parent comment being replied to
 * @param {Object} config.api - API client instance for making requests
 * @returns {HTMLElement} The reply form element
 */
function renderReplyForm({ projectId, parentId, api }) {
  let form;

  form = createCommentForm({
    type: "reply",
    placeholder: "Write a reply...",
    submitText: "Reply",
    onSubmit: async (value, errorElem) => {
      const res = await api.createProjectComment(projectId, {
        message: value,
        parentId,
      });

      if (res.success) {
        errorElem.textContent = "";
        addNewCommentToDOM(res.data, parentId, api, projectId);
        form.remove();
      } else {
        errorElem.textContent = res.message || "Failed to submit reply.";
        throw new Error(res.message);
      }
    },
    onCancel: () => {
      form.remove();
    },
  });

  return form;
}

/**
 * Renders an edit form for modifying existing comments
 * @param {Object} config - Configuration object
 * @param {Object} config.comment - The comment object to edit
 * @param {Object} config.api - API client instance for making requests
 * @param {Function} config.onSave - Callback function executed when comment is saved
 * @returns {HTMLElement} The edit form element
 */
function renderEditForm({ comment, api, onSave }) {
  let form;

  form = createCommentForm({
    type: "edit",
    placeholder: "Edit your comment...",
    submitText: "Save",
    initialValue: comment.message,
    onSubmit: async (value, errorElem) => {
      const res = await api.updateComment(comment.id, { message: value });

      if (res.success && res.data) {
        errorElem.textContent = "";
        onSave(res.data);
      } else {
        errorElem.textContent = res.message || "Failed to update comment.";
        throw new Error(res.message);
      }
    },
    onCancel: () => {
      form.remove();
      if (form.previousSibling) form.previousSibling.style.display = "";
    },
  });

  return form;
}
