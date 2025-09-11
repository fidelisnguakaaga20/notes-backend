// import axios from "axios";
// import { getFirebaseToken, waitForAuthReady } from "../context/AuthContext";

// const api = axios.create({ baseURL: "http://localhost:5001/api" });

// api.interceptors.request.use(async (config) => {
//   await waitForAuthReady();
//   const token = await getFirebaseToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;



// // frontend/src/lib/axios.js
// import axios from "axios";
// import { getFirebaseToken, waitForAuthReady } from "../context/AuthContext";

// // Use env in prod, fall back to local in dev
// const BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim())
//   ? import.meta.env.VITE_API_URL.trim()
//   : "http://localhost:5001";              // ✅ fallback for local dev

// const api = axios.create({ baseURL: `${BASE}/api` });

// api.interceptors.request.use(async (config) => {
//   await waitForAuthReady();
//   const token = await getFirebaseToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

import axios from "axios";
import { getFirebaseToken, waitForAuthReady } from "../context/AuthContext";

const base = import.meta.env.VITE_API_URL || "http://localhost:5001"; // dev fallback
const api = axios.create({ baseURL: `${base}/api` });

api.interceptors.request.use(async (config) => {
  await waitForAuthReady();
  const token = await getFirebaseToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
