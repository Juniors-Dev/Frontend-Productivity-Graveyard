import { createCommentsState } from "./state.js";
import {
  renderCommentsList,
  renderEmpty,
  renderError,
  renderComment,
} from "./render.js";
import {
  setupMainCommentForm,
  createReplyForm,
  createEditForm,
} from "./forms.js";
import {
  closeAllForms,
  getCommentEl,
  ensureRepliesContainer,
  setAriaExpanded,
} from "./helpers.js";

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
  const cleanupFunctions = [];

  try {
    await state.load(1);

    container.innerHTML = "";
    const formContainer = document.getElementById("comment-form-container");
    const loginHint = document.getElementById("comments-login-hint");

    if (currentUser?.id) {
      if (formContainer) formContainer.hidden = false;
      if (loginHint) loginHint.hidden = true;

      const mainFormCleanup = setupMainCommentForm({
        onSubmit: async (message) => {
          try {
            const response = await api.createProjectComment(projectId, {
              message,
              parentId: null,
            });

            if (response?.success === false) {
              return {
                success: false,
                message:
                  response?.message ||
                  "Unable to share your condolence right now. Please try again.",
              };
            }

            if (response?.success && response.data) {
              state.add(response.data);
              updateCommentsList();
              return { success: true };
            }

            return {
              success: false,
              message: "Something went wrong. Please try again.",
            };
          } catch (err) {
            console.error("Comment submission failed:", err);
            return {
              success: false,
              message:
                "Connection failed. Please check your internet and try again.",
            };
          }
        },
      });

      cleanupFunctions.push(mainFormCleanup);
    } else {
      if (formContainer) formContainer.hidden = true;
      if (loginHint) loginHint.hidden = false;
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
            onReply: handleReply,
            onEdit: handleEdit,
            onDelete: handleDelete,
          }),
        );
      }
    }

    // ---- Handlers ----
    async function handleReply(parentId) {
      closeAllForms();

      const host = getCommentEl(container, parentId);
      if (!host) return;
      const replies = ensureRepliesContainer(host);

      const opener =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const formId = `reply-form-${parentId}-${Date.now()}`;

      const form = createReplyForm({
        formId,
        onCancel: () => {
          form.remove();
          setAriaExpanded(opener, { expanded: false });
          opener?.focus();
        },
        onSubmit: async (message) => {
          try {
            const res = await api.createProjectComment(projectId, {
              message,
              parentId,
            });
            if (res?.success && res.data) {
              const newReplyEl = renderComment(res.data, {
                currentUser,
                onReply: handleReply,
                onEdit: handleEdit,
                onDelete: handleDelete,
              });
              replies.prepend(newReplyEl);
              state.add(res.data);
              form.remove();
              setAriaExpanded(opener, { expanded: false });
              opener?.focus();

              return { success: true };
            }
            return {
              success: false,
              message:
                res?.message ||
                "Unable to post your reply right now. Please try again.",
            };
          } catch {
            return {
              success: false,
              message:
                "Connection failed. Please check your internet and try again.",
            };
          }
        },
      });

      setAriaExpanded(opener, { expanded: true, controlsId: formId });
      replies.prepend(form);
    }

    async function handleEdit(commentId) {
      closeAllForms();

      const host = getCommentEl(container, commentId);
      if (!host) return;
      const comment = state.find(commentId);
      if (!comment) return;

      const messageEl = host.querySelector(".comment-message") || host;

      const opener =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const formId = `edit-form-${commentId}-${Date.now()}`;

      const form = createEditForm({
        formId,
        initialValue: comment.message,
        onCancel: () => {
          form.remove();
          messageEl.style.display = "";
          setAriaExpanded(opener, { expanded: false });
          opener?.focus();
        },
        onSubmit: async (message) => {
          try {
            const res = await api.updateComment(commentId, { message });

            if (res?.success && res.data) {
              messageEl.textContent = res.data.message;
              state.update(commentId, res.data);
              form.remove();
              messageEl.style.display = "";
              setAriaExpanded(opener, { expanded: false });
              opener?.focus();
              return { success: true };
            }
            return {
              success: false,
              message:
                res?.message ||
                "Unable to save your changes right now. Please try again.",
            };
          } catch {
            return {
              success: false,
              message:
                "Connection failed. Please check your internet and try again.",
            };
          }
        },
      });

      messageEl.style.display = "none";
      messageEl.after(form);
      setAriaExpanded(opener, { expanded: true, controlsId: formId });
    }

    async function handleDelete(commentId) {
      const host = getCommentEl(container, commentId);
      if (!host) return;

      const opener =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      try {
        const res = await api.deleteComment(commentId);
        if (res?.success) {
          host.classList.add("deleted");
          const avatar = host.querySelector(".comment-avatar");
          const username = host.querySelector(".comment-username");
          const msg = host.querySelector(".comment-message");
          const actions = host.querySelector(".comment-actions");
          if (avatar) avatar.style.display = "none";
          if (username) username.style.display = "none";
          if (msg) {
            msg.textContent = "[deleted]";
            msg.classList.add("deleted");
          }
          if (actions) actions.style.display = "none";

          state.remove(commentId);

          setAriaExpanded(opener, { expanded: false });
          if (opener && document.contains(opener)) {
            opener.focus();
          } else {
            host.setAttribute("tabindex", "-1");
            host.focus();
            setTimeout(() => host.removeAttribute("tabindex"), 0);
          }
        } else {
          console.error(res?.message || "Delete failed");
        }
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        closeAllForms();
      }
    }

    updateCommentsList();

    return () => {
      cleanupFunctions.forEach((fn) => fn && fn());
      container.innerHTML = "";
      state.clear?.();
    };
  } catch (err) {
    console.error("Error initializing comments:", err);
    container.innerHTML = "";
    container.appendChild(
      renderError(
        "Unable to load condolences right now. Please refresh the page or try again later.",
      ),
    );
    return () => {
      container.innerHTML = "";
    };
  }
}
