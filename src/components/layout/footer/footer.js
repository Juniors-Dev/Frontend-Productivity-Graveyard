export function createFooter() {
  const footer = document.querySelector("footer");
  const h1 = document.createElement("h1");
  h1.textContent = "bye";
  footer.appendChild(h1);
  return footer;
}
