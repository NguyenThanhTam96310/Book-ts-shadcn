import { z } from "zod";

export const orderSchema = z.object({
    order: z.object({
        userId: z.number().optional(),
        email: z.string().email("Email không hợp lệ"),
        deliveryName: z.string().min(3, "Vui lòng nhập họ tên"),
        deliveryPhone: z.string().min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
        address: z.object({
            ward: z.string().min(1, "Vui lòng nhập tên phường/xã"),
            buildingName: z.string().min(1, "Vui lòng nhập tên tòa nhà"),
            city: z.string().min(1, "Vui lòng nhập tên thành phố"),
            district: z.string().min(1, "Vui lòng nhập tên quận/huyện"),
            country: z.string().min(1, "Vui lòng nhập tên quốc gia"),
            pincode: z.string().min(1, "Mã bưu điện không hợp lệ"),
            cityCode: z.string(),
            districtCode: z.string(),
            wardCode: z.string(),
        }),
        payment: z.object({
            paymentMethod: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
        }),
        freeship: z
            .object({
                promotionCode: z.string().min(1, "Vui lòng nhập mã khuyến mãi"),
            })
            .optional(),
    }),
    productQuantities: z.array(
        z.object({
            productId: z.number().min(1, "Mã sản phẩm không hợp lệ"),
            quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
        })
    ),
    productIds: z.array(z.number()).optional()
});

export type PaymentBodyType = z.TypeOf<typeof orderSchema>;

export const OrderOTPResSchema = z.object({
    orderId: z.string().min(1),
    email: z.string().email().min(1),
    code: z.string().min(6, { message: "Mã OTP phải có ít nhất 6 ký tự." }),
    deliveryPhone: z.string().min(1),
    type: z.string(),
    orderCode: z.string()
});

export type OrderOTPRes = z.infer<typeof OrderOTPResSchema>;

export const VnPayResSchema = z.object({
    status: z.string(),
    message: z.string(),
    url: z.string()
});
export type VnPayRes = z.infer<typeof VnPayResSchema>;
