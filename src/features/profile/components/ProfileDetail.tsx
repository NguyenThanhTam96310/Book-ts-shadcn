'use client'
import { Bell, CreditCard, MapPin, Package, Settings, Star, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserRes } from "@/features/profile/services/type"
import { useEffect, useState } from "react"
import { fetchUserByEmail } from "@/features/profile/services/profile.service"
import { USER_NAME } from "@/constants/userConstants"

export default function ProfileDetail() {
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-80 border-r bg-white p-6 flex flex-col">
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                        <AvatarFallback className="bg-gray-200">
                            <svg className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                            </svg>
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{profile?.fullName}</h2>
                    <div className="mt-2">
                        <Badge variant="secondary" className="px-3 py-1 rounded-full">
                            Thành viên Bạc
                        </Badge>
                    </div>
                    <div className="mt-3 text-sm text-center">
                        <p>F-Point tích lũy 0</p>
                        <p className="text-amber-600 mt-1">Thêm 30.000 để nâng hạng Vàng</p>
                    </div>
                </div>

                <div className="space-y-1 mt-4">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        <span>Thông tin tài khoản</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ cá nhân</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Sổ địa chỉ</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Đổi mật khẩu</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Thông tin xuất hóa đơn GTGT</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Ưu đãi thành viên</span>
                    </Button>
                </div>

                <div className="mt-6 space-y-1">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Đơn hàng của tôi</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start relative" size="sm">
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            14
                        </div>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Ví voucher</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Tài Khoản F-Point / Freeship</span>
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <Bell className="h-4 w-4 text-red-500" />
                    <AlertTitle className="text-red-500 font-medium">Bạn vui lòng cập nhật thông tin tài khoản:
                        <Button variant="link" className="p-0 h-auto text-red-500 font-medium">
                            Cập nhật thông tin ngay
                        </Button>
                    </AlertTitle>
                </Alert>

                {/* <div className="bg-white rounded-lg p-6 mb-6 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="relative z-10">
                            <img src="/placeholder.svg?height=120&width=120" alt="Mascot" className="h-32 w-32 object-contain" />
                        </div>
                        <Button variant="outline" className="relative z-10">
                            Thành viên
                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 opacity-50"></div>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Ưu đãi của bạn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">F-Point hiện có</div>
                                    <div className="text-2xl font-bold text-red-500">0</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Freeship hiện có</div>
                                    <div className="text-2xl font-bold text-red-500">0 lần</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Thành tích năm 2025</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Số đơn hàng</div>
                                    <div className="text-2xl font-bold text-red-500">0 đơn hàng</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Đã thanh toán</div>
                                    <div className="text-2xl font-bold text-red-500">0 đ</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center text-sm mb-2">
                    <span>Khám phá hạng thành viên.</span>
                    <Button variant="link" className="p-0 h-auto ml-1 text-red-500">
                        Xem chi tiết
                    </Button>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Hồ sơ cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Họ tên<span className="text-red-500">*</span>
                                </label>
                                <Input defaultValue="Nguyễn" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Tên t<span className="text-red-500">*</span>
                                </label>
                                <Input defaultValue="Tâm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
