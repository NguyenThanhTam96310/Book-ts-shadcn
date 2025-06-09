// import { refreshAccessToken } from "@/features/auth";
// import axios from "axios";
// import { signOut } from "next-auth/react";
// import { z } from "zod";

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
//                     localStorage.removeItem("authToken");
//                     localStorage.removeItem("authTokenExpiry");
//                     localStorage.removeItem("userId");
//                     localStorage.removeItem("username");
//                     localStorage.removeItem("accountName");
//                     await signOut({ redirect: false }); // Không tự động redirect
//                     window.location.href = "/login";
//                 }
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;


import { refreshAccessToken } from "@/features/auth";
import axios from "axios";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true,
    timeout: 10000, // Timeout 10 giây
});

axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi timeout
        if (error.code === "ECONNABORTED" || error.code === 23) {
            if (typeof window !== "undefined") {
                toast.error("Không thể kết nối đến server, vui lòng thử lại sau!", {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            }
            return Promise.reject(error);
        }

        // Xử lý lỗi 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    if (typeof window !== "undefined") {
                        localStorage.setItem("authToken", newToken);
                    }
                    return axiosInstance(originalRequest);
                } else {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("authTokenExpiry");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("username");
                        localStorage.removeItem("accountName");

                        try {
                            // Gọi API đăng xuất (nếu có)
                            await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
                            await signOut({ redirect: false });
                            window.location.href = "/login";
                        } catch (signOutError) {
                            console.error("Lỗi khi đăng xuất:", signOutError);
                            window.location.href = "/login";
                        }
                    }
                }
            } catch (refreshError) {
                console.error("Lỗi khi làm mới token:", refreshError);
                if (typeof window !== "undefined") {
                    localStorage.clear()
                    await signOut({ redirect: false });
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;