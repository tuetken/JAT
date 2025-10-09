// src/api/axios.js
import axios from "axios";
import { auth } from "../firebase";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ← must include /api
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
