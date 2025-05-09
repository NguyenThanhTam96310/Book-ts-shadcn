import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import styles from "./PublisherItem.module.css"

interface PublisherItemProps {
    publisherId: string
    publisherName?: string
    image?: string
}

const PublisherItem: FC<PublisherItemProps> = ({ publisherId, publisherName, image }) => {
    return (
        <Link key={publisherId} href={`/products?publisherId=${publisherId}`} className={styles.publisherItem}>
            <div className={styles.logoContainer}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_FILE}${image}`}
                    alt={publisherName || "image.jpg"}
                    fill
                    // sizes="(max-width: 768px) 25vw, 150px"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.logo}
                />
            </div>
        </Link>
    )
}

export default PublisherItem
