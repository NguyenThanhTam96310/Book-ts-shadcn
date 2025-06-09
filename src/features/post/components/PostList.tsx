"use client"

import PostItem from '@/components/organisms/PostItem'
import { fetchPostByTopicId } from '@/features/post/services/post.service'
import { PostItemRes } from '@/features/post/services/type'
import React, { useEffect, useState } from 'react'

interface PostByTopicFormProps {
    topicId: number
}

const PostsList: React.FC<PostByTopicFormProps> = ({ topicId }) => {
    const [posts, setPosts] = useState<PostItemRes[]>([])

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPostByTopicId(topicId)
                const filterPost = data.filter((post: PostItemRes) => post.type === "POST");
                setPosts(filterPost)
            } catch (error) {
                console.error("Lỗi khi load post:", error)
            }
        }
        if (topicId) {
            loadPosts()
        }
    }, [topicId])
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
                    createdAt={post.createdAt}
                />
            ))}
        </div>
    )
}

export default PostsList
