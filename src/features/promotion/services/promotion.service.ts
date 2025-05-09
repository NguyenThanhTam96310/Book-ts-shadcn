
import { PostItemProps } from "@/features/post/services/type"
import { PromotionItemProps } from "@/features/promotion/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"


export async function fetchPromotions(): Promise<PromotionItemProps[]> {
    const res = await axiosInstance.get<{
        content: PromotionItemProps[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/promotions`, {
        params: {
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "promotionId",
            sortOrder: "desc",
        },
    })
    const data = res.data as { content: PromotionItemProps[] }
    return data.content
}   