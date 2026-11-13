import axios from "axios";
import { auth } from "../auth/cognito";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
});

httpClient.interceptors.request.use(async (config) => {
  const user = await auth.getUser();
  if (user?.access_token && !user.expired) {
    config.headers.set("Authorization", `Bearer ${user.access_token}`);
  }
  return config;
});
