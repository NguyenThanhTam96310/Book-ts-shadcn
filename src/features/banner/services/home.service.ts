
import { BannerItem } from "@/features/banner/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"



export async function fetchBanners(): Promise<BannerItem[]> {
    const res = await axiosInstance.get<{
        content: BannerItem[]
    }>(`${envConfig.NEXT_PUBLIC_API}/public/banners`, {
        params: {
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "bannerId",
            sortOrder: "asc",
        },
    })
    const data = res.data as { content: BannerItem[] }
    return data.content
}   