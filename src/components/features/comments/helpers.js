import { avatarApiUrl } from "../../../utils/constants.js";

/**
 * Check if a comment is deleted
 * @param {Object} comment - The comment object
 * @returns {boolean} True if comment is deleted
 */
export const isCommentDeleted = (comment) => comment?.isDeleted === true;

/**
 * Generate avatar URL for a user
 * @param {Object} user - The user object
 * @returns {string} Avatar URL
 */
export const getUserAvatarUrl = (user) =>
  user?.avatarUrl ||
  `${avatarApiUrl}/?name=${encodeURIComponent(user?.username || "Anonymous")}&background=random`;

/**
 * Close all open comment forms
 */
export const closeAllForms = () => {
  document
    .querySelectorAll(".reply-form, .edit-form")
    .forEach((form) => form.remove());
};

/**
 * Find a comment element by its id within a root container
 * @param {HTMLElement} root
 * @param {string|number} commentId
 * @returns {HTMLElement|null}
 */
export const getCommentEl = (root, commentId) =>
  root?.querySelector?.(`[data-comment-id="${commentId}"]`) || null;

/**
 * Ensure a .comment-replies container exists under a comment element
 * @param {HTMLElement} hostEl - The comment element
 * @returns {HTMLElement} The replies container
 */
export function ensureRepliesContainer(hostEl) {
  if (!hostEl) return null;
  let replies = hostEl.querySelector(".comment-replies");
  if (!replies) {
    replies = document.createElement("div");
    replies.className = "comment-replies";
    hostEl.appendChild(replies);
  }
  return replies;
}

/**
 * Toggle ARIA expanded/controls on a disclosure button (Reply/Edit open/close)
 * @param {HTMLElement|null} btn
 * @param {Object} options
 * @param {boolean} options.expanded
 * @param {string} [options.controlsId]
 */
export function setAriaExpanded(btn, { expanded, controlsId } = {}) {
  if (!btn) return;
  btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  if (expanded && controlsId) {
    btn.setAttribute("aria-controls", controlsId);
  } else {
    btn.removeAttribute("aria-controls");
  }
}
