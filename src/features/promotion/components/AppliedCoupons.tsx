"use client"

import { X, Truck, Gift, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PromotionItemRes } from "@/features/promotion/services/type"

interface AppliedCouponsProps {
    appliedCoupons: string[]
    promotions: PromotionItemRes[]
    onRemoveCoupon: (coupon: string) => void
}

export default function AppliedCoupons({ appliedCoupons, promotions, onRemoveCoupon }: AppliedCouponsProps) {
    if (appliedCoupons.length === 0) return null

    const getCouponConfig = (type: string) => {
        switch (type) {
            case "FREESHIP":
                return {
                    icon: Truck,
                    bgColor: "bg-emerald-50 border-emerald-200",
                    textColor: "text-emerald-700",
                    badgeColor: "bg-emerald-100 text-emerald-800",
                    label: "Miễn phí vận chuyển",
                }
            case "VOUCHER":
                return {
                    icon: Gift,
                    bgColor: "bg-orange-50 border-orange-200",
                    textColor: "text-orange-700",
                    badgeColor: "bg-orange-100 text-orange-800",
                    label: "Voucher giảm giá",
                }
            case "DISCOUNT":
                return {
                    icon: Tag,
                    bgColor: "bg-blue-50 border-blue-200",
                    textColor: "text-blue-700",
                    badgeColor: "bg-blue-100 text-blue-800",
                    label: "Mã giảm giá",
                }
            default:
                return {
                    icon: Tag,
                    bgColor: "bg-gray-50 border-gray-200",
                    textColor: "text-gray-700",
                    badgeColor: "bg-gray-100 text-gray-800",
                    label: "Khuyến mãi",
                }
        }
    }

    return (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Mã đã áp dụng</h4>
                <Badge variant="secondary" className="text-xs">
                    {appliedCoupons.length}
                </Badge>
            </div>

            <div className="space-y-3">
                {appliedCoupons.map((coupon) => {
                    const promotion = promotions.find((p) => p.promotionCode === coupon)
                    const promotionType = promotion?.promotionType || "DISCOUNT"
                    const config = getCouponConfig(promotionType)
                    const IconComponent = config.icon

                    return (
                        <div
                            key={coupon}
                            className={`group relative flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${config.bgColor}`}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2 rounded-full ${config.badgeColor}`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono font-semibold text-sm ${config.textColor}`}>{coupon}</span>
                                        <Badge variant="outline" className={`text-xs ${config.badgeColor} border-0`}>
                                            {config.label}
                                        </Badge>
                                    </div>
                                    {promotion?.description && <p className="text-xs text-gray-600 mt-1">{promotion.description}</p>}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveCoupon(coupon)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Xóa mã {coupon}</span>
                            </Button>
                        </div>
                    )
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-green-200">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                    Bạn đang tiết kiệm được với {appliedCoupons.length} mã khuyến mãi
                </p>
            </div>
        </div>
    )
}
