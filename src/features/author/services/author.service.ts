import { AuthorLastPage, AuthorRes, AuthorSearchRes } from "@/features/author/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import qs from "qs"
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
export const fetchAuthors = async (): Promise<AuthorRes[]> => {
    let allAuthor: AuthorRes[] = [];
    let pageNumber = 1;
    const pageSize = 20; // Giữ nguyên pageSize như API hiện tại
    let lastPage = false;

    try {
        while (!lastPage) {
            const response = await axiosInstance.get<AuthorLastPage>(
                `${envConfig.NEXT_PUBLIC_API}/public/authors`,
                {
                    params: {
                        status: true,
                        pageNumber,
                        pageSize,
                        sortBy: 'authorId',
                        sortOrder: 'asc',
                    },
                }
            );

            const data = response.data;
            allAuthor = [...allAuthor, ...data.content]; // Gộp dữ liệu từ trang hiện tại
            lastPage = data.lastPage; // Kiểm tra nếu là trang cuối
            pageNumber++; // Tăng số trang cho lần gọi tiếp theo
        }

        return allAuthor;
    } catch (error) {
        console.error('Error fetching all menus:', error);
        throw error;
    }
};
export const fetchSearchAuthorName = async (keyword: string): Promise<any> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/authors?status=true`, {
        params: {
            keyword: keyword,
            status: true,
            pageNumber: 1,
            pageSize: 5,
            sortBy: "authorId",
            sortOrder: "asc"
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat' // authorIds=1&authorIds=2
            });
        }
    });

    const data = response.data as { content: AuthorSearchRes[] };
    return data.content;
}