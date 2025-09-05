import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 60000, // 1 minute
  headers: {
    "Content-Type": "application/json",
  },
});

//
http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("sb-access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sb-access-token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
