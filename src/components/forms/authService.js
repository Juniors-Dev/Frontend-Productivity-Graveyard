import api from "../../utlis/apiClient.js";

export class AuthService {
  async login(email, password) {
    try {
      const response = await api.login({ email, password });

      // Extract from response.data
      const { token, ...user } = response.data || {};

      if (token) {
        localStorage.setItem("authToken", token);
        api.setToken(token);
      }

      if (Object.keys(user).length > 0) {
        user.token = token;
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  async register(username, firstName, lastName, email, password) {
    try {
      const response = await api.register({
        username,
        firstName,
        lastName,
        email,
        password,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    api.clearToken();
    window.location.href = "/login.html";
  }

  isAuthenticated() {
    const token = localStorage.getItem("authToken");
    if (token) {
      api.setToken(token);
      return true;
    }
    return false;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  // Initialize token when the page loads
  init() {
    const token = localStorage.getItem("authToken");
    if (token) {
      api.setToken(token);
    }
  }
}

export const authService = new AuthService();
