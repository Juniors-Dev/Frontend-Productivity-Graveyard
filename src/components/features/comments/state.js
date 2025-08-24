/**
 * Create a comments state manager with pagination and fast lookup
 * @param {Object} config
 * @param {string} config.projectId - Project ID
 * @param {Object} config.api - API client instance
 * @returns {Object} State manager object with methods
 */
export function createCommentsState({ projectId, api }) {
  let comments = [];
  let metadata = { total: 0, page: 1, limit: 10, totalPages: 0 };
  let indexMap = new Map();

  const stringifyId = (v) => String(v);

  function setTotal(total) {
    metadata.total = Math.max(0, Number(total) || 0);
    metadata.totalPages = Math.ceil((metadata.total || 0) / metadata.limit);
  }

  function rebuildIndex() {
    indexMap.clear();
    comments.forEach((c, i) => {
      indexMap.set(stringifyId(c.id), { type: "top", index: i });
      const reps = Array.isArray(c.replies) ? c.replies : null;
      reps?.forEach((r, j) => {
        indexMap.set(stringifyId(r.id), {
          type: "reply",
          parentIndex: i,
          index: j,
        });
      });
    });
  }

  function findCommentLocation(commentId) {
    const meta = indexMap.get(stringifyId(commentId));
    if (!meta) return null;

    if (meta.type === "top") {
      const { index } = meta;
      return {
        type: "top",
        index,
        comment: comments[index],
        update: (updates) => {
          comments[index] = { ...comments[index], ...updates };
        },
      };
    }
    const { parentIndex, index } = meta;
    return {
      type: "reply",
      parentIndex,
      index,
      comment: comments[parentIndex].replies[index],
      update: (updates) => {
        comments[parentIndex].replies[index] = {
          ...comments[parentIndex].replies[index],
          ...updates,
        };
      },
    };
  }

  return {
    async load(page = 1) {
      const offset = (page - 1) * metadata.limit;
      const res = await api.getProjectComments(projectId, {
        offset,
        limit: metadata.limit,
      });

      if (!res?.success) {
        throw new Error(
          res?.message ||
            "We're having trouble loading the condolences. Please refresh the page or try again in a moment.",
        );
      }

      comments = Array.isArray(res.data) ? res.data : [];
      metadata.page = page;
      setTotal(res.meta?.total ?? comments.length ?? 0);
      rebuildIndex();
      return comments;
    },

    get() {
      return [...comments];
    },

    meta() {
      return { ...metadata };
    },

    add(comment) {
      const isRoot = comment?.parentId == null;

      if (isRoot) {
        if (metadata.page === 1) {
          comments.unshift(comment);
          if (comments.length > metadata.limit) comments.pop();
        }
        setTotal((metadata.total || 0) + 1);
        rebuildIndex();
        return;
      }

      const parentLoc = findCommentLocation(comment.parentId);
      if (!parentLoc || parentLoc.type !== "top") return;

      const parent = comments[parentLoc.index];
      parent.replies = Array.isArray(parent.replies) ? parent.replies : [];
      parent.replies.unshift(comment);
      rebuildIndex();
    },

    update(commentId, updates) {
      const loc = findCommentLocation(commentId);
      if (!loc) return;
      loc.update(updates);
    },

    remove(commentId) {
      const loc = findCommentLocation(commentId);
      if (!loc) return;

      loc.update({ isDeleted: true, message: "[deleted]", User: null });

      if (loc.type === "top") {
        setTotal((metadata.total || 0) - 1);
      }
      rebuildIndex();
    },

    find(commentId) {
      const loc = findCommentLocation(commentId);
      return loc?.comment || null;
    },
    clear() {
      comments = [];
      metadata = { total: 0, page: 1, limit: 10, totalPages: 0 };
      indexMap.clear();
    },
  };
}
