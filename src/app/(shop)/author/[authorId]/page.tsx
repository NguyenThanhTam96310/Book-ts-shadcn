import AuthorDetail from "@/features/author/components/AuthorDetail"
import { fetchAuthorDetail } from "@/features/author/services/author.service"
import { AuthorRes } from "@/features/author/services/type"
import { fetchPostDetail, PostItemRes } from "@/features/post"
import PostNewHomeForm from "@/features/post/components"
import PostByTopicForm from "@/features/post/components/PostByTopicForm"
import Postdetail from "@/features/post/components/PostDetail"
import { useEffect, useState } from "react"

interface Props {
    params: { authorId: number }
}
export default async function AuthorDetailPage({ params }: Props) {
    const { authorId } = await params
    const author: AuthorRes = await fetchAuthorDetail(authorId)
    return (
        <>
            <AuthorDetail author={author} />
            {/* <div className="py-author10 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg pb-6">
                    <div className="flex items-center gap-4 py-6">
                        <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold whitespace-nowrap">
                            BÀI VIẾT LIÊN QUAN
                        </h1>
                        <div className=" flex-1 h-1 bg-gray-300"></div>
                    </div>
                    <div>
                        <PostByTopicForm topicId={Number(post.topic?.topicId)} currentPostId={Number(post.postId)} />
                    </div>
                </div>
            </div> */}
        </>
    )
}