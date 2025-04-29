"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./PostItem.module.css"
import { PostItemProps } from "@/features/post/services/type"



const PostItem: React.FC<PostItemProps> = ({ postId, title, image, content }) => {
    return (
        <div className={styles.postItem}>
            <div className={styles.imageGrid}>
                <div className={styles.imageWrapper} >
                    <Image src={`${process.env.NEXT_PUBLIC_FILE}${image}`} alt={""} fill className={styles.image} />
                </div>
            </div>
            <div className={styles.content}>
                <Link href={`/posts/${postId}`} className={styles.title}>
                    {title}
                </Link>
                <p className={styles.excerpt}>{content}</p>
                <Link href={`/posts/${postId}`} className={styles.readMore}>
                    Xem thêm
                </Link>
            </div>
        </div>
    )
}

export default PostItem
