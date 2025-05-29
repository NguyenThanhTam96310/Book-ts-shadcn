"use client"
import type { FC } from "react"
import styles from "./PostDetail.module.css"
import type { PostItemRes } from "@/features/post"

interface PostDetailProps {
    post: PostItemRes
}

const PostDetail: FC<PostDetailProps> = ({ post }) => {
    // Function to inject image into content
    const injectImageIntoContent = (content: string, imageElement: string) => {
        // Split content into paragraphs
        const paragraphs = content.split("</p>")

        // Find a good position to insert image (after 1-2 paragraphs)
        const insertPosition = Math.min(2, Math.floor(paragraphs.length / 3))

        // Insert image after the chosen paragraph
        paragraphs.splice(insertPosition, 0, imageElement)

        return paragraphs.join("</p>")
    }

    const imageElement = post.image
        ? `
    <div class="${styles.floatingImageWrapper}">
      <img 
        src="${process.env.NEXT_PUBLIC_FILE}${post.image}" 
        alt="${post.title}"
        class="${styles.floatingImage}"
      />
    </div>
  `
        : ""

    const contentWithImage = post.image ? injectImageIntoContent(post.content, imageElement) : post.content

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg mt-8">
            <article className="prose lg:prose-xl p-5">
                {/* Tiêu đề */}
                <h1 className="text-3xl font-bold text-gray-800 uppercase mb-4">{post.title}</h1>

                {/* Meta Info */}
                <div className="text-sm text-gray-500 mb-6">Đăng ngày: {post?.createdAt}</div>

                {/* Nội dung bài viết với hình ảnh được chèn vào giữa */}
                <div
                    className={`prose max-w-none ${styles.contentWithFloatingImage}`}
                    dangerouslySetInnerHTML={{ __html: contentWithImage }}
                />
            </article>
        </div>
    )
}

export default PostDetail
