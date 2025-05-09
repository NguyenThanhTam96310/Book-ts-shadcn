import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { Publisher } from "@/types"
export const fetchPublishersForm = async (): Promise<PublisherShowcaseProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            status: true,
            pageNumber: 0,
            pageSize: 10,
            sortBy: "publisherId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: PublisherShowcaseProps[] }
    return data.content
}
export const fetchAllPublishers = async (): Promise<Publisher[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            status: true,
            pageNumber: 0,
            pageSize: 10,
            sortBy: "publisherId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: Publisher[] }
    return data.content
}