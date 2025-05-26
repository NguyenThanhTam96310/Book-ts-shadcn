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