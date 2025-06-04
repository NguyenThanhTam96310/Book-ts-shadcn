"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderRes } from "@/features/order/services/type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, RotateCcw, CheckCircle, Truck, XCircle } from "lucide-react";

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
                        Giao hàng thành công
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

interface OrderDetailProps {
    order: OrderRes;
}

const OrderDetail: FC<OrderDetailProps> = ({ order }) => {
    const router = useRouter();

    // Guard clause nếu không có dữ liệu
    if (!order || !order.orderItems || order.orderItems.length === 0) {
        return (
            <Card className="w-full max-w-4xl mx-auto shadow-lg">
                <CardContent className="p-6 text-center text-gray-600">
                    Không có thông tin đơn hàng.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader className="bg-gray-50 p-4 sm:p-6 rounded-t-lg">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                    Chi tiết đơn hàng #{order.orderCode}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 mt-2">
                    <span>Ngày đặt: {new Date(order.orderDateTime).toLocaleString("vi-VN")}</span>
                    <StatusBadge status={order.orderStatus} />
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Thông tin giao hàng */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin giao hàng</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        <p>
                            <strong>Người nhận:</strong> {order.deliveryName || "N/A"}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> {order.deliveryPhone || "N/A"}
                        </p>
                        <p className="sm:col-span-2">
                            <strong>Địa chỉ:</strong>{" "}
                            {order.address
                                ? `${order.address.buildingName}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`
                                : "N/A"}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                {/* Danh sách sản phẩm */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm trong đơn hàng</h3>
                    {order.orderItems.map((item) => (
                        <Link
                            key={item.orderItemId}
                            href={`/products/${item.product.productId}`}
                            className="block hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row gap-4 py-3 border-b border-gray-200 last:border-b-0">
                                <div className="relative flex-shrink-0">
                                    <Image
                                        src={
                                            item.product.images?.[0]?.fileName && process.env.NEXT_PUBLIC_FILE
                                                ? `${process.env.NEXT_PUBLIC_FILE}${item.product.images[0].fileName}`
                                                : "/placeholder.svg"
                                        }
                                        alt={item.product.productName || "Sản phẩm"}
                                        width={80}
                                        height={80}
                                        sizes="(max-width: 768px) 80px, 100px"
                                        className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
                                    />
                                    {item.discount && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5"
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
                                    <div className="flex items-center gap-2">
                                        {item.discount ? (
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                {formatCurrency((item.price || 0) + (item.discount || 0))}
                                            </span>
                                        ) : null}
                                        <span className="text-sm sm:text-base font-medium text-red-600">
                                            {formatCurrency(
                                                item.price - item.price * ((item.discount ?? 0) / 100)
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Separator className="my-4" />

                {/* Tổng tiền */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(order.subTotal)}</span>
                    </div>
                    {order.freeship ? (
                        <div className="flex justify-between text-sm sm:text-base text-gray-700">
                            <span>Miễn phí vận chuyển (Mã: {order.freeship.promotionCode}):</span>
                            <span className="text-green-600">{formatCurrency(order.priceShip)}</span>
                        </div>
                    ) : (
                        <div className="flex justify-between text-sm sm:text-base text-gray-700">
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(order.priceShip)}</span>
                        </div>
                    )}
                    {order.coupon && (
                        <div className="flex justify-between text-sm sm:text-base text-gray-700">
                            <span>Giảm giá (Mã: {order.coupon.promotionCode}):</span>
                            <span className="text-green-600">
                                -{formatCurrency((order.subTotal * order.coupon.value) / 100)}
                            </span>
                        </div>
                    )}
                    <Separator className="mt-2" />
                    <div className="flex justify-between text-base sm:text-lg font-bold text-red-600">
                        <span>Tổng tiền:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>

                {/* <Separator className="my-4" /> */}

                {/* Nút hành động */}
                {/* <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-sm h-10 hover:bg-gray-100 transition-colors"
                        onClick={() => router.push("/cart")}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Mua lại
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-sm h-10 hover:bg-gray-100 transition-colors"
                        onClick={() => router.push("/contact")}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ người bán
                    </Button>
                </div> */}
            </CardContent>
        </Card>
    );
};

export default OrderDetail;