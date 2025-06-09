import { AuthorRes } from "@/features/author/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
export const fetchAllAuthors = async (): Promise<AuthorRes[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/authors`, {
        params: {
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "authorId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: AuthorRes[] }
    return data.content
}
export const fetchAuthorDetail = async (authorId: number): Promise<AuthorRes> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/authors/${authorId}`)
    return response.data as AuthorRes
}