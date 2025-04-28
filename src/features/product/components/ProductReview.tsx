"use client"

import ReviewItem from "@/components/organisms/ReviewItem/ReviewItem"
import ReviewForm from "@/features/review/components/ReviewForm"
import { useState } from "react"

type ReviewProps = {
    review_id: number
    avatar: string
    comment: string
    created_at: string
    full_name: string
    star: number
    order_id: number
    product_id: number
}

const ProductReview = () => {
    const [reviews, setReviews] = useState<ReviewProps[]>([
        {
            review_id: 1,
            avatar: "/images/avatars/avatar.jpg",
            comment: "Sản phẩm rất tốt!",
            created_at: "25/04/2025",
            full_name: "Nguyễn Văn A",
            star: 5,
            order_id: 1001,
            product_id: 2002,
        }
    ])
    return (
        <div className="p-4 bg-white rounded shadow-sm space-y-8">
            <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
                Đánh giá sản phẩm
            </h1>
            <ReviewForm />
            <div className="space-y-6">
                {reviews.map((review) => (
                    <ReviewItem key={review.review_id} review={review} />
                ))}
            </div>
        </div>
    );
}

export default ProductReview