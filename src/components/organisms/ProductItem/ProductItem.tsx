import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import styles from "./ProductItem.module.css";
import { ProductItemProps } from "@/features/product/services/type";
import { ShoppingCart } from "lucide-react";

interface ProductDetailProps {
    product: ProductItemProps;
}

const ProductItem: FC<ProductDetailProps> = ({ product }) => {
    const discountedPrice =
        (product.discount ?? 0) > 0
            ? Math.round(product.price - (product.price * ((product.discount ?? 0) / 100)))
            : product.price;

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
        );
    };

    return (
        <div className={styles.card}>
            <Link href={`/products/${product.slug}`} className={styles.productLink}>
                <div className={styles.imageWrapper}>
                    {(product.discount ?? 0) > 0 && (
                        <span className={styles.discountBadge}>-{product.discount}%</span>
                    )}
                    <Image
                        src={
                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                : "/placeholder.svg"
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
                        {(product.discount ?? 0) > 0 && (
                            <span className={styles.oldPrice}>{formatPrice(product.price)}</span>
                        )}
                    </div>
                </div>
            </Link>
            <button className={styles.addToCart}>
                <ShoppingCart size={16} className={styles.cartIcon} />
                Thêm vào giỏ
            </button>
        </div>
    );
};

export default ProductItem;