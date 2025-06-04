"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import styles from "./PostItem.module.css"
import type { PostItemRes } from "@/features/post/services/type"

const PostItem: React.FC<PostItemRes> = ({ postId, title, content, slug, image }) => {
    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea")
        txt.innerHTML = html
        return txt.value
    }

    return (
        <div className={styles.postItem}>
            <div className={styles.content}>
                <Link href={`/post/${slug}`} className={styles.title}>
                    {title}
                </Link>
                <p
                    className={styles.excerpt}
                    dangerouslySetInnerHTML={{ __html: decodeHtml(content).replace(/^<p>|<\/p>$/g, "") }}
                />
                <Link href={`/post/${slug}`} className={styles.readMore}>
                    Xem thêm
                </Link>
            </div>
            <div className={styles.imageWrapper}>
                <Image src={`${process.env.NEXT_PUBLIC_FILE}${image}`} alt={title} fill className={styles.image} priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
        </div>
    )
}

export default PostItem
