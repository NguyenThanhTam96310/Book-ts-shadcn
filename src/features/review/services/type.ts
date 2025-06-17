import { Images } from "@/types"

export type ReviewProps = {
    reviewId: number
    avatar: string
    comment: string
    created_at: string
    fullName: string
    star: number
    images: Images[]
    createdAt: string
}

export interface ReviewRes {
    content: ReviewProps[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}
export interface StarRes {
    totalReviews: number;
    averageStar: number;
}