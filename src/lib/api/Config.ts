import { refreshAccessToken } from "@/features/auth";
import axios from "axios";

// Tạo instance axios
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true, // Để gửi refreshToken trong cookie
});

// Gắn access token vào mọi request
axiosInstance.interceptors.request.use((config) => {
    // Kiểm tra nếu đang chạy trên client-side (có window)
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor xử lý response lỗi
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 401 và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshAccessToken();

            if (newToken) {
                // Gắn token mới vào header và gửi lại request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // Lưu token mới vào localStorage (chỉ trên client-side)
                if (typeof window !== "undefined") {
                    localStorage.setItem("authToken", newToken);
                }
                return axiosInstance(originalRequest);
            } else {
                // Nếu không refresh được → chuyển về login
                if (typeof window !== "undefined") {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authTokenExpiry");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("username");
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;