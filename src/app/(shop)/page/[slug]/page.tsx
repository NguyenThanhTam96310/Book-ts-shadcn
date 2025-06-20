import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fetchPostDetail, PostItemRes } from "@/features/post"
import PostNewHomeForm from "@/features/post/components"
import PageDetail from "@/features/post/components/PageDetail"
import PostByTopicForm from "@/features/post/components/PostByTopicForm"
import Postdetail from "@/features/post/components/PostDetail"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Props {
    params: { slug: string }
}
export default async function Page({ params }: Props) {
    const { slug } = await params
    const post: PostItemRes = await fetchPostDetail(slug)
    return (
        <>
            <PageDetail post={post} />
        </>
    )
}