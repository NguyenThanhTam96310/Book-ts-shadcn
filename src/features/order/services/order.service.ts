
import { OrderOTPRes, PaymentBodyType } from "@/features/order/services/order.Schema";
import { OrderRes, OrderVnPayRes } from "@/features/order/services/type";
import axiosInstance from "@/lib/api/Config";
import envConfig from "@/lib/api/envConfig";
import { callApi } from "@/lib/api/Service";

export async function paymentCustomer(body: PaymentBodyType) {
    try {
        const response = await axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/public/orders/customer`, body, {
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
    } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.response?.data) {
            throw error.response.data; // Ném lỗi từ server
        }
        console.error("Lỗi khi gọi API thanh toán:", error.response.data.message);
        throw { general: "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại." };
    }
}

// export const paymentUser = async (
//     body: PaymentBodyType
// ): Promise<void> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders`;
//     await callApi<void>(endpoint, "POST", body);
// };
export async function paymentUser(body: PaymentBodyType) {
    try {
        const response = await axiosInstance.post(
            `${envConfig.NEXT_PUBLIC_API}/public/orders`,
            body,
            {
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.response?.data) {
            throw error.response.data; // Ném lỗi từ server
        }
        console.error("Lỗi khi gọi API thanh toán:", error.response.data.message);
        throw { general: "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại." };
    }
}
export async function otpCustomer(body: OrderOTPRes) {
    try {
        const response = await axiosInstance.post(`${envConfig.NEXT_PUBLIC_API}/public/orders/otp`, body, {
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
    } catch (error: any) {
        // Xử lý lỗi từ API
        if (error.response) {
            throw error.response.data; // Ném lỗi từ server
        }
        console.error("Lỗi khi gọi API thanh toán:", error.response.data.message);
        throw { general: "Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại." };
    }


}
// export const fetchOrderbyCode = async (OrderRes: string): Promise<OrderRes> => {
//     const endpoint = `${envConfig.NEXT_PUBLIC_API}/public/orders/code/${orderCode}`;
//     return await callApi<OrderRes>(endpoint, "GET");
// };
export const fetchOrderbyCode = async (orderCode: string): Promise<OrderRes> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/orders/code/${orderCode}`)
    return response.data as OrderRes

}