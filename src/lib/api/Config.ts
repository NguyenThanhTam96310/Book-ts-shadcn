// import { refreshAccessToken } from "@/features/auth";
// import axios from "axios";
// import { signOut } from "next-auth/react";
// import { z } from "zod";
// import envConfig from "./envConfig";
// const apiUrl = `${envConfig.NEXT_PUBLIC_API}`;
// // Tạo instance axios
// const axiosInstance = axios.create({
//     baseURL: "http://localhost:8080/api",
//     withCredentials: true, // Để gửi refreshToken trong cookie  
// });

// // Gắn access token vào mọi request
// axiosInstance.interceptors.request.use((config) => {
//     // Kiểm tra nếu đang chạy trên client-side (có window)
//     const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

//     if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // Interceptor xử lý response lỗi
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Nếu lỗi là 401 và chưa thử refresh
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             const newToken = await refreshAccessToken();

//             if (newToken) {
//                 // Gắn token mới vào header và gửi lại request
//                 originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                 // Lưu token mới vào localStorage (chỉ trên client-side)
//                 if (typeof window !== "undefined") {
//                     localStorage.setItem("authToken", newToken);
//                 }
//                 return axiosInstance(originalRequest);
//             } else {
//                 // Nếu không refresh được → chuyển về login
//                 if (typeof window !== "undefined") {
//                     localStorage.clear();
//                     await signOut({ redirect: false }); // Không tự động redirect
//                     window.location.href = "/login";
//                 }
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;
// axiosInstance.ts
import { refreshAccessToken } from "@/features/auth";
import axios from "axios";
import { signOut } from "next-auth/react";
import envConfig from "./envConfig";

// Tạo instance axios
const axiosInstance = axios.create({
    baseURL: `${envConfig.NEXT_PUBLIC_API}`,
    withCredentials: true, // Để gửi refreshToken trong cookie
});

// Gắn access token vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        // Kiểm tra nếu đang chạy trên client-side (có window)
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý response lỗi
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 401 và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    // Gắn token mới vào header và gửi lại request
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Lưu token mới vào localStorage (chỉ trên client-side)
                    if (typeof window !== "undefined") {
                        localStorage.setItem("authToken", newToken);
                    }

                    return axiosInstance(originalRequest);
                } else {
                    // Nếu không refresh được → chuyển về login
                    await handleLogout();
                }
            } catch (refreshError) {
                console.error("Error during token refresh:", refreshError);
                await handleLogout();
            }
        }

        return Promise.reject(error);
    }
);
export default axiosInstance;

// Hàm xử lý logout
const handleLogout = async () => {
    if (typeof window !== "undefined") {
        // Xóa tất cả data trong localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("authTokenExpiry");
        localStorage.clear();
        // Hoặc có thể dùng localStorage.clear() nếu muốn xóa hết

        try {
            // Sign out từ next-auth
            await signOut({ redirect: false });
        } catch (signOutError) {
            console.error("Error during sign out:", signOutError);
        }

        // Redirect về login
        window.location.href = "/login";
    }
};
