import { OrderRes, PaginatedOrderResponse } from "@/features/order/services/type";
import { EditAddressBodyType, EditPasswordType } from "@/features/profile/services/profile.Schema";
import { AvatarProps, UserRes } from "@/features/profile/services/type"
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig"
import { callApi } from "@/lib/api/Service"


export async function fetchUserByEmail(email: string): Promise<UserRes> {
    const res = await axiosInstance.get<UserRes>(`${envConfig.NEXT_PUBLIC_API}/public/users/email/${email}`);
    return res.data;
};
export async function fetchEditPassword(body: EditPasswordType): Promise<void> {
    const res = await axiosInstance.post<void>(`${envConfig.NEXT_PUBLIC_API}/public/users/password`, body);
    return res.data;
}
// export const fetchOrdersbyId = async (userId: number, page: number = 0): Promise<PaginatedOrderResponse> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders/user/${userId}?pageNumber=${page}&pageSize=3`;
//     return await callApi<PaginatedOrderResponse>(endpoint, "GET");
// };
export async function fetchOrdersbyId(userId: number, page: number = 0): Promise<PaginatedOrderResponse> {
    const res = await axiosInstance.get<PaginatedOrderResponse>(`${envConfig.NEXT_PUBLIC_API}/public/orders/user/${userId}?pageNumber=${page}&pageSize=3&sortOrder=desc&sortBy=totalAmount`);
    return res.data;
};
export async function fetchEditAddress(body: EditAddressBodyType): Promise<void> {
    const res = await axiosInstance.put<void>(`${envConfig.NEXT_PUBLIC_API}/public/users`, body);
    return res.data;
}
export async function fetchEditAvatar(body: AvatarProps): Promise<void> {
    const res = await axiosInstance.put<void>(`${envConfig.NEXT_PUBLIC_API}/public/users/1/avatar`, body);
    return res.data;
}

export async function updateUserAvatar(userId: string, file: File) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance
            .put(`${envConfig.NEXT_PUBLIC_API}/public/users/${userId}/avatar`, formData, {
                headers: {
                    accept: "*/*",
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                console.log(error);
                throw error;
            });

        return response; // Có thể validate với Zod nếu cần
    } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.response) {
            throw error.response.data; // Ném lỗi từ server
        }
        console.error("Lỗi khi cập nhật ảnh đại diện:", error.response?.data?.message);
        throw { general: "Đã có lỗi xảy ra khi cập nhật ảnh đại diện. Vui lòng thử lại." };
    }
}