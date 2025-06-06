import { CartItemType } from "@/features/cart/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";
// export const fetchCart = async (userId: any): Promise<CartItemType> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}`;
//     return await callApi<CartItemType>(endpoint, "GET");
// };
export const deleteCartItem = async (
    userId: number,
    productId: string | number
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}/product`
    await callApi<void>(endpoint, "DELETE", productId)
}
// export const updateQuantityCart = async (
//     userId: number,
//     productId: string | number,
//     quantity: number
// ): Promise<void> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/carts`;
//     const data = {
//         userId: userId,
//         productId: productId,
//         quantity: quantity
//     };
//     await callApi<void>(endpoint, "PUT", data);  
// };
export async function fetchCart(userId: any): Promise<CartItemType> {
    const res = await axiosInstance.get<CartItemType>(`${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}`);
    return res.data;
};
// export async function deleteCartItem(
//     userId: number,
//     productId: string | number
// ): Promise<void> {
//     const res = await axiosInstance.get<void>(`${envConfig.NEXT_PUBLIC_API}/public/carts/user/${userId}/product`);
//     return res.data;
// }
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
    await callApi<void>(endpoint, "PUT", data);
};

