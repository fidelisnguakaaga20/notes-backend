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
import { auth } from "../lib/firebase"; // your initialized firebase app

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  // we don't need withCredentials for Firebase tokens (they go in the header)
});

// Attach Firebase ID token to every request (if logged in)
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(/* forceRefresh? false */);
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
