import { UserRes } from "@/features/profile/services/type"
import envConfig from "@/lib/api/envConfig"
import { callApi } from "@/lib/api/Service"


export const fetchUserByEmail = async (email: string): Promise<UserRes> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/users/email/${email}`;
    return await callApi<UserRes>(endpoint, "GET");
};
