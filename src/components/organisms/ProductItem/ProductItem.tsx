import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import styles from "./ProductItem.module.css";
import { ProductItemProps } from "@/features/product/services/type";

interface ProductDetailProps {
    product: ProductItemProps
}
const ProductItem: FC<ProductDetailProps> = ({ product }) => {
    // Giá sau khi giảm
    const discountedPrice = (product.discount ?? 0) > 0 ? Math.round(product.price - (product.price * ((product.discount ?? 0) / 100))) : product.price;

    // Format giá theo VNĐ  
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
        <div className={styles.container}>
            <Link href={`/products/${product.slug}`} className={styles.productLink}>
                <div className={styles.imageContainer}>
                    {(product.discount ?? 0) > 0 && (
                        <div className={styles.discountBadge}>-{product.discount}%</div>
                    )}
                    <div className={styles.authenticBadge}>
                        <span>CHÍNH HÃNG</span>
                    </div>
                    <Image
                        src={
                            product.images && product.images.length > 0
                                ? `/images/products/${product.images[0].fileName}`
                                : "/placeholder.svg"
                        }
                        alt={product.productName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImage}
                        priority
                    />
                </div>

                <div className={styles.infoContainer}>
                    <h3 className={styles.title}>{product.productName}</h3>
                    <div className={styles.priceContainer}>
                        <span className={styles.price}>
                            {formatPrice(discountedPrice)}
                        </span>
                        {(product.discount ?? 0) > 0 && (
                            <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                        )}
                    </div>
                </div>
            </Link>
            <button className={styles.addToCartButton}>THÊM VÀO GIỎ</button>
        </div>
    );
};

export default ProductItem;
