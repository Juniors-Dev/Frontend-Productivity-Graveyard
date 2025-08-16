import { createEl } from "../../../utils/createEl.js";
import { timeAgo } from "../../../utils/dateHandlers.js";
import { isCommentDeleted, getUserAvatarUrl } from "./helpers.js";
import { canReply, canModify } from "./permissions.js";

/**
 * Render a list of comments
 * @param {Array<Object>} comments - Array of comment objects
 * @param {Object} options - Rendering options
 * @param {Object|null} options.currentUser - Current authenticated user
 * @param {Function} options.onReply - Reply button click handler
 * @param {Function} options.onEdit - Edit button click handler
 * @param {Function} options.onDelete - Delete button click handler
 * @returns {HTMLElement} Comments list container
 */
export function renderCommentsList(comments, options = {}) {
  const list = createEl("div", { class: "comments-list" });
  comments.forEach((comment) => list.appendChild(renderComment(comment, options)));
  return list;
}

/**
 * Render a single comment with replies
 * @param {Object} comment - Comment object from API
 * @param {Object} options - Same as renderCommentsList options
 * @returns {HTMLElement} Comment element
 */
export function renderComment(comment, options = {}) {
  const { currentUser, onReply, onEdit, onDelete } = options;

  if (isCommentDeleted(comment)) {
    return renderDeletedComment(comment);
  }

  const el = createEl("div", {
    class: "comment",
    "data-comment-id": comment.id,
  });

  const metaRow = renderCommentMeta(comment);
  el.appendChild(metaRow);

  const message = createEl("div", { class: "comment-message" }, comment.message);
  el.appendChild(message);

  if (currentUser && currentUser.id) {
    const actions = renderCommentActions(comment, {
      currentUser,
      onReply,
      onEdit,
      onDelete,
    });

    if (actions.hasChildNodes()) {
      el.appendChild(actions);
    }
  }

  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = createEl("div", { class: "comment-replies" });
    comment.replies.forEach((reply) => {
      repliesContainer.appendChild(renderComment(reply, options));
    });
    el.appendChild(repliesContainer);
  }

  return el;
}

function renderCommentMeta(comment) {
  const metaRow = createEl("div", { class: "comment-meta" });

  const userSection = createEl("div");

  const avatar = createEl("img", {
    class: "comment-avatar",
    src: getUserAvatarUrl(comment.User),
    alt: `${comment.User?.username || "User"} avatar`,
  });

  const username = createEl(
    "span",
    { class: "comment-username" },
    comment.User?.username || "Anonymous",
  );

  userSection.append(avatar, username);

  const time = createEl("span", { class: "comment-time" }, timeAgo(comment.createdAt));
  metaRow.append(userSection, time);

  return metaRow;
}

function renderCommentActions(comment, options) {
  const { currentUser, onReply, onEdit, onDelete } = options;
  const actions = createEl("div", { class: "comment-actions" });
  const leftActions = createEl("div");
  const rightActions = createEl("div");

  if (canReply(comment, currentUser)) {
    const replyBtn = createEl(
      "button",
      { class: "btn-small", "aria-label": "Reply to comment" },
      "Reply",
    );
    replyBtn.onclick = () => onReply?.(comment.id);
    leftActions.appendChild(replyBtn);
  }

  if (canModify(comment, currentUser)) {
    const editBtn = createEl(
      "button",
      { class: "btn-small", "aria-label": "Edit comment" },
      "Edit",
    );
    editBtn.onclick = () => onEdit?.(comment.id);

    const deleteBtn = createEl(
      "button",
      { class: "btn-small", "aria-label": "Delete comment" },
      "Delete",
    );
    deleteBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this comment?")) {
        onDelete?.(comment.id);
      }
    };

    rightActions.append(editBtn, deleteBtn);
  }

  if (leftActions.hasChildNodes()) actions.appendChild(leftActions);
  if (rightActions.hasChildNodes()) actions.appendChild(rightActions);

  return actions;
}

function renderDeletedComment(comment) {
  const el = createEl("div", {
    class: "comment deleted",
    "data-comment-id": comment.id,
  });

  const metaRow = createEl("div", { class: "comment-meta" });
  const userSection = createEl("div");

  userSection.appendChild(
    createEl("span", { class: "comment-username" }, "Condolence deleted"),
  );

  const time = createEl("span", { class: "comment-time" }, timeAgo(comment.createdAt));
  metaRow.append(userSection, time);

  const message = createEl("div", { class: "comment-message" }, "[deleted]");
  el.append(metaRow, message);

  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = createEl("div", { class: "comment-replies" });
    comment.replies.forEach((reply) => {
      repliesContainer.appendChild(renderDeletedComment(reply));
    });
    el.appendChild(repliesContainer);
  }

  return el;
}

export function renderEmpty() {
  return createEl("div", { class: "comments-empty" }, "No condolences yet.");
}

export function renderError(message = "Something went wrong") {
  return createEl("div", { class: "error-state" }, message);
}
