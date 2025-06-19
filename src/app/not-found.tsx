"use client"

import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 text-center px-4 relative overflow-hidden py-10">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-100 rounded-full opacity-10 animate-ping"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl mx-auto">
                {/* 404 Number with animation */}
                <div className="relative mb-8">
                    <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-emerald-500 animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-8xl md:text-9xl font-black text-gray-200 -z-10 transform translate-x-2 translate-y-2">
                        404
                    </div>
                </div>

                {/* Error message */}
                <div className="space-y-4 mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Oops! Trang không tìm thấy</h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </Link>
                    </Button>

                </div>

                {/* Additional help text */}
                <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Bạn có thể thử:</h3>
                    <ul className="text-gray-600 space-y-2 text-left max-w-sm mx-auto">
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                            Kiểm tra lại đường dẫn URL
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                            Quay lại trang trước đó
                        </li>

                    </ul>
                </div>

                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-8 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại trang trước
                </Button>
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-orange-300 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-rose-300 rounded-full animate-bounce delay-700"></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-emerald-300 rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-32 right-10 w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-1000"></div>
        </div>
    )
}
