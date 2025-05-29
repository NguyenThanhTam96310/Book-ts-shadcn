'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import MenuProfile from "@/features/profile/components/MenuProfile"
import { useForm } from "react-hook-form"
import { EditPassWordBody } from "@/features/profile/services/profile.Schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { fetchEditPassword } from "@/features/profile/services/profile.service"

const EditPasswordForm = () => {
    const form = useForm<z.infer<typeof EditPassWordBody>>({
        resolver: zodResolver(EditPassWordBody),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof EditPassWordBody>) => {
        try {
            await fetchEditPassword(values)
            toast.success("Thay đổi mật khẩu thành công.")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại.")
            }
            console.error(error)
        }
    }

    return (
        <div>
            {/* Main content */}
            <div className="flex-1">
                <Card className="mx-auto shadow-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-orange-600">
                            Thay đổi mật khẩu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu cũ</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Nhập mật khẩu cũ"
                                                    className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="newPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu mới</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Nhập mật khẩu mới"
                                                    className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                                                    {...field}
                                                />
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
                                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Nhập lại mật khẩu mới"
                                                    className="border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Cập nhật mật khẩu
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default EditPasswordForm
