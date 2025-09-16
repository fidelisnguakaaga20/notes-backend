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


// frontend/src/lib/axios.js
import axios from "axios";
import { getAuth } from "firebase/auth";

// If VITE_API_URL is set (Render), use it + /api
// Otherwise use relative /api and let vercel.json rewrite proxy it.
const API_ROOT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : `/api`;

const api = axios.create({
  baseURL: API_ROOT,
  // We're sending Firebase bearer tokens, not cookies:
  withCredentials: false,
});

// Attach Firebase ID token on every request
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
