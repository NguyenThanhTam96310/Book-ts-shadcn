"use client";

import ScrollToTop from "@/components/atoms/ScrollToTop";
import { SessionProvider } from "next-auth/react";



export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <ScrollToTop />
            <SessionProvider>
                {children}
            </SessionProvider>
        </div>
    );
}