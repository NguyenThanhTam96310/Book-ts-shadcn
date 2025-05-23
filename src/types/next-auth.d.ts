import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken: string; // Chỉnh sửa từ `z.string` thành `string`
        user: {
            id: number;
            email: string;
            name: string;
            role?: string;
        };
    }
}
