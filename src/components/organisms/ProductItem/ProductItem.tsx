import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import styles from "./ProductItem.module.css"

const ProductItem: FC<ProductItemProps> = ({
    productId,
    productName,
    price,
    discount = 0,
    slug,
    publisherName = "",
    images,
    author = "",
    year,
}) => {
    // Calculate discounted price
    const discountedPrice = price - discount
    const originalPrice = discount > 0 ? price : undefined
    const percentDiscount = (price / discount).toFixed(0);
    // Format price with Vietnamese currency
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

    return (
        <div className={styles.container}>
            <Link href={`/product/${slug}`} className={styles.productLink}>
                <div className={styles.imageContainer}>
                    {discount > 0 && <div className={styles.discountBadge}>-{percentDiscount}%</div>}
                    <div className={styles.authenticBadge}>
                        <span>CHÍNH HÃNG</span>
                    </div>
                    <Image
                        src={images && images.length > 0
                            ? `/images/products/${images[0].fileName}` : "/placeholder.svg"}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImage}
                        priority
                    />
                </div>

                <div className={styles.infoContainer}>
                    <div className={styles.publisher}>{publisherName}</div>
                    <h3 className={styles.title}>
                        {productName}
                    </h3>
                    <div className={styles.priceContainer}>
                        <span className={styles.price}>{formatPrice(discountedPrice)}</span>
                        {originalPrice && <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>}
                    </div>
                </div>
            </Link>
            <button className={styles.addToCartButton}>THÊM VÀO GIỎ</button>
        </div>
    )
}

export default ProductItem
