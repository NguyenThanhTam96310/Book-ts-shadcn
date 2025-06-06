"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ContactSchema } from "@/features/contact/services/contact.Schema"
import { toast } from "react-toastify"
import { fetchContact } from "@/features/contact/services/contact.service"

export default function RegisterPromotionForm() {
    const form = useForm<z.infer<typeof ContactSchema>>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            email: "",
            title: "Đăng ký nhận tin khuyến mãi",
            mobileNumber: "0000000000",
            content: "Nhận thông báo về sách mới và ưu đãi đặc biệt",
        },
    })

    const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
        try {
            await fetchContact(values)
            toast.success("Đăng kí thành công.", {
                position: "top-right",
                autoClose: 2000,
            })
            form.reset()
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.", {
                    position: "top-right",
                    autoClose: 2000,
                })
            }
            console.error(error)
        }
    }

    return (
        <div className="relative border-t border-white/10 bg-gradient-to-r from-orange-500/10 to-red-500/10">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-400" />
                            Đăng ký nhận tin khuyến mãi
                        </h3>
                        <p className="text-gray-300">Nhận thông báo về sách mới và ưu đãi đặc biệt</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 w-full md:w-auto max-w-md">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="md:min-w-[320px] lg:min-w-[400px]">
                                        {/* <FormLabel className="text-white font-semibold">Email</FormLabel> */}
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
                            <Button
                                type="submit"
                                className="h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Đăng ký
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}