import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { Languages } from "@/types"
import qs from "qs"
import { LanguagesSearchRes } from "./type"
export const fetchAllLanguages = async (): Promise<Languages[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/languages`, {
        params: {
            status: true,
            pageNumber: 1,
            sortBy: "languageId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: Languages[] }
    return data.content
}
export const fetchAllLanguageByName = async (keyword: string): Promise<any> => {
    const response = await axiosInstance.get(
        `${envConfig.NEXT_PUBLIC_API}/public/languages`, {
        params: {
            keyword: keyword,
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: 'languageId',
            sortOrder: "asc"
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat'
            });
        }
    });
    const data = response.data as { content: LanguagesSearchRes[] };
    return data.content;
}