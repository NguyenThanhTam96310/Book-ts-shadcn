"use client"
import PostItem from '@/components/organisms/PostItem'
import { fetchPosts } from '@/features/post/services/post.service'
import { PostItemProps } from '@/features/post/services/type'
import React, { useEffect, useState } from 'react'

const PostHome = () => {
    const [posts, setPosts] = useState<PostItemProps[]>([])
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts()
                setPosts(data)
            } catch (error) {
                console.error("Lỗi khi load post:", error)
            }
        }
        loadPosts()
    }, [])
    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <PostItem
                        key={post.postId}
                        postId={post.postId}
                        title={post.title}
                        content={post.content}
                    />
                ))}
            </div>
        </div>
    )
}

export default PostHome
