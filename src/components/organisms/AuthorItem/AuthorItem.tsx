"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, type FC } from "react"
import styles from "./authorItem.module.css"
import { toast } from "react-toastify"
import { AuthorRes } from "@/features/author/services/type"

interface AuthorProps {
    author: AuthorRes
}

const AuthorItem: FC<AuthorProps> = ({ author }) => {

    return (
        <div className={styles.card}>
            <Link href={`/author/${author.authorId}`} className={styles.authorLink}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={
                            author.image && process.env.NEXT_PUBLIC_FILE
                                ? `${process.env.NEXT_PUBLIC_FILE}${author.image}`
                                : "/placeholder.png"
                        }
                        alt={author?.authorName || "Author image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.authorImage}
                        priority
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{author.authorName}</h3>
                </div>

            </Link>
        </div>
    )
}

export default AuthorItem
