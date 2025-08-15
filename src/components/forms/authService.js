import api from "../../utils/apiClient.js";

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

// Making this function available for other pages to use
export function checkAuthentication() {
  if (!authService.isAuthenticated()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// Flexible page protection utility
export function protectPage(options = {}) {
  const {
    redirectUrl = "/login.html",
    onAuthenticated = null,
    onUnauthenticated = null,
  } = options;

  return function () {
    if (!authService.isAuthenticated()) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else {
        window.location.href = redirectUrl;
      }
      return false;
    }

    if (onAuthenticated) {
      onAuthenticated();
    }
    return true;
  };
}

// felxible function for pages that needs authentication
export function requireAuth(pageInitFunction, options = {}) {
  document.addEventListener("DOMContentLoaded", async () => {
    const isAuthenticated = protectPage(options)();
    if (isAuthenticated && pageInitFunction) {
      await pageInitFunction();
    }
  });
}
