let bound = false;
let ctx = { api: null, renderMemorial: null, triggerBtn: null, project: null };

export function initMemorialEditModal({ api, renderMemorial }) {
  ctx.api = api;
  ctx.renderMemorial = renderMemorial;

  if (bound) return;
  bound = true;

  const modal = byId("memorial-edit-modal");
  const form = byId("memorial-edit-form");
  const closeBtn = byId("memorial-edit-close");
  const cancel = byId("memorial-edit-cancel");
  const saveBtn = byId("memorial-edit-save");
  const status = byId("memorial-edit-status");

  if (!modal || !form || !closeBtn || !cancel || !saveBtn) {
    console.warn("[MemorialEditModal] Missing modal DOM");
    return;
  }

  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onEsc);
    try {
      ctx.triggerBtn?.focus?.();
    } catch {
      // ignore
    }
  };

  const onEsc = (e) => {
    if (e.key === "Escape") close();
  };

  modal.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-close") === "true") close();
  });
  closeBtn.addEventListener("click", close);
  cancel.addEventListener("click", close);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!ctx.project) return;

    status.textContent = "Saving...";
    saveBtn.disabled = true;

    const name = byId("memorial-edit-name").value.trim();
    const description = byId("memorial-edit-description").value.trim();
    const eulogy = byId("memorial-edit-eulogy")?.value.trim() ?? "";
    const causeOfDeath = byId("memorial-edit-cause")?.value.trim() ?? "";
    const startDate = byId("memorial-edit-start")?.value || null; // yyyy-mm-dd
    const endDate = byId("memorial-edit-end")?.value || null; // yyyy-mm-dd
    const statusVal = byId("memorial-edit-status-select")?.value.trim() || null;

    if (startDate && endDate && endDate < startDate) {
      status.textContent = "Project Died kan ikke være før Project Born.";
      saveBtn.disabled = false;
      return;
    }

    const payload = {
      name,
      description: description || null,
      eulogy: eulogy || null,
      causeOfDeath: causeOfDeath || null,
      startDate,
      endDate,
      status: statusVal,
    };

    try {
      const res = await ctx.api.updateProject(ctx.project.id, payload);
      if (!res?.success) {
        status.textContent = res?.message || "Failed to save.";
        return;
      }
      const updated = res.data || { ...ctx.project, ...payload };
      ctx.renderMemorial(updated);
      status.textContent = "Saved!";
      close();
    } catch (err) {
      console.error(err);
      status.textContent = err?.message || "Error saving.";
    } finally {
      saveBtn.disabled = false;
    }
  });

  ctx._close = close;
  ctx._onEsc = onEsc;
}

export function openMemorialEditModal(project, triggerBtn) {
  const modal = byId("memorial-edit-modal");
  const inName = byId("memorial-edit-name");
  const inDesc = byId("memorial-edit-description");
  const inEul = byId("memorial-edit-eulogy");
  const inCause = byId("memorial-edit-cause");
  const inStart = byId("memorial-edit-start");
  const inEnd = byId("memorial-edit-end");
  const inStat = byId("memorial-edit-status-select");
  const status = byId("memorial-edit-status");

  ctx.project = project;
  ctx.triggerBtn = triggerBtn || null;

  inName.value = project?.name ?? "";
  inDesc.value = project?.description ?? "";
  inEul.value = project?.eulogy ?? "";
  inCause.value = project?.causeOfDeath ?? "";
  inStart.value = toInputDate(project?.startDate);
  inEnd.value = toInputDate(project?.endDate);
  inStat.value = project?.status ?? "";

  status.textContent = "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.addEventListener("keydown", ctx._onEsc);
  setTimeout(() => inName.focus(), 0);
}

function toInputDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function byId(id) {
  return document.getElementById(id);
}
