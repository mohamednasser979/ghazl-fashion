import axios from "axios";
import { API_URL, FALLBACK_API_URL } from "./config";

const api = axios.create({
baseURL: API_URL
});

api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token");

if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}

return config;

},
(error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error?.config || {};
    const isNetworkError =
      !error.response &&
      (error.code === "ERR_NETWORK" || error.message === "Network Error");
    const isLocalRequest =
      typeof originalConfig.baseURL === "string" &&
      originalConfig.baseURL.includes("localhost:5000");

    if (
      isNetworkError &&
      isLocalRequest &&
      !originalConfig.__retriedWithFallback
    ) {
      originalConfig.__retriedWithFallback = true;
      originalConfig.baseURL = FALLBACK_API_URL;
      return api.request(originalConfig);
    }

    return Promise.reject(error);
  }
);

export default api;
