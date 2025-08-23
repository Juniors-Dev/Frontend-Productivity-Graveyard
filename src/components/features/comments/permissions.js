export const isOwner = (comment, user) =>
  !!(user?.id && comment?.User?.id && user.id === comment.User.id);

export const canReply = (comment, user) =>
  !!(user?.id && comment?.parentId === null && !comment?.isDeleted);

export const canModify = (comment, user) =>
  !comment?.isDeleted && isOwner(comment, user);

/*-- Future:
const canEdit 
const canDelete
const canModerate = (user) => user?.role === 'admin' || user?.role === 'moderator';

export const commentPermissions = {
  isOwner,
  canReply,
  canModify,
  canEdit,
  canDelete,
  canModerate
};
*/
