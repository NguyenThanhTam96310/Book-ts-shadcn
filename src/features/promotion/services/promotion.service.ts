
import { PromotionItemRes } from "@/features/promotion/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { callApi } from "@/lib/api/Service"


export async function fetchPromotions(): Promise<PromotionItemRes[]> {
    const res = await axiosInstance.get<{
        content: PromotionItemRes[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/promotions`, {
        params: {
            status: true,
            pageNumber: 1,
            pageSize: 5,
            sortBy: "promotionId",
            sortOrder: "desc",
        },
    })
    const data = res.data as { content: PromotionItemRes[] }
    return data.content
}   