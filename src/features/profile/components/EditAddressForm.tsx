"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { PAYMENT_ITEM_KEY } from "@/constants/orderConstants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { USER_ID } from "@/constants/cartConstants";
import { fetchUserByToken } from "@/features/auth/services/auth.service";
import { getDistricts, getProvinces, getWards } from "@/features/order/services/ghn.service";
import { UserRes } from "@/features/profile/services/type";
import { EditAddressBody } from "@/features/profile/services/profile.Schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Shield, MapPin } from "lucide-react";
import { fetchEditAddress } from "@/features/profile/services/profile.service";


export default function EditAddressForm() {
    const form = useForm<z.infer<typeof EditAddressBody>>({
        resolver: zodResolver(EditAddressBody),
        defaultValues: {
            userId: undefined,
            email: "",
            fullName: "",
            mobileNumber: "",
            address: {
                ward: "",
                buildingName: "",
                city: "",
                district: "",
                country: "Việt Nam"
            }
        },
    });

    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<UserRes | null>(null);
    const [showCouponOptions, setShowCouponOptions] = useState(false);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const selectedProvince = form.watch("address.city");
    const selectedDistrict = form.watch("address.district");
    const selectedWard = form.watch("address.ward");
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserId = localStorage.getItem(USER_ID);
                if (storedUserId) {
                    form.setValue("userId", Number(storedUserId));
                    setUserId(parseInt(storedUserId, 10));
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                        throw new Error("Không nhận được token từ server");
                    }

                    const user = await fetchUserByToken(token);
                    if (user?.userId && user?.email) {
                        localStorage.setItem("userId", user.userId.toString());
                        localStorage.setItem("username", user.email);
                    }
                    setUser(user);
                    form.setValue("fullName", user.fullName || "");
                    form.setValue("email", user.email || "");
                    form.setValue("mobileNumber", user.mobileNumber || "");

                    // Tự động điền địa chỉ nếu có
                    if (user?.address) {
                        form.setValue("address.buildingName", user.address.buildingName || "");
                        form.setValue("address.country", user.address.country || "Việt Nam");

                        // Lấy danh sách tỉnh/thành
                        const provincesData = await getProvinces();
                        setProvinces(provincesData);
                        const matchedProvince = provincesData.find(
                            (p: any) => p.ProvinceName === user.address.city
                        );
                        if (matchedProvince) {
                            form.setValue("address.city", String(matchedProvince.ProvinceID));

                            // Lấy danh sách quận/huyện
                            const districtsData = await getDistricts(matchedProvince.ProvinceID);
                            setDistricts(districtsData);
                            const matchedDistrict = districtsData.find(
                                (d: any) => d.DistrictName === user.address.district
                            );
                            if (matchedDistrict) {
                                form.setValue("address.district", String(matchedDistrict.DistrictID));
                                console.log(form.getValues("address.district"))

                                // Lấy danh sách phường/xã
                                const wardsData = await getWards(matchedDistrict.DistrictID);
                                const matchedWard = wardsData.find(
                                    (w: any) => w.WardName === user.address.ward
                                );
                                if (matchedWard) {
                                    form.setValue("address.ward", matchedWard.WardCode);
                                    console.log(form.getValues("address.ward"))

                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
            }
        };

        fetchData();
    }, [form]);
    // Fetch cart and promotions
    // Fetch provinces
    useEffect(() => {
        getProvinces().then(setProvinces);
    }, []);

    // Fetch districts based on selected province
    useEffect(() => {
        const provinceId = parseInt(selectedProvince);
        if (provinceId) {
            getDistricts(provinceId).then(setDistricts);
            form.setValue("address.district", ""); // Reset district
            form.setValue("address.ward", ""); // Reset ward
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince, form]);

    // Fetch wards based on selected district
    useEffect(() => {
        const districtId = parseInt(selectedDistrict);
        if (districtId) {
            getWards(districtId).then(setWards);
            form.setValue("address.ward", ""); // Reset ward
        }
    }, [selectedDistrict, form]);


    const onSubmit = async (values: z.infer<typeof EditAddressBody>) => {
        try {
            let AddressData = { ...values }; // Bắt đầu với bản sao của values.order

            // Lấy tên Tỉnh/Thành phố và gán vào orderData
            const selectedProvinceObject = provinces.find((p) => String(p.ProvinceID) === values.address.city);
            AddressData.address.city = selectedProvinceObject?.ProvinceName || "";

            // Lấy tên Quận/Huyện và gán vào orderData
            const selectedDistrictObject = districts.find((d) => String(d.DistrictID) === values.address.district);
            AddressData.address.district = selectedDistrictObject?.DistrictName || "";

            // Lấy tên Phường/Xã và gán vào orderData
            const selectedWardObject = wards.find((w) => w.WardCode === values.address.ward);
            AddressData.address.ward = selectedWardObject?.WardName || "";
            console.log(values)
            try {
                const result = await fetchEditAddress(values);
                toast.success("Lưu thông tin thành công.", {
                    position: "top-right",
                    autoClose: 2000,
                });
                router.push("/profile")
            } catch (error) {
                toast.error("Lưu thông tin thất bại.", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }


        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Lưu thông tin thất bại 2.");
            }
            console.error(error);
        }
    };


    return (
        <>
            <div className="w-full  mx-auto">
                <Card className=" border-0 shadow-2xl overflow-hidden">
                    {/* Header with gradient background */}
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-purple-600 text-white p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-bold mb-2">Cập nhật thông tin</CardTitle>
                                <p className="text-blue-100">Vui lòng cập nhật thông tin chính xác để shop phục vụ tốt nhất</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className=" mx-auto space-y-6 p-4 bg-white"
                            >

                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-4 w-full">
                                            <FormLabel className="w-[150px] min-w-[50px] text-sm text-gray-700 font-semibold">
                                                Họ và tên
                                            </FormLabel>
                                            <FormControl className="flex-1">
                                                <Input
                                                    {...field}
                                                    placeholder="Nhập họ và tên"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-4 w-full">
                                            <FormLabel className="w-[150px] min-w-[50px] text-sm text-gray-700 font-semibold">
                                                Email
                                            </FormLabel>
                                            <FormControl className="flex-1">
                                                <Input placeholder="Nhập email" {...field} readOnly />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-4 w-full">
                                            <FormLabel className="w-[150px] min-w-[50px] text-sm text-gray-700 font-semibold">Số điện thoại</FormLabel>
                                            <FormControl className="flex-1">
                                                <Input placeholder="Ví dụ: 0979123xxx (10 ký tự số)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Địa chỉ chi tiết với GHN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.city" // Tên trường trong form state
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-gray-700 font-semibold">Thành phố</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value} // Giá trị hiện tại của trường trong form state
                                                        onValueChange={(value) => {
                                                            field.onChange(value); // Cập nhật giá trị vào form state
                                                            // Cập nhật các state cục bộ và reset các trường con
                                                            const selected = provinces.find((p) => String(p.ProvinceID) === value);
                                                            // Reset các trường con
                                                            const currentDistrict = form.getValues("address.city");
                                                            if (currentDistrict !== value) {
                                                                form.setValue("address.district", "");
                                                                form.setValue("address.ward", "");
                                                                setDistricts([]);
                                                                setWards([]);
                                                            }

                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn tỉnh" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                provinces.map((p) => (
                                                                    <SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>
                                                                        {p.ProvinceName}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Select Quận/Huyện */}
                                    <FormField
                                        control={form.control}
                                        name="address.district" // Tên trường trong form state
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-gray-700 font-semibold">Quận/huyện</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value} // Giá trị hiện tại của trường trong form state
                                                        onValueChange={(value) => {
                                                            // Chỉ reset nếu thay đổi thực sự
                                                            const currentDistrict = form.getValues("address.district");
                                                            if (value && value !== field.value) {
                                                                field.onChange(value);
                                                                const selected = districts.find((d) => String(d.DistrictID) === value);
                                                                form.setValue("address.ward", "");
                                                                setWards([]);
                                                            }
                                                        }}
                                                        disabled={!selectedProvince || districts.length === 0}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn quận" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                districts.map((d) => (
                                                                    <SelectItem key={d.DistrictID} value={String(d.DistrictID)}>
                                                                        {d.DistrictName}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Select Phường/Xã */}
                                    <FormField
                                        control={form.control}
                                        name="address.ward" // Tên trường trong form state
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-gray-700 font-semibold">Phường/xã</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value} // Giá trị hiện tại của trường trong form state
                                                        onValueChange={(value) => {
                                                            if (value && value !== field.value) {
                                                                field.onChange(value); // Cập nhật giá trị vào form state
                                                            }

                                                        }}
                                                        disabled={!selectedDistrict || wards.length === 0}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn phường" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                wards.map((w) => (
                                                                    <SelectItem key={w.WardCode} value={w.WardCode}>
                                                                        {w.WardName}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address.buildingName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-gray-700 font-semibold">Địa chỉ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập số nhà, tên đường" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address.country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm text-gray-700 font-semibold">Quốc gia</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập quốc gia" {...field} readOnly />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold h-14"
                                >
                                    Lưu thay đổi
                                </Button>
                            </form>
                        </Form>


                    </CardContent>
                </Card>
            </div>

        </>
    );
}
