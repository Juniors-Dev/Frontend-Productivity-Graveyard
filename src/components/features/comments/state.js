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

  return {
    /**
     * Load comments from API
     * @param {number} page - Page number (1-indexed)
     * @returns {Promise<Array>} Array of comment objects
     * @throws {Error} If API request fails
     */
    async load(page = 1) {
      const offset = (page - 1) * metadata.limit;
      const response = await api.getProjectComments(projectId, {
        offset,
        limit: metadata.limit,
      });

      if (response?.success) {
        comments = Array.isArray(response.data) ? response.data : [];
        metadata.total = Number(response.meta?.total || comments.length || 0);
        metadata.page = page;
        metadata.totalPages = Math.ceil(metadata.total / metadata.limit);
      } else {
        throw new Error(response?.message || "Unable to load condolences right now. Please refresh the page or try again later.");
      }
      return comments;
    },

    get() {
      return [...comments];
    },
    meta() {
      return { ...metadata };
    },

    add(comment) {
      comments.unshift(comment);
      metadata.total += 1;
    },
    update(commentId, updates) {
      const i = comments.findIndex((c) => c.id === commentId);
      if (i !== -1) comments[i] = { ...comments[i], ...updates };
    },
    remove(commentId) {
      const i = comments.findIndex((c) => c.id === commentId);
      if (i !== -1) {
        comments[i] = {
          ...comments[i],
          isDeleted: true,
          message: "[deleted]",
          User: null,
        };
      }
    },

    find(commentId) {
      return comments.find((c) => c.id === commentId) || null;
    },
    clear() {
      comments = [];
      metadata = { total: 0, page: 1, limit: 10, totalPages: 0 };
    },
  };
}
