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
        </>
    )
}