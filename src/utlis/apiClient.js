import { baseUrl } from "./constants.js";

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

  // Users
  getCurrentUser() {
    return this.request("GET", "/users/me", null, true);
  }

  updateCurrentUser(data) {
    return this.request("PUT", "/users/me", data, true);
  }

  softDeleteCurrentUser() {
    return this.request("DELETE", "/users/me", null, true);
  }

  getUserById(id) {
    return this.request("GET", `/users/${id}`);
  }

  // Projects
  createProject(data) {
    return this.request("POST", "/projects", data, true);
  }

  getAllProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request("GET", `/projects${query ? `?${query}` : ""}`);
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

  //Comments
  createProjectComment(projectId, data) {
    return this.request("POST", `/projects/${projectId}/comments`, data, true);
  }

  getProjectComments(projectId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(
      "GET",
      `/projects/${projectId}/comments${query ? `?${query}` : ""}`,
    );
  }

  updateComment(commentId, data) {
    return this.request("PUT", `/comments/${commentId}`, data, true);
  }

  deleteComment(commentId) {
    return this.request("DELETE", `/comments/${commentId}`, null, true);
  }

  // Votes
  toggleUpvote(projectId) {
    return this.request("POST", `/votes/${projectId}/toggle`, null, true);
  }

  // Stats
  getAllStats() {
    return this.request("GET", "/stats");
  }

  getCurrentUserStats() {
    return this.request("GET", "/stats/user/me", null, true);
  }

  getUserStats(userId) {
    return this.request("GET", `/stats/user/${userId}`);
  }

  // Misc
  getAllTypes() {
    return this.request("GET", "/projects/types");
  }

  getAllTombstones() {
    return this.request("GET", "/projects/tombstones");
  }
}

export default ApiClient;
