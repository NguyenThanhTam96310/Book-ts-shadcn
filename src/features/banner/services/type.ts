export interface BannerItem {
    bannerId: number
    bannerName: string
    image: string
    link?: string
    position?: "TOP" | "MIDDLE" | "BOTTOM"
    status: boolean
}
export interface SideBanner {
    banner_id: number
    banner_name?: string
    imageUrl: string
    link?: string
}