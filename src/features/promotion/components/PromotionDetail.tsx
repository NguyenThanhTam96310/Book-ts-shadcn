"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PromotionItemRes } from "@/features/promotion";

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
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const getDiscountText = () => {
        if (voucher.valueType) {
            return `Giảm ${voucher.value}%`;
        } else {
            return `Giảm ${formatCurrency(voucher.value ?? 0)}đ`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thông tin chi tiết mã khuyến mãi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                    <p><strong>Mã khuyến mãi:</strong> {voucher.promotionName}</p>
                    <p><strong>Mã code:</strong> {voucher.promotionCode}</p>
                    <p><strong>Loại:</strong> {voucher.promotionType === "VOUCHER" ? "Giảm giá" : "Miễn phí vận chuyển"}</p>
                    <p><strong>Giảm giá:</strong> {getDiscountText()}</p>
                    <p><strong>Áp dụng từ:</strong> {formatCurrency(voucher.valueApply ?? 0)}đ</p>
                    <p><strong>Mô tả:</strong> {voucher.description}</p>
                    <p><strong>Ngày bắt đầu:</strong> {formatDate(voucher.startDate)}</p>
                    <p><strong>Ngày hết hạn:</strong> {formatDate(voucher.endDate || "")}</p>
                    <p><strong>Trạng thái:</strong> {voucher.status ? "Hoạt động" : "Ngừng hoạt động"}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}