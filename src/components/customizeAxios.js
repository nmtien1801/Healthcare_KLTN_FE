import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Cài đặt header mặc định
instance.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access_Token")}`;

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_Token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Body:", config.data); 
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  async (error) => {
    const status = error.response?.status || 500;

    switch (status) {
      // Xử lý lỗi 401 (token hết hạn)
      case 401: {
        const path = window.location.pathname;

        if (path === "/" || path === "/login" || path === "/register" || path === "/forgot-password") {
          console.warn("401 on auth page, skip refresh");
          return Promise.reject(error); 
        }
      }

      case 400: {
        return error.response.data; // Bad request
      }

      // Xử lý lỗi 403 (không có quyền)
      case 403: {
        toast.error("Bạn không có quyền truy cập tài nguyên này.");
        return Promise.reject(error);
      }

      // Xử lý các lỗi khác
      case 404: {
        toast.error("Không tìm thấy tài nguyên.");
        return Promise.reject(error); // Not found
      }
      case 409: {
        return Promise.reject(error); // Conflict
      }
      case 422: {
        return Promise.reject(error); // Unprocessable
      }
      default: {
        return Promise.reject(error); // Lỗi server bất ngờ
      }
    }
  }
);

export default instance;