import axiosInstance from "@/lib/api/Config"
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