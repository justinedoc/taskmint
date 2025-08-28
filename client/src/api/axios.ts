import { parseAxiosError } from "@/lib/parse-axios-error";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

API.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

createAuthRefreshInterceptor(
  API,
  async (failedRequest) => {
    try {
      const { data } = await API.post<{ accessToken: string }>(
        "/refresh",
        {},
        { skipAuthRefresh: true },
      );

      const newAccessToken = data.accessToken;

      useAuthStore.getState().setAccessToken(newAccessToken);

      if (failedRequest.response) {
        failedRequest.response.config.headers["Authorization"] =
          `Bearer ${newAccessToken}`;
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Client Refresh token error:", parseAxiosError(error));

      useAuthStore.getState().logout();

      return Promise.reject(error);
    }
  },
  {
    statusCodes: [401],
    pauseInstanceWhileRefreshing: true,
    interceptNetworkError: false,
  },
);
