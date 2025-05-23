
import { login, loginGoogleLocal } from '@/features/auth/services/auth.service';
import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),


        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: '',
                    type: 'text',
                },
                password: {
                    label: '',
                    type: 'text',
                },
                otp: {
                    label: '',
                    type: 'text',
                },
            },
            async authorize(credentials) {
                try {
                    if (credentials?.email && credentials?.password) {
                        const res = await login({
                            username: credentials.email,
                            password: credentials.password

                        });
                        return res;
                    }
                    return null;
                } catch (err: any) {
                    console.error('Failed authorized ', err);
                    throw new Error(err.message);
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: '/login',
        error: '/error',
    },
    callbacks: {
        async jwt({ token, trigger, session, user, profile, account }: any) {
            if (trigger === 'update') {
                return { ...token, user: session.user };
            }
            // console.log('1.user', user);
            // console.log('2.profile', profile);
            // console.log('3.account', account);

            let resLoginBySocial: any = null;
            let currentUser: any = null;

            if (account?.id_token && user?.email) {
                try {
                    resLoginBySocial = await loginGoogleLocal(account.id_token);
                    token.accessToken = resLoginBySocial["jwt-token"];

                    token.user = resLoginBySocial.user || {
                        email: user.email,
                        name: user.name,
                    };

                } catch (error) {
                    console.error("JWT loginGoogleLocal error:", error);
                    throw new Error("Login backend thất bại");
                }
            }

            return token;
        },

        async session({ session, token }: { session: Session; token: any }) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        },

        async signIn() {
            // console.log('user::', user);
            try {
                return true;
            } catch (err: any) {
                // console.log('err', err);
                throw new Error();
            }
        },
        // async redirect({ url, baseUrl }) {
        //     return baseUrl; // Tự động về trang chủ
        // },
    },
};
