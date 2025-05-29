"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderVnPayRes } from "@/features/order/services/type";
import { fetchOrderbyCode } from "@/features/order/services/order.service";

const VnPayForm = () => {
    const searchParams = useSearchParams();
    const vnp_ResponseCode = searchParams?.get("vnp_ResponseCode");
    const vnp_TransactionStatus = searchParams?.get("vnp_TransactionStatus");
    const vnp_Amount = searchParams?.get("vnp_Amount");
    const vnp_OrderInfo = searchParams?.get("vnp_OrderInfo");
    const vnp_TxnRef = searchParams?.get("vnp_TxnRef");
    const vnp_SecureHash = searchParams?.get("vnp_SecureHash");
    const [order, setOrder] = useState<OrderVnPayRes>();
    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!vnp_TxnRef) return;
                const data = await fetchOrderbyCode(vnp_TxnRef);
                setOrder(data);
            } catch (error) {
                console.error("Lỗi khi load profile:", error);
            }
        };
        loadProfile();
    }, [vnp_TxnRef])
    const isSuccess = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00" && order?.orderStatus === "PAID";

    return (
        <div className="min-h-[70vh] flex py-5 justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex items-center justify-center mb-6">
                    <span className={`text-4xl ${isSuccess ? "text-green-500" : "text-red-500"}`}>
                        {isSuccess ? "✅" : "❌"}
                    </span>
                    <h1 className="text-2xl font-bold ml-2 text-gray-800">
                        Kết quả thanh toán
                    </h1>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <strong className="text-gray-800">{vnp_TxnRef || "N/A"}</strong>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Thông tin:</span>
                        <span className="text-gray-800">{vnp_OrderInfo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="text-gray-800">
                            {(Number(vnp_Amount || 0) / 100).toLocaleString("vi-VN")} VND
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className={`font-semibold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                            {isSuccess ? "Thành công" : "Thất bại"}
                        </span>
                    </div>
                    {!isSuccess && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Có thắt mắc vui lòng liên hệ:</span>
                            <span className="font-semibold text-green-600">
                                1234567890
                            </span>
                        </div>
                    )}
                </div>
                <div className="mt-8 space-y-4">
                    <Link href={`/order-details/${vnp_TxnRef}`}>

                        <button className="w-full py-3 border border-orange-600 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer transition-colors duration-200 font-semibold bg-white">
                            Xem chi tiết đơn hàng
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="w-full py-3 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white cursor-pointer transition-colors duration-200 font-semibold bg-white mt-5">
                            Tiếp tục mua sắm
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VnPayForm;