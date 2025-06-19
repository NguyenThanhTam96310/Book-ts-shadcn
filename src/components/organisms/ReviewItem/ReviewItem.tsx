"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ReviewProps } from "@/features/review/services/type"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from '@/components/ui/card'
import { useRef, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog";
import { DialogTitle } from "@/components/ui/dialog";
const ReviewItem = ({ review }: { review: ReviewProps }) => {
    const [open, setOpen] = useState(false);
    const [imageZoomOpen, setImageZoomOpen] = useState(false); // Trạng thái cho Dialog phóng to ảnh
    const [isExpanded, setIsExpanded] = useState(false)
    const [showReadMore, setShowReadMore] = useState(false)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0) // Thêm state cho chỉ số hình ảnh
    const handleImageClick = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl)
        setSelectedImageIndex(index) // Cập nhật chỉ số hình ảnh
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    // Hàm chuyển hình ảnh tiếp theo
    const nextImage = () => {
        if (review.images && review.images.length > 1) {
            const nextIndex = (selectedImageIndex + 1) % review.images.length;
            setSelectedImageIndex(nextIndex);
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${review.images[nextIndex].fileName}`);
        }
    }

    // Hàm chuyển hình ảnh trước đó
    const prevImage = () => {
        if (review.images && review.images.length > 1) {
            const prevIndex = selectedImageIndex === 0 ? review.images.length - 1 : selectedImageIndex - 1;
            setSelectedImageIndex(prevIndex);
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${review.images[prevIndex].fileName}`);
        }
    }
    return (
        <div className="flex gap-4 border-b border-gray-200 py-6 last:border-b-0">
            <div className="flex-shrink-0 flex flex-col items-center text-center">
                <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-sm font-medium">
                        {review.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <time className="text-xs text-gray-500 mt-2 whitespace-nowrap">  {formatDate(review.createdAt)}</time>
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
                                    onClick={() => {
                                        handleImageClick(`${process.env.NEXT_PUBLIC_FILE}${img.fileName}`, index);
                                        setImageZoomOpen(true);
                                    }}
                                    height={80}
                                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                        ))}
                        {imageZoomOpen && (
                            <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Dialog.Root open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
                                            <Dialog.Portal>
                                                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                                                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[550px] h-[650px] max-w-[90%] max-h-[90%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                                                    <DialogTitle>
                                                        <span className="sr-only">Ảnh đại diện phóng to</span>
                                                    </DialogTitle>
                                                    <button
                                                        onClick={() => setImageZoomOpen(false)}
                                                        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl"
                                                        aria-label="Đóng"
                                                    >
                                                        ×
                                                    </button>
                                                    {/* Nút chuyển hình trước */}
                                                    {review.images && review.images.length > 1 && (
                                                        <button
                                                            onClick={prevImage}
                                                            className="absolute left-1 top-1/2 transform -translate-y-1/2 text-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-10"
                                                            aria-label="Hình ảnh trước"
                                                        >
                                                            <ChevronLeft className="w-15 h-15" />
                                                        </button>
                                                    )}
                                                    {/* Hình ảnh chính */}
                                                    <img
                                                        src={selectedImage || '/placeholder.png'}
                                                        alt="Zoomed Avatar"
                                                        className="w-full h-full object-contain"
                                                    />
                                                    {/* Nút chuyển hình sau */}
                                                    {review.images && review.images.length > 1 && (
                                                        <button
                                                            onClick={nextImage}
                                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 v bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-10"
                                                            aria-label="Hình ảnh tiếp theo"
                                                        >
                                                            <ChevronRight className="w-15 h-15" />
                                                        </button>
                                                    )}
                                                </Dialog.Content>
                                            </Dialog.Portal>
                                        </Dialog.Root>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewItem
