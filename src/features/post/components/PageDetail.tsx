"use client"
import type { FC } from "react"
import styles from "./PostDetail.module.css"
import type { PostItemRes } from "@/features/post"

interface PostDetailProps {
    post: PostItemRes
}

const PageDetail: FC<PostDetailProps> = ({ post }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg mt-8">
            <article className="prose lg:prose-xl p-5">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-gray-800 uppercase mb-4">{post.title}</h1>

                {/* Meta Info */}
                <div className="text-sm text-gray-500 mb-6">Đăng ngày: {post?.createdAt}</div>

                {/* Nội dung bài viết với hình ảnh được chèn vào giữa */}
                <div
                    // className={`prose max-w-none`}
                    dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                />
            </article>
        </div>
    )
}

export default PageDetail
