import { MenuItem } from "@/features/menu/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export const fetchMenus = async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/menus`, {
        params: {
            type: "parent",
            pageNumber: 0,
            // pageSize: 5,
            sortBy: "menuId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: MenuItem[] }
    return data.content
}

export const fetchMenuFooter = async (): Promise<MenuItem[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/menus`, {
        params: {
            type: "parent",
            pageNumber: 0,
            pageSize: 30,
            sortBy: "menuId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: MenuItem[] }
    return data.content
}
