import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { Languages } from "@/types"
export const fetchAllLanguages = async (): Promise<Languages[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/languages`, {
        params: {
            status: true,
            pageNumber: 0,
            sortBy: "languageId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: Languages[] }
    return data.content
}