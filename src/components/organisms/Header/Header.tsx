'use client'

import {
    UserIcon,
    ChatBubbleLeftRightIcon,
    ShoppingCartIcon,
    TruckIcon,
    Bars3Icon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    return (
        <header className="border-b">
            {/* Top Bar */}
            <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2 text-orange-500 text-2xl font-bold w-full md:w-auto">
                    <span className=" sm:inline">BOOKSTORE</span>
                </div>

                {/* Search */}
                {/* <div className="flex items-center w-full md:flex-1 border rounded-md overflow-hidden text-sm  "> */}
                <div className="flex items-center w-full sm:w-3/4 md:w-1/2 lg:w-2/4 border rounded-md overflow-hidden text-sm">
                    <select className="p-2 border-r outline-none bg-white">
                        <option>Tất cả</option>
                        <option>Sách mới</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="flex-1 px-2 py-2 outline-none text-sm"
                    />
                    <button className="bg-orange-500 text-white px-4 py-2 whitespace-nowrap">
                        Tìm kiếm
                    </button>
                </div>

                {/* Icons */}
                <div className="flex w-full md:w-auto justify-between md:justify-end items-center gap-6 text-sm">
                    {[
                        { icon: <UserIcon className="w-6 h-6" />, label: 'Hồ sơ của tôi', badge: 3 },
                        { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: 'Tin nhắn', badge: 1 },
                        { icon: <TruckIcon className="w-6 h-6" />, label: 'Đơn hàng' },
                        { icon: <ShoppingCartIcon className="w-6 h-6" />, label: 'Giỏ hàng' },
                    ].map((item, index) => (
                        <div key={index} className="relative flex flex-col items-center">
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </header>

    )
}
