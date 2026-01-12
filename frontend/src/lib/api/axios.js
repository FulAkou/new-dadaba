import axios from "axios";
import { setupInterceptors } from "./interceptors";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If using cookies
});

setupInterceptors(api);

export default api;
