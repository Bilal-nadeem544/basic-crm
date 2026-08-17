import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

let accessToken = null;
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setOnUnauthorized(fn) {
  onUnauthorized = fn;
}

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const noRetryUrls = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isAuthUrl = noRetryUrls.some((u) => originalRequest.url.includes(u));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        accessToken = res.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshErr) {
        accessToken = null;
        if (onUnauthorized) onUnauthorized();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default client;