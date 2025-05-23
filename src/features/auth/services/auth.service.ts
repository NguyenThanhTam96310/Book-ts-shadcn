import { emailVerifySchema, RegisterBodyType, LoginGoogleResponseSchema, LoginGoogleResponse, LoginGoogleRes, LoginGoogleResSchema } from "@/features/auth/services/auth.schema";
import { UserProps } from "@/features/auth/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
import { signIn, signOut } from 'next-auth/react';
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

export const fetchUserByToken = async (accessToken: any): Promise<UserProps> => {
    const response = axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/users/infor`, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        });
    return response;
};

export function registerUser(body: RegisterBodyType) {
    const response = axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/register`, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        });

    return response; // validate với Zod
}
export async function fetchEmailVerify(token: string) {
    try {
        const response = await axiosInstance.get(
            `${envConfig.NEXT_PUBLIC_API}/auth/verify/${token}`
        );
        console.log("Email verify response:", response.data);
        return emailVerifySchema.parse(response.data); // validate dữ liệu
    } catch (error) {
        console.error("Email verification error:", error);
        throw error;
    }
}

export async function loginGoogleLocal(token: string): Promise<any> {
    try {
        const res = await axiosInstance.post(
            `${envConfig.NEXT_PUBLIC_API}/auth/google`,
            { token: token },
            {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        );

        return res.data;
    } catch (error: any) {
        console.error("Error in loginGoogle:", error?.response?.data || error.message);
        throw error;
    }
}
