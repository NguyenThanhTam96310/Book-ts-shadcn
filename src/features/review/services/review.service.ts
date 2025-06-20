import { CategoriesRes } from "@/features/category/services/type";
import { InputReviewBodyType } from "@/features/review/services/review.Schema";
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { z } from "zod"
import { ReviewProps, ReviewRes, StarRes } from "./type";
export async function submitReview(
    reviewData: Omit<InputReviewBodyType, "images" | "createdAt" | "updateAt">,
    files: File[]
): Promise<any> {
    try {
        const formData = new FormData();
        formData.append("orderItemId", reviewData.orderItemId.toString());
        // formData.append("fullName", reviewData.fullName);
        formData.append("avatar", reviewData.avatar || "");
        formData.append("star", reviewData.star.toString());
        formData.append("comment", reviewData.comment);
        // formData.append('reviewDTO', JSON.stringify(reviewData));
        files.forEach((file) => {
            formData.append("files", file, file.name);
        })
        const response = await axiosInstance.post(
            `${envConfig.NEXT_PUBLIC_API}/public/reviews/orderItem`,
            formData,
            {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error("Lỗi khi gửi đánh giá:", error);
            throw new Error("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        }
    }
}
export const fetchAllReview = async (productId: number, isImage: boolean): Promise<ReviewProps[]> => {
    try {
        const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/reviews/product/${productId}`, {
            params: {
                productId: productId,
                isImage: isImage,
                pageNumber: 0,
                pageSize: 10,
                sortBy: 'reviewId',
                sortOrder: 'desc',
            },
        });
        const data = response.data as { content: ReviewProps[] };
        return data.content;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error("Lỗi khi gửi đánh giá:", error);
            throw new Error("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        }
    }
};

export const fetchReviewsByStar = async (productId: number, star: number): Promise<ReviewProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/reviews/product/${productId}`, {
        params: {
            productId: productId,
            star: star,
            isImage: false,
            pageNumber: 0,
            pageSize: 10,
            sortBy: 'reviewId',
            sortOrder: 'desc',
        },
    });
    const data = response.data as { content: ReviewProps[] };
    return data.content;
};
export const fetchAverageStarByProductId = async (productId: number): Promise<StarRes> => {
    const response = await axiosInstance.get<StarRes>(`${envConfig.NEXT_PUBLIC_API}/public/reviews/product/${productId}/average-star`);
    return response.data;
};

export const fetchReviewById = async (reviewId: number): Promise<ReviewProps> => {
    try {
        const response = await axiosInstance.get<ReviewProps>(`${envConfig.NEXT_PUBLIC_API}/public/reviews/${reviewId}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error("Lỗi khi get đánh giá:", error);
            throw new Error("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        }
    }
};
export const fetchReviewByOrderItemId = async (orderItemId: number): Promise<ReviewProps | null> => {
    try {
        const response = await axiosInstance.get<ReviewProps>(
            `${envConfig.NEXT_PUBLIC_API}/public/reviews/orderItem/${orderItemId}`
        );
        return response.data; // Có đánh giá → trả về ReviewProps
    } catch {
        return null;
    }
};

export async function editReview(
    reviewData: Omit<InputReviewBodyType, "images" | "createdAt" | "updateAt">,
    files: File[]
): Promise<any> {
    try {
        const formData = new FormData();
        if (reviewData.reviewId !== undefined && reviewData.reviewId !== null) {
            formData.append("reviewId", reviewData.reviewId.toString());
        }
        formData.append("orderItemId", reviewData.orderItemId.toString());
        // formData.append("fullName", reviewData.fullName);
        formData.append("avatar", reviewData.avatar || "");
        formData.append("star", reviewData.star.toString());
        formData.append("comment", reviewData.comment);
        // formData.append('reviewDTO', JSON.stringify(reviewData));
        files.forEach((file) => {
            formData.append("files", file, file.name);
        })
        const response = await axiosInstance.put(
            `${envConfig.NEXT_PUBLIC_API}/public/reviews/orderItem`,
            formData,
            {
                headers: {
                    Accept: "*/*",
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            console.error("Lỗi khi gửi đánh giá:", error);
            throw new Error("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        }
    }
}