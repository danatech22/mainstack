import axiosInstance from "./axios-config";
import type { AxiosRequestConfig } from "axios";

// API client with abstraction layer
const api = {
  // GET request
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default api;
