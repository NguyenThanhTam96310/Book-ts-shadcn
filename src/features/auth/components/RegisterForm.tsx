"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { RegisterBody, RegisterBodyType, RegisterResType } from "@/features/auth/services/auth.schema";
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

const RegisterForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof RegisterBody>>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            fullName: "",
            mobileNumber: "",
            email: "",
            username: "",
            password: "",
            address: {
                ward: "",
                buildingName: "",
                city: "",
                district: "",
                country: "",
                pincode: ""
            }
        }
    });

    const onSubmit = async (values: z.infer<typeof RegisterBody>) => {
        try {
            const result = await registerUser(values) as RegisterResType;
            // console.log(result.message);
            toast.success(result.message || "Đăng ký thành công!");
            // router.push("/login");
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
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 max-w-md mx-auto bg-white p-2"
            >
                <h2 className="text-xl font-semibold text-center">Đăng ký</h2>

                <FormField
                    name="fullName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Họ tên</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="mobileNumber"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        name="address.ward"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phường/Xã</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="address.buildingName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên tòa nhà</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="address.city"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thành phố</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="address.district"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quận/Huyện</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="address.country"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quốc gia</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="address.pincode"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mã bưu chính</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                    Đăng ký
                </Button>
            </form>
        </Form>
    );
};

export default RegisterForm;

