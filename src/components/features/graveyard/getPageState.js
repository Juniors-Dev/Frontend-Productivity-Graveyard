/**
 * Parse the current URL query string and return pagination + filter state.
 *
 * Ensures `limit` stays within 1–100, derives `offset` and `currentPage`,
 * and provides safe defaults if params are missing.
 *
 * @returns {Object} Page state object
 * @returns {"asc"|"desc"} return.order   Sort direction (default: "desc")
 * @returns {string}       return.orderBy Field to order by (default: "createdAt")
 * @returns {string}       return.query   Free-text search query (default: "")
 * @returns {string}       return.types   Comma-separated type IDs (default: "")
 * @returns {number}       return.limit   Page size, clamped between 1 and 100
 * @returns {number}       return.offset  Result offset, derived from `offset` param
 * @returns {number}       return.currentPage 1-based page number, derived from offset/limit
 */
export function getPageState() {
  const params = new URLSearchParams(window.location.search);

  let limit = Number(params.get("limit")) || 10;
  limit = Math.min(100, Math.max(1, limit));

  const offset = Number(params.get("offset")) || 0;
  const currentPage = Math.floor(offset / limit) + 1;

  return {
    order: params.get("order") || "desc",
    orderBy: params.get("orderBy") || "createdAt",
    query: params.get("query") || "",
    types: params.get("types") || "",
    limit,
    offset,
    currentPage,
  };
}
