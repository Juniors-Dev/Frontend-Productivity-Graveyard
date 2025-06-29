/**
 * Format lifespan from days to readable format
 * @param {number} days - Number of days
 * @returns {string} Formatted lifespan
 */
export function formatLifespan(days) {
  if (!days || days === 0) return "0 days";

  const numDays = Math.round(Number(days));

  if (numDays < 7) {
    return `${numDays} day${numDays !== 1 ? "s" : ""}`;
  } else if (numDays < 30) {
    const weeks = Math.round(numDays / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else {
    const months = Math.round(numDays / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
}