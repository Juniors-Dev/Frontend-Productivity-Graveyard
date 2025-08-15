import { Header } from "./header/header.js";
import { createFooter } from "./footer/footer.js";

export let header = null;

// Initialize header when DOM is loaded
export function initUI() {
  document.addEventListener("DOMContentLoaded", () => {
    header = new Header();
    header.init();
    document.body.appendChild(createFooter());
  });
}
