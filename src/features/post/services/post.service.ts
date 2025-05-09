
import { PostItemProps } from "@/features/post/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export async function fetchPosts(): Promise<PostItemProps[]> {
    const res = await axiosInstance.get<{
        content: PostItemProps[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/posts`, {
        params: {
            pageNumber: 0,
            pageSize: 5,
            sortBy: "postId",
            sortOrder: "desc",
        },
    })
    const data = res.data as { content: PostItemProps[] }
    return data.content
}   