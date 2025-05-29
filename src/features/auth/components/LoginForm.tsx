"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, LogIn } from "lucide-react"
import { fetchUserByToken, login } from "@/features/auth/services/auth.service"
import { LoginBody } from "@/features/auth/services/auth.schema"
import { fetchCart } from "@/features/cart/services/service"
import { POST_ADD } from "@/lib/api/Service"
import type { CartProps } from "@/features/cart"
import { CART_ITEM_KEY } from "@/constants/cartConstants"

const LoginForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl") || "/";
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof LoginBody>>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            username: "",
            password: "",
        },
    })
    const handleGoogleLogin = () => {
        localStorage.removeItem("googleSynced")
        signIn("google")
    }

    useEffect(() => {
        const handleSyncAfterGoogle = async () => {
            const isSynced = localStorage.getItem("googleSynced")
            if (!isSynced && session?.accessToken) {
                try {
                    localStorage.setItem("authToken", session.accessToken)
                    localStorage.setItem("authTokenExpiry", session.expires)
                    localStorage.setItem("username", session.user.email)
                    const data = await fetchUserByToken(session.accessToken)
                    if (data?.userId && data?.email) {
                        localStorage.setItem("userId", data.userId)
                    }

                    const raw = localStorage.getItem(CART_ITEM_KEY)
                    // Đánh dấu là đã đồng bộ
                    localStorage.setItem("googleSynced", "true")

                    // Điều hướng
                    const redirect = searchParams?.get("redirect") || "/"
                    window.location.href = redirect
                } catch (error) {
                    console.error("Đồng bộ Google thất bại:", error)
                }
            }
        }

        handleSyncAfterGoogle()
    }, [session])

    const onSubmit = async (values: z.infer<typeof LoginBody>) => {
        try {
            setIsLoading(true)
            const result = await login(values)
            const token = result["jwt-token"]
            if (!token) {
                throw new Error("Không nhận được token từ server")
            }

            // Lưu token và expiryTime vào localStorage
            localStorage.setItem("authToken", token)
            // Đặt thời gian hết hạn cho token (3 ngày)
            const expiryTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000
            localStorage.setItem("authTokenExpiry", expiryTime.toString())

            const user = await fetchUserByToken(token)
            if (user?.userId && user?.email) {
                localStorage.setItem("userId", user.userId)
                localStorage.setItem("username", user.email)
            }

            const raw = localStorage.getItem(CART_ITEM_KEY)
            if (raw) {
                try {
                    const localCart = JSON.parse(raw) as {
                        cartItems: Array<{
                            product: { productId: number }
                            quantity: number
                        }>
                        totalPrice?: number
                    }

                    if (localCart?.cartItems?.length > 0) {
                        // Lấy giỏ hàng trên server
                        const serverCart: CartProps = await fetchCart(user.userId)

                        const existingIds = new Set((serverCart.cartItems || []).map((ci) => ci.product.productId))

                        // Gửi POST_ADD cho mỗi item chưa có trên server
                        await Promise.all(
                            localCart.cartItems
                                .filter((item) => !existingIds.has(item.product.productId))
                                .map((item) =>
                                    POST_ADD("/public/carts", {
                                        userId: user.userId,
                                        productId: item.product.productId,
                                        quantity: item.quantity,
                                    }),
                                ),
                        )
                    }

                    // Xóa local cart sau khi đã đồng bộ
                    localStorage.removeItem(CART_ITEM_KEY)
                } catch (error) {
                    console.error("Failed to sync local cart:", error)
                }
            }

            // Điều hướng
            const redirect = searchParams?.get("redirect") || "/"
            window.location.href = redirect
        } catch (error) {
            console.error("Lỗi đăng nhập:", error)
            form.setError("root", {
                message: "Tên đăng nhập hoặc mật khẩu không đúng!",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh] ">
            <Card className="w-full max-w-md  border-0 overflow-hidden">
                <CardTitle className="text-2xl font-bold text-center">ĐĂNG NHẬP</CardTitle>
                <CardContent className=" px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {form.formState.errors.root && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
                                    {form.formState.errors.root.message}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input
                                                    placeholder="Nhập email của bạn"
                                                    className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                                                    {...field}
                                                />
                                            </div>
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
                                        <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input
                                                    type="password"
                                                    placeholder="Nhập mật khẩu của bạn"
                                                    className="pl-10 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end">
                                <a href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                                    Quên mật khẩu?
                                </a>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 font-medium cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center ">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Đăng nhập
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-6">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                            Hoặc
                        </span>
                    </div>

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full h-11 border-gray-300 hover:bg-gray-50 mb-4 cursor-pointer"
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Đăng nhập với Google
                    </Button>
                </CardContent>

                <CardFooter className="px-6 flex justify-center">
                    <p className="text-gray-600">
                        Chưa có tài khoản?
                        <a href="/register" className="text-orange-600 hover:text-orange-700 font-medium ml-1">
                            Đăng ký ngay
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default LoginForm
