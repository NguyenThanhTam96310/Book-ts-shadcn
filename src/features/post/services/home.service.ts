
import { BannerItem } from "@/features/banner/services/type"
import axiosInstance from "@/lib/api/Config"

const API = process.env.NEXT_PUBLIC_API

export async function fetchBanners(): Promise<BannerItem[]> {
    const res = await axiosInstance.get<{
        content: BannerItem[]
    }>(`${API}/public/banners`, {
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