import axiosInstance from "@/lib/api/Config"
import { Publisher } from "@/types"
const API = process.env.NEXT_PUBLIC_API
export const fetchPublishersForm = async (): Promise<PublisherShowcaseProps[]> => {
    const response = await axiosInstance.get(`${API}/public/publishers`, {
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
    const response = await axiosInstance.get(`${API}/public/publishers`, {
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