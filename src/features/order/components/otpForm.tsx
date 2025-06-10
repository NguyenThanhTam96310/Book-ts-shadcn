"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { OrderOTPResSchema } from "@/features/order/services/order.Schema"
import { otpCustomer, resendOtpCustomer } from "@/features/order/services/order.service"
import { PAYMENT_ITEM_KEY } from "@/constants/orderConstants"

type OtpFormProps = {
    email: string
    orderId: number
    deliveryPhone: string
    orderCode: string
    open: boolean
    onClose: () => void
}

export function OtpForm({
    email,
    orderId,
    deliveryPhone,
    orderCode,
    open,
    onClose
}: OtpFormProps) {
    const [dialogOpen, setDialogOpen] = React.useState(open)
    const router = useRouter()

    const form = useForm<z.infer<typeof OrderOTPResSchema>>({
        resolver: zodResolver(OrderOTPResSchema),
        defaultValues: {
            code: "",
            email,
            orderId: orderId.toString(),
            deliveryPhone,
            type: "ACCOUNT_VERIFICATION",
            orderCode,
        },
    })

    const onSubmit = async (values: z.infer<typeof OrderOTPResSchema>) => {
        try {
            try {
                await otpCustomer(values)
                toast.success("Xác thực thành công!")
                onClose()
                localStorage.removeItem(PAYMENT_ITEM_KEY);
                router.push(`/payment/checkout?vnp_TxnRef=${orderCode}`);
            } catch (error: any) {
                // Xử lý lỗi từ Zod hoặc API
                if (typeof error === "object" && error !== null) {
                    // Hiển thị từng lỗi cụ thể
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    // Lỗi chung nếu không có chi tiết
                    toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                }
            }

        } catch {
            toast.error("Xác thực thất bại.")
        }
    }
    const onResend = async () => {
        try {
            try {
                await resendOtpCustomer(orderCode)
                toast.success("Gửi lại Otp thành công.")
            } catch (error: any) {
                // Xử lý lỗi từ Zod hoặc API
                if (typeof error === "object" && error !== null) {
                    // Hiển thị từng lỗi cụ thể
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    // Lỗi chung nếu không có chi tiết
                    toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                }
            }

        } catch {
            toast.error("Xác thực thất bại.")
        }
    }

    React.useEffect(() => {
        setDialogOpen(open)
    }, [open])

    return (
        <Dialog open={dialogOpen} onOpenChange={(val) => { setDialogOpen(val); if (!val) onClose(); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nhập mã OTP</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập mã OTP..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                            Xác nhận
                        </Button>

                    </form>
                    <Button onClick={onResend} className="w-full bg-orange-500 text-white hover:bg-orange-600">
                        Gửi lại mã xác nhận
                    </Button>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
