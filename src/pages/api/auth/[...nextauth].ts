
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import type { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
//         }),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     callbacks: {
//         async jwt({ token, account, user }) {
//             if (account) {
//                 token.accessToken = account.access_token;
//                 token.idToken = account.id_token;
//             }

//             return token;
//         },
//         async session({ session, token }) {
//             (session as any).accessToken = token.accessToken;
//             (session as any).idToken = token.idToken;

//             return session;
//         },
//     },
// };

// export default NextAuth(authOptions);

import { authOptions } from '@/lib/api/authOptions';
import NextAuth from 'next-auth';

const handler = NextAuth(authOptions);

export default handler;