// Dropdown open/close and selection display logic

export function setupCategoryDropdown() {
  const dropdown = document.getElementById("categoryDropdown");
  const toggle = document.getElementById("categoryDropdownToggle");
  const menu = document.getElementById("categoryDropdownMenu");

  // Open/close dropdown
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  // Update button text with selected categories
  menu.addEventListener("change", () => {
    const checked = menu.querySelectorAll('input[type="checkbox"]:checked');
    if (checked.length === 0) {
      toggle.textContent = "Select Categories";
    } else {
      const names = Array.from(checked).map((cb) =>
        cb.parentElement.textContent.trim(),
      );
      toggle.textContent = names.join(", ");
    }
  });
}
