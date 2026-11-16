import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("pasteleriaToken");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
