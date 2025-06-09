"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, type FC } from "react"
import styles from "./ProductItem.module.css"
import type { ProductItemProps } from "@/features/product/services/type"
import { ShoppingCart } from "lucide-react"
import { CART_ITEM_KEY, USER_ID } from "@/constants/cartConstants"
import { POST_ADD } from "@/lib/api/Service"
import { toast } from "react-toastify"
import { addProductIdToLocalStorage } from "@/lib/utils/localStorege"

interface ProductDetailProps {
    product: ProductItemProps
}

const ProductItem: FC<ProductDetailProps> = ({ product }) => {
    const [userId, setUserId] = useState<number | null>(null)
    const discountedPrice =
        (product.discount ?? 0) > 0
            ? Math.round(product.price - product.price * ((product.discount ?? 0) / 100))
            : product.price

    const formatPrice = (price: number) => {
        return (
            new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
                .format(price)
                .replace("₫", "")
                .trim() + "₫"
        )
    }

    useEffect(() => {
        const storedUserId = localStorage.getItem(USER_ID)
        if (storedUserId) {
            setUserId(Number.parseInt(storedUserId, 10))
        }
    }, [])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation when clicking the button
        e.stopPropagation() // Stop event propagation

        const quantity = 1

        if (userId) {
            const url = `/public/carts`
            POST_ADD(url, { userId: userId, productId: product.productId, quantity })
                .then(() => {
                    toast.success("Thêm vào giỏ hàng thành công", {
                        position: "bottom-right",
                        autoClose: 2000,
                    })
                    addProductIdToLocalStorage(product.productId)
                })
                .catch((error) => {
                    console.error("Add to cart error:", error)
                    toast.error("Sản phẩm đã có trong giỏ hàng.", {
                        position: "bottom-right",
                        autoClose: 2000,
                    })
                })
        } else {
            const storedCart = localStorage.getItem(CART_ITEM_KEY)
            const cart = storedCart ? JSON.parse(storedCart) : { cartItems: [], totalPrice: 0 }

            const existingIndex = cart.cartItems.findIndex((item: any) => item.product.productId === product.productId)

            if (existingIndex !== -1) {
                cart.cartItems[existingIndex].quantity += quantity
            } else {
                addProductIdToLocalStorage(product.productId)
                cart.cartItems.push({
                    product: {
                        productId: product.productId,
                        slug: product.slug,
                    },
                    quantity,
                })
            }

            cart.totalPrice = cart.cartItems.reduce((sum: number, item: any) => {
                const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100)
                return sum + discountedPrice * item.quantity
            }, 0)

            localStorage.setItem(CART_ITEM_KEY, JSON.stringify(cart))

            toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
                position: "bottom-right",
                autoClose: 2000,
            })
        }
    }

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.productLink}>
                <div className={styles.imageWrapper}>
                    {(product.discount ?? 0) > 0 && <span className={styles.discountBadge}>-{product.discount}%</span>}
                    <Image
                        src={
                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                : "/placeholder.png"
                        }
                        alt={product.productName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImage}
                        priority
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{product.productName}</h3>
                    <div className={styles.priceWrapper}>
                        <span className={styles.currentPrice}>{formatPrice(discountedPrice)}</span>
                        {(product.discount ?? 0) > 0 && <span className={styles.oldPrice}>{formatPrice(product.price)}</span>}
                    </div>
                </div>
                <button className={styles.addToCart} onClick={handleAddToCart} aria-label="Thêm vào giỏ hàng">
                    <ShoppingCart size={16} className={styles.cartIcon} />
                    Thêm vào giỏ
                </button>
            </Link>
        </div>
    )
}

export default ProductItem
