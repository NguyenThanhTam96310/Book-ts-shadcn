import MenuProfile from "@/features/profile/components/MenuProfile";
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Tài khoản của tôi - Bookstore",
    description: "Thông tin tài khoản.",
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <MenuProfile />
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden bg-gray-100">
                {children}
            </main>
        </div>
    );
}
