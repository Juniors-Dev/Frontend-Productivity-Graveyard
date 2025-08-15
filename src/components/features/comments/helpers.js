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
 * Check if user can modify (edit/delete) a comment
 * @param {Object} comment - Comment object
 * @param {Object|null} currentUser - Authenticated user or null
 * @returns {boolean} True if user owns the comment
 */
export const canUserModifyComment = (comment, currentUser) => currentUser?.id === comment?.User?.id;

/**
 * Check if user can reply to a comment
 * Only root comments can have replies
 * @param {Object} comment - Comment object
 * @param {Object|null} currentUser - Authenticated user or null
 * @returns {boolean} True if user can reply to this comment
 */
export const canUserReply = (comment, currentUser) => 
  currentUser?.id && !comment?.isDeleted && !comment?.parentId;

/**
 * Close all open comment forms
 * TODO: Will be used when reply/edit forms are implemented
 */
export const closeAllForms = () => {
  document.querySelectorAll(".reply-form, .edit-form").forEach((form) => form.remove());
}