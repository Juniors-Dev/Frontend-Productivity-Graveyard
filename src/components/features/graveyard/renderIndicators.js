import { getPageState } from "./getPageState.js";

export function renderIndicators() {
  const { order, orderBy, query, types, limit, currentPage } = getPageState();
  const container = document.querySelector(".results-indicators");

  const parts = [];
  parts.push(`Page ${currentPage}`);
  parts.push(`Limit: ${limit}`);
  parts.push(`Sorted: ${orderBy} (${order})`);
  if (query) parts.push(`Search: "${query}"`);
  if (types) parts.push(`Types: ${types.split(",").length} selected`);

  container.innerHTML = parts.map((p) => `<span>${p}</span>`).join(" • ");
}
