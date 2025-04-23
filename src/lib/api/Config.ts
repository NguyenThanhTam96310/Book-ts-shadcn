import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
});

// Interceptor xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!localStorage.getItem("hasRedirected")) {
                localStorage.setItem("hasRedirected", "true");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
