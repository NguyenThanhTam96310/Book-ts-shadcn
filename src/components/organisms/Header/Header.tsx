'use client'

import {
    UserIcon,
    ChatBubbleLeftRightIcon,
    ShoppingCartIcon,
    TruckIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { USER_ID } from '@/constants/cartConstants'

export default function Header() {
    const [userId, setUserId] = useState<number | null>(null)
    useEffect(() => {
        const loadUserId = () => {
            const storedUserId = localStorage.getItem(USER_ID);
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
            } else {
                setUserId(null);
            }
        };

        loadUserId(); // Load lần đầu tiên

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'userId') {
                loadUserId();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    return (
        <header className="border-b">
            {/* Top Bar */}
            <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2 text-orange-500 text-2xl font-bold w-full md:w-auto">
                    <span className=" sm:inline">BOOKSTORE</span>
                </div>

                {/* Search */}
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

                    {userId ? (
                        <>
                            <Link href="/profile" className="relative flex flex-col items-center">
                                <UserIcon className="w-6 h-6" />
                                <span>Hồ sơ của tôi</span>
                            </Link>
                            <Link href="/messages" className="relative flex flex-col items-center">
                                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                                <span>Tin nhắn</span>
                                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1 rounded-full">
                                    1
                                </span>
                            </Link>
                            <Link href="/orders" className="relative flex flex-col items-center">
                                <TruckIcon className="w-6 h-6" />
                                <span>Đơn hàng</span>
                            </Link>

                        </>
                    ) : (
                        <>
                            <Link href="/login" className="relative flex flex-col items-center">
                                <UserIcon className="w-6 h-6" />
                                <span>Đăng nhập</span>
                            </Link>
                        </>
                    )}





                    <Link href="/cart" className="relative flex flex-col items-center">
                        <ShoppingCartIcon className="w-6 h-6" />
                        <span>Giỏ hàng</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}
