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
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

/**
 * Format time ago from a date to readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time ago string
 */
export function timeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return `Just now`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}