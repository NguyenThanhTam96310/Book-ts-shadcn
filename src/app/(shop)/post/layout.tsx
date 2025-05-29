import TopicMenu from "@/features/topics/components/TopicMenu";

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
