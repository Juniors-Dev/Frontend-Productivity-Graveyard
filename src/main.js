import { initUI } from "./components/layout/index.js";
import ApiClient from "./utlis/apiClient.js";

export let api = new ApiClient();
initUI();
