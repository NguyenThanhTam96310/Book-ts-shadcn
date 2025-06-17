"use client";
import PostItem from "@/components/organisms/PostItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchPosts } from "@/features/post/services/post.service";
import { PostItemRes } from "@/features/post/services/type";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PostNewHomeForm = () => {
    const [posts, setPosts] = useState<PostItemRes[]>([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data.slice(0, 3));
            } catch (error) {
                console.error("Lỗi khi load post:", error);
            }
        };
        loadPosts();
    }, []);

    return (
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
                            <Link href="/post">
                                <Button
                                    variant="outline"
                                    className="hidden sm:flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-300 cursor-pointer"
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.map((post) => (
                                <PostItem
                                    key={post.postId}
                                    postId={post.postId}
                                    title={post.title}
                                    slug={post.slug}
                                    image={post.image}
                                    content={post.content}
                                    createdAt={0}
                                />
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </section>

    );
};

export default PostNewHomeForm;