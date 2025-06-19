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
// const axiosInstance = axios.create({
//     baseURL: `${envConfig.NEXT_PUBLIC_API}`,
//     withCredentials: true, // Để gửi refreshToken trong cookie
// });

// // Gắn access token vào mọi request
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Kiểm tra nếu đang chạy trên client-side (có window)
//         const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

//         if (token) {
//             config.headers = config.headers || {};
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Interceptor xử lý response lỗi
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Nếu lỗi là 401 và chưa thử refresh
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const newToken = await refreshAccessToken();

//                 if (newToken) {
//                     // Gắn token mới vào header và gửi lại request
//                     originalRequest.headers = originalRequest.headers || {};
//                     originalRequest.headers.Authorization = `Bearer ${newToken}`;

//                     // Lưu token mới vào localStorage (chỉ trên client-side)
//                     if (typeof window !== "undefined") {
//                         localStorage.setItem("authToken", newToken);
//                     }

//                     return axiosInstance(originalRequest);
//                 } else {
//                     // Nếu không refresh được → chuyển về login
//                     await handleLogout();
//                 }
//             } catch (refreshError) {
//                 console.error("Error during token refresh:", refreshError);
//                 await handleLogout();
//             }
//         }

//         return Promise.reject(error);
//     }
// );
const apiUrl = `${envConfig.NEXT_PUBLIC_API}`;
const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true, // nếu dùng cookie cho refresh token
});
interface LoginResponse {
    "jwt-token": string;
}
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers = originalRequest.headers || {};
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(axiosInstance(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post<LoginResponse>(
                    `${apiUrl}/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true,
                    },
                );

                const newAccessToken = res.data["jwt-token"];
                localStorage.setItem("authToken", newAccessToken);
                axiosInstance.defaults.headers.common["Authorization"] =
                    "Bearer " + newAccessToken;
                processQueue(null, newAccessToken);

                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                await handleLogout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
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
