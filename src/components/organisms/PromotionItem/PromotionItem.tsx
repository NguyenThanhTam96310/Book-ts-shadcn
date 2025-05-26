// VoucherItem.tsx (đã đúng, chỉ kiểm tra lại)
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

export default function VoucherItem({ voucher, onSelect, appliedCoupons, totalPrice }: VoucherItemProps) {
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
            const percent = Math.round((totalPrice / voucher.valueApply) * 100)
            return percent;
        }
    };

    const isApplied = appliedCoupons?.includes(voucher.promotionCode);

    return (
        <Card className="relative p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <PromotionDetail
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                voucher={voucher}
            />

            <Info
                className="absolute top-2 right-2 w-4 h-4 text-blue-500 cursor-pointer"
                onClick={() => setIsDetailOpen(true)}
            />
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    {
                        voucher.promotionType === "VOUCHER" ? (
                            <Percent className="w-8 h-8 text-gray-600" />
                        ) : (
                            <Truck className="w-8 h-8 text-gray-600" />
                        )
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{voucher.promotionName}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        Đơn hàng từ {formatCurrency(voucher.valueApply ?? 0)}đ - {voucher.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">HSD: {formatDate(voucher.endDate || "")}</p>
                    <Progress value={getProgressValue()} className="h-2 mb-2" />
                    {totalPrice < voucher.valueApply && (
                        <p className="text-xs text-gray-500">Mua thêm {Math.round(voucher.valueApply - totalPrice)}đ</p>
                    )}

                </div>
                <div className="flex justify-end mt-auto">
                    {onSelect && (
                        isApplied ? (
                            <Badge className="bg-green-500 text-white px-4 py-1 text-xs">Đã áp dụng</Badge>
                        ) : (
                            totalPrice >= voucher.valueApply ? (
                                <Button
                                    onClick={() => onSelect(voucher.promotionCode)}
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-xs"
                                >
                                    Áp dụng
                                </Button>
                            ) : (<Button
                                onClick={() => router.push("/")}
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-xs"
                            >
                                Mua thêm
                            </Button>)
                        )
                    )}

                </div>
            </div>
        </Card>
    );
}