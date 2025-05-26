'use client';
import { signOut } from "next-auth/react";
import {
    UserIcon,
    PowerIcon,
    ChatBubbleLeftRightIcon,
    ShoppingCartIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { USER_ID } from '@/constants/cartConstants';
import CategoryMenu from '@/features/category/components/CategoryMenu';
import { Search } from 'lucide-react';
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function Header() {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const clearNextAuthCookies = () => {
        const cookiesToDelete = [
            'next-auth.callback-url',
            'next-auth.csrf-token',
            'next-auth.pkce.code_verifier',
            'next-auth.state',
            'next-auth.session-token',  // Thêm cookie session-token nếu cần
            'refreshToken',  // Thêm cookie session-token nếu cần
        ];

        cookiesToDelete.forEach((cookieName) => {
            document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()}; path=/`;
        });
    };
    const handleSearch = async () => {
        if (!keyword.trim()) return;

        setLoading(true);
        const slug = slugify(keyword);
        router.push(`/products?keyword=${slug}`)
    };
    const handleLogout = () => {
        // Xóa localStorage
        localStorage.clear();

        // Xóa các cookie liên quan đến next-auth
        clearNextAuthCookies();

        // Đăng xuất người dùng từ next-auth và chuyển hướng về trang chủ
        signOut();
    };

    return (
        // sticky
        <header className=" top-0 z-50 bg-orange-500 md:bg-white shadow-md border-b border-gray-200">

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
                <div className="flex items-center w-full md:w-1/2 lg:w-1/2 border border-gray-300 rounded overflow-hidden text-sm shadow-sm hover:shadow-md transition-shadow p-1 bg-white">
                    <CategoryMenu />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        type="text"
                        placeholder="Tìm kiếm sách, tác giả..."
                        className=" flex-1 px-4 py-2 outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button onClick={handleSearch} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded hover:from-orange-600 hover:to-orange-700 transition-all hidden sm:block cursor-pointer">
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
                                <UserIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium hidden sm:block">Tài khoản</span>
                            </Link>
                            <div

                                className="flex flex-col items-center group hover:text-orange-600 transition-colors relative"
                            >
                                <PowerIcon onClick={() => handleLogout()} className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                <span className="text-xs sm:text-sm font-medium hidden sm:block">Đăng xuất</span>

                            </div>

                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                        >
                            <UserIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:block">Đăng nhập</span>
                        </Link>
                    )}
                    <Link
                        href="/orders"
                        className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                    >
                        <TruckIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium hidden sm:block">Đơn hàng</span>
                    </Link>
                    <div className="relative inline-block">
                        <Link
                            href="/cart"
                            className="flex flex-col items-center group hover:text-orange-600 transition-colors"
                        >
                            <ShoppingCartIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                            <span className="text-xs sm:text-sm font-medium hidden sm:block">Giỏ hàng</span>
                            <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                                1
                            </span>
                        </Link>
                    </div>
                </div>
            </div>


        </header>
    );
}