import { CartItemType } from "@/features/cart/services/type";
import axiosInstance from "@/lib/api/Config";
import { callApi } from "@/lib/api/Service";
const API = process.env.NEXT_PUBLIC_API
export const fetchCart = async (cartId: any): Promise<CartItemType> => {
    const endpoint = `${API}/public/carts/${cartId}`;
    return await callApi<CartItemType>(endpoint, "GET");
};
export const deleteCartItem = async (
    cartId: string | number,
    productId: string | number
): Promise<void> => {
    const endpoint = `${API}/public/carts/${cartId}/product`
    // Gọi DELETE, body chứa productId
    await callApi<void>(endpoint, "DELETE", productId)
}
export const updateQuantityCart = async (
    cartId: string | number,
    productId: string | number,
    quantity: number
): Promise<void> => {
    const endpoint = `${API}/public/carts`;
    const data = {
        cartId: cartId,
        productId: productId,
        quantity: quantity
    };
    await callApi<void>(endpoint, "PUT", data);  // Gọi API để update số lượng
};