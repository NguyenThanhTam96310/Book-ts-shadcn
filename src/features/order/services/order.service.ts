
import { OrderOTPRes, PaymentBodyType } from "@/features/order/services/order.Schema";
import { OrderRes, OrderVnPayRes } from "@/features/order/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";

export function paymentCustomer(body: PaymentBodyType) {
    const response = axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/public/orders/customer`, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        });

    return response; // validate với Zod
}

// export const paymentUser = async (
//     body: PaymentBodyType
// ): Promise<void> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders`;
//     await callApi<void>(endpoint, "POST", body);
// };
export function paymentUser(body: PaymentBodyType) {
    const response = axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/public/orders`, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        });

    return response; // validate với Zod
}
export function otpCustomer(body: OrderOTPRes) {
    const response = axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/public/orders/otp`, body, {
        headers: {
            accept: "*/*",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.data)
        .catch((error) => {
            console.log(error)
            throw error
        });

    return response; // validate với Zod
}
// export const fetchOrderbyCode = async (OrderRes: string): Promise<OrderRes> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders/code/${orderCode}`;
//     return await callApi<OrderRes>(endpoint, "GET");
// };
export const fetchOrderbyCode = async (orderCode: string): Promise<OrderRes> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/orders/code/${orderCode}`)
    return response.data as OrderRes

}