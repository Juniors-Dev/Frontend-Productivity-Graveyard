import { avatarApiUrl } from '../../../utils/constants.js';

/**
 * Check if a comment is deleted
 * @param {Object} comment - The comment object
 * @returns {boolean} True if comment is deleted
 */
export function isCommentDeleted(comment) {
  if (!comment) return true;
  return comment.isDeleted || comment.message === "[deleted]" || !comment.User;
}

/**
 * Generate avatar URL for a user
 * @param {Object} user - The user object
 * @returns {string} Avatar URL
 */
export function getUserAvatarUrl(user) {
  if (user?.avatarUrl) return user.avatarUrl;
  const name = user?.fullName || user?.username || "Anonymous";
  return `${avatarApiUrl}/?name=${encodeURIComponent(name)}&background=random`;
}

/**
 * Check if user can edit/delete a comment
 * @param {Object} comment - Comment object
 * @param {Object|null} currentUser - Authenticated user or null
 * @returns {boolean} True if user owns the comment and it's not deleted
 */
export function canUserModifyComment(comment, currentUser) {
  return (
    currentUser &&
    currentUser.id &&
    comment.User &&
    comment.User.id === currentUser.id &&
    !isCommentDeleted(comment)
  );
}

/**
 * Check if user can reply to a comment
 * Only root comments can have replies
 * @param {Object} comment - Comment object
 * @param {Object|null} currentUser - Authenticated user or null
 * @returns {boolean} True if user can reply to this comment
 */
export function canUserReply(comment, currentUser) {
  return (
    currentUser &&
    currentUser.id &&
    comment.parentId === null &&
    !isCommentDeleted(comment)
  );
}

export function closeAllForms() {
  document.querySelectorAll(".reply-form, .edit-form").forEach((form) => form.remove());
}