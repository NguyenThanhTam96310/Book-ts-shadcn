'use client';

import PostsList from "@/features/post/components/PostList";
import PostNew from "@/features/post/components/PostNew";
import TopicMenu from "@/features/topics/components/TopicMenu";
import { useSearchParams } from "next/navigation";

const PostPage = () => {
    const searchParams = useSearchParams();
    const slug = searchParams?.get("slugTopic") || null; // Lấy topicId từ query string

    return (
        <div className="py-5 bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg p-6">
                {slug ? (
                    <PostsList slug={String(slug)} />

                ) : (
                    <PostNew />
                )}
            </div>
        </div>
    );
};

export default PostPage;