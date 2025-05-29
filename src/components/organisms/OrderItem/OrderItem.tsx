"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, RotateCcw, CheckCircle } from "lucide-react"
import { OrderRes } from "@/features/order/services/type"
import Link from "next/link"

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    }).format(amount).replace("₫", "₫")
}

function getStatusBadge(status: string) {
    switch (status) {
        case "PAID":
            return (
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Giao hàng thành công
                    </Badge>
                    <Badge className="bg-green-600 text-white text-xs">ĐÃ THANH TOÁN</Badge>
                </div>
            )
        case "PENDING":
            return (
                <Badge className="text-orange-600 border border-orange-200 text-xs" variant="outline">
                    Đang xử lý
                </Badge>
            )
        case "FALSED":
            return (
                <Badge className="text-red-600 border border-red-200 text-xs" variant="outline">
                    Đã hủy
                </Badge>
            )
        default:
            return <Badge className="text-xs" variant="outline">{status}</Badge>
    }
}

export default function OrderItem({ order }: { order: OrderRes }) {

    return (
        <Card className="w-full max-w-4xl ">
            <CardContent className="px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2  border-b border-gray-200 ">
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
                        {/* <Badge variant="destructive" className="text-xs">Yêu thích</Badge> */}
                        <span className="font-medium text-sm">Mã đơn hàng: {order.orderCode}</span>
                        {/* <Button variant="outline" size="sm" className=" h-8 px-3 text-sm flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Chat
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-3 text-sm">Xem Shop</Button> */}
                    </div>
                    {getStatusBadge(order?.orderStatus ?? "")}
                </div>

                {/* Order Items */}
                <div className="px-2 ">
                    {order?.orderItems?.map((orderItem) => {
                        const product = orderItem.product
                        const discountedPrice =
                            (product.discount ?? 0) > 0
                                ? Math.round(product.price - product.price * ((product.discount ?? 0) / 100))
                                : product.price
                        return (
                            <div key={orderItem.orderItemId} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200">
                                {/* Product image */}
                                <div className="relative">
                                    <Image
                                        src={
                                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                                : "/placeholder.svg"
                                        }
                                        alt={product?.productName ?? "Product"}
                                        width={80}
                                        height={80}
                                        className="rounded-lg object-cover w-20 h-20"
                                    />
                                    {product?.discount && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-1"
                                        >
                                            SALE
                                        </Badge>
                                    )}
                                </div>

                                {/* Product info */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                        <Link href={`/profile/order/${order.orderCode}`}>
                                            {product?.productName}
                                        </Link>
                                    </h3>
                                    {product?.categories && (
                                        <p className="text-xs text-gray-600 mb-1">
                                            Sách: {product.categories?.map((c) => c.categoryName).join(', ')}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-600">x{orderItem.quantity ?? 1}</p>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-1">
                                        {product?.discount && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {formatCurrency(product.price + product.discount)}
                                            </span>
                                        )}
                                        <span className="text-sm font-medium text-red-600">
                                            {formatCurrency(discountedPrice ?? 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Total */}
                    <div className="flex justify-end my-4">
                        <span className="text-sm font-medium">Thành tiền: <span className="text-2xl font-bold text-red-600">
                            {formatCurrency(order?.totalAmount ?? 0)}
                        </span> </span>

                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button variant="outline" className="flex items-center gap-2 text-sm h-10">
                            <RotateCcw className="w-4 h-4" />
                            Mua Lại
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 text-sm h-10">
                            <MessageCircle className="w-4 h-4" />
                            Liên Hệ Người Bán
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
