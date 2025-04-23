import axiosInstance from "@/lib/api/Config";


export function login(body: { username: string; password: string }) {
    const API_URL_LOGIN = "http://localhost:8080/api/auth/login"
    return axiosInstance.post(API_URL_LOGIN, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        })
}
