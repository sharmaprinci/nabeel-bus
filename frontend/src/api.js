// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
// });

// // Add token interceptor
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default API;

// src/api.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// ✅ Request Interceptor
API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  if (config.url.includes("/admin")) {
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

// ✅ Response Interceptor — Handle Token Expiry or Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";

    if (status === 401 || message.toLowerCase().includes("jwt expired")) {
      console.warn("⚠️ Session expired. Logging out...");

      // Clear stored tokens
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");

      // Redirect based on user type
      if (window.location.pathname.includes("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }

      return Promise.reject(new Error("Session expired"));
    }

    return Promise.reject(error);
  }
);

export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
// });

// // ✅ Interceptor that picks correct token automatically
// API.interceptors.request.use((config) => {
//   const adminToken = localStorage.getItem("adminToken");
//   const userToken = localStorage.getItem("token");

//   // 🔹 Automatically detect admin routes
//   if (config.url.includes("/admin")) {
//     if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
//   } else {
//     if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
//   }

//   return config;
// });

// export default API;

