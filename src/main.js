import { initUI } from "./components/layout/index.js";
import ApiClient from "./utlis/apiClient.js";

export let api = new ApiClient();
initUI();

const token = localStorage.getItem("token");
if (token) {
  api.setToken(token);
} else {
  const fetchSetToken = async () => {
    const res = await api.login({
      email: "jake@example.com",
      password: "user123",
    });

    if (res.status === "success") {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    return res;
  };

  await fetchSetToken();
}
