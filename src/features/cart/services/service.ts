import { CartItemType, CartProps } from "@/features/cart/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
export const deleteCartItem = async (
    userId: number,
    productId: string | number
): Promise<any> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}/product`;
    const result = await callApi<any>(endpoint, "DELETE", productId);
    return productId;
}
export const updateQuantityCart = async (
    userId: number,
    productId: string | number,
    quantity: number
): Promise<any> => {
    try {
        const data = {
            userId,
            productId,
            quantity,
        };
        const res = await axiosInstance.put<any>(
            `${envConfig.NEXT_PUBLIC_API}/public/carts`,
            data,
            {
                timeout: 5000, // Timeout để tránh TimeoutError
            }
        );
        return data;
    } catch (error: any) {
        console.error("Error in updateQuantityCart:", error);
        if (error.code === "ECONNABORTED" || error.code === 23) {
            throw new Error("Request timed out. Please try again later.");
        }
        throw error.response?.data?.message || error.message || "Failed to update cart quantity.";
    }
};
export async function fetchCart(userId: any): Promise<CartProps> {
    const res = await axiosInstance.get<CartProps>(`${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}`);
    return res.data;
};
// export async function deleteCartItem(
//     userId: number,
//     productId: string | number
// ): Promise<void> {
//     const res = await axiosInstance.get<void>(`${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}/product`);
//     return res.data;
// }
// export const updateQuantityCart = async (
//     userId: number,
//     productId: string | number,
//     quantity: number
// ): Promise<any> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts`;
//     const data = {
//         userId: userId,
//         productId: productId,
//         quantity: quantity
//     };
//     await callApi<any>(endpoint, "PUT", data);
// };

