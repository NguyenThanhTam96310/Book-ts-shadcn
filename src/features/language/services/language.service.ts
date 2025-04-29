import axiosInstance from "@/lib/api/Config"
import { Languages } from "@/types"
const API = process.env.NEXT_PUBLIC_API
export const fetchAllLanguages = async (): Promise<Languages[]> => {
    const response = await axiosInstance.get(`${API}/public/languages`, {
        params: {
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "languageId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: Languages[] }
    return data.content
}