const API_URL = "https://backend-productivity-graveyard.onrender.com/";
const API_PROJECTS = "projects";

/**
 * Fetches JSON data from the API.
 * @param {string} url - The endpoint to fetch.
 * @param {object} [options] - Optional fetch options.
 * @returns {Promise<any>} - Resolves with parsed JSON data.
 */
export async function fetchProjects(options = {}) {
  const url = API_URL + API_PROJECTS;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data);
  return data;
}
