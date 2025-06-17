"use client";

import { useEffect, useState, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    MessageCircle,
    RotateCcw,
    CheckCircle,
    Truck,
    XCircle,
    MapPin,
    Phone,
    User,
    Mail,
    Calendar,
    Package,
    CreditCard,
    Pencil,
    X,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { OrderRes } from "@/features/order/services/type";
import { submitReview } from "@/features/review/services/review.service";
import { AddReviewForm } from "@/features/review/components/InputReviewForm";
import { Images } from "@/types";
import OrderDetailItem from "@/components/organisms/OrderItem/OrderDetailItem";

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
const StatusBadge: FC<{ status: string | undefined; paymentMethod: string | undefined }> = ({
    status,
    paymentMethod,
}) => {
    const [isPayment, setIsPayment] = useState(false);

    useEffect(() => {
        if (paymentMethod === "VNPAY") {
            setIsPayment(true);
        }
    }, [paymentMethod]);

    switch (status) {
        case "PAID":
            return (
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Đặt hàng thành công
                    </Badge>
                    {isPayment ? (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                            <CreditCard className="w-4 h-4 mr-2" />
                            ĐÃ THANH TOÁN
                        </Badge>
                    ) : (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                            <CreditCard className="w-4 h-4 mr-2" />
                            CHƯA THANH TOÁN
                        </Badge>
                    )}
                </div>
            );
        case "PENDING":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="text-orange-600 border border-orange-200 text-xs" variant="outline">
                        Đang xử lý
                    </Badge>
                    {isPayment ? (
                        <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                    ) : (
                        <Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>
                    )}
                </div>
            );
        case "CANCELLED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        Đã hủy
                    </Badge>
                    {isPayment ? (
                        <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                    ) : (
                        <Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>
                    )}
                </div>
            );
        case "COMPLETED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã hoàn thành
                    </Badge>
                    <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                </div>
            );
        case "SHIPPED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <Truck className="w-4 h-4 mr-1" />
                        Đã giao hàng
                    </Badge>
                    {isPayment ? (
                        <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                    ) : (
                        <Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>
                    )}
                </div>
            );
        case "FALSED":
            return (
                <Badge className="text-red-600 border border-red-200 text-xs" variant="outline">
                    Thất bại
                </Badge>
            );
        default:
            return (
                <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                    {status || "Không xác định"}
                </Badge>
            );
    }
};

interface OrderDetailProps {
    order: OrderRes;
}

const OrderDetail: FC<OrderDetailProps> = ({ order }) => {
    const displayOrder = order;
    const finalCouponFee =
        displayOrder.coupon && Number(displayOrder.coupon.valueType) === 1
            ? Number(displayOrder.totalAmount) * (displayOrder.coupon.value / 100)
            : displayOrder.coupon?.value;
    const finalFreeShipFee =
        displayOrder.freeship && Number(displayOrder.freeship.valueType) === 1
            ? Number(displayOrder.priceShip) * (displayOrder.freeship.value / 100)
            : displayOrder.freeship?.value;

    // Guard clause nếu không có dữ liệu cart
    if (!displayOrder || !displayOrder.orderItems || displayOrder.orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
                    <CardContent className="p-8 text-center text-gray-600">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-semibold mb-2">Không có thông tin đơn hàng</h3>
                        <p className="text-gray-500">Vui lòng kiểm tra lại mã đơn hàng của bạn.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<OrderRes['orderItems'][number] | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    // Mở dialog review
    const handleReviewDialog = (item: OrderRes['orderItems'][number]) => {
        setSelectedItem(item);
        setIsReviewDialogOpen(true);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 p-4">
            <div className="w-full max-w-5xl mx-auto space-y-6">
                {/* Header Card */}
                <Card className="shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-600 to-purple-600 text-white p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Đơn hàng #{displayOrder.orderCode}</h1>
                                <div className="flex items-center gap-2 text-orange-100">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">
                                        Ngày đặt: {new Date(displayOrder.orderDateTime).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                            </div>
                            <StatusBadge status={displayOrder.orderStatus} paymentMethod={displayOrder.payment.paymentMethod} />
                        </div>
                    </div>
                </Card>

                {/* Delivery Info Card */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="border-b justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-800 flex justify-between items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-600" />
                            Thông tin giao hàng
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Người nhận</p>
                                        <p className="font-semibold text-gray-800">{displayOrder.deliveryName || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                        <p className="font-semibold text-gray-800">{displayOrder.deliveryPhone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-800">{displayOrder.email || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                                        <MapPin className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</p>
                                        <p className="font-semibold text-gray-800 leading-relaxed">
                                            {displayOrder.address
                                                ? `${displayOrder.address.buildingName}, ${displayOrder.address.ward}, ${displayOrder.address.district}, ${displayOrder.address.city}`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Card */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Package className="w-5 h-5 text-orange-600" />
                            Sản phẩm trong đơn hàng ({displayOrder.orderItems.length} sản phẩm)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {displayOrder.orderItems.map((item) => (
                                <div key={item.orderItemId} className="relative group">
                                    <OrderDetailItem order={item} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {selectedItem && (
                    <AddReviewForm
                        orderItemId={selectedItem.orderItemId}
                        productName={selectedItem.product.productName}
                        productImage={selectedItem.product.images?.[0]?.fileName ?? ""}
                        open={isReviewDialogOpen}
                        onClose={() => {
                            setIsReviewDialogOpen(false);
                            setSelectedItem(null);
                        }}
                    />)}
                <Card className="shadow-lg border-0">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                            Chi tiết thanh toán
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Tạm tính:</span>
                                <span className="font-semibold">{formatCurrency(displayOrder.subTotal)}</span>
                            </div>

                            {displayOrder.freeship ? (
                                <>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                        <span className="font-semibold">{formatCurrency(displayOrder.priceShip)}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 bg-green-50 px-4 rounded-lg">
                                        <span className="text-green-700 font-medium">
                                            Miễn phí vận chuyển (Mã: {displayOrder.freeship.promotionCode})
                                        </span>
                                        <span className="text-green-600 font-semibold">-{formatCurrency(finalFreeShipFee)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-semibold">{formatCurrency(displayOrder.priceShip)}</span>
                                </div>
                            )}

                            {displayOrder.coupon && (
                                <div className="flex justify-between items-center py-2 bg-orange-50 px-4 rounded-lg">
                                    <span className="text-orange-700 font-medium">Giảm giá (Mã: {displayOrder.coupon.promotionCode})</span>
                                    <span className="text-orange-600 font-semibold">-{formatCurrency(finalCouponFee)}</span>
                                </div>
                            )}

                            <Separator className="my-4" />

                            <div className="flex justify-between items-center py-3 bg-gradient-to-r from-red-50 to-pink-50 px-4 rounded-lg">
                                <span className="text-xl font-bold text-gray-800">Tổng tiền:</span>
                                <span className="text-2xl font-bold text-red-600">{formatCurrency(displayOrder.totalAmount)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="outline"
                                className="flex items-center gap-2 px-6 py-3 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                                onClick={() => router.push("/cart")}
                            >
                                <RotateCcw className="w-5 h-5" />
                                Mua lại
                            </Button>
                            <Button
                                size="lg"
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                                onClick={() => router.push("/contact")}
                            >
                                <MessageCircle className="w-5 h-5" />
                                Liên hệ người bán
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrderDetail;