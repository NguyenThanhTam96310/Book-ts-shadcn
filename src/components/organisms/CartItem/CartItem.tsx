"use client";

import type { CartItemType, ProductCartProps } from "@/features/cart/services/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

interface CartItemProps {
    item: CartItemType;
    index: number;
    checked: boolean;
    onCheck: () => void;
    onDecrease: (productId: string | number) => void;
    onIncrease: (productId: string | number) => void;
    onRemove: (productId: string | number) => void;
    refQuantity: (productId: string | number) => void;
}

const CartItem = ({ item, checked, onCheck, onDecrease, onIncrease, onRemove, refQuantity }: CartItemProps) => {
    const product: ProductCartProps = item.product;
    const availableQuantity = product.quantity ?? 0; // Số lượng tồn kho, mặc định 0 nếu undefined
    const [isQuantity, setIsQuantity] = useState(false);
    useEffect(() => {
        setIsQuantity(item.quantity > availableQuantity);
    }, [item.quantity, availableQuantity]);
    // Kiểm tra số lượng tồn kho hợp lệ
    const isStockValid = availableQuantity > 0;

    const handleIncrease = () => {
        if (!isStockValid) {
            toast.error("Sản phẩm hiện không có sẵn trong kho!", {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }
        if (item.quantity >= availableQuantity) {
            toast.error(`Số lượng không thể vượt quá ${availableQuantity} sản phẩm có sẵn!`, {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }
        onIncrease(product.productId);
    };

    const handleDecrease = () => {
        if (item.quantity <= 1) {
            toast.warn("Số lượng tối thiểu là 1. Bạn có thể xóa sản phẩm nếu không cần!", {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }
        onDecrease(product.productId);
    };
    const handleUpdateToMaxQuantity = () => {

        toast.info(`Số lượng đã được cập nhật về mức tối đa: ${availableQuantity}`, {
            position: "bottom-right",
            autoClose: 2000,
        });
        refQuantity(product.productId);
    };
    return (
        <div className="flex items-center justify-between border-b py-4 gap-4 overflow-x-auto min-w-full">
            <div className="flex items-start gap-4 w-full lg:w-[60%]">
                <label className="cursor-pointer p-2 rounded">
                    <Checkbox
                        checked={checked}
                        onCheckedChange={onCheck}
                    // disabled={!product.status}
                    />
                </label>
                <Link href={`/products/${product.slug}`}>
                    <img
                        src={
                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                : "/placeholder.png"
                        }
                        alt={product?.productName}
                        className="w-20 h-20 object-cover border rounded-md flex-shrink-0"
                    />
                </Link>
                <div className="flex flex-col gap-1">
                    <Link href={`/products/${product.slug}`}>
                        <div className="text-base font-medium text-gray-800 hover:text-red-600 transition-colors duration-200 w-[250px] line-clamp-2">
                            {product?.productName}
                        </div>
                    </Link>
                    <div className="flex items-center gap-2">
                        {product?.discount ? (
                            <>
                                <span className="text-red-600 font-semibold text-lg">
                                    {(product.price - Math.round(product.price * (product.discount / 100))).toLocaleString()} đ
                                </span>
                                <span className="hidden sm:block text-gray-500 line-through text-sm">
                                    {product.price.toLocaleString()} đ
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-800 text-lg font-semibold">
                                {product?.price?.toLocaleString()} đ
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {product.status && product.quantity > 0 ? (
                <>

                    {isQuantity ?
                        (<div className="flex flex-col items-center gap-1 w-[20%] min-w-[100px] justify-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="min-w-[24px] text-center">{item.quantity}</span>
                            </div>
                            <div className=" mt-1 flex flex-col justify-center items-center gap-1">
                                <p className="text-sm text-red-600">
                                    Số lượng không thể vượt quá {availableQuantity} sản phẩm có sẵn!
                                </p>
                                <button
                                    onClick={handleUpdateToMaxQuantity}
                                    className="w-fit px-3 py-1 bg-blue-100 text-blue-700 border rounded hover:bg-blue-200 text-sm"
                                >
                                    Cập nhật số lượng
                                </button>
                            </div>
                        </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1 w-[20%] min-w-[100px] justify-center flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleDecrease}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 border rounded hover:bg-gray-200 text-lg cursor-pointer"
                                        disabled={!isStockValid}
                                    >
                                        -
                                    </button>
                                    <span className="min-w-[24px] text-center">{item.quantity}</span>
                                    <button
                                        onClick={handleIncrease}
                                        className="w-8 h-8 flex items-center justify-center bg-gray-100 border rounded hover:bg-gray-200 text-lg cursor-pointer"
                                        disabled={!isStockValid}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                    <div className="hidden sm:block text-red-600 font-semibold w-[20%] min-w-[100px] text-center flex-shrink-0">
                        {(
                            (product.price - Math.round(product.price * ((product.discount ?? 0) / 100))) * item.quantity
                        ).toLocaleString()} đ
                    </div>
                    <div className="w-[10%] min-w-[60px] flex justify-center flex-shrink-0">
                        <button
                            onClick={() => onRemove(product.productId)}
                            className="text-xl hover:text-red-700 cursor-pointer"
                        >
                            <Trash2 />
                        </button>
                    </div>
                </>) : (
                <>
                    <div className="text-red-600 font-semibold w-[60%] min-w-[100px] text-center items-center justify-center">
                        SẢN PHẨM ĐÃ NGƯNG BÁN
                    </div>
                    <div className="w-[10%] min-w-[60px] flex justify-center flex-shrink-0">
                        <button
                            onClick={() => onRemove(product.productId)}
                            className="text-xl hover:text-red-700 cursor-pointer"
                        >
                            <Trash2 />
                        </button>
                    </div>
                </>

            )}
        </div>
    );
};

export default CartItem;