import { CategoriesRes, CategoryItemProps } from "@/features/category/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export const fetchCategories = async (): Promise<CategoryItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/categories`, {
        params: {
            status: true,
            type: "parent",
            pageNumber: 1,
            pageSize: 4,
            sortBy: "categoryId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: CategoryItemProps[] }
    return data.content
}
export const fetchCategoryById = async (categoryId: number): Promise<CategoryItemProps> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/categories/${categoryId}`)
    return response.data as CategoryItemProps
}
export const fetchCategoriesFooter = async (): Promise<CategoryItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/categories`, {
        params: {
            status: true,
            type: "parent",
            pageNumber: 1,
            pageSize: 5,
            sortBy: "categoryId",
            sortOrder: "asc"
        }
    })

    const data = response.data as { content: CategoryItemProps[] }
    return data.content
}
// export const fetchAllCategories = async (): Promise<CategoryItemProps[]> => {
//     const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/categories`, {
//         params: {
//             status: true,
//             type: "parent",
//             pageNumber: 0,
//             sortBy: "categoryId",
//             sortOrder: "asc"
//         }
//     })

//     const data = response.data as { content: CategoryItemProps[] }
//     return data.content
// }
export const fetchAllCategories = async (): Promise<CategoryItemProps[]> => {
    let allCate: CategoryItemProps[] = [];
    let pageNumber = 1;
    const pageSize = 5; // Giữ nguyên pageSize như API hiện tại
    let lastPage = false;

    try {
        while (!lastPage) {
            const response = await axiosInstance.get<CategoriesRes>(
                `${envConfig.NEXT_PUBLIC_API}/public/categories`,
                {
                    params: {
                        status: true,
                        type: 'parent',
                        pageNumber,
                        pageSize,
                        sortBy: 'categoryId',
                        sortOrder: 'asc',
                    },
                }
            );

            const data = response.data;
            allCate = [...allCate, ...data.content]; // Gộp dữ liệu từ trang hiện tại
            lastPage = data.lastPage; // Kiểm tra nếu là trang cuối
            pageNumber++; // Tăng số trang cho lần gọi tiếp theo
        }

        return allCate;
    } catch (error) {
        console.error('Error fetching all menus:', error);
        throw error;
    }
};
export const getCategoryIdFromSlug = async (slug: string): Promise<number | undefined> => {
    try {
        const response = await axiosInstance.get<{ categoryId?: number }>(
            `${envConfig.NEXT_PUBLIC_API}/public/categories/slug/${slug}`
        );
        return response.data?.categoryId;
    } catch (error) {
        console.error(`Lỗi khi fecth categoryId sang slug ${slug}:`, error);
        return undefined;
    }
};

// Hàm lấy slug từ categoryId qua API
export const getSlugFromCategoryId = async (categoryId: number): Promise<string | undefined> => {
    try {
        const response = await axiosInstance.get<{ slug?: string }>(
            `${envConfig.NEXT_PUBLIC_API}/public/categories/${categoryId}`
        );
        return response.data?.slug;
    } catch (error) {
        console.error(`Lỗi khi fecth slug sang id ${categoryId}:`, error);
        return undefined;
    }
};
export const fetchAllCategoriesByName = async (categoryName: string): Promise<CategoryItemProps[]> => {
    let allChildren: CategoryItemProps[] = [];
    let pageNumber = 1;
    const pageSize = 5; // Giữ nguyên pageSize như API hiện tại
    let lastPage = false;

    try {
        while (!lastPage) {
            const response = await axiosInstance.get<CategoriesRes>(
                `${envConfig.NEXT_PUBLIC_API}/public/categories`,
                {
                    params: {
                        keyword: categoryName,
                        status: true,
                        type: 'parent',
                        pageNumber,
                        pageSize,
                        sortBy: 'categoryId',
                        sortOrder: 'asc',
                    },
                }
            );

            const data = response.data;
            // Lấy childrens từ tất cả danh mục cha trong trang hiện tại
            const children = data.content.flatMap((category) => category.childrens || []);
            allChildren = [...allChildren, ...children];
            lastPage = data.lastPage; // Kiểm tra nếu là trang cuối
            pageNumber++; // Tăng số trang
        }

        return allChildren;
    } catch (error) {
        console.error('Error fetching all menus:', error);
        throw error;
    }
};