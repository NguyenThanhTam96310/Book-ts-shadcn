"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { fetchUserByEmail, fetchUserByToken, login } from "@/features/auth/services/auth.service"
import { LoginBody } from "@/features/auth/services/auth.schema"
import { useState } from "react"
import { toast } from "react-toastify"
import { fetchCart } from "@/features/cart/services/service"
import { POST_ADD } from "@/lib/api/Service"
import { CartItemType, CartProps } from "@/features/cart"
import { CART_ITEM_KEY } from "@/constants/cartConstants"


const LoginForm = () => {

    const router = useRouter()
    const searchParams = useSearchParams();
    const form = useForm<z.infer<typeof LoginBody>>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginBody>) => {
        try {
            const result = await login(values);
            const token = result["jwt-token"];
            if (!token) {
                throw new Error("Không nhận được token từ server");
            }
            // Lưu token và expiryTime vào localStorage
            localStorage.setItem("authToken", token);
            // Đặt thời gian hết hạn cho token (3 ngày)
            const expiryTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
            localStorage.setItem("authTokenExpiry", expiryTime.toString());

            const user = await fetchUserByToken();
            if (user?.userId && user?.email) {
                localStorage.setItem("userId", user.userId);
                localStorage.setItem("username", user.email);
            }
            const raw = localStorage.getItem(CART_ITEM_KEY);
            if (raw) {
                try {
                    const localCart = JSON.parse(raw) as {
                        cartItems: Array<{
                            product: { productId: number };
                            quantity: number;
                        }>;
                        totalPrice?: number;
                    };

                    if (localCart?.cartItems?.length > 0) {
                        // Lấy giỏ hàng trên server
                        const serverCart: CartProps = await fetchCart(user.userId);

                        const existingIds = new Set(
                            (serverCart.cartItems || []).map(ci => ci.product.productId)
                        );

                        // Gửi POST_ADD cho mỗi item chưa có trên server
                        await Promise.all(
                            localCart.cartItems
                                .filter(item => !existingIds.has(item.product.productId))
                                .map(item =>
                                    POST_ADD("/public/carts", {
                                        cartId: user.userId,
                                        productId: item.product.productId,
                                        quantity: item.quantity,
                                    })
                                )
                        );
                    }

                    // Xóa local cart sau khi đã đồng bộ
                    localStorage.removeItem(CART_ITEM_KEY);

                } catch (error) {
                    console.error("Failed to sync local cart:", error);
                }
            }
            // Điều hướng
            const redirect = searchParams.get("redirect") || "/";
            // Sau khi login thành công:
            window.location.href = redirect;
            // router.push("/");
            // router.refresh();

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
