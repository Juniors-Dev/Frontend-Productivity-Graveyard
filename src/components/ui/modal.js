/**
 * FormModal
 * A reusable modal class specialized for forms.
 * - Attaches to the DOM and provides a trigger button, in specified container
 * - Handles open, close, and form submission events.
 * @example
 * const modal = new FormModal({
 *   title: "Filter Projects",
 *   bodyElement: myFormBodyElement,
 *   container: document.querySelector("#filters-container"),
 *   buttonLabel: "Open Filters",
 *   onSubmit: (data) => console.log(data)
 * });
 */
export class FormModal {
  /**
   * Creates a new FormModal instance.
   * @param {Object} options - Configuration options for the modal.
   * @param {string} options.title - Title text for the modal header.
   * @param {HTMLElement|string} options.bodyElement - The form body content.
   *        Can be a DOM element or HTML string.
   * @param {HTMLElement} options.container - DOM element where the trigger button will be appended.
   * @param {string} [options.buttonLabel="Open Modal"] - Label for the trigger button.
   * @param {Function} [options.onSubmit] - Callback invoked on form submission.
   *        Receives form data as an object `{ [fieldName]: value }`.
   */
  constructor({ title, bodyElement, container, buttonLabel, onSubmit }) {
    this.title = title;
    this.bodyElement = bodyElement;
    this.container = container;
    this.buttonLabel = buttonLabel || "Open Modal";
    this.onSubmit = onSubmit;
    this.build();
  }

  build() {
    // Create <dialog>
    this.dialog = document.createElement("dialog");
    this.dialog.classList.add("modal-background");

    // Build inner content
    this.dialog.innerHTML = `
      <div class="dialog-content">
        <form>
          <div class="modal-header">
            <h2>${this.title}</h2>
            <button type="button" class="modal-close">✕</button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="submit" class="btn-beige">Submit</button>
            <button type="button" class="btn-beige ml-auto modal-close">Close</button>
          </div>
        </form>
      </div>
    `;

    // Add body content
    const body = this.dialog.querySelector(".modal-body");
    if (typeof this.bodyElement === "string") {
      body.innerHTML = this.bodyElement;
    } else {
      body.appendChild(this.bodyElement);
    }

    // Append dialog to body
    document.body.appendChild(this.dialog);

    // Attach trigger button
    this.triggerButton = document.createElement("button");
    this.triggerButton.className = "btn-beige";
    this.triggerButton.textContent = this.buttonLabel;
    this.container.appendChild(this.triggerButton);

    // Event bindings
    this.bindEvents();
  }

  bindEvents() {
    this.triggerButton.addEventListener("click", () => this.dialog.showModal());
    this.dialog.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => this.dialog.close());
    });
    this.dialog.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof this.onSubmit === "function") {
        const formData = new FormData(e.target);
        this.onSubmit(Object.fromEntries(formData.entries()));
      }
      this.dialog.close();
    });
  }
}
