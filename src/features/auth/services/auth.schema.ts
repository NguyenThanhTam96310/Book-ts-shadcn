import z from 'zod'

// export const RegisterBody = z
//     .object({
//         name: z.string().trim().min(2).max(256),
//         email: z.string().email(),
//         password: z.string().min(6).max(100),
//         confirmPassword: z.string().min(6).max(100)
//     })
//     .strict()
//     .superRefine(({ confirmPassword, password }, ctx) => {
//         if (confirmPassword !== password) {
//             ctx.addIssue({
//                 code: 'custom',
//                 message: 'Mật khẩu không khớp',
//                 path: ['confirmPassword']
//             })
//         }
//     })

// export type RegisterBodyType = z.TypeOf<typeof RegisterBody>
export const RegisterBody = z.object({
    fullName: z.string().min(3, "Họ tên phải từ 3 ký tự"),
    mobileNumber: z.string().min(10, "Số điện thoại phải 10 ký tự").max(10, "Số điện thoại phải 10 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    username: z.string().min(3, "Tên đăng nhập phải từ 3 ký tự"),
    password: z.string().min(1, "Mật khẩu phải từ 1 ký tự"),
    confirmPassword: z.string().min(1, "Mật khẩu phải từ 1 ký tự").max(100),
    address: z.object({
        ward: z.string(),
        buildingName: z.string(),
        city: z.string(),
        district: z.string(),
        country: z.string(),
    }),
}).strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu không khớp',
                path: ['confirmPassword']
            })
        }
    })
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>
export const LoginGoogleResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
    user: z.object({
        id: z.number(),
        email: z.string().email(),
        name: z.string().optional(),
        role: z.string().optional(),
    }),
});
export type LoginGoogleResponse = z.infer<typeof LoginGoogleResponseSchema>;


export const LoginGoogleResSchema = z.object({
    credential: z.string(),
    clientId: z.string(),
    select_by: z.string(),
});
export type LoginGoogleRes = z.infer<typeof LoginGoogleResSchema>;



export const GoogleCredentialSchema = z.object({
    credential: z.string(),
    clientId: z.string(),
    select_by: z.string(),
});
export type GoogleCredential = z.infer<typeof GoogleCredentialSchema>;
// export const RegisterRes = z.object({
//     data: z.object({
//         token: z.string(),
//         expiresAt: z.string(),
//         account: z.object({
//             id: z.number(),
//             name: z.string(),
//             email: z.string()
//         })
//     }),
//     message: z.string()
// })
export const RegisterRes = z.object({
    message: z.string(),
    status: z.boolean()
});
export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const LoginBody = z
    .object({
        username: z.string().min(2, "Tên người dùng tối thiểu 3 ký tự").max(50),
        password: z.string().min(1, "Mật khẩu tối thiểu 1 ký tự").max(256),
    })
    .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>
export const emailVerifySchema = z.object({
    result: z.boolean()
});
// export const LoginRes = RegisterRes

// export type LoginResType = z.TypeOf<typeof LoginRes>
// export const SlideSessionBody = z.object({}).strict()

// export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
// export const SlideSessionRes = RegisterRes

// export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>