import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// Extend Axios config so individual calls can opt out of global error toasts
declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorToast?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isAuthVerifyRequest = (config?: InternalAxiosRequestConfig): boolean => {
  const url = config?.url ?? "";
  return url.includes("/auth/verify");
};

// --- GLOBAL ERROR INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,

  (error: AxiosError<{ message?: string }>) => {
    const config = error.config;

    // Skip global toasts for silent auth checks (like /auth/verify on page load)
    // or any request explicitly marked with `skipGlobalErrorToast: true`
    if (config?.skipGlobalErrorToast || isAuthVerifyRequest(config)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (status === 400) {
        toast.error(serverMessage || "Bad request. Please check your input.");
      } else if (status === 401) {
        // Only shown for non-/auth/verify routes (e.g., an action performed after session expired)
        toast.error(serverMessage || "Please sign in to continue.");
      } else if (status === 404) {
        toast.error("Requested resource not found.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later!");
      } else {
        toast.error(serverMessage || "Something went wrong!");
      }
    } else if (error.request) {
      toast.error("Network error! Please check if the server is running.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);