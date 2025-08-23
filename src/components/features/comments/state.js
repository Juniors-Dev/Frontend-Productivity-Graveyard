/**
 * Create a comments state manager
 * @param {Object} config
 * @param {string} config.projectId - Project ID
 * @param {Object} config.api - API client instance
 * @returns {Object} State manager with methods for CRUD operations
 */
export function createCommentsState({ projectId, api }) {
  let comments = [];
  let metadata = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const idsEqual = (a, b) => String(a) === String(b);

  const findCommentLocation = (commentId) => {
    // -- Root comments
    const topIndex = comments.findIndex((c) => idsEqual(c.id, commentId));
    if (topIndex !== -1) {
      return {
        type: "top",
        index: topIndex,
        comment: comments[topIndex],
        update: (updates) =>
          (comments[topIndex] = { ...comments[topIndex], ...updates }),
      };
    }

    // -- Replies
    for (let i = 0; i < comments.length; i++) {
      const reps = Array.isArray(comments[i].replies)
        ? comments[i].replies
        : null;
      if (reps) {
        const replyIndex = reps.findIndex((r) => idsEqual(r.id, commentId));
        if (replyIndex !== -1) {
          return {
            type: "reply",
            parentIndex: i,
            index: replyIndex,
            comment: reps[replyIndex],
            update: (updates) => {
              comments[i].replies[replyIndex] = {
                ...comments[i].replies[replyIndex],
                ...updates,
              };
            },
          };
        }
      }
    }
    return null;
  };

  return {
    /**
     * Load comments from API
     * @param {number} page - Page number (1-indexed)
     * @returns {Promise<Array>} Array of comment objects
     */
    async load(page = 1) {
      const offset = (page - 1) * metadata.limit;
      const response = await api.getProjectComments(projectId, {
        offset,
        limit: metadata.limit,
      });

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "We're having trouble loading the condolences. Please refresh the page or try again in a moment.",
        );
      }

      comments = Array.isArray(response.data) ? response.data : [];
      metadata.total = Number(response.meta?.total ?? comments.length ?? 0);
      metadata.page = page;
      metadata.totalPages = Math.ceil((metadata.total || 0) / metadata.limit);
      return comments;
    },

    get() {
      return [...comments];
    },
    meta() {
      return { ...metadata };
    },

    add(comment) {
      if (comment?.parentId == null) {
        comments.unshift(comment);
        return;
      }
      const parentLoc = findCommentLocation(comment.parentId);
      if (parentLoc && parentLoc.type === "top") {
        const parent = comments[parentLoc.index];
        parent.replies = Array.isArray(parent.replies) ? parent.replies : [];
        parent.replies.unshift(comment);
      }
    },
    update(commentId, updates) {
      const loc = findCommentLocation(commentId);
      if (loc) {
        loc.update(updates);
      }
    },
    remove(commentId) {
      const loc = findCommentLocation(commentId);
      if (loc) {
        loc.update({ isDeleted: true, message: "[deleted]", User: null });
      }
    },

    find(commentId) {
      const loc = findCommentLocation(commentId);
      return loc?.comment || null;
    },
    clear() {
      comments = [];
      metadata = { total: 0, page: 1, limit: 10, totalPages: 0 };
    },
  };
}
