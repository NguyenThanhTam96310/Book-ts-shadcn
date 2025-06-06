import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fetchPostDetail, PostItemRes } from "@/features/post"
import PostNewHomeForm from "@/features/post/components"
import PostByTopicForm from "@/features/post/components/PostByTopicForm"
import Postdetail from "@/features/post/components/PostDetail"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
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
            <section className="py-10 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-xl rounded-3xl overflow-hidden">
                        <div className="p-8">
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">BÀI VIẾT NỔI BẬT</h2>
                                        <p className="text-gray-600 mt-1">Khám phá những bài viết thú vị về sách và đọc</p>
                                    </div>
                                </div>
                                <Link href={`/post?topicId=${post.topic?.topicId}`} passHref>
                                    <Button
                                        variant="outline"
                                        className="hidden sm:flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-300"
                                    >
                                        Đọc thêm
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Decorative Line */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-orange-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-1 rounded-full"></div>
                                </div>
                            </div>

                            <PostByTopicForm topicId={Number(post.topic?.topicId)} currentPostId={Number(post.postId)} />
                        </div>
                    </Card>
                </div>
            </section>
        </>
    )
}