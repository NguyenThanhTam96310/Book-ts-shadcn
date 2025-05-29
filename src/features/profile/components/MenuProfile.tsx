'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    Bell, CreditCard, MapPin, Package, Settings, Star, User, Menu,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import {
    Avatar, AvatarFallback, AvatarImage,
} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MenuProfileProps, UserRes } from '@/features/profile/services/type'
import { USER_NAME } from '@/constants/userConstants'
import { fetchUserByEmail } from '@/features/profile/services/profile.service'

const MenuProfile = () => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [profile, setProfile] = useState<UserRes>();
    const [email, setEmail] = useState<string>();
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
        { label: 'Thông tin tài khoản', icon: User, href: '/profile' },
        { label: 'Hồ sơ cá nhân', icon: User, href: '/profile' },
        // { label: 'Sổ địa chỉ', icon: MapPin, href: '/profile/address' },
        { label: 'Đổi mật khẩu', icon: Settings, href: '/profile/password' },
        // { label: 'Thông tin xuất hóa đơn GTGT', icon: CreditCard, href: '/profile/invoice' },
        // { label: 'Ưu đãi thành viên', icon: Star, href: '/profile/rewards' },
        { label: 'Đơn hàng của tôi', icon: Package, href: '/profile/order' },
        // { label: 'Ví voucher', icon: CreditCard, href: '/profile/voucher', badge: 14 },
        // { label: 'F-Point / Freeship', icon: CreditCard, href: '/profile/fpoint' },
    ]

    const renderMenu = () => (
        <div className="w-80 bg-white p-6 flex flex-col h-full">
            <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={`${process.env.NEXT_PUBLIC_FILE}${profile?.avatar}` || "/placeholder.png"} alt="Avatar" />
                    <AvatarFallback className="bg-gray-200">
                        <svg
                            className="h-12 w-12 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                        </svg>
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-semibold">{profile?.fullName}</h2>
                {/* <div className="mt-2">
                    <Badge variant="secondary" className="px-3 py-1 rounded-full">
                        Thành viên Bạc
                    </Badge>
                </div> */}
                {/* <div className="mt-3 text-sm text-center">
                        <p>F-Point tích lũy 0</p>
                        <p className="text-amber-600 mt-1">Thêm 30.000 để nâng hạng Vàng</p>
                    </div> */}
            </div>

            <div className="space-y-1">
                {menuItems.map((item, index) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link href={item.href} key={index}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={`text-base w-full justify-start relative  ${isActive ? 'text-orange-600 font-semibold' : ' cursor-pointer'}`}
                                size="sm"
                            >
                                {/* {item.badge && (
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {item.badge}
                                    </div>
                                )} */}
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{item.label}</span>
                            </Button>
                        </Link>
                    )
                })}
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop menu */}
            <div className="hidden md:flex">{renderMenu()}</div>

            {/* Mobile menu button */}
            <div className="md:hidden ">
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>
                        <div className="pt-6 pl-4 w-full flex justify-start">
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
                        <Dialog.Content className="fixed top-0 left-0 h-full w-4/5 bg-white z-50 shadow-lg overflow-y-auto">
                            <Dialog.Title className="sr-only">Menu tài khoản</Dialog.Title>
                            {renderMenu()}
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </>
    )
}

export default MenuProfile