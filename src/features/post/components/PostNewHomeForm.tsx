"use client"
import PostItem from '@/components/organisms/PostItem'
import { fetchPosts } from '@/features/post/services/post.service'
import { PostItemRes } from '@/features/post/services/type'
import React, { useEffect, useState } from 'react'

const PostNewHomeForm = () => {
    const [posts, setPosts] = useState<PostItemRes[]>([])
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
                <PostItem
                    key={post.postId}
                    postId={post.postId}
                    title={post.title}
                    slug={post.slug}
                    image={post.image}
                    content={post.content}
                    createdAt={0} />
            ))}
        </div>

    )
}

export default PostNewHomeForm
