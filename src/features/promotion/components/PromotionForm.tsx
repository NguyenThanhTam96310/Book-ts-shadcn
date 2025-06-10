"use client";

import VoucherItem from "@/components/organisms/PromotionItem/PromotionItem";
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PromotionItemRes } from "@/features/promotion";

interface VoucherFormProps {
    open: boolean;
    onClose: () => void;
    onSelectPromotion: (promotionCode: string) => void;
    appliedCoupons: string[];
    totalPrice: number;
    promotions: PromotionItemRes[];
}

export default function VoucherForm({ open, onClose, onSelectPromotion, appliedCoupons, promotions, totalPrice }: VoucherFormProps) {
    const [dialogOpen, setDialogOpen] = React.useState(open);

    React.useEffect(() => {
        setDialogOpen(open);
    }, [open]);

    const handleSelectVoucher = (promotionCode: string) => {
        onSelectPromotion(promotionCode);
        onClose();
    };


    return (
        <Dialog open={dialogOpen} onOpenChange={(val) => { setDialogOpen(val); if (!val) onClose(); }}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Chọn mã khuyến mãi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Phần mã miễn phí vận chuyển (FREESHIP) */}
                    <h3 className="text-lg font-semibold mb-2">Mã miễn phí vận chuyển</h3>
                    {promotions.length > 0 && promotions.some((voucher) => voucher.promotionType === "FREESHIP") ? (
                        promotions
                            .filter((voucher) => voucher.promotionType === "FREESHIP")
                            .map((voucher) => (
                                <VoucherItem
                                    key={voucher.promotionId}
                                    voucher={voucher}
                                    totalPrice={totalPrice}
                                    onSelect={handleSelectVoucher}
                                    appliedCoupons={appliedCoupons}
                                />
                            ))
                    ) : (
                        <p className="text-center text-gray-500">Không có mã miễn phí vận chuyển nào.</p>
                    )}

                    {/* Phần mã giảm giá (VOUCHER) */}
                    <h3 className="text-lg font-semibold mb-2 mt-6">Mã giảm giá</h3>
                    {promotions.length > 0 && promotions.some((voucher) => voucher.promotionType === "VOUCHER") ? (
                        promotions
                            .filter((voucher) => voucher.promotionType === "VOUCHER")
                            .map((voucher) => (
                                <VoucherItem
                                    key={voucher.promotionId}
                                    voucher={voucher}
                                    totalPrice={totalPrice}
                                    onSelect={handleSelectVoucher}
                                    appliedCoupons={appliedCoupons}
                                />
                            ))
                    ) : (
                        <p className="text-center text-gray-500">Không có mã giảm giá nào.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}