"use client";
import { Bell, CreditCard, MapPin, Package, Settings, Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRes } from "@/features/profile/services/type";
import { useEffect, useState } from "react";
import { fetchUserByEmail } from "@/features/profile/services/profile.service";
import { USER_NAME } from "@/constants/userConstants";
import MenuProfile from "@/features/profile/components/MenuProfile";

export default function ProfileDetail() {
    const [profile, setProfile] = useState<UserRes>();
    const [email, setEmail] = useState<string>();
    const [fullName, setFullName] = useState<string>(""); // State để quản lý họ tên

    useEffect(() => {
        const stoorangeEmail = localStorage.getItem(USER_NAME);
        if (stoorangeEmail) {
            setEmail(stoorangeEmail);
        }
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!email) return;
                const data = await fetchUserByEmail(email);
                console.log(data);
                setProfile(data);
                // Gán giá trị ban đầu từ profile.fullName
                if (data?.fullName) setFullName(data.fullName);
            } catch (error) {
                console.error("Lỗi khi load profile:", error);
            }
        };
        loadProfile();
    }, [email]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <MenuProfile />
            {/* Main content */}
            <div className="flex-1 p-6">
                <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <Bell className="h-4 w-4 text-orange-500" />
                    <AlertTitle className="text-orange-500 font-medium">
                        Bạn vui lòng cập nhật thông tin tài khoản:
                        <Button variant="link" className="p-0 h-auto text-orange-500 font-medium">
                            Cập nhật thông tin ngay
                        </Button>
                    </AlertTitle>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Ưu đãi của bạn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">F-Point hiện có</div>
                                    <div className="text-2xl font-bold text-orange-500">0</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Freeship hiện có</div>
                                    <div className="text-2xl font-bold text-orange-500">0 lần</div>
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
                                    <div className="text-2xl font-bold text-orange-500">0 đơn hàng</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-sm font-medium mb-2">Đã thanh toán</div>
                                    <div className="text-2xl font-bold text-orange-500">0 đ</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center text-sm mb-2">
                    <span>Khám phá hạng thành viên.</span>
                    <Button variant="link" className="p-0 h-auto ml-1 text-orange-500">
                        Xem chi tiết
                    </Button>
                </div>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-xl">Hồ sơ cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Họ tên
                                </label>
                                <Input
                                    readOnly
                                    value={fullName}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    readOnly
                                    defaultValue={profile?.email} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Số điện thoại
                                </label>
                                <Input readOnly defaultValue={profile?.mobileNumber} />
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-xl font-medium">
                                    Địa chỉ
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tên tòa nhà
                                        </label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.buildingName || ""}
                                            placeholder="Tên tòa nhà/Số nhà"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Phường/Xã
                                        </label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.ward || ""}
                                            placeholder="Phường/Xã"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Quận/Huyện
                                        </label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.district || ""}
                                            placeholder="Quận/Huyện"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Thành phố
                                        </label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.city || ""}
                                            placeholder="Thành phố"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Quốc gia
                                        </label>
                                        <Input
                                            readOnly
                                            defaultValue={profile?.address?.country || ""}
                                            placeholder="Quốc gia"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                            Cập nhật thông tin
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}