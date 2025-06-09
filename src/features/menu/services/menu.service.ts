import { MenuItem, MenuRes } from "@/features/menu/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


// export const fetchMenus = async (): Promise<MenuItem[]> => {
//     const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/menus`, {
//         params: {
//             status: true,
//             type: "parent",
//             pageNumber: 0,
//             pageSize: 10,
//             sortBy: "menuId",
//             sortOrder: "asc"
//         }
//     })

//     const data = response.data as { content: MenuItem[] }
//     return data.content
// }

// export const fetchMenuFooter = async (): Promise<MenuItem[]> => {
//     const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/menus`, {
//         params: {
//             type: "parent",
//             pageNumber: 0,
//             pageSize: 50,
//             sortBy: "menuId",
//             sortOrder: "asc"
//         }
//     })

//     const data = response.data as { content: MenuItem[] }
//     return data.content
// }
export const fetchMenuFooter = async (): Promise<MenuItem[]> => {
    let allMenus: MenuItem[] = [];
    let pageNumber = 1;
    const pageSize = 10; // Giữ nguyên pageSize như API hiện tại
    let lastPage = false;

    try {
        while (!lastPage) {
            const response = await axiosInstance.get<MenuRes>(
                `${envConfig.NEXT_PUBLIC_API}/public/menus`,
                {
                    params: {
                        status: true,
                        type: 'parent',
                        pageNumber,
                        pageSize,
                        sortBy: 'menuId',
                        sortOrder: 'asc',
                    },
                }
            );

            const data = response.data;
            const filteredData = data.content.filter((menu: MenuItem) => menu.position === "FOOTERMENU");
            allMenus = [...allMenus, ...filteredData]; // Gộp dữ liệu từ trang hiện tại
            lastPage = data.lastPage; // Kiểm tra nếu là trang cuối
            pageNumber++; // Tăng số trang cho lần gọi tiếp theo
        }

        return allMenus;
    } catch (error) {
        console.error('Error fetching all menus:', error);
        throw error;
    }
};
export const fetchMenus = async (): Promise<MenuItem[]> => {
    let allMenus: MenuItem[] = [];
    let pageNumber = 1;
    const pageSize = 5; // Giữ nguyên pageSize như API hiện tại
    let lastPage = false;

    try {
        while (!lastPage) {
            const response = await axiosInstance.get<MenuRes>(
                `${envConfig.NEXT_PUBLIC_API}/public/menus`,
                {
                    params: {
                        status: true,
                        type: 'parent',
                        pageNumber,
                        pageSize,
                        sortBy: 'menuId',
                        sortOrder: 'asc',
                    },
                }
            );

            const data = response.data;
            allMenus = [...allMenus, ...data.content]; // Gộp dữ liệu từ trang hiện tại
            lastPage = data.lastPage; // Kiểm tra nếu là trang cuối
            pageNumber++; // Tăng số trang cho lần gọi tiếp theo
        }

        return allMenus;
    } catch (error) {
        console.error('Error fetching all menus:', error);
        throw error;
    }
};