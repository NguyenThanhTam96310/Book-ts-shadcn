import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import styles from "./CategoryItem.module.css"
import { CategoryItemProps } from "@/features/category/services/type"


const CategoryItem: FC<CategoryItemProps> = ({
    categoryId,
    categoryName,
    slug,
    image,
    status = "active",
}) => {
    if (status !== "active") return null

    return (
        <div className={styles.bannerCard}>
            <Link href={`products/?categoryId=${categoryId}`}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={`${process.env.NEXT_PUBLIC_FILE}${image}`}
                        alt={categoryName}
                        fill
                        className={styles.bannerImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />
                </div>
                <div className={styles.overlay}>
                    <h3 className={styles.textMain}>{categoryName}</h3>
                    <div className={styles.button}>MUA NGAY</div>
                </div>
            </Link>
        </div>
    )
}

export default CategoryItem
