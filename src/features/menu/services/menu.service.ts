import { MenuItem } from "@/features/menu/services/type"
import axiosInstance from "@/lib/api/Config"


const API = process.env.NEXT_PUBLIC_API

export const fetchMenus = async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get(`${API}/public/menus`, {
        params: {
            type: "parent",
            pageNumber: 0,
            pageSize: 10,
            sortBy: "menuId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: MenuItem[] }
    return data.content
}
