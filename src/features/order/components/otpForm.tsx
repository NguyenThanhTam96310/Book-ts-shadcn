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
import { otpCustomer } from "@/features/order/services/order.service"

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
            await otpCustomer(values)
            toast.success("Xác thực thành công!")
            onClose()
            router.push("/")
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
                </Form>
            </DialogContent>
        </Dialog>
    )
}
