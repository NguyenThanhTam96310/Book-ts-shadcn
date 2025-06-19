import { emailVerifySchema, RegisterBodyType, LoginGoogleResponseSchema, LoginGoogleResponse, LoginGoogleRes, LoginGoogleResSchema } from "@/features/auth/services/auth.schema";
import { UserProps } from "@/features/auth/services/type";
import { UserRes } from "@/features/profile/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
import { signIn, signOut } from 'next-auth/react';
export function login(body: { username: string; password: string }) {
    return axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/auth/login`, body, {
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

export const fetchUserByToken = async (accessToken: any): Promise<UserRes> => {
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

export async function registerUser(body: RegisterBodyType) {
    try {
        const response = await axiosInstance.post(
            `${envConfig.NEXT_PUBLIC_API}/register`,
            body,
            {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.response) {
            throw error.response.data; // Ném lỗi từ server
        }
        console.error("Lỗi khi gọi API đăng ký:", error.response.data.message);
        throw { general: "Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại." };
    }
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
