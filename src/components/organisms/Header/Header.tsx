'use client';
import { Menu, Truck, Phone, PackageCheck } from 'lucide-react';
import {
    UserIcon,
    ChatBubbleLeftRightIcon,
    ShoppingCartIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { USER_ID } from '@/constants/cartConstants';
import CategoryMenu from '@/features/category/components/CategoryMenu';
import { Search } from 'lucide-react';
import BannerTop from '@/features/banner/components/BannerTop';

export default function Header() {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const loadUserId = () => {
            const storedUserId = localStorage.getItem(USER_ID);
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
            } else {
                setUserId(null);
            }
        };

        loadUserId();

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
        <header className="bg-orange-500 md:bg-white shadow-md border-b border-gray-200">

            <BannerTop />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link href="/" passHref>
                    <span
                        className="cursor-pointer text-orange-600 text-3xl sm:text-4xl font-extrabold tracking-tight hover:text-orange-700 transition-colors"
                        style={{ textShadow: '0 0 2px white, 1px 1px white, -1px -1px white' }}
                    >
                        BOOKSTORE
                    </span>
                </Link>



                {/* Search Bar */}
                <div className="flex items-center w-full md:w-1/2 lg:w-2/5 border border-gray-300 rounded overflow-hidden text-sm shadow-sm hover:shadow-md transition-shadow p-1 bg-white">
                    <CategoryMenu />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách, tác giả..."
                        className=" flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded hover:from-orange-600 hover:to-orange-700 transition-all hidden sm:block">
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
                    {userId ? (
                        <>
                            <Link
                                href="/profile"
                                className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                            >
                                <UserIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium hidden sm:block">Tài khoản</span>
                            </Link>
                            <Link
                                href="/messages"
                                className="flex flex-col items-center group hover:text-orange-600 transition-colors relative"
                            >
                                <ChatBubbleLeftRightIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium hidden sm:block">Tin nhắn</span>
                                <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                                    1
                                </span>
                            </Link>

                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                        >
                            <UserIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:block">Đăng nhập</span>
                        </Link>
                    )}
                    <Link
                        href="/orders"
                        className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                    >
                        <TruckIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium hidden sm:block">Đơn hàng</span>
                    </Link>

                    <Link
                        href="/cart"
                        className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                    >
                        <ShoppingCartIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium hidden sm:block">Giỏ hàng</span>
                    </Link>
                </div>
            </div>


        </header>
    );
}