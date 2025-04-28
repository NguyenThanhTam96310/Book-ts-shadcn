import { UserProps } from "@/features/auth/services/type";
import axiosInstance from "@/lib/api/Config";
import { callApi } from "@/lib/api/Service";
const API = process.env.NEXT_PUBLIC_API
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

export const fetchUserByEmail = async (username: string): Promise<UserProps> => {
    const endpoint = `${API}/public/users/email/${username}`;
    return await callApi<UserProps>(endpoint, "GET");
};
export const fetchUserByToken = async (): Promise<UserProps> => {
    const endpoint = `${API}/public/users/infor`;
    return await callApi<UserProps>(endpoint, "GET");
};