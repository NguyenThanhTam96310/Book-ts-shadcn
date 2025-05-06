"use client";

import type { CartItemType, CartProps, ProductCartProps } from "@/features/cart/services/type";
import Link from "next/link";
interface CartItemProps {
    item: CartItemType;


}

const PaymentItem = ({ item }: CartItemProps) => {
    const product: ProductCartProps = item.product;

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b py-4 gap-4">
            {/* Left - image + name + price */}
            <div className="flex items-start lg:items-center gap-4 w-full lg:w-[40%]">
                <img
                    src={
                        product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                            ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                            : "/placeholder.svg"
                    }
                    alt={product?.productName}
                    className="w-20 h-20 object-cover border rounded-md flex-shrink-0"
                />
                <div className="flex flex-col gap-1">
                    <div className="text-base font-medium text-gray-800 hover:text-red-600 transition-colors duration-200">
                        {product?.productName}
                    </div>
                    <div className="flex items-center gap-2">
                        {product?.discount ? (
                            <>
                                <span className="text-red-600 font-semibold text-lg">
                                    {(product.price - (Math.round(product.price * (product.discount / 100)))).toLocaleString()} đ
                                </span>
                                <span className="text-gray-500 line-through text-sm">
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

            {/* Quantity */}
            <div className="flex items-center gap-2 w-32 justify-center">

                <span className="min-w-[24px] text-center">{item.quantity}</span>

            </div>

            {/* Total price */}
            <div className="font-semibold text-red-600 w-32 text-center">
                {(((product.price - (Math.round(product.price * ((product.discount ?? 0) / 100))))) * item.quantity).toLocaleString()} đ
            </div>

            {/* Delete button */}
            <div className="w-16 flex justify-center">

            </div>
        </div>
    );
};

export default PaymentItem;
