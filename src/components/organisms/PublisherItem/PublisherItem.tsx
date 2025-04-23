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
        <Link key={publisherId} href={`/publisher/${publisherId}`} className={styles.publisherItem}>
            <div className={styles.logoContainer}>
                <Image
                    src={image || "/placeholder.svg"}
                    alt={publisherName || "image.jpg"}
                    fill
                    sizes="(max-width: 768px) 25vw, 150px"
                    className={styles.logo}
                />
            </div>
        </Link>
    )
}

export default PublisherItem
