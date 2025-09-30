export function showPageError(
  message = "Something went wrong. Please refresh the page or try again later.",
) {
  const el = document.getElementById("page-error");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}
