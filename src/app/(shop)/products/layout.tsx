

import * as React from "react";
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Sản phẩm - Bookstore",
    description: "Login to your Bookstore account.",
};


export default function ProductLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
        </div>
    );
}
