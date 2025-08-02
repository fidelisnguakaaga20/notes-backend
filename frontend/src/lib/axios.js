import axios from "axios";
import { getFirebaseToken, waitForAuthReady } from "../context/AuthContext";

const api = axios.create({ baseURL: "http://localhost:5001/api" });

api.interceptors.request.use(async (config) => {
  await waitForAuthReady();
  const token = await getFirebaseToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

