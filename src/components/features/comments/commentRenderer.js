import { createEl } from '../../../utils/createEl.js';
import { isCommentDeleted, getUserAvatarUrl } from './commentHelpers.js';
import { timeAgo } from '../../../utils/dateHandlers.js';


/**
 * Render a list of comments
 * @param {Array} comments - Array of comment objects
 * @returns {HTMLElement} Comments list container
 */
export function renderCommentsList(comments) {
  const container = createEl('div', { class: 'comments-list' });
  
  if (!comments || !comments.length) {
    container.append(
      createEl('div', { class: 'comments-empty' }, 
        'No condolences...')
    );
    return container;
  }
  
  comments.forEach(comment => {
    container.append(renderComment(comment));
  });
  
  return container;
}

/**
 * Render a single comment
 * @param {Object} comment - Comment object
 * @returns {HTMLElement} Comment element
 */
export function renderComment(comment) {
  if (isCommentDeleted(comment)) {
    return renderDeletedComment(comment);
  }
  
  const el = createEl('div', {
    class: 'comment',
    'data-comment-id': comment.id
  });
  
  const metaRow = renderCommentMeta(comment);
  const message = createEl('div', { class: 'comment-message' }, comment.message);
  
  el.append(metaRow, message);
  
  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = createEl('div', { class: 'comment-replies' });
    comment.replies.forEach(reply => {
      repliesContainer.append(renderComment(reply));
    });
    el.append(repliesContainer);
  }
  
  return el;
}

/**
 * Render comment metadata (avatar, username, time)
 * @param {Object} comment - Comment object
 * @returns {HTMLElement} Metadata row element
 */
function renderCommentMeta(comment) {
  const metaRow = createEl('div', { class: 'comment-meta' });
  const userSection = createEl('div');
  
  const avatar = createEl('img', {
    class: 'comment-avatar',
    src: getUserAvatarUrl(comment.User),
    alt: `${comment.User?.username || 'User'} avatar`
  });
  
  const userName = createEl('span', 
    { class: 'comment-username' }, 
    comment.User?.username || 'Anonymous'
  );
  
  const time = createEl('span', 
    { class: 'comment-time' }, 
    timeAgo(comment.createdAt)
  );
  
  userSection.append(avatar, userName);
  metaRow.append(userSection, time);
  
  return metaRow;
}

/**
 * Render a deleted comment
 * @param {Object} comment - Deleted comment object
 * @returns {HTMLElement} Deleted comment element
 */
function renderDeletedComment(comment) {
  const el = createEl('div', {
    class: 'comment deleted',
    'data-comment-id': comment.id
  });
  
  const metaRow = createEl('div', { class: 'comment-meta' });
  const userSection = createEl('div');
  
  const deletedLabel = createEl('span', 
    { class: 'comment-username' }, 
    'Condolence deleted'
  );
  
  const time = createEl('span', 
    { class: 'comment-time' }, 
    timeAgo(comment.createdAt)
  );
  
  userSection.append(deletedLabel);
  metaRow.append(userSection, time);
  
  const message = createEl('div', { class: 'comment-message' }, '[deleted]');
  
  el.append(metaRow, message);
  
  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = createEl('div', { class: 'comment-replies' });
    comment.replies.forEach(reply => {
      repliesContainer.append(renderComment(reply));
    });
    el.append(repliesContainer);
  }
  
  return el;
}