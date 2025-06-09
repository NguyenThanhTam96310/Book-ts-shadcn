"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageCircle, Send, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { fetchContact } from "@/features/contact/services/contact.service";
import ReCAPTCHA from "react-google-recaptcha";
import { ContactSchema } from "@/features/contact/services/contact.Schema";

export default function ContactForm() {
    const [capVal, setCapVal] = useState<string | null>(null);

    const form = useForm<z.infer<typeof ContactSchema>>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            email: "",
            title: "",
            mobileNumber: "",
            content: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
        try {
            if (!capVal) {
                toast.error("Vui lòng xác thực rằng bạn không phải là robot.", {
                    position: "top-right",
                    autoClose: 2000,
                });
                return;
            }

            // Thêm recaptchaToken vào dữ liệu gửi đi (dù schema không yêu cầu, API có thể cần)
            const submissionData = {
                ...values,
                recaptchaToken: capVal,
            };

            await fetchContact(submissionData);
            toast.success("Gửi thông tin thành công.", {
                position: "top-right",
                autoClose: 2000,
            });
            form.reset();
            setCapVal(null); // Reset reCAPTCHA token
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 2000,
                });
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.", {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Company Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-orange-600 mb-6 flex items-center gap-3">
                                <Building className="w-8 h-8" />
                                NHÀ SÁCH BOOKSTORE
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Địa chỉ</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Số 20 Tăng Nhơn Phú - Phường Phước Long B - Thành phố Thủ Đức - TP. Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Điện thoại</h3>
                                        <p className="text-gray-600">
                                            Điện thoại: <span className="font-semibold text-orange-600">(024) 1111 1111</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                                        <p className="text-gray-600">
                                            Email: <span className="font-semibold text-orange-600">bookstore@info.vn</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <Card className="border-0 shadow-xl py-0">
                            <CardHeader className="bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-t-lg py-5">
                                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                    <MessageCircle className="w-6 h-6" />
                                    Gửi tin nhắn cho chúng tôi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-semibold">Họ & tên</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Họ & tên..."
                                                            {...field}
                                                            className="h-12 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="mobileNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-semibold">Số điện thoại</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Số điện thoại..."
                                                                {...field}
                                                                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                                required
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
                                                    <FormItem>
                                                        <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="Email"
                                                                {...field}
                                                                className="h-12 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                                                                required
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="content"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-semibold">Nội dung</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Nội dung..."
                                                            {...field}
                                                            rows={6}
                                                            className="border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                                                            required
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string} // Sửa tên biến
                                            onChange={(val) => setCapVal(val)}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={!capVal}
                                            className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg font-semibold"
                                        >
                                            <Send className="w-5 h-5" />
                                            Gửi tin nhắn
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Map */}
            <footer className="bg-gray-800 text-white">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6590.507590508663!2d106.77265989509044!3d10.831254951450195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752701a34a5d5f%3A0x30056b2fdf668565!2zQ2FvIMSQ4bqzbmcgQ8O0bmcgVGjGsMahbmcgVFAuSENN!5e0!3m2!1svi!2s!4v1749045789727!5m2!1svi!2s"
                    width="100%"
                    height="800"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </footer>
        </div>
    );
}