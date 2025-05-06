"use client";

import type { CartItemType, CartProps, ProductCartProps } from "@/features/cart/services/type";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from 'lucide-react';
import Link from "next/link";
interface CartItemProps {
    item: CartItemType;
    index: number;
    checked: boolean;
    onCheck: () => void;
    onDecrease: (productId: string | number) => void;
    onIncrease: (productId: string | number) => void;
    onRemove: (productId: string | number) => void;
}

const CartItem = ({ item, checked, onCheck, onDecrease, onIncrease, onRemove }: CartItemProps) => {
    const product: ProductCartProps = item.product;

    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b py-4 gap-4">
            {/* Left - image + name + price */}
            <div className="flex items-start lg:items-center gap-4 w-full lg:w-[40%]">

                <Checkbox checked={checked} onCheckedChange={onCheck} />
                <Link href={`/products/${product.slug}`}>
                    <img
                        src={
                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                : "/placeholder.svg"
                        }
                        alt={product?.productName}
                        className="w-20 h-20 object-cover border rounded-md flex-shrink-0"
                    />
                </Link>
                <div className="flex flex-col gap-1">
                    <Link href={`/products/${product.slug}`}>
                        <div className="text-base font-medium text-gray-800 hover:text-red-600 transition-colors duration-200">
                            {product?.productName}
                        </div>
                    </Link>

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
                <button
                    onClick={() => onDecrease(product.productId)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 border rounded hover:bg-gray-200 text-lg"
                >
                    -
                </button>
                <span className="min-w-[24px] text-center">{item.quantity}</span>
                <button
                    onClick={() => onIncrease(product.productId)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 border rounded hover:bg-gray-200 text-lg"
                >
                    +
                </button>
            </div>

            {/* Total price */}
            <div className="font-semibold text-red-600 w-32 text-center">
                {(((product.price - (Math.round(product.price * ((product.discount ?? 0) / 100))))) * item.quantity).toLocaleString()} đ
            </div>

            {/* Delete button */}
            <div className="w-16 flex justify-center">
                <button
                    onClick={() => onRemove(product.productId)}
                    className="text-xl hover:text-red-700"
                >
                    <Trash2 />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
