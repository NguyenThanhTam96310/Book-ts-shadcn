// PromotionDetail.tsx
"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PromotionItemRes } from "@/features/promotion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface VoucherDetailProps {
    open: boolean;
    onClose: () => void;
    voucher: PromotionItemRes;
}

export default function PromotionDetail({ open, onClose, voucher }: VoucherDetailProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getDiscountText = () => {
        if (voucher.valueType) {
            return `Giảm ${voucher.value}%`;
        } else {
            return `Giảm ${formatCurrency(voucher.value ?? 0)}`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent className="sm:max-w-xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                        Thông tin chi tiết mã khuyến mãi
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 text-sm sm:text-base text-gray-700 overflow-y-auto max-h-[calc(80vh-120px)]">
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Mã khuyến mãi:</span>
                            <span className="text-gray-800 font-semibold">{voucher.promotionName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Mã code:</span>
                            <span className="text-gray-800 font-semibold">{voucher.promotionCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Loại:</span>
                            <Badge
                                variant="outline"
                                className={`text-sm font-semibold ${voucher.promotionType === "VOUCHER"
                                    ? "text-orange-600 border-orange-200 bg-orange-50"
                                    : "text-emerald-600 border-emerald-200 bg-emerald-50"
                                    }`}
                            >
                                {voucher.promotionType === "VOUCHER" ? "Giảm giá" : "Miễn phí vận chuyển"}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Giảm giá:</span>
                            <span className="text-gray-800 font-semibold text-red-600">{getDiscountText()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Áp dụng từ:</span>
                            <span className="text-gray-800">{formatCurrency(voucher.valueApply ?? 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Mô tả:</span>
                            <span className="text-gray-800 line-clamp-2">{voucher.description}</span>
                        </div>
                        <Separator className="my-3" />
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Ngày bắt đầu:</span>
                            <span className="text-gray-800">{formatDate(voucher.startDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Ngày hết hạn:</span>
                            <span className="text-gray-800">{formatDate(voucher.endDate || "")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-600">Trạng thái:</span>
                            <Badge
                                variant="outline"
                                className={`text-sm font-semibold ${voucher.status
                                    ? "text-green-600 border-green-200 bg-green-50"
                                    : "text-red-600 border-red-200 bg-red-50"
                                    }`}
                            >
                                {voucher.status ? "Hoạt động" : "Ngừng hoạt động"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}