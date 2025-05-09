
import { PaymentBodyType } from "@/features/order/services/order.Schema";
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

export const paymentUser = async (
    body: PaymentBodyType
): Promise<void> => {
    const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders`;
    await callApi<void>(endpoint, "POST", body);
};