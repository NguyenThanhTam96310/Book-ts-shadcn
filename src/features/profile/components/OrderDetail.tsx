"use client"

import { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OrderRes } from "@/features/order/services/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, RotateCcw, CheckCircle, Truck, XCircle } from "lucide-react";


interface OrderDetailProps {
    order: OrderRes;
}

const OrderDetail: FC<OrderDetailProps> = ({ order }) => {
    const router = useRouter();

    // Format tiền tệ
    const formatCurrency = (amount: number | undefined): string => {
        if (typeof amount !== "number" || isNaN(amount)) {
            return "0 ₫";
        }
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        })
            .format(amount)
            .replace("₫", "₫");
    };

    // Hiển thị trạng thái đơn hàng
    const getStatusBadge = (status: string | undefined) => {
        switch (status) {
            case "PAID":
                return (
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200 text-[10px] sm:text-xs md:text-sm"
                        >
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 md:w-4 sm:h-3 md:h-4 mr-1" />
                            Giao hàng thành công
                        </Badge>
                        <Badge className="bg-green-600 text-white text-[10px] sm:text-xs md:text-sm">
                            ĐÃ THANH TOÁN
                        </Badge>
                    </div>
                );
            case "PENDING":
                return (
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge
                            variant="outline"
                            className="text-orange-600 border-orange-200 text-[10px] sm:text-xs md:text-sm"
                        >
                            <Truck className="w-2.5 h-2.5 sm:w-3 md:w-4 sm:h-3 md:h-4 mr-1" />
                            Đang xử lý
                        </Badge>
                    </div>
                );
            case "FALSED":
                return (
                    <Badge
                        variant="outline"
                        className="text-red-600 border-red-200 text-[10px] sm:text-xs md:text-sm"
                    >
                        <XCircle className="w-2.5 h-2.5 sm:w-3 md:w-4 sm:h-3 md:h-4 mr-1" />
                        Đã hủy
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-[10px] sm:text-xs md:text-sm">
                        {status || "Không xác định"}
                    </Badge>
                );
        }
    };

    // Guard clause nếu không có dữ liệu
    if (!order || !order.orderItems || order.orderItems.length === 0) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-4">
                    <div className="text-center py-4 text-gray-600">
                        Không có thông tin đơn hàng.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
                    Chi tiết đơn hàng #{order.orderCode}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600">
                    <span>Ngày đặt: {new Date(order.orderDateTime).toLocaleString("vi-VN")}</span>
                    {getStatusBadge(order.orderStatus)}
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {/* Thông tin giao hàng */}
                <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Thông tin giao hàng
                    </h3>
                    <p className="text-xs sm:text-sm">
                        <strong>Người nhận:</strong> {order.deliveryName}
                    </p>
                    <p className="text-xs sm:text-sm">
                        <strong>Số điện thoại:</strong> {order.deliveryPhone}
                    </p>
                    <p className="text-xs sm:text-sm">
                        <strong>Địa chỉ:</strong>{" "}
                        {`${order.address.buildingName}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`}
                    </p>
                </div>

                <Separator />

                {/* Danh sách sản phẩm */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Sản phẩm trong đơn hàng
                    </h3>
                    {order.orderItems.map((item) => (
                        <div
                            key={item.orderItemId}
                            className="flex flex-col sm:flex-row gap-3 mb-4"
                        >
                            <div className="relative flex-shrink-0">
                                <Image
                                    src={
                                        item.product.images?.[0]?.fileName
                                            ? `${process.env.NEXT_PUBLIC_FILE}${item.product.images[0].fileName}`
                                            : "/placeholder.svg"
                                    }
                                    alt={item.product.productName || "Sản phẩm"}
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
                                />
                                {item.discount && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute -top-1.5 -left-1.5 bg-green-500 text-white text-[10px] sm:text-xs px-1"
                                    >
                                        SALE
                                    </Badge>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2">
                                    {item.product.productName || "Không xác định"}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                    Phân loại: {item.product.size || "N/A"}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Số lượng: x{item.quantity || 1}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                    {item.discount ? (
                                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                                            {formatCurrency(
                                                (item.price || 0) + (item.discount || 0)
                                            )}
                                        </span>
                                    ) : null}
                                    <span className="text-sm sm:text-base font-medium text-red-600">
                                        {formatCurrency(item.price - item.price * ((item.discount ?? 0) / 100))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Tổng tiền */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm sm:text-base">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(order.subTotal)}</span>
                    </div>
                    {order.freeship ? (
                        <div className="flex justify-between text-sm sm:text-base">
                            <span>Miễn phí vận chuyển (Mã: {order.freeship.promotionCode}):</span>
                            <span>{formatCurrency(order.priceShip)}</span>
                        </div>
                    ) : (
                        <div className="flex justify-between text-sm sm:text-base">
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(order.priceShip)}</span>
                        </div>
                    )}

                    {order.coupon && (
                        <div className="flex justify-between text-sm sm:text-base ">
                            <span>Giảm giá (Mã: {order.coupon.promotionCode}):</span>
                            <span>-{formatCurrency((order.subTotal) * order.coupon.value / 100)}</span>
                        </div>
                    )}

                    <Separator />
                    <div className="flex justify-between text-base sm:text-lg font-bold text-red-600">
                        <span>Tổng tiền:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>

                <Separator />

                {/* Nút hành động */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                    <Button
                        variant="outline"
                        className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10"
                        onClick={() => router.push("/cart")} // Ví dụ: chuyển hướng đến giỏ hàng để mua lại
                    >
                        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                        Mua lại
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10"
                        onClick={() => router.push("/contact")} // Ví dụ: chuyển hướng đến trang liên hệ
                    >
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Liên hệ người bán
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderDetail;