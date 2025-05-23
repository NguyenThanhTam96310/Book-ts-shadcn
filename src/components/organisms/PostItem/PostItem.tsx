"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./PostItem.module.css"
import { PostItemRes } from "@/features/post/services/type"

const PostItem: React.FC<PostItemRes> = ({ postId, title, content, slug }) => {
    return (
        <div className={styles.postItem}>
            <div className={styles.content}>
                <Link href={`/post/${slug}`} className={styles.title}>
                    {title}
                </Link>
                <p className={styles.excerpt}>{content}</p>
                <Link href={`/post/${slug}`} className={styles.readMore}>
                    Xem thêm
                </Link>
            </div>
        </div>
    )
}

export default PostItem
