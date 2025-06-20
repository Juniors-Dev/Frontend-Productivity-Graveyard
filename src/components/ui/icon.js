/**
 * TODO: Replace with (CSS/SVG/icon library)
 * 
 */

export function createIcon(type, className = "icon") {
  const icons = {
    success: "✓",
    error: "⚠", //☠️
    warning: "⚠",
    info: "ⓘ",
    delete: "x",
    edit: "✎",
    save: "✓",
    cancel: "x"
  };

  const icon = document.createElement("span");
  icon.className = className;
  icon.textContent = icons[type] || icons.info;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}