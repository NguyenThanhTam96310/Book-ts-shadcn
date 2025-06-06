import z from 'zod'
export const EditPassWordBody = z.object({
    currentPassword: z.string().min(1, "Mật khẩu phải từ 1 ký tự"),
    newPassword: z.string().min(1, "Mật khẩu phải từ 1 ký tự"),
    confirmPassword: z.string().min(1).max(100),
}).strict()
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
        if (confirmPassword !== newPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu không khớp',
                path: ['confirmPassword']
            })
        }
    })
export type EditPasswordType = z.TypeOf<typeof EditPassWordBody>
export const EditAddressBody = z.object({
    userId: z.number().min(1),
    fullName: z.string().min(3, "Họ tên phải từ 3 ký tự"),
    mobileNumber: z.string().min(10, "Số điện thoại phải 10 ký tự").max(10, "Số điện thoại phải 10 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    address: z.object({
        ward: z.string().min(3, "Phường/xã phải từ 3 ký tự"),
        buildingName: z.string().min(5, "địa chỉ phải từ 5 ký tự"),
        city: z.string().min(3, "Thành phố phải từ 3 ký tự"),
        district: z.string().min(3, "Quận/huyện phải từ 3 ký tự"),
        country: z.string().min(3, "Đất nước phải từ 3 ký tự"),
    })
})
export type EditAddressBodyType = z.TypeOf<typeof EditAddressBody>