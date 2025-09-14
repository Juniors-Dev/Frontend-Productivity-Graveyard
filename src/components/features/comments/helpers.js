import { avatarApiUrl } from "../../../utils/constants.js";

/* -------------------------------------------------------------------------
   COMMENT STATE HELPERS 
   ------------------------------------------------------------------------- */

/**
 * Toggle visual/interaction state on a single comment host.
 * Adds/removes modifiers and hides relevant UI parts.
 * @param {HTMLElement} commentEl
 * @param {'editing'|'replying'|null} visualState
 */
export const setCommentFormState = (commentEl, visualState) => {
  if (!commentEl) return;

  commentEl.classList.remove("comment--editing", "comment--replying");

  if (visualState === "editing") commentEl.classList.add("comment--editing");
  if (visualState === "replying") commentEl.classList.add("comment--replying");

  const actions = commentEl.querySelector(".comment-actions");
  if (actions) actions.hidden = !!visualState;

  const msg = commentEl.querySelector(".comment-message");
  if (msg) msg.hidden = visualState === "editing";
};

//Internal helper to reset all comments in a container
const resetAllCommentStates = (container) => {
  if (!container) return;
  container.querySelectorAll(".comment").forEach((c) => {
    c.classList.remove("comment--editing", "comment--replying");
    c.querySelectorAll(".comment-actions").forEach((a) => (a.hidden = false));
    c.querySelectorAll(".comment-message").forEach((m) => (m.hidden = false));
    c.querySelectorAll("[aria-expanded][aria-controls]").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      btn.removeAttribute("aria-controls");
    });
  });
};

/**
 * Close all open comment forms and restore comment states.
 * @param {HTMLElement} container
 */
export const closeAllForms = (container) => {
  if (!container) return;
  container
    .querySelectorAll(".reply-form, .edit-form")
    .forEach((form) => form.remove());
  resetAllCommentStates(container);
};

/* -------------------------------------------------------------------------
   DOM HELPERS  - Element selection and structure manipulation
   ------------------------------------------------------------------------- */

/**
 * Find a comment element by its id within a root container.
 * @param {HTMLElement} root
 * @param {string|number} commentId
 * @returns {HTMLElement|null}
 */
export const getCommentEl = (root, commentId) =>
  root?.querySelector?.(`[data-comment-id="${commentId}"]`) || null;

/**
 * Ensure a .comment-replies container exists under a comment element.
 * @param {HTMLElement} hostEl
 * @returns {HTMLElement|null}
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
 * Toggle ARIA expanded/controls on a disclosure button (Reply/Edit open/close).
 * @param {HTMLElement|null} btn
 * @param {{expanded: boolean, controlsId?: string}} options
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

/* -------------------------------------------------------------------------
   COMMENT METADATA / UTILITIES
   ------------------------------------------------------------------------- */

/**
 * Check if a comment is soft-deleted.
 * @param {Object} comment
 * @returns {boolean}
 */
export const isCommentDeleted = (comment) => comment?.isDeleted === true;

/**
 * Generate avatar URL for a user.
 * @param {Object} user
 * @returns {string}
 */
export const getUserAvatarUrl = (user) =>
  user?.avatarUrl ||
  `${avatarApiUrl}/?name=${encodeURIComponent(
    user?.username || "Anonymous",
  )}&background=random`;

/* -------------------------------------------------------------------------
   UI INDICATORS (LOADING / ERROR)
   ------------------------------------------------------------------------- */

let indicators = null;

/**
 * Cache indicator elements (idempotent).
 * @returns {{loadingEl: HTMLElement|null, errorEl: HTMLElement|null}}
 */
export function initIndicators() {
  indicators = {
    loadingEl: document.getElementById("comments-loading"),
    errorEl: document.getElementById("comments-error"),
  };
  return indicators;
}

export function showLoading() {
  if (!indicators?.loadingEl) return;
  indicators.loadingEl.hidden = false;
}

export function hideLoading() {
  if (!indicators?.loadingEl) return;
  indicators.loadingEl.hidden = true;
}

/**
 * Show an error message and ensure loading is hidden.
 * @param {string} [message]
 */
export function showError(message) {
  if (indicators?.loadingEl) {
    indicators.loadingEl.hidden = true;
  }
  if (!indicators?.errorEl) return;
  indicators.errorEl.textContent =
    message ?? "Unable to load comments. Please try again.";
  indicators.errorEl.hidden = false;
}

export function hideError() {
  if (!indicators?.errorEl) return;
  indicators.errorEl.textContent = "";
  indicators.errorEl.hidden = true;
}
