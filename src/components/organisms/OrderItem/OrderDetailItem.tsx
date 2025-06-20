"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { OrderItemRes } from "@/features/order/services/type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AddReviewForm } from "@/features/review/components/InputReviewForm";
import { EditReviewForm } from "@/features/review/components/EditReviewForm";
import { fetchReviewByOrderItemId } from "@/features/review/services/review.service";
import { ReviewProps } from "@/features/review/services/type";
import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { USER_NAME } from "@/constants/userConstants";
import { USER_ID } from "@/constants/cartConstants";

type ItemProps = {
    order: OrderItemRes;
};

export default function OrderDetailItem({ order }: ItemProps) {
    const displayOrder = order;
    const [selectedItem, setSelectedItem] = useState<OrderItemRes | null>(null);
    const [selectedEdit, setSelectedEdit] = useState<OrderItemRes | null>(null);
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [isReviewDialogEdit, setIsReviewDialogEdit] = useState(false);
    const [review, setReview] = useState<ReviewProps | null>(null)
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = useState<string>();
    const [userId, setUserId] = useState<number>();

    useEffect(() => {
        const storedId = localStorage.getItem(USER_ID);
        if (storedId) {
            setUserId(Number(storedId));
        }
    }, []);
    useEffect(() => {
        const loadReview = async () => {
            const data = await fetchReviewByOrderItemId(Number(order.orderItemId));
            setReview(data); // Có dữ liệu -> sửa, null -> viết mới
        };
        loadReview();
    }, [order.orderItemId]);
    // Handler to open the review form
    const handleOpenReview = (item: OrderItemRes) => {
        setSelectedItem(item);
        setIsReviewDialogOpen(true);
    };
    const handleToast = (updateAt: string) => {
        if (updateAt) {
            toast.success("Bạn đã đạt giới hạng chỉnh sửa!");
        }
    };
    const handleOpenEdit = (item: OrderItemRes) => {
        setSelectedEdit(item);
        setIsReviewDialogEdit(true);
    };
    // Handler to close the review form
    const handleCloseReview = () => {
        setSelectedItem(null);
        setIsReviewDialogOpen(false);
    };
    const handleCloseEdit = () => {
        setSelectedEdit(null);
        setIsReviewDialogEdit(false);
    };

    return (
        <div className="relative">
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
                                        : "/placeholder-image.png" // Fallback image if none exists
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
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                Kích thước: {displayOrder.product.size || "N/A"}
                            </span>
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                                Số lượng: x{displayOrder.quantity || 1}
                            </span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        {displayOrder.discount ? (
                            <div className="text-sm text-gray-400 line-through">
                                {formatCurrency(displayOrder.price || 0)}
                            </div>
                        ) : null}
                        <div className="text-lg font-bold text-red-600">
                            {formatCurrency(
                                displayOrder.price - displayOrder.price * ((displayOrder.discount ?? 0) / 100)
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            {userId && (
                review ? (
                    <Button
                        className="absolute bottom-4 right-4 flex items-center gap-1 border-2 border-blue-500 bg-white text-blue-600 px-3 py-1 rounded-xl shadow-md transition hover:bg-blue-500 hover:text-white cursor-pointer"
                        onClick={() => handleOpenEdit(displayOrder)}
                    >
                        <Pencil className="w-4 h-4" />
                        Sửa đánh giá
                    </Button>
                ) : (
                    <Button
                        className="absolute bottom-4 right-4 flex items-center gap-1 border-2 border-orange-500 bg-white text-orange-600 px-3 py-1 rounded-xl shadow-md transition hover:bg-orange-500 hover:text-white cursor-pointer"
                        onClick={() => handleOpenReview(displayOrder)}
                    >
                        <Pencil className="w-4 h-4" />
                        Viết đánh giá
                    </Button>
                )
            )}

            {selectedItem && (
                <AddReviewForm
                    orderItemId={selectedItem.orderItemId}
                    productName={selectedItem.product.productName}
                    productImage={selectedItem.product.images?.[0]?.fileName ?? ""}
                    open={isReviewDialogOpen}
                    onClose={handleCloseReview}
                />
            )}
            {selectedEdit && (
                <EditReviewForm
                    orderItemId={selectedEdit.orderItemId}
                    productName={selectedEdit.product.productName}
                    productImage={selectedEdit.product.images?.[0]?.fileName ?? ""}
                    open={isReviewDialogEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    );
}

// Hàm format tiền tệ
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    })
        .format(amount)
        .replace("₫", "₫");
}