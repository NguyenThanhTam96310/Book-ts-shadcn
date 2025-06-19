import { AuthorSearchRes } from "@/features/author/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { Publisher } from "@/types"
import qs from "qs"
export const fetchPublishersForm = async (): Promise<PublisherShowcaseProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            status: true,
            pageNumber: 1,
            pageSize: 20,
            sortBy: "publisherId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: PublisherShowcaseProps[] }
    return data.content
}
export const fetchAllPublishers = async (): Promise<Publisher[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            status: true,
            pageNumber: 1,
            sortBy: "publisherId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: Publisher[] }
    return data.content
}
export const fetchSearchPublisherName = async (keyword: string): Promise<any> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/publishers`, {
        params: {
            keyword: keyword,
            status: true,
            pageNumber: 1,
            pageSize: 5,
            sortBy: "publisherId",
            sortOrder: "asc"
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat'
            });
        }
    });
    const data = response.data as { content: PublisherShowcaseProps[] };
    return data.content;
}