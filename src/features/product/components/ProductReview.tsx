"use client"
import ReviewItem from "@/components/organisms/ReviewItem/ReviewItem"
import ReviewForm from "@/features/review/components/ReviewForm"
import { fetchAllReview, fetchReviewsByStar } from "@/features/review/services/review.service"
import { ReviewProps } from "@/features/review/services/type"
import { useEffect, useState } from "react"

type ProductReviewProps = {
    productId: string | number
}

type TabType = 'all' | 'media' | 'star'

const ProductReview = ({ productId }: ProductReviewProps) => {
    const [reviews, setReviews] = useState<ReviewProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<TabType>('all')
    const [selectedRating, setSelectedRating] = useState<number | null>(null)

    useEffect(() => {
        const loadReviews = async () => {
            setLoading(true)
            setError(null)
            try {
                let reviewsData: ReviewProps[] = []
                if (activeTab === 'all') {
                    // Lấy tất cả đánh giá (isImage = false để lấy tất cả)
                    reviewsData = await fetchAllReview(Number(productId), false)
                } else if (activeTab === 'media') {
                    // Lấy đánh giá có hình ảnh (isImage = true)
                    reviewsData = await fetchAllReview(Number(productId), true)
                } else if (activeTab === 'star' && selectedRating) {
                    // Lấy đánh giá theo sao
                    reviewsData = await fetchReviewsByStar(Number(productId), selectedRating)
                } else if (activeTab === 'star' && !selectedRating) {
                    // Nếu đang ở tab star nhưng chưa chọn sao, lấy tất cả để hiển thị số lượng
                    reviewsData = await fetchAllReview(Number(productId), false)
                }

                console.log('Reviews loaded:', reviewsData)
                setReviews(reviewsData)
            } catch (error) {
                console.error("Lỗi khi tải đánh giá:", error)
                setError("Không thể tải đánh giá")
            } finally {
                setLoading(false)
            }
        }

        loadReviews()
    }, [productId, activeTab, selectedRating])

    // State để lưu số lượng cho từng tab (để tránh gọi API nhiều lần)
    const [tabCounts, setTabCounts] = useState({
        all: 0,
        media: 0,
        star: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    })

    // Load số lượng cho các tab khi component mount
    useEffect(() => {
        const loadTabCounts = async () => {
            try {
                // Lấy tất cả đánh giá để đếm
                const allReviews = await fetchAllReview(Number(productId), false)
                const mediaReviews = await fetchAllReview(Number(productId), true)

                // Đếm đánh giá theo sao
                const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                for (let star = 1; star <= 5; star++) {
                    try {
                        const starReviews = await fetchReviewsByStar(Number(productId), star)
                        starCounts[star as keyof typeof starCounts] = starReviews.length
                    } catch (error) {
                        console.error(`Lỗi khi đếm đánh giá ${star} sao:`, error)
                    }
                }

                setTabCounts({
                    all: allReviews.length,
                    media: mediaReviews.length,
                    star: starCounts
                })
            } catch (error) {
                console.error("Lỗi khi tải số lượng đánh giá:", error)
            }
        }

        loadTabCounts()
    }, [productId])

    // Tabs configuration
    const tabs = [
        { key: 'all' as TabType, label: 'Tất cả', count: tabCounts.all },
        { key: 'media' as TabType, label: 'Có hình ảnh/Video', count: tabCounts.media },
        { key: 'star' as TabType, label: 'Theo sao', count: tabCounts.all }
    ]

    const renderStarFilter = () => {
        if (activeTab !== 'star') return null

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setSelectedRating(null)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedRating === null
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Tất cả ({tabCounts.all})
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                    <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${selectedRating === star
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <span>{star}</span>
                        <span className="text-yellow-400">★</span>
                        <span>({tabCounts.star[star as keyof typeof tabCounts.star]})</span>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm space-y-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
                Đánh giá sản phẩm
            </h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key)
                                if (tab.key !== 'star') {
                                    setSelectedRating(null)
                                }
                            }}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </nav>
            </div>

            {/* Star Filter for Rating Tab */}
            {renderStarFilter()}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="ml-3 text-gray-500">Đang tải đánh giá...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && reviews.length === 0 && !error && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {activeTab === 'all' && 'Chưa có đánh giá nào.'}
                        {activeTab === 'media' && 'Chưa có đánh giá nào với hình ảnh/video.'}
                        {activeTab === 'star' && selectedRating && `Chưa có đánh giá ${selectedRating} sao.`}
                        {activeTab === 'star' && !selectedRating && 'Chọn số sao để xem đánh giá.'}
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {!loading && reviews.length > 0 && (
                <div className="space-y-6">
                    <div className="text-sm text-gray-600 mb-4">
                        Hiển thị {reviews.length} đánh giá
                        {activeTab === 'media' && ' có hình ảnh/video'}
                        {activeTab === 'star' && selectedRating && ` ${selectedRating} sao`}
                    </div>

                    {reviews.map((review) => (
                        <ReviewItem key={review.reviewId} review={review} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProductReview