import { baseUrl } from "../data/constants";

class ApiClient {
  constructor() {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request(method, path, body = null, requiresAuth = false) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && !this.token) {
      throw new Error("Authentication token is required for this request");
    } else if (requiresAuth || this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`${this.baseUrl}${path}`, options);
    return await res.json();
  }

  // Auth
  login(data) {
    return this.request("POST", "/auth/login", data);
  }

  register(data) {
    return this.request("POST", "/auth/register", data);
  }

  // Projects
  getAllProjects() {
    return this.request("GET", "/projects");
  }

  getProject(id) {
    return this.request("GET", `/projects/${id}`);
  }

  updateProject(id, data) {
    return this.request("PUT", `/projects/${id}`, data, true);
  }

  deleteProject(id) {
    return this.request("DELETE", `/projects/${id}`, null, true);
  }

  updateProjectType(id, data) {
    return this.request("PUT", `/projects/${id}/type`, data, true);
  }

  deleteProjectType(id) {
    return this.request("DELETE", `/projects/${id}/type`, null, true);
  }

  // Misc
  getAllTypes() {
    return this.request("GET", "/projects/types");
  }

  getAllTombstones() {
    return this.request("GET", "/projects/tombstones");
  }
}

const api = new ApiClient();
export default api;
