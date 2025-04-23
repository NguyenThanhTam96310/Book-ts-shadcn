"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { login } from "@/features/auth/services/auth.service"
import { LoginBody } from "@/features/auth/services/auth.schema"
import { useState } from "react"


const LoginForm = () => {

    const router = useRouter()

    const form = useForm<z.infer<typeof LoginBody>>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginBody>) => {
        const { username, password } = values;
        try {
            const result = await login(values);
            const token = result["jwt-token"];
            if (!token) {
                throw new Error("Không nhận được token từ server");
            }
            localStorage.setItem("authToken", token);
            localStorage.setItem("username", username);

            // Điều hướng
            router.push("/");
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm mx-auto mt-20">
                <h2 className="text-xl font-semibold text-center">Đăng nhập</h2>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">Đăng nhập
                </Button>

                <p className="text-center mt-2">
                    Chưa có tài khoản? <a href="/Register" className="text-blue-500 underline">Đăng ký</a>
                </p>
            </form>
        </Form>
    )
}

export default LoginForm
