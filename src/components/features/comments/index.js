import { createCommentsState } from "./state.js";
import { renderCommentsList, renderEmpty, renderError } from "./render.js";
import { createMainCommentForm } from "./forms.js";

/**
 * Initialize the comments system
 * @param {Object} config
 * @param {string} config.projectId
 * @param {Object} config.api
 * @param {HTMLElement} config.container
 * @param {Object|null} config.currentUser
 * @returns {Function} teardown
 */
export async function initComments({ projectId, api, container, currentUser }) {
  if (!container) {
    console.error("Comments container not found");
    return () => {};
  }

  const state = createCommentsState({ projectId, api });
  container.innerHTML = '<div class="comments-empty">Loading...</div>';

  try {
    await state.load(1);

    container.innerHTML = "";

    if (currentUser && currentUser.id) {
      const form = createMainCommentForm({
        onSubmit: async (message) => {
          const response = await api.createProjectComment(projectId, {
            message,
            parentId: null,
          });

          if (response?.success && response.data) {
            state.add(response.data);
            updateCommentsList();
            return { success: true };
          }

          return {
            success: false,
            error: response?.message || "Sorry, we couldn't post your condolence. Please try again.",
          };
        },
      });
      container.appendChild(form);
    } else {
      const loginPrompt = document.createElement("div");
      loginPrompt.className = "comments-login-hint";
      loginPrompt.textContent = "Login to leave a condolence.";
      container.appendChild(loginPrompt);
    }

    const listContainer = document.createElement("div");
    container.appendChild(listContainer);

    function updateCommentsList() {
      listContainer.innerHTML = "";
      const comments = state.get();

      if (!comments.length) {
        listContainer.appendChild(renderEmpty());
      } else {
        listContainer.appendChild(
          renderCommentsList(comments, {
            currentUser,
            //// TODO: reply/edit/delete in next PR:
            //onReply: (commentId) => {},
            //onEdit: (commentId) => {},
            //onDelete: async (commentId) => {},
          }),
        );
      }
    }

    updateCommentsList();

    return () => {
      container.innerHTML = "";
      state.clear?.();
    };
  } catch (error) {
    console.error("Error initializing comments:", error);
    container.innerHTML = "";
    container.appendChild(renderError("Unable to load condolences right now. Please refresh the page or try again later."));
    return () => {
      container.innerHTML = "";
    };
  }
}
