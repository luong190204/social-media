import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8085/api",
  headers: { "Content-Type": "application/json" },
});

// Thêm interceptor để đính kèm token vào mỗi request
 axiosInstance.interceptors.request.use(
   (config) => {
     const token = localStorage.getItem("token");
     console.log("Sending token:", token);

     if (token && token !== "undefined" && token !== "null") {
       config.headers["Authorization"] = `Bearer ${token}`;
     }
     return config;
   },
   (error) => Promise.reject(error)
 );