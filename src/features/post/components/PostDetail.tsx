"use client"

import { fetchPostDetail, PostItemRes } from "@/features/post"
import { FC, useEffect, useState } from "react"

interface PostDetailProps {
    post: PostItemRes
}

const PostDetail: FC<PostDetailProps> = ({ post }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg mt-5">
            <article className="prose lg:prose-xl p-5">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-gray-800 uppercase ">{post.title}</h1>

                {/* Meta Info */}
                <div className="text-sm text-gray-500 mb-4">
                    Đăng ngày: {post?.createdAt}
                </div>

                {/* Nội dung bài viết (HTML) */}
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
            </article>
        </div>
    )
}

export default PostDetail
