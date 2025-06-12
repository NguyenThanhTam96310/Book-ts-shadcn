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
    fullName: z.string().min(5, "Vui lòng nhập họ tên ít nhất có 5 ký tự").max(50, "Vui lòng nhập họ tên không quá 50 ký tự"),
    mobileNumber: z.string().min(10, "Số điện thoại phải 10 ký tự").max(11, "Số điện thoại phải 10 ký tự").regex(/^\d+$/, { message: "Số điện thoại giao hàng chỉ được chứa chữ số" }),
    email: z.string().email("Email không hợp lệ"),
    address: z.object({
        ward: z.string().min(3, "Vui lòng nhập thông tin phường/xã"),
        buildingName: z.string().min(5, "Vui lòng nhập địa chỉ ít nhất có 5 ký tự"),
        city: z.string().min(3, "Vui lòng nhập thông tin thành phố"),
        district: z.string().min(3, "Vui lòng nhập thông tin quận/huyện"),
        country: z.string().min(3, "Vui lòng nhập thông tin quốc gia"),
    })
})
export type EditAddressBodyType = z.TypeOf<typeof EditAddressBody>