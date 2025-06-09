
import { PostItemRes } from "@/features/post/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export async function fetchPosts(): Promise<PostItemRes[]> {
    const res = await axiosInstance.get<{
        content: PostItemRes[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/posts`, {
        params: {
            status: true,
            pageNumber: 1,
            pageSize: 9,
            sortBy: "postId",
            sortOrder: "desc",
        },
    })
    const data = res.data as { content: PostItemRes[] }
    return data.content
}
export const fetchPostDetail = async (slug: string): Promise<PostItemRes> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/posts/slug/${slug}`)
    return response.data as PostItemRes
}
export const fetchPageDetail = async (slug: string): Promise<PostItemRes> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/posts/slug/${slug}`)
    return response.data as PostItemRes
}
export async function fetchPostByTopicId(topicId: number): Promise<PostItemRes[]> {
    const res = await axiosInstance.get<{
        content: PostItemRes[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/posts`, {
        params: {
            status: true,
            topicId: topicId,
            pageNumber: 1,
            pageSize: 9,
            sortBy: "postId",
            sortOrder: "desc",
        },
    })
    const data = res.data as { content: PostItemRes[] }
    return data.content
}