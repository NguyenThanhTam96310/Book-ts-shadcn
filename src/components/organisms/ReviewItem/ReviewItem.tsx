// components/organisms/ReviewItem.tsx

import React from "react"

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

const ReviewItem = ({ review }: { review: ReviewProps }) => {
    return (
        <div className="flex gap-4 border-b py-4">
            <img src={review.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
                <div className="font-semibold">{review.full_name}</div>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < review.star ? "text-yellow-400" : "text-gray-300"}>
                            ★
                        </span>
                    ))}
                </div>
                <div className="text-gray-600 text-sm">{review.created_at}</div>
                <div className="mt-2">{review.comment}</div>
            </div>
        </div>
    )
}

export default ReviewItem
