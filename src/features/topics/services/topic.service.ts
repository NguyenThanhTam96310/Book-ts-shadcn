import { MenuItem } from "@/features/menu/services/type"
import { TopicRes } from "@/features/topics/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export const fetchTopics = async (): Promise<TopicRes[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/topics`, {
        params: {
            status: true,
            pageNumber: 1,
            sortBy: "topicId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: TopicRes[] }
    return data.content
}
