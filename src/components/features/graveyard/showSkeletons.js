/**
 * Render a set of skeleton placeholders into a container.
 *
 * Clears the container’s existing contents and appends the given
 * number of skeleton elements by calling the provided render function.
 *
 * @param {number} count - How many skeletons to render.
 * @param {HTMLElement} container - DOM element where skeletons will be injected.
 * @param {() => string} renderFn - Function returning the HTML string for a skeleton.
 *   If you want to return a DOM element instead, change this signature to `() => HTMLElement`.
 */
export function showSkeletons(count, container, renderFn) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    container.innerHTML += renderFn();
  }
}
