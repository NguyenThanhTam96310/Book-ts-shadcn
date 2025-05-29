import MenuProfile from "@/features/profile/components/MenuProfile";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <MenuProfile />
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
