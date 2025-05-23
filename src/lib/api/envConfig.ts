import { z } from "zod"

const configSchema = z.object({
    NEXT_PUBLIC_API: z.string(),
    // NEXT_PUBLIC_FILE: z.string(),
    // NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    // NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: z.string(),
    // NEXTAUTH_URL: z.string(),
    // NEXTAUTH_SECRET: z.string(),
    NEXT_PUBLIC_GHN_TOKEN: z.string(),
    NEXT_PUBLIC_GHN_SHOP_ID: z.string(),
})
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
    // NEXT_PUBLIC_FILE: process.env.NEXT_PUBLIC_FILE,
    // NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    // NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_GHN_TOKEN: process.env.NEXT_PUBLIC_GHN_TOKEN,
    NEXT_PUBLIC_GHN_SHOP_ID: process.env.NEXT_PUBLIC_GHN_SHOP_ID
})
if (!configProject.success) {
    console.error(configProject.error.issues)
    throw new Error('Các giá trị trong .env không hợp lệ')
}
const envConfig = configProject.data
export default envConfig