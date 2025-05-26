import { EditPasswordType } from "@/features/profile/services/profile.Schema";
import { UserRes } from "@/features/profile/services/type"
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig"
import { callApi } from "@/lib/api/Service"


export const fetchUserByEmail = async (email: string): Promise<UserRes> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/users/email/${email}`;
    return await callApi<UserRes>(endpoint, "GET");
};
// export const fetchEditPassword = async (body: EditPasswordType) => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/users/password`;
//     return await callApi<void>(endpoint, "POST", body);
// };
export async function fetchEditPassword(body: EditPasswordType): Promise<void> {
    const res = await axiosInstance.post<void>(`${envConfig.NEXT_PUBLIC_API}/public/users/password`, body);
    return res.data;
}