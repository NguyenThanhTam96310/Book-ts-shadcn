import { CartItemType } from "@/features/cart/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
export const fetchCart = async (userId: any): Promise<CartItemType> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}`;
    return await callApi<CartItemType>(endpoint, "GET");
};
export const deleteCartItem = async (
    userId: number,
    productId: string | number
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}/product`
    // Gọi DELETE, body chứa productId
    await callApi<void>(endpoint, "DELETE", productId)
}
export const updateQuantityCart = async (
    userId: number,
    productId: string | number,
    quantity: number
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts`;
    const data = {
        userId: userId,
        productId: productId,
        quantity: quantity
    };
    await callApi<void>(endpoint, "PUT", data);  // Gọi API để update số lượng
};