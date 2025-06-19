import envConfig from "@/lib/api/envConfig";
import axios from "axios";

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${envConfig.NEXT_PUBLIC_API}/auth/refresh-token`,
            {
                withCredentials: true, // Gửi cookie chứa refreshToken
            }
        );

        const newToken = (response.data as { "jwt-token": string })["jwt-token"];
        if (newToken) {
            localStorage.setItem("authToken", newToken);
            const expiryTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
            localStorage.setItem("authTokenExpiry", expiryTime.toString());
            return newToken;
        }
        return null;
    } catch (error) {
        console.error("Không thể refresh token:", error);
        return null;
    }
};
