import { z } from "zod";

export const ContactSchema = z.object({
    title: z.string().min(1, { message: "Họ & tên là bắt buộc" }),
    mobileNumber: z.string().min(10, { message: "Số điện thoại không hợp lệ" }).max(11),
    email: z.string().email({ message: "Email không hợp lệ" }),
    content: z.string().min(1, { message: "Nội dung là bắt buộc" }),
})
export type ContactSchemaType = z.TypeOf<typeof ContactSchema>
