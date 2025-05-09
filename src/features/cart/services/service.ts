import { CartItemType } from "@/features/cart/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
export const fetchCart = async (cartId: any): Promise<CartItemType> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/${cartId}`;
    return await callApi<CartItemType>(endpoint, "GET");
};
export const deleteCartItem = async (
    cartId: string | number,
    productId: string | number
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/${cartId}/product`
    // Gọi DELETE, body chứa productId
    await callApi<void>(endpoint, "DELETE", productId)
}
export const updateQuantityCart = async (
    cartId: string | number,
    productId: string | number,
    quantity: number
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts`;
    const data = {
        cartId: cartId,
        productId: productId,
        quantity: quantity
    };
    await callApi<void>(endpoint, "PUT", data);  // Gọi API để update số lượng
};