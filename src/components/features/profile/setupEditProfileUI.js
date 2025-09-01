export function setupEditProfileUI(
  userData,
  viewingOwnProfile,
  api,
  renderProfile,
) {
  const editBtn = document.getElementById("edit-profile-btn");
  const modal = document.getElementById("edit-modal");
  if (!editBtn || !modal) return;

  if (!viewingOwnProfile) {
    editBtn.style.display = "none";
    return;
  }

  const form = document.getElementById("edit-modal-form");
  const closeBtn = document.getElementById("edit-modal-close");
  const cancelBtn = document.getElementById("edit-modal-cancel");
  const saveBtn = document.getElementById("edit-modal-save");
  const statusEl = document.getElementById("edit-modal-status");

  const inFirst = document.getElementById("modal-firstName");
  const inLast = document.getElementById("modal-lastName");
  const inUser = document.getElementById("modal-username");
  const inBio = document.getElementById("modal-bio");
  const inAvatar = document.getElementById("modal-avatarUrl");
  const avatarImg = document.getElementById("profile-picture");
  const displayName = document.getElementById("profile-name");

  const openModal = () => {
    // Prefill
    inFirst.value = userData.firstName ?? "";
    inLast.value = userData.lastName ?? "";
    inUser.value = userData.username ?? "";
    inBio.value = userData.bio ?? "";
    inAvatar.value = userData.avatarUrl ?? "";

    statusEl.textContent = "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    setTimeout(() => inFirst.focus(), 0);

    document.addEventListener("keydown", onKeydown);
  };

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeydown);
  };

  const onKeydown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  editBtn.addEventListener("click", openModal);

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-close") === "true")
      closeModal();
  });

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Saving...";
    saveBtn.disabled = true;

    const payload = {
      firstName: inFirst.value.trim(),
      lastName: inLast.value.trim(),
      username: inUser.value.trim(),
      bio: inBio.value.trim(),
      avatarUrl: inAvatar.value.trim(),
    };

    try {
      const res = await api.updateCurrentUser(payload);

      if (!res?.success) {
        statusEl.textContent = res?.message || "Failed to save.";
        console.warn("Update response:", res);
        return;
      }

      userData = res.data;

      const fullName = [userData.firstName, userData.lastName]
        .filter(Boolean)
        .join(" ");
      if (displayName) displayName.textContent = fullName || "";
      if (avatarImg && userData.avatarUrl) avatarImg.src = userData.avatarUrl;

      statusEl.textContent = "Saved!";
      closeModal();

      renderProfile(userData);
    } catch (err) {
      console.error(err);
      statusEl.textContent = err?.message || "Error saving.";
    } finally {
      saveBtn.disabled = false;
    }
  });
}
