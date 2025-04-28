"use client"
import PostItem from '@/components/organisms/PostItem'
import React from 'react'

const PostHome = () => {
    const dummyPosts = [
        {
            postId: 1,
            title: "The Sketchnote Handbook – Ghi Chép Trực Quan Từ Mike Rohde",
            content: "Mike Rohde là một tác giả, nhà thiết kế và họa sĩ minh họa...",
            image: "/images/banners/s2.jpg"
        },
        {
            postId: 2,
            title: "Các Cuốn Sách Của Jon Acuff Giúp Thay Đổi Tư Duy Về Công Việc",
            content: "Jon Acuff là tác giả nổi tiếng với những cuốn sách tạo động lực...",
            image: "/images/banners/s2.jpg"
        },
        {
            postId: 3,
            title: "Những Cuốn Sách Hay Của Donald Trump",
            content: "Donald J. Trump sinh ngày 14 tháng 6 năm 1946...",
            image: "/images/banners/s2.jpg"
        },
        {
            postId: 4,
            title: "Stephen King: Tác Giả Huyền Thoại Của Thể Loại Kinh Dị",
            content: "Stephen King được mệnh danh là 'Vua kinh dị'...",
            image: "/images/banners/s2.jpg"
        }
    ]

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dummyPosts.map((post) => (
                    <PostItem
                        key={post.postId}
                        postId={post.postId}
                        title={post.title}
                        content={post.content}
                        image={post.image}
                    />
                ))}
            </div>
        </div>
    )
}

export default PostHome
