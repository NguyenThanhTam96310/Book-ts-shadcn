
import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import styles from "./CategoryItem.module.css"

interface CategoryItemProps {
    categoryId: string | number
    categoryName: string
    slug: string
    image?: string
    status?: "active" | "inactive" | string
    parent_id?: string | number | null
}

const CategoryItem: FC<CategoryItemProps> = ({
    categoryName,
    slug,
    image,
    status = "active",

}) => {
    if (status !== "active") {
        return null
    }
    return (
        <div className={styles.container}>
            <Link href={`/category/${slug}`}>
                <div className={styles.imageContainer}>
                    <div className={styles.bookStack}>
                        {/* Background books */}
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className={`${styles.backgroundBook} ${index % 2 === 0 ? styles.leftBook : styles.rightBook
                                    } ${styles[`book${index + 1}`]}`}
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_FILE}${image}`}

                                    alt={categoryName}
                                    fill
                                    className={styles.bookCover}
                                />
                            </div>
                        ))}

                        {/* Main featured book */}
                        <div className={styles.mainBook}>
                            <Image src={`${process.env.NEXT_PUBLIC_FILE}${image}`} alt={categoryName} fill className={styles.bookCover} priority />
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <h2 className={styles.title}>{categoryName}</h2>
                    <span className={styles.viewLink}>Xem ngay</span>
                </div>
            </Link>
        </div>
    )
}

export default CategoryItem
