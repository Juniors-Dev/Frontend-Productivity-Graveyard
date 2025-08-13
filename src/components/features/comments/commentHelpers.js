import { avatarApiUrl } from '../../../utils/constants.js';

/**
 * Check if a comment is deleted
 * @param {Object} comment - The comment object
 * @returns {boolean} True if comment is deleted
 */
export function isCommentDeleted(comment) {
  return comment.isDeleted || 
         comment.message === '[deleted]' || 
         !comment.User;
}

/**
 * Generate avatar URL for a user
 * @param {Object} user - The user object
 * @returns {string} Avatar URL
 */
export function getUserAvatarUrl(user) {
  if (user?.avatarUrl) return user.avatarUrl;
  
  const name = user?.fullName || user?.username || 'User';
  return `${avatarApiUrl}/?name=${encodeURIComponent(name)}&background=random`;
}