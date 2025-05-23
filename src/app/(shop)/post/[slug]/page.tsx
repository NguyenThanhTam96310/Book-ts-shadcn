import { fetchPostDetail, PostItemRes } from "@/features/post"
import PostHome from "@/features/post/components"
import Postdetail from "@/features/post/components/PostDetail"
import { useEffect, useState } from "react"

interface Props {
    params: { slug: string }
}
export default async function PostDetailPage({ params }: Props) {
    const { slug } = await params
    const post: PostItemRes = await fetchPostDetail(slug)
    return (
        <>
            <Postdetail post={post} />
            <div className="py-10 bg-gray-100">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 py-5 rounded-xl shadow-xl text-center">
                        <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-lg">
                            Bài Viết Nổi Bật
                        </h1>
                    </div>
                    <div className="mt-8">
                        <PostHome />
                    </div>
                </div>
            </div>
        </>
    )
}