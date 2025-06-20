"use client"

import { Bell, MapPin, Star, User, Gift, Trophy, Edit, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useEffect, useState } from "react"
import { UserRes } from "@/features/profile/services/type"
import { fetchUserByEmail } from "@/features/profile/services/profile.service"
import { USER_NAME } from "@/constants/userConstants"
import Link from "next/link"

// Mock data types for demonstration
// Mock service function

export default function ProfileDetail() {
    const [profile, setProfile] = useState<UserRes>()
    const [email, setEmail] = useState<string>()
    const [fullName, setFullName] = useState<string>("") // State để quản lý họ tên

    useEffect(() => {
        const stoorangeEmail = localStorage.getItem(USER_NAME)
        if (stoorangeEmail) {
            setEmail(stoorangeEmail)
        }
    }, [])

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!email) return
                const data = await fetchUserByEmail(email)
                setProfile(data)
                // Gán giá trị ban đầu từ profile.fullName
                if (data?.fullName) setFullName(data.fullName)
            } catch (error) {
                console.error("Lỗi khi load profile:", error)
            }
        }
        loadProfile()
    }, [email])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Stats Cards */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Gift className="w-6 h-6" />
                                Ưu đãi của bạn
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                    <div className="text-sm font-medium mb-2 text-purple-100">F-Point hiện có</div>
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="text-xs text-purple-100 mt-1">điểm thưởng</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                    <div className="text-sm font-medium mb-2 text-purple-100">Freeship hiện có</div>
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="text-xs text-purple-100 mt-1">lần miễn phí</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}

                {/* Achievements Card */}
                {/* <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                        <CardHeader className="pb-3 relative z-10">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6" />
                                Thành tích năm 2025
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                    <div className="text-sm font-medium mb-2 text-blue-100">Số đơn hàng</div>
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="text-xs text-blue-100 mt-1">đơn hàng</div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30">
                                    <div className="text-sm font-medium mb-2 text-blue-100">Đã thanh toán</div>
                                    <div className="text-3xl font-bold">0₫</div>
                                    <div className="text-xs text-blue-100 mt-1">tổng chi tiêu</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Member Rank Info */}
                {/* <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-gray-700 font-medium">Khám phá hạng thành viên của bạn</span>
                                    <p className="text-sm text-gray-500">Tích lũy điểm để nâng hạng và nhận ưu đãi</p>
                                </div>
                            </div>
                            <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                Xem chi tiết
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Profile Card */}
                <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            Hồ sơ cá nhân
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Personal Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Thông tin cá nhân
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Họ tên</label>
                                        <Input
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            readOnly
                                            value={fullName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <Input
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            readOnly
                                            defaultValue={profile?.mobileNumber}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <Input
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            readOnly
                                            defaultValue={profile?.email}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-red-500" />
                                    Địa chỉ
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Tên tòa nhà</label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.buildingName || ""}
                                            placeholder="Tên tòa nhà/Số nhà"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phường/Xã</label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.ward || ""}
                                            placeholder="Phường/Xã"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Quận/Huyện</label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.district || ""}
                                            placeholder="Quận/Huyện"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Thành phố</label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.city || ""}
                                            placeholder="Thành phố"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Quốc gia</label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.country || ""}
                                            placeholder="Quốc gia"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="pt-4 border-t">
                                <Link href="/profile/address">
                                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Cập nhật thông tin
                                    </Button></Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
