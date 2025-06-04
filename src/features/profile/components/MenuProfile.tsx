"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { MapPin, Package, Settings, Star, User, Menu, X, ChevronRight } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UserRes } from "@/features/profile/services/type"
import { USER_NAME } from "@/constants/userConstants"
import { fetchUserByEmail } from "@/features/profile/services/profile.service"

// Mock types - replace with your actual types

const MenuProfile = () => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [profile, setProfile] = useState<UserRes>()
    const [email, setEmail] = useState<string>()

    useEffect(() => {
        const storedEmail = localStorage.getItem(USER_NAME);
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);
    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!email) return;
                const data = await fetchUserByEmail(email);
                setProfile(data);
            } catch (error) {
                console.error("Lỗi khi load profile:", error);
            }
        };
        loadProfile();
    }, [email])

    const menuItems = [
        {
            label: "Thông tin tài khoản",
            icon: User,
            href: "/profile",
            description: "Quản lý thông tin cá nhân",
        },
        {
            label: "Đổi mật khẩu",
            icon: Settings,
            href: "/profile/password",
            description: "Bảo mật tài khoản",
        },
        {
            label: "Đơn hàng của tôi",
            icon: Package,
            href: "/profile/order",
            description: "Theo dõi đơn hàng",
        },
        {
            label: "Ưu đãi thành viên",
            icon: Star,
            href: "/profile/rewards",
            description: "Điểm thưởng và ưu đãi",
        },
        {
            label: "Sổ địa chỉ",
            icon: MapPin,
            href: "/profile/address",
            description: "Quản lý địa chỉ giao hàng",
        },
    ]

    const renderMenu = () => (
        <div className="w-80 bg-gradient-to-br from-white to-gray-50/50 p-6 flex flex-col h-full border-r border-gray-100">
            {/* Profile Header */}
            <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                            <AvatarImage
                                src={profile?.avatar}
                                alt="Avatar"
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-indigo-500 text-white text-xl font-semibold">
                                {profile?.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.fullName}</h2>
                    <p className="text-sm text-gray-600 mb-3">{email}</p>
                    {/* <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 px-3 py-1"
                    >
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Thành viên Vàng
                    </Badge> */}
                </div>
            </Card>

            {/* Menu Items */}
            <div className="space-y-2 flex-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Tài khoản của tôi</h3>
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link href={item.href} key={index} className="block">
                            <div
                                className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                                    : "hover:bg-white hover:shadow-md hover:shadow-gray-200/50 hover:scale-[1.02]"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`p-2 rounded-lg mr-3 transition-colors ${isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`font-medium text-sm ${isActive ? "text-white" : "text-gray-900 group-hover:text-gray-900"
                                                }`}
                                        >
                                            {item.label}
                                        </p>
                                        <p
                                            className={`text-xs mt-0.5 ${isActive ? "text-blue-100" : "text-gray-500 group-hover:text-gray-600"
                                                }`}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-white" : "text-gray-400"
                                            }`}
                                    />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Phiên bản 2.0.1</p>
                </div>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop menu */}
            <div className="hidden md:flex">{renderMenu()}</div>

            {/* Mobile menu */}
            <div className="md:hidden">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>
                        <div className="p-4 w-full flex justify-start">
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                        <Dialog.Content className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">Tài khoản</Dialog.Title>
                                <Dialog.Close asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </Dialog.Close>
                            </div>
                            <div className="h-full pb-4">{renderMenu()}</div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </>
    )
}

export default MenuProfile
