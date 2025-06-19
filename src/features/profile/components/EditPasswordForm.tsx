"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { EditPassWordBody } from "@/features/profile/services/profile.Schema"
import { fetchEditPassword } from "@/features/profile/services/profile.service"
import { toast } from "react-toastify"


// Mock toast function

const EditPasswordForm = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof EditPassWordBody>>({
        resolver: zodResolver(EditPassWordBody),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof EditPassWordBody>) => {
        try {
            setIsSubmitting(true)
            await fetchEditPassword(values)
            toast.success("Thay đổi mật khẩu thành công.", {
                position: "top-right",
                autoClose: 2000,
            });
            form.reset()
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.", {
                    position: "top-right",
                    autoClose: 2000,
                })
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.", {
                    position: "top-right",
                    autoClose: 2000,
                })
            }
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: "", color: "" }
        if (password.length < 6) return { strength: 1, label: "Yếu", color: "text-red-500" }
        if (password.length < 8) return { strength: 2, label: "Trung bình", color: "text-yellow-500" }
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { strength: 3, label: "Mạnh", color: "text-green-500" }
        }
        return { strength: 2, label: "Trung bình", color: "text-yellow-500" }
    }

    const newPassword = form.watch("newPassword")
    const passwordStrength = getPasswordStrength(newPassword)

    return (
        <div >
            <div className="w-full  mx-auto">
                <Card className=" border-0 shadow-2xl overflow-hidden">
                    {/* Header with gradient background */}
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-purple-600 text-white p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-bold mb-2">Thay đổi mật khẩu</CardTitle>
                                <p className="text-blue-100">Bảo vệ tài khoản của bạn với mật khẩu mạnh</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        {/* Security Tips */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-800 mb-2">Lời khuyên bảo mật</h3>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Sử dụng ít nhất 8 ký tự</li>
                                        <li>• Kết hợp chữ hoa, chữ thường và số</li>
                                        <li>• Không sử dụng thông tin cá nhân</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Current Password */}
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Mật khẩu hiện tại
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        placeholder="Nhập mật khẩu hiện tại"
                                                        className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-12"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* New Password */}
                                <FormField
                                    name="newPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Mật khẩu mới
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Nhập mật khẩu mới"
                                                        className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-12"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </FormControl>

                                            {/* Password Strength Indicator */}
                                            {newPassword && (
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm text-gray-600">Độ mạnh:</span>
                                                        <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                                                            {passwordStrength.label}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 1
                                                                ? "bg-red-500 w-1/3"
                                                                : passwordStrength.strength === 2
                                                                    ? "bg-yellow-500 w-2/3"
                                                                    : "bg-green-500 w-full"
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Confirm Password */}
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Xác nhận mật khẩu mới
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Nhập lại mật khẩu mới"
                                                        className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-12"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold h-14"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Đang cập nhật...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5" />
                                                Cập nhật mật khẩu
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>

                        {/* Additional Security Info */}
                        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Mật khẩu của bạn được mã hóa và bảo mật tuyệt đối</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EditPasswordForm
