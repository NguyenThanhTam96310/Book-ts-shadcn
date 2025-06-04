import TopicMenu from "@/features/topics/components/TopicMenu";
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Tin tức - Bookstore",
    description: "Tin tức trên Bookstore.",
};

export default function PostLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-gray-100">
            <TopicMenu />
            {children}
        </div>
    );
}
