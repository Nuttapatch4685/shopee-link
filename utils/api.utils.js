import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Only add the token on the client
if (typeof window !== "undefined") {
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Safe: runs only in browser
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Missing token 111");
    }
    return config;
  });
}

export default axiosInstance;
