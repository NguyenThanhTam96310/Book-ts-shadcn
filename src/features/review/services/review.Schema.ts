import z from "zod";

export const InputReviewBody = z.object({
    reviewId: z.number().optional(),
    orderItemId: z.number().min(1, "ID sản phẩm phải lớn hơn 0"),
    fullName: z
        .string()
        .min(5, "Vui lòng nhập họ tên ít nhất có 5 ký tự")
        .max(50, "Vui lòng nhập họ tên không quá 50 ký tự"),
    avatar: z.string().optional(), // Thường optional vì bạn có thể lấy avatar từ user profile
    images: z
        .array(
            z.object({
                fileName: z.string(),
                type: z.literal("IMAGE"),
            })
        )
        .optional(), // Có thể có hoặc không ảnh
    star: z.number().min(1, "Số sao đánh giá phải từ 1").max(5, "Số sao đánh giá tối đa là 5"),
    comment: z.string().min(5, "Vui lòng nhập nội dung ít nhất 5 ký tự")
});


export type InputReviewBodyType = z.infer<typeof InputReviewBody>;
