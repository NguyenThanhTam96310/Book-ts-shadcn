// VoucherItem.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PromotionItemRes } from "@/features/promotion";
import PromotionDetail from "@/features/promotion/components/PromotionDetail";
import { Info, Percent, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface VoucherItemProps {
    voucher: PromotionItemRes;
    onSelect?: (promotionCode: string) => void;
    appliedCoupons?: string[];
    totalPrice: number;
}

export default function VoucherItem({
    voucher,
    onSelect,
    appliedCoupons,
    totalPrice,
}: VoucherItemProps) {
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const getDiscountText = () => {
        if (voucher.valueType) {
            return `Giảm ${voucher.value}%`;
        } else {
            return `Giảm ${formatCurrency(voucher.value ?? 0)}đ`;
        }
    };

    const getProgressValue = () => {
        if (totalPrice > voucher.valueApply) {
            return 100;
        } else {
            return Math.round((totalPrice / voucher.valueApply) * 100);
        }
    };

    const isApplied = appliedCoupons?.includes(voucher.promotionCode);
    const isVoucher = voucher.promotionType === "VOUCHER";
    const cardBgColor = isVoucher ? "bg-orange-50" : "bg-emerald-50";
    const iconColor = isVoucher ? "text-orange-500" : "text-emerald-500";
    const buttonBgColor = isVoucher ? "bg-orange-500 hover:bg-orange-600" : "bg-emerald-500 hover:bg-emerald-600";
    const progressColor = isVoucher ? "[&>div]:bg-orange-500" : "[&>div]:bg-emerald-500";

    return (
        <Card className={`relative p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${cardBgColor}`}>
            <PromotionDetail
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                voucher={voucher}
            />

            <Info
                className={`absolute top-2 right-2 w-4 h-4 ${iconColor} cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => setIsDetailOpen(true)}
            />
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${cardBgColor}`}>
                    {isVoucher ? (
                        <Percent className={`w-8 h-8 ${iconColor}`} />
                    ) : (
                        <Truck className={`w-8 h-8 ${iconColor}`} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2">
                        {voucher.promotionName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        Đơn từ {formatCurrency(voucher.valueApply ?? 0)}đ - {voucher.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">HSD: {formatDate(voucher.endDate || "")}</p>
                    <Progress
                        value={getProgressValue()}
                        className={`h-2 mb-2 bg-gray-200 ${progressColor}`}
                    />
                    {totalPrice < voucher.valueApply && (
                        <p className="text-xs sm:text-sm text-gray-500">
                            Mua thêm {formatCurrency(Math.round(voucher.valueApply - totalPrice))}đ
                        </p>
                    )}
                </div>
                <div className="flex justify-end mt-auto">
                    {onSelect && (
                        isApplied ? (
                            <Badge className="bg-green-500 text-white px-3 py-1 text-xs sm:text-sm font-medium">
                                Đã áp dụng
                            </Badge>
                        ) : totalPrice >= voucher.valueApply ? (
                            <Button
                                onClick={() => onSelect(voucher.promotionCode)}
                                size="sm"
                                className={`px-3 py-1.5 text-xs sm:text-sm ${buttonBgColor} text-white`}
                            >
                                Áp dụng
                            </Button>
                        ) : (
                            <Button
                                onClick={() => router.push("/")}
                                size="sm"
                                className={`px-3 py-1.5 text-xs sm:text-sm ${buttonBgColor} text-white`}
                            >
                                Mua thêm
                            </Button>
                        )
                    )}
                </div>
            </div>
        </Card>
    );
}