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

// ✅ Interceptor that picks correct token automatically
API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  // 🔹 Automatically detect admin routes
  if (config.url.includes("/admin")) {
    if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;
  } else {
    if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default API;

