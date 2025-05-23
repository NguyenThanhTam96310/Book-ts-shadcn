// "use client";

// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { RegisterBody, RegisterBodyType, RegisterResType } from "@/features/auth/services/auth.schema";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { registerUser } from "@/features/auth/services/auth.service";

// const RegisterForm = () => {
//     const router = useRouter();

//     const form = useForm<z.infer<typeof RegisterBody>>({
//         resolver: zodResolver(RegisterBody),
//         defaultValues: {
//             fullName: "",
//             mobileNumber: "",
//             email: "",
//             username: "",
//             password: "",
//             confirmPassword: "",
//             address: {
//                 ward: "",
//                 buildingName: "",
//                 city: "",
//                 district: "",
//                 country: "",
//                 pincode: ""
//             }
//         }
//     });

//     const onSubmit = async (values: z.infer<typeof RegisterBody>) => {
//         try {
//             const result = await registerUser(values) as RegisterResType;
//             // console.log(result.message);
//             toast.success(result.message || "Đăng ký thành công!");
//             if (result) {
//                 router.push(`/verifyEmail`); //
//             }
//         } catch (error) {
//             if (error instanceof Error) {
//                 toast.error(error.message);
//             } else {
//                 toast.error("An unknown error occurred.");
//             }
//             console.error(error);
//         }
//     };

//     return (
//         <Form {...form}>
//             <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4 max-w-md mx-auto bg-white p-2"
//             >
//                 <h2 className="text-xl font-semibold text-center">Đăng ký</h2>

//                 <FormField
//                     name="fullName"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Họ tên</FormLabel>
//                             <FormControl><Input {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     name="mobileNumber"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Số điện thoại</FormLabel>
//                             <FormControl><Input {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     name="email"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Email</FormLabel>
//                             <FormControl><Input type="email" {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     name="username"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Tên đăng nhập</FormLabel>
//                             <FormControl><Input {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     name="password"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Mật khẩu</FormLabel>
//                             <FormControl><Input type="password" {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     name="confirmPassword"
//                     control={form.control}
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Xác nhận mật khẩu</FormLabel>
//                             <FormControl><Input type="password" {...field} /></FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className="grid grid-cols-2 gap-4">
//                     <FormField
//                         name="address.ward"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Phường/Xã</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         name="address.buildingName"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Tên tòa nhà</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         name="address.city"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Thành phố</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         name="address.district"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Quận/Huyện</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         name="address.country"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Quốc gia</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         name="address.pincode"
//                         control={form.control}
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Mã bưu chính</FormLabel>
//                                 <FormControl><Input {...field} /></FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 <Button
//                     type="submit"
//                     className="w-full bg-orange-600 text-white hover:bg-orange-700"
//                 >
//                     Đăng ký
//                 </Button>
//             </form>
//         </Form>
//     );
// };

// export default RegisterForm;

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Phone, Home } from "lucide-react"; // Import thêm các icon cần thiết

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
            confirmPassword: "",
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
            toast.success(result.message || "Đăng ký thành công!");
            if (result) {
                router.push(`/verifyEmail`);
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
        <div className="flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md border-0 overflow-hidden">
                <CardTitle className="text-2xl font-bold text-center">ĐĂNG KÝ</CardTitle>
                <CardContent className="">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
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

                            <Separator className="my-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Địa chỉ</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    name="address.ward"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Phường/Xã</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                    <Input placeholder="Phường/Xã" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="address.buildingName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Tên tòa nhà (nếu có)</FormLabel>
                                            <FormControl><Input placeholder="Tên tòa nhà" className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="address.city"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Thành phố</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                    <Input placeholder="Thành phố" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                                </div>
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
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                    <Input placeholder="Quận/Huyện" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                                </div>
                                            </FormControl>
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

                                <FormField
                                    name="address.pincode"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700">Mã bưu chính</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                    <Input placeholder="Mã bưu chính" className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-medium"
                            >
                                Đăng ký
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="bg-gray-50 py-4 px-6 flex justify-center">
                    <p className="text-gray-600">
                        Đã có tài khoản?
                        <a href="/login" className="text-orange-600 hover:text-orange-700 font-medium ml-1">
                            Đăng nhập
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterForm;