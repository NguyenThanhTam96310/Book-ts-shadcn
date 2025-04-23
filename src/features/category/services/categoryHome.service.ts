import axiosInstance from "@/lib/api/Config"


const API = process.env.NEXT_PUBLIC_API

export const fetchCategories = async (): Promise<CategoryItemProps[]> => {
    const response = await axiosInstance.get(`${API}/public/categories`, {
        params: {
            status: true,
            type: "parent",
            pageNumber: 0,
            pageSize: 4,
            sortBy: "categoryId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: CategoryItemProps[] }
    return data.content
}
