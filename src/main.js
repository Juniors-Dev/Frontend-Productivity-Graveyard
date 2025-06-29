import { initUI } from "./components/layout/index.js";
import api from "./utlis/apiClient.js";
export { api };

let user = null;

try {
  const stored = localStorage.getItem("user");
  if (stored) {
    user = JSON.parse(stored);
  }
} catch (err) {
  console.warn("Invalid user JSON in localStorage, clearing it." + err);
  localStorage.removeItem("user");
}

if (user && user.token) {
  api.setToken(user.token);
} else {
  localStorage.removeItem("user");
}

initUI();
