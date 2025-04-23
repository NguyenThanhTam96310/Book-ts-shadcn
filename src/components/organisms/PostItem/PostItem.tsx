"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./PostItem.module.css"

interface PostItemProps {
    postId: string
    title: string
    excerpt: string
    images: string[]
}

const PostItem: React.FC<PostItemProps> = ({ postId, title, excerpt, images }) => {
    return (
        <div className={styles.postItem}>
            <div className={styles.imageGrid}>
                {images.slice(0, 3).map((img, idx) => (
                    <div className={styles.imageWrapper} key={idx}>
                        <Image src={img} alt={`Image ${idx + 1}`} fill className={styles.image} />
                    </div>
                ))}
            </div>
            <div className={styles.content}>
                <Link href={`/posts/${postId}`} className={styles.title}>
                    {title}
                </Link>
                <p className={styles.excerpt}>{excerpt}</p>
                <Link href={`/posts/${postId}`} className={styles.readMore}>
                    Xem thêm
                </Link>
            </div>
        </div>
    )
}

export default PostItem
