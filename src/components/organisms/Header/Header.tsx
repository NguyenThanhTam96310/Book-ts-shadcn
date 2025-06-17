"use client"

import type React from "react"

import { signOut } from "next-auth/react"
import Image from "next/image"
import { TruckIcon } from "@heroicons/react/24/outline"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { USER_ID } from "@/constants/cartConstants"
import CategoryMenu from "@/features/category/components/CategoryMenu"
import { Search, Bell, Heart, User, ShoppingBag, LogOut, Package, Settings } from "lucide-react"
import { slugify } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { ACCOUNTNAME, CARTLENGTH } from "@/constants/userConstants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartProps, fetchCart } from "@/features/cart"
import useCartProductLength from "@/lib/utils/render"
import { fetchSearchProductName, ProductSearchRes } from "@/features/product"
import { AuthorSearchRes } from "@/features/author/services/type"
import { fetchSearchAuthorName } from "@/features/author/services/author.service"
import ShowSuggestions from "@/components/organisms/Header/ShowSuggestions"


export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [keyword, setKeyword] = useState("")
    const [loading, setLoading] = useState(false)
    const [userId, setUserId] = useState<number | null>(null)
    const [nameUser, setNameUser] = useState<string | null>(null)
    const cartLength = useCartProductLength();

    // States cho search suggestions
    const [searchResults, setSearchResults] = useState<ProductSearchRes[]>([])
    const [searchAuthors, setSearchAuthors] = useState<AuthorSearchRes[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    // Refs
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<NodeJS.Timeout>(null)

    const [showTooltip, setShowTooltip] = useState(false)

    const handleClick = () => {
        if (userId) {
            router.push("/profile/order")
        }
    }

    useEffect(() => {
        const loadUserId = () => {
            const storedUserId = localStorage.getItem(USER_ID)
            const storedName = localStorage.getItem(ACCOUNTNAME)
            if (storedUserId && storedName) {
                setUserId(Number.parseInt(storedUserId, 10))
                setNameUser(storedName)
            } else {
                setUserId(null)
            }
        }

        loadUserId()

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "userId") {
                loadUserId()
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    // Effect cho việc tìm kiếm suggestions
    useEffect(() => {
        // Clear timeout cũ
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        // Nếu keyword rỗng, ẩn suggestions
        if (!keyword.trim()) {
            setShowSuggestions(false)
            setSearchAuthors([])
            setSearchResults([])
            return
        }

        // Debounce search
        debounceRef.current = setTimeout(async () => {
            setSearchLoading(true)
            try {
                const results = await fetchSearchProductName(keyword.trim())
                const resultAuthors = await fetchSearchAuthorName(keyword.trim())
                setSearchResults(results || [])
                setSearchAuthors(resultAuthors || [])
                setShowSuggestions(true)
            } catch (error) {
                console.error("Error fetching search suggestions:", error)
                setSearchResults([])
                setSearchAuthors([])

            } finally {
                setSearchLoading(false)
            }
        }, 300) // Delay 300ms

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [keyword])

    const clearNextAuthCookies = () => {
        const cookiesToDelete = [
            "next-auth.callback-url",
            "next-auth.csrf-token",
            "next-auth.pkce.code_verifier",
            "next-auth.state",
            "next-auth.session-token",
            "refreshToken",
        ]

        cookiesToDelete.forEach((cookieName) => {
            document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()}; path=/`
        })
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async () => {
        if (!keyword.trim()) return
        setLoading(true)
        setShowSuggestions(false)
        const slug = slugify(keyword)
        router.push(`/products?keyword=${slug}`)
        setLoading(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
        if (e.key === "Escape") {
            setShowSuggestions(false)
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        clearNextAuthCookies()
        signOut();
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    // Handle author link click
    const handleAuthorClick = (authorId: number) => {
        router.push(`/products?authorIds=${authorId}`)
        setShowSuggestions(false)

    }

    // Handle product link click
    const handleProductClick = (product: ProductSearchRes) => {
        setShowSuggestions(false)
        // Assuming you have a product detail page route
        router.push(`/products/${product.slug}`)
    }

    return (
        <header className="top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Bar - Desktop Only */}
                <div className="hidden lg:flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-100">
                    <div className="flex items-center space-x-6">
                        <span className="flex items-center">
                            <TruckIcon className="w-4 h-4 mr-1 text-green-600" />
                            Miễn phí vận chuyển đơn từ 200k
                        </span>
                        <span className="flex items-center">
                            <Bell className="w-4 h-4 mr-1 text-blue-600" />
                            Khuyến mãi đặc biệt tháng này
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span>Hotline: 1900-1234</span>
                        <div className="flex items-center space-x-2">
                            <Image src="/Vietnam.png" alt="Việt Nam" width={20} height={20} className="rounded-sm" />
                            <span>Việt Nam</span>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="flex items-center justify-between py-4 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="group">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                                    <span className="text-white font-bold text-lg">B</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        BOOKSTORE
                                    </h1>
                                    <p className="text-xs text-gray-500 -mt-1">Tri thức là sức mạnh</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-4 relative" ref={searchContainerRef}>
                        <div className="relative group">
                            <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm group-hover:shadow-md group-focus-within:shadow-lg group-focus-within:border-orange-300 transition-all duration-300 overflow-hidden px-2">
                                <div className="flex-shrink-0 border-r border-gray-200 cursor-pointer">
                                    <CategoryMenu />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        onFocus={() => keyword.trim() && setShowSuggestions(true)}
                                        type="text"
                                        placeholder="Tìm kiếm sách"
                                        className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                    />
                                    {keyword && (
                                        <button
                                            onClick={() => {
                                                setKeyword("")
                                                setShowSuggestions(false)
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-none rounded-r-xl border-0 shadow-none hover:shadow-md transition-all duration-300 cursor-pointer"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Search className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Search Suggestions Dropdown */}

                        {showSuggestions && (
                            <ShowSuggestions
                                authors={searchAuthors}
                                products={searchResults}
                                searchLoading={searchLoading}
                                setShowSuggestions={setShowSuggestions}
                                keyword={keyword}
                                isMobile={false}
                            />
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {/* Wishlist - Desktop Only */}
                        <div
                            className="relative"
                            onMouseEnter={() => !userId && setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`
                                 hidden lg:flex flex-col items-center justify-center gap-1.5 
                                w-16 h-16 rounded-lg transition-all duration-200 ease-in-out
                                        ${userId
                                        ? "hover:bg-orange-50 hover:text-orange-600 hover:shadow-sm cursor-pointer"
                                        : "text-gray-400 cursor-not-allowed opacity-60"
                                    }
                                    `}
                                onClick={handleClick}
                                disabled={!userId}
                            >
                                <Package className={`w-5 h-5 transition-transform duration-200 ${userId ? "group-hover:scale-110" : ""}`} />
                                <span className="text-xs font-medium leading-tight">Đơn hàng</span>
                            </Button>

                            {/* Tooltip */}
                            {!userId && (
                                <div
                                    className={`
                                    absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-2
                                    bg-white text-orange-600 text-sm font-medium rounded-md shadow-lg
                                    border border-orange-500
                                    whitespace-nowrap z-50 pointer-events-none
                                    before:content-[''] before:absolute before:bottom-full before:left-1/2 
                                    before:-translate-x-1/2 before:border-4 before:border-transparent 
                                    before:border-b-white
                                    transition-all duration-200 ease-in-out
                                    ${showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"}
`}
                                >
                                    Vui lòng đăng nhập
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:flex flex-col items-center justify-center gap-1 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer w-16 h-16 relative"
                            >
                                {/* Icon + Badge trong một khối để badge nằm đúng chỗ */}
                                <div className="relative">
                                    <ShoppingBag className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                    {Number(cartLength) > 0 && (
                                        <Badge className="absolute -top-2 -right-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-1.5 py-0.5 min-w-[10px] h-4 animate-pulse">
                                            {cartLength}
                                        </Badge>
                                    )}
                                </div>

                                {/* Text phía dưới */}
                                <span className="hidden lg:block text-xs font-medium">Giỏ hàng</span>
                            </Button>
                        </Link>

                        {/* User Account */}
                        {userId ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-sm">
                                                {nameUser?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden lg:block text-left">
                                            <p className="text-sm font-medium">{nameUser || "Tài khoản"}</p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl"
                                >
                                    <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                                        <User className="w-4 h-4 mr-2" />
                                        Tài khoản của tôi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/profile/order")} className="cursor-pointer">
                                        <Package className="w-4 h-4 mr-2" />
                                        Đơn hàng của tôi
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/profile/password")} className="cursor-pointer">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Thay đổi mật khẩu
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href={`/login?redirect=${encodeURIComponent(pathname || "")}`}>
                                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Đăng nhập</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Search - Show on small screens */}
                <div className="lg:hidden md:hidden pb-4">
                    <div className="relative group" ref={searchContainerRef}>
                        <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm group-hover:shadow-md group-focus-within:shadow-lg group-focus-within:border-orange-300 transition-all duration-300 overflow-hidden">
                            <div className="flex-1 relative">
                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => keyword.trim() && searchResults.length > 0 && setShowSuggestions(true)}
                                    type="text"
                                    placeholder="Tìm kiếm sách..."
                                    className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-gradient-to-r mr-2 from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-none rounded-r-2xl border-0 shadow-none cursor-pointer"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        {/* Mobile Search Suggestions */}
                        {showSuggestions && (
                            <ShowSuggestions
                                authors={searchAuthors}
                                products={searchResults}
                                searchLoading={searchLoading}
                                setShowSuggestions={setShowSuggestions}
                                keyword={keyword}
                                isMobile={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}