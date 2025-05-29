'use client';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { MenuIcon } from "lucide-react"; // Loại bỏ ChevronDown, ChevronUp vì không sử dụng
import { useEffect, useState } from "react";
import Link from "next/link";
import { TopicRes } from "@/features/topics/services/type";
import { fetchTopics } from "@/features/topics/services/topic.service";
import { useRouter, useSearchParams } from "next/navigation";

export default function TopicMenu() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [topics, setTopics] = useState<TopicRes[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await fetchTopics();
                setTopics(data);
            } catch (error) {
                console.error("Lỗi khi load Menu:", error);
            }
        };

        loadTopics();
    }, []);

    const toggleDropdown = (menuId: string) => {
        setOpenDropdown(openDropdown === menuId ? null : menuId);
    };

    const handleTopicClick = (topicId: string) => {
        // Tạo query string mới với topicId
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.set("topicId", topicId);
        router.push(`/post?${params.toString()}`, { scroll: false }); // Cập nhật URL mà không reload trang
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 bg-white shadow-lg">
            <div className="relative bg-white">
                {/* ---------- Desktop Menu ---------- */}
                <div className="hidden md:flex items-center py-3 border-b border-gray-200">
                    <Menubar className="border-0 p-0">
                        <MenubarMenu>
                            <MenubarTrigger
                                onClick={() => handleTopicClick("newPost")}
                                className="flex items-center gap-2 text-gray-800 text-base font-semibold hover:text-orange-600 transition-colors group"
                            >
                                Mới nhất
                            </MenubarTrigger>
                        </MenubarMenu>
                        {topics.map((topic) => (
                            <MenubarMenu key={topic.topicId}>
                                <MenubarTrigger
                                    onClick={() => handleTopicClick(String(topic.topicId))}
                                    className="flex items-center gap-2 text-gray-800 text-base font-semibold hover:text-orange-600 transition-colors group"
                                >
                                    {topic.topicName}
                                </MenubarTrigger>
                            </MenubarMenu>
                        ))}
                    </Menubar>
                </div>
                {/* ---------- Mobile Toggle ---------- */}
                <div className="md:hidden px-4 py-3 flex items-center">
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="focus:outline-none">
                        <MenuIcon className="w-6 h-6 text-gray-800" />
                    </button>
                </div>

                {/* ---------- Mobile Menu ---------- */}
                {showMobileMenu && (
                    <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50 px-4 py-4 space-y-3 text-sm">
                        <div className="border-t border-gray-200 pt-2 first:border-t-0 first:pt-0">
                            <button
                                onClick={() => handleTopicClick("newPost")}
                                className="w-full flex items-center justify-between py-2 text-gray-800 font-medium"
                            >
                                <span>Mới nhất</span>
                            </button>
                        </div>
                        {topics.map((topic) => (
                            <div key={topic.topicId} className="border-t border-gray-200 pt-2 first:border-t-0 first:pt-0">
                                <button
                                    onClick={() => handleTopicClick(String(topic.topicId))}
                                    className="w-full flex items-center justify-between py-2 text-gray-800 font-medium"
                                >
                                    <span>{topic.topicName}</span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openDropdown === String(topic.topicId) ? 'max-h-96' : 'max-h-0'}`}
                                >
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}