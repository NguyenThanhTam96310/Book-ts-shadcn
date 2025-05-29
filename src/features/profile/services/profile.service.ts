import { OrderRes, PaginatedOrderResponse } from "@/features/order/services/type";
import { EditPasswordType } from "@/features/profile/services/profile.Schema";
import { UserRes } from "@/features/profile/services/type"
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig"
import { callApi } from "@/lib/api/Service"


export const fetchUserByEmail = async (email: string): Promise<UserRes> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/users/email/${email}`;
    return await callApi<UserRes>(endpoint, "GET");
};
export async function fetchEditPassword(body: EditPasswordType): Promise<void> {
    const res = await axiosInstance.post<void>(`${envConfig.NEXT_PUBLIC_API}/public/users/password`, body);
    return res.data;
}
// export const fetchOrdersbyId = async (userId: number, page: number = 0): Promise<PaginatedOrderResponse> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders/user/${userId}?pageNumber=${page}&pageSize=3`;
//     return await callApi<PaginatedOrderResponse>(endpoint, "GET");
// };
export const fetchOrdersbyId = async (userId: number, page: number = 0, status?: string): Promise<PaginatedOrderResponse> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders/user/${userId}?pageNumber=${page}&pageSize=3${status ? `&status=${status}` : ""}`;
    return await callApi<PaginatedOrderResponse>(endpoint, "GET");
};