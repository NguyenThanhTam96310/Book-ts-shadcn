"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RegisterBody, RegisterBodyType, RegisterResType } from "@/features/auth/services/auth.schema";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { registerUser } from "@/features/auth/services/auth.service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Phone, Home } from "lucide-react"; // Import thêm các icon cần thiết
import { useEffect, useState } from "react";
import { getDistricts, getProvinces, getWards } from "@/features/order/services/ghn.service";

const RegisterForm = () => {
    const router = useRouter();
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const form = useForm<z.infer<typeof RegisterBody>>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            fullName: "",
            mobileNumber: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            address: {
                ward: "",
                buildingName: "",
                city: "",
                district: "",
                country: "Việt Nam",
            }
        }
    });
    const selectedProvince = form.watch("address.city");
    const selectedDistrict = form.watch("address.district");
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
    const onSubmit = async (values: z.infer<typeof RegisterBody>) => {
        try {
            let orderData = { ...values };

            // Lấy tên Tỉnh/Thành phố
            const selectedProvinceObject = provinces.find((p) => String(p.ProvinceID) === values.address.city);
            orderData.address.city = selectedProvinceObject?.ProvinceName || "";

            // Lấy tên Quận/Huyện
            const selectedDistrictObject = districts.find((d) => String(d.DistrictID) === values.address.district);
            orderData.address.district = selectedDistrictObject?.DistrictName || "";

            // Lấy tên Phường/Xã
            const selectedWardObject = wards.find((w) => w.WardCode === values.address.ward);
            orderData.address.ward = selectedWardObject?.WardName || "";
            const result = await registerUser(values) as RegisterResType;
            // console.log(result.message);
            toast.success(result.message || "Đăng ký thành công!");
            if (result) {
                router.push(`/register/verifyEmail`); //
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
            console.error(error);
        }
    };

    return (

        <Card >
            <CardTitle className="text-2xl font-bold text-center">ĐĂNG KÝ</CardTitle>
            <CardContent className="  ">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                name="fullName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Họ tên</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input placeholder="Nhập họ tên của bạn" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="mobileNumber"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Số điện thoại</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input placeholder="Nhập số điện thoại của bạn" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input type="email" placeholder="Nhập email của bạn" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input placeholder="Chọn tên đăng nhập" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input type="password" placeholder="Nhập mật khẩu" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="confirmPassword"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Xác nhận mật khẩu</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input type="password" placeholder="Xác nhận mật khẩu" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold text-gray-700">Địa chỉ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                                name="address.city"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Thành phố</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    const selected = provinces.find((p) => String(p.ProvinceID) === value);

                                                    form.setValue("address.district", ""); // Reset district
                                                    form.setValue("address.ward", ""); // Reset ward
                                                    setDistricts([]);
                                                    setWards([]);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn tỉnh" />
                                                </SelectTrigger>
                                                <SelectContent >
                                                    {provinces.map((p) => (
                                                        <SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>
                                                            {p.ProvinceName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="address.district"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Quận/Huyện</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    const selected = districts.find((d) => String(d.DistrictID) === value);
                                                    form.setValue("address.ward", ""); // Reset ward
                                                    setWards([]);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn quận" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {districts.map((d) => (
                                                        <SelectItem key={d.DistrictID} value={String(d.DistrictID)}>
                                                            {d.DistrictName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="address.ward"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Phường/Xã</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    form.setValue("address.ward", value);
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Chọn phường" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wards.map((w) => (
                                                        <SelectItem key={w.WardCode} value={w.WardCode}>
                                                            {w.WardName}
                                                        </SelectItem>
                                                    ))}
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
                                name="address.buildingName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Địa chỉ nhà</FormLabel>
                                        <FormControl><Input placeholder="Tên tòa nhà" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="address.country"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Quốc gia</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input placeholder="Quốc gia" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-medium cursor-pointer text-base"
                        >
                            Đăng ký
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="px-6 flex justify-center">
                <p className="text-gray-600">
                    Đã có tài khoản?
                    <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium ml-1">
                        Đăng nhập
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
};

export default RegisterForm;

