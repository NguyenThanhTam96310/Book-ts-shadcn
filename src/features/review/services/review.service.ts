import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
export const fetchPublishersForm = async (): Promise<PublisherShowcaseProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "publisherId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: PublisherShowcaseProps[] }
    return data.content
}