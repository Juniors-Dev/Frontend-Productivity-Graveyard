/**
 * Update the current page URL query parameters and optionally run a callback.
 *
 * - Merges the provided `updates` into the current URL search params.
 * - Any key with `undefined`, `null`, or `""` as its value is removed.
 * - Uses `history.pushState` to create a new history entry with the updated URL.
 * - Invokes the optional callback after the URL is updated.
 *
 * @param {Record<string, string|number|null|undefined>} updates
 *   Key/value pairs to set in the URL query string.
 *   Values are coerced to strings; falsy values (`undefined`, `null`, `""`)
 *   will remove the key.
 * @param {Function} [fn=() => {}]
 *   Optional callback function to run after the URL is updated.
 */
export function setPageState(updates, fn = () => {}) {
  const url = new URL(window.location);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.pushState({}, "", url);
  fn();
}
