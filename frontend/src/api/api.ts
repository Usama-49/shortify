import axios, { AxiosError } from "axios";
import { toast } from "react-toastify"; // Optional: if you want global toast notifications

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- GLOBAL ERROR INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,

  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      if (status === 400) {
        toast.error(serverMessage || "Bad request. Please check your input.");
      } else if (status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (status === 404) {
        toast.error("Requested resource not found.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later!");
      } else {
        toast.error(serverMessage || "Something went wrong!");
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., server is offline / backend not running)
      toast.error("Network error! Please check if the server is running.");
    } else {
      // Something else happened while setting up the request
      toast.error("An unexpected error occurred.");
    }

    // Reject the promise so individual components/mutations still know it failed if needed
    return Promise.reject(error);
  },
);
