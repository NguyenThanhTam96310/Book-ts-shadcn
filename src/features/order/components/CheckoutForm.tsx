"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, FC } from "react";
import { OrderRes, OrderVnPayRes } from "@/features/order/services/type";
import { fetchOrderbyCode } from "@/features/order/services/order.service";
import OrderDetail from "@/features/profile/components/OrderDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Truck } from "lucide-react";

// Hàm format tiền tệ
const formatCurrency = (amount: number | undefined): string => {
    if (typeof amount !== "number" || isNaN(amount)) {
        return "0 ₫";
    }
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount);
};

// Component hiển thị trạng thái đơn hàng
const StatusBadge: FC<{ status: string | undefined }> = ({ status }) => {
    switch (status) {
        case "PAID":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm font-medium"
                    >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đặt hàng thành công
                    </Badge>
                    <Badge className="bg-green-600 text-white text-xs sm:text-sm font-medium">
                        ĐÃ THANH TOÁN
                    </Badge>
                </div>
            );
        case "PENDING":
            return (
                <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200 text-xs sm:text-sm font-medium"
                >
                    <Truck className="w-4 h-4 mr-1" />
                    Đang xử lý
                </Badge>
            );
        case "FALSED":
            return (
                <Badge
                    variant="outline"
                    className="text-red-600 border-red-200 text-xs sm:text-sm font-medium"
                >
                    <XCircle className="w-4 h-4 mr-1" />
                    Đã hủy
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="text-xs sm:text-sm font-medium">
                    {status || "Không xác định"}
                </Badge>
            );
    }
};

const CheckoutForm = () => {
    const searchParams = useSearchParams();
    const vnp_ResponseCode = searchParams?.get("vnp_ResponseCode");
    const vnp_TransactionStatus = searchParams?.get("vnp_TransactionStatus");
    const vnp_Amount = searchParams?.get("vnp_Amount");
    const vnp_TxnRef = searchParams?.get("vnp_TxnRef");

    const [order, setOrder] = useState<OrderRes | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                if (!vnp_TxnRef) return;
                const data = await fetchOrderbyCode(vnp_TxnRef);
                setOrder(data);
            } catch (error) {
                console.error("Lỗi khi load profile:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [vnp_TxnRef]);

    let isSuccess: boolean = false;
    if (vnp_ResponseCode && vnp_TransactionStatus) {
        isSuccess =
            vnp_ResponseCode === "00" &&
            vnp_TransactionStatus === "00" &&
            order?.orderStatus === "PAID";
    } else {
        isSuccess = order?.orderStatus === "PAID";
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center py-5 bg-gray-100">
                <div className="text-center text-gray-600">Đang tải...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center py-5 bg-gray-100">
                <div className="text-center text-gray-600">Không tìm thấy đơn hàng.</div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex justify-center items-center py-5 bg-gray-100">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-[800px] md:w-[60%]">
                {/* Hiển thị OrderDetail khi showOrderDetail là true */}
                {showOrderDetail && order && (
                    <div className="transition-opacity duration-300">
                        <OrderDetail order={order} />
                    </div>
                )}
                {/* Hiển thị thông tin thanh toán khi không xem chi tiết */}
                {!showOrderDetail && (
                    <div className="transition-opacity duration-300">
                        <Card className="w-full shadow-lg border-none">
                            <CardHeader className="flex flex-row items-center justify-center">
                                <span
                                    className={`text-4xl ${isSuccess ? "text-green-500" : "text-red-500"} mr-2`}
                                >
                                    {isSuccess ? "✅" : "❌"}
                                </span>
                                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                                    Kết quả thanh toán
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 space-y-4">
                                <div className="grid grid-cols-1 gap-3 text-sm sm:text-base text-gray-700">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                                        <strong className="text-gray-800">{vnp_TxnRef || "N/A"}</strong>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600 font-medium">Thông tin:</span>
                                        <span className="text-gray-800">{order?.deliveryName || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600 font-medium">Số điện thoại:</span>
                                        <span className="text-gray-800">{order?.deliveryPhone || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-gray-600 font-medium">Số tiền:</span>
                                        <span className="text-gray-800 font-semibold text-red-600">
                                            {formatCurrency(Number(order?.totalAmount))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Trạng thái:</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-sm font-semibold ${isSuccess
                                                ? "text-green-600 border-green-200 bg-green-50"
                                                : "text-red-600 border-red-200 bg-red-50"
                                                }`}
                                        >
                                            {isSuccess ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    Thành công
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    Thất bại
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    {!isSuccess && (
                                        <div className="flex justify-between items-center pt-2 border-t">
                                            <span className="text-gray-600 font-medium">
                                                Có thắc mắc vui lòng liên hệ:
                                            </span>
                                            <a
                                                href="tel:1234567890"
                                                className="text-green-600 font-semibold hover:underline"
                                            >
                                                1234567890
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => setShowOrderDetail(!showOrderDetail)} // Toggle giữa thông tin và OrderDetail
                        className="w-full py-3 border border-orange-600 rounded-lg hover:bg-orange-500 hover:text-white cursor-pointer transition-colors duration-200 font-semibold bg-white"
                    >
                        {showOrderDetail ? "Quay lại" : "Xem chi tiết đơn hàng"}
                    </button>
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

export default CheckoutForm;