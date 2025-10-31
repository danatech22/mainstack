import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
