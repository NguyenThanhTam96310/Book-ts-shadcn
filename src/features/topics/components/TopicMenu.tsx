"use client"

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { MenuIcon, Sparkles, X, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchTopics } from "@/features/topics/services/topic.service"

// Mock data types for demonstration
interface TopicRes {
    topicId: number
    topicName: string
}

export default function TopicMenu() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [topics, setTopics] = useState<TopicRes[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const data = await fetchTopics()
                setTopics(data)
            } catch (error) {
                console.error("Lỗi khi load Menu:", error)
            }
        }

        loadTopics()
    }, [])

    const toggleDropdown = (menuId: string) => {
        setOpenDropdown(openDropdown === menuId ? null : menuId)
    }

    const handleTopicClick = (topicId: string) => {
        // Tạo query string mới với topicId
        const params = new URLSearchParams(searchParams?.toString() ?? "")
        params.set("topicId", topicId)
        router.push(`/post?${params.toString()}`, { scroll: false }) // Cập nhật URL mà không reload trang
        setShowMobileMenu(false) // Close mobile menu after selection
    }

    return (
        <div className="relative">
            {/* Background with gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 shadow-xl">
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* ---------- Desktop Menu ---------- */}
                    <div className="hidden md:flex items-center py-4">
                        <Menubar className="border-0 p-0 bg-transparent">
                            <MenubarMenu>
                                <MenubarTrigger
                                    onClick={() => router.push("/post")}
                                    className="flex items-center gap-2 text-white text-base font-semibold hover:text-yellow-300 transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm group cursor-pointer"
                                >
                                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                                    Mới nhất
                                </MenubarTrigger>
                            </MenubarMenu>
                            {topics.map((topic, index) => (
                                <MenubarMenu key={topic.topicId}>
                                    <MenubarTrigger
                                        onClick={() => handleTopicClick(String(topic.topicId))}
                                        className="flex items-center gap-2 text-white text-base font-semibold hover:text-yellow-300 transition-all duration-300 hover:scale-105 px-4 py-2 rounded-full hover:bg-white/10 backdrop-blur-sm group cursor-pointer"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-yellow-300 transition-colors duration-300"></div>
                                        {topic.topicName}
                                    </MenubarTrigger>
                                </MenubarMenu>
                            ))}
                        </Menubar>
                    </div>

                    {/* ---------- Mobile Toggle ---------- */}
                    <div className="md:hidden px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-bold text-lg">Chủ đề</span>
                        </div>
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                        >
                            {showMobileMenu ? <X className="w-6 h-6 text-white" /> : <MenuIcon className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ---------- Mobile Menu ---------- */}
            {showMobileMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setShowMobileMenu(false)}
                    ></div>

                    {/* Mobile Menu Panel */}
                    <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-2xl z-50 mx-4 rounded-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
                        <div className="p-6 space-y-2">
                            {/* Latest Posts Item */}
                            <div className="group">
                                <button
                                    onClick={() => router.push("/post")}
                                    className="w-full flex items-center justify-between p-4 text-gray-800 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-lg">Mới nhất</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                                </button>
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4"></div>

                            {/* Topic Items */}
                            {topics.map((topic, index) => (
                                <div key={topic.topicId} className="group">
                                    <button
                                        onClick={() => handleTopicClick(String(topic.topicId))}
                                        className="w-full flex items-center justify-between p-4 text-gray-800 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md"
                                        style={{
                                            animationDelay: `${(index + 1) * 0.05}s`,
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60 + 60) % 360}, 70%, 70%))`,
                                                }}
                                            >
                                                <div className="w-3 h-3 rounded-full bg-white/80"></div>
                                            </div>
                                            <span className="text-lg">{topic.topicName}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Bottom gradient decoration */}
                        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    </div>
                </>
            )}
        </div>
    )
}
