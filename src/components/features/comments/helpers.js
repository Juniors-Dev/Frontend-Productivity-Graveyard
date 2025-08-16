import { avatarApiUrl } from '../../../utils/constants.js';

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
 user?.avatarUrl || `${avatarApiUrl}/?name=${encodeURIComponent(user?.username || "Anonymous")}&background=random`;

/**
 * Close all open comment forms
 * TODO: Will be used when reply/edit forms are implemented
 */
export const closeAllForms = () => {
  document.querySelectorAll(".reply-form, .edit-form").forEach((form) => form.remove());
}