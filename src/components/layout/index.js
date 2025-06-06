import { Header } from "./header/header.js";
import { createFooter } from "./footer/footer.js";

// Initialize header when DOM is loaded
export function initUI() {
  document.addEventListener("DOMContentLoaded", () => {
    const header = new Header();
    header.init();
    document.body.appendChild(createFooter());
  });
}
