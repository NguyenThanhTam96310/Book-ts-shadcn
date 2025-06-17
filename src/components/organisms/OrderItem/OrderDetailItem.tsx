"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, RotateCcw, CheckCircle, Pencil, Package } from "lucide-react"
import { OrderItemRes, OrderRes } from "@/features/order/services/type"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount).replace("₫", "₫")
}

function getStatusBadge(status: string | undefined, paymentMethod: string | undefined) {
    const [isPayment, setIsPayment] = useState(true);
    useEffect(() => {
        if (paymentMethod === "COD") {
            setIsPayment(false);
        }
    }, [paymentMethod]);
    switch (status) {
        case "PAID":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đặt hàng thành công
                    </Badge>
                    {
                        isPayment ? (<Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>) :
                            (<Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>)
                    }

                </div>
            )
        case "PENDING":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="text-orange-600 border border-orange-200 text-xs" variant="outline">
                        Đang xử lý
                    </Badge>
                    {
                        isPayment ? (<Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>) :
                            (<Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>)
                    }

                </div>

            )
        case "CANCELLED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã hủy
                    </Badge>
                    {
                        isPayment ? (<Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>) :
                            (<Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>)
                    }

                </div>
            )
        case "COMPLETED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã hoàn thành
                    </Badge>
                    <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                </div>
            )
        case "SHIPPED":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã giao hàng
                    </Badge>
                    {
                        isPayment ? (<Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>) :
                            (<Badge className="bg-yellow-600 text-white text-xs">CHƯA THANH TOÁN</Badge>)
                    }

                </div>
            )
        case "FALSED":
            return (
                <Badge className="text-red-600 border border-red-200 text-xs" variant="outline">
                    Thất bại
                </Badge>
            )
        default:
            return <Badge className="text-xs" variant="outline">{status}</Badge>
    }
}

export default function OrderDetailItem({ order }: { order: OrderItemRes }) {
    const displayOrder = order;
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<OrderRes['orderItems'][number] | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

    const handleReviewDialog = (item: OrderItemRes) => {
        setSelectedItem(item);
        setIsReviewDialogOpen(true);
    };

    return (
        <div>
            <Link
                href={`/products/${displayOrder.product.slug}`}
                className="block hover:bg-gray-50 transition-all duration-200"
            >
                <div className="p-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md">
                            <Image
                                src={
                                    displayOrder.product.images?.[0]?.fileName && process.env.NEXT_PUBLIC_FILE
                                        ? `${process.env.NEXT_PUBLIC_FILE}${displayOrder.product.images[0].fileName}`
                                        : ""
                                }
                                alt={displayOrder.product.productName || "Sản phẩm"}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {displayOrder.discount && (
                            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                -{displayOrder.discount}%
                            </Badge>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {displayOrder.product.productName || "Không xác định"}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">Kích thước: {displayOrder.product.size || "N/A"}</span>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                                Số lượng: x{displayOrder.quantity || 1}
                            </span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        {displayOrder.discount ? (
                            <div className="text-sm text-gray-400 line-through">{formatCurrency(displayOrder.price || 0)}</div>
                        ) : null}
                        <div className="text-lg font-bold text-red-600">
                            {formatCurrency(displayOrder.price - displayOrder.price * ((displayOrder.discount ?? 0) / 100))}
                        </div>
                    </div>
                </div>
            </Link>
            <button
                className="absolute bottom-4 right-4 flex items-center gap-1 border-2 border-orange-500 bg-white text-orange-600 px-3 py-1 rounded-xl shadow-md transition hover:bg-orange-500 hover:text-white"
                onClick={() => handleReviewDialog(displayOrder)}
            >
                <Pencil className="w-4 h-4" />
                Viết đánh giá
            </button>
            <button
                className="absolute bottom-4 right-4 flex items-center gap-1 border-2 border-orange-500 bg-white text-orange-600 px-3 py-1 rounded-xl shadow-md transition hover:bg-orange-500 hover:text-white"
                onClick={() => handleReviewDialog(displayOrder)}
            >
                <Pencil className="w-4 h-4" />
                Sửa đánh giá
            </button>
        </div>

    )
}
