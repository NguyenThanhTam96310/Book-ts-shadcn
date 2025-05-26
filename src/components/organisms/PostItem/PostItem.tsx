"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./PostItem.module.css"
import { PostItemRes } from "@/features/post/services/type"

const PostItem: React.FC<PostItemRes> = ({ postId, title, content, slug }) => {
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
        </div>
    )
}

export default PostItem
