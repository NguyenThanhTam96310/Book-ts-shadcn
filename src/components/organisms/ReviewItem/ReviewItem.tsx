import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ReviewProps } from "@/features/review/services/type"
import { Star } from "lucide-react"
import Image from "next/image"

const ReviewItem = ({ review }: { review: ReviewProps }) => {
    return (
        <div className="flex gap-4 border-b border-gray-200 py-6 last:border-b-0">
            <div className="flex-shrink-0 flex flex-col items-center text-center">
                <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-sm font-medium">
                        {review.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <time className="text-xs text-gray-500 mt-2 whitespace-nowrap">{review.createdAt}</time>
            </div>

            <div className="flex-1 min-w-0">
                <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 text-base mb-1">{review.fullName}</h4>
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                            <Star
                                key={index}
                                className={`w-4 h-4 ${index < review.star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">({review.star}/5)</span>
                    </div>
                </div>

                <div className="text-gray-700 leading-relaxed mb-3">{review.comment}</div>

                {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {review.images.map((img: any, index: number) => (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                            >
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_FILE}${img.fileName}`}
                                    alt={`Review image ${index + 1} for ${review.reviewId}`}
                                    width={80}
                                    height={80}
                                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewItem
