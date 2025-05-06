"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Badge } from "lucide-react";
import { CartItemType, CartProps } from "@/features/cart";
import { PAYMENT_ITEM_KEY } from "@/constants/orderConstants";
import PaymentItem from "@/components/organisms/PaymentItem";

const validCoupons = [
    {
        code: "GIAM10",
        type: "percent",
        value: 10,
        expires: "2025-06-30",
        description: "Giảm 10%"
    },
    {
        code: "FREESHIP",
        type: "shipping",
        value: 0,
        expires: "2025-12-31",
        description: "Miễn phí vận chuyển"
    },
    {
        code: "BOOK50K",
        type: "fixed",
        value: 50000,
        expires: "2025-07-01",
        description: "Giảm 50.000đ"
    },
];

const orderSchema = z.object({
    delivery_name: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.string().email("Email không hợp lệ"),
    delivery_phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    country: z.string(),
    city: z.string().min(1, "Chọn tỉnh/thành phố"),
    district: z.string().min(1, "Chọn quận/huyện"),
    ward: z.string().min(1, "Chọn phường/xã"),
    address_detail: z.string().min(1, "Vui lòng nhập địa chỉ"),
    payment_method: z.string().min(1, "Vui lòng chọn phương thức thanh toán"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function PaymentForm() {
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            country: "Việt Nam",
        },
    });
    const [showCouponOptions, setShowCouponOptions] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
    const [cart, setCart] = useState<CartProps>({
        cartId: undefined,
        cartItems: [],
        totalPrice: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = localStorage.getItem(PAYMENT_ITEM_KEY);
                if (raw) {
                    const data = JSON.parse(raw) as { cartItems: CartItemType[]; totalPrice: number };
                    setCart({
                        cartId: undefined,
                        cartItems: data.cartItems || [],
                        totalPrice: data.totalPrice || 0,
                    });
                }
            } catch (error) {
                console.error("Failed to parse local cart data:", error);
            }
        };

        fetchData();
    }, []);

    const handleApplyCoupon = (code?: string) => {
        const coupon = validCoupons.find(c => c.code === (code || couponInput.toUpperCase()));

        if (!coupon) {
            alert("Mã không hợp lệ");
            return;
        }

        const isExpired = new Date(coupon.expires) < new Date();
        if (isExpired) {
            alert("Mã đã hết hạn");
            return;
        }

        if (!appliedCoupons.includes(coupon.code)) {
            setAppliedCoupons([...appliedCoupons, coupon.code]);
            setCouponInput("");
        }
    };

    const handleRemoveCoupon = (coupon: string) => {
        setAppliedCoupons(appliedCoupons.filter(c => c !== coupon));
    };

    const onSubmit = (values: OrderFormValues) => {
        console.log("Order Data:", values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6 p-4 bg-white relative">
                <h2 className="text-xl font-semibold">ĐỊA CHỈ GIAO HÀNG</h2>

                <FormField
                    control={form.control}
                    name="delivery_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Họ và tên người nhận</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập họ và tên người nhận" {...field} />
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
                    name="delivery_phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                                <Input placeholder="Ví dụ: 0979123xxx (10 ký tự số)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quốc gia</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue="Việt Nam">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn quốc gia" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Việt Nam">Việt Nam</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tỉnh/Thành Phố</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn tỉnh/thành Phố" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HCM">Hồ Chí Minh</SelectItem>
                                            <SelectItem value="HN">Hà Nội</SelectItem>
                                            <SelectItem value="DN">Đà Nẵng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quận/Huyện</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn quận/huyện" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Q1">Quận 1</SelectItem>
                                            <SelectItem value="Q2">Quận 2</SelectItem>
                                            <SelectItem value="Q3">Quận 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ward"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phường/Xã</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn phường/xã" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="P1">Phường 1</SelectItem>
                                            <SelectItem value="P2">Phường 2</SelectItem>
                                            <SelectItem value="P3">Phường 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address_detail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Địa chỉ nhận hàng</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập địa chỉ nhận hàng" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <h2 className="text-xl font-semibold border-b-2 border-solid pb-1">
                    PHƯƠNG THỨC THANH TOÁN
                </h2>

                <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phương thức</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cod">Thanh toán khi nhận hàng</SelectItem>
                                        <SelectItem value="paypal">Thanh toán Paypal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <h2 className="text-xl font-semibold border-b-2 border-solid pb-1">MÃ KHUYẾN MÃI/MÃ QUÀ TẶNG</h2>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập mã khuyến mãi/Quà tặng"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <Button type="button" onClick={() => handleApplyCoupon()}>
                        Áp dụng
                    </Button>
                    <Button type="button" onClick={() => setShowCouponOptions(!showCouponOptions)} variant="link" className="text-sm text-blue-600 self-center hover:underline">
                        Chọn mã khuyến mãi
                    </Button>
                </div>
                {appliedCoupons.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Mã giảm giá đã áp dụng</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {appliedCoupons.map((coupon) => (
                                <div
                                    key={coupon}
                                    className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                >
                                    <span>{coupon}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCoupon(coupon)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {showCouponOptions && (
                        <div className="mt-2 border p-3 rounded-md bg-gray-50 space-y-2">
                            <h3 className="font-semibold">Chọn mã giảm giá</h3>
                            <div className="space-y-2">
                                {validCoupons.map((coupon) => (
                                    <div
                                        key={coupon.code}
                                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
                                    >
                                        <span className="text-sm">{coupon.description}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyCoupon(coupon.code)}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        Có thể áp dụng đồng thời nhiều mã <span className="text-gray-400">ℹ️</span>
                    </p>
                </div>
                <h2 className="text-xl font-semibold border-b-2 border-solid pb-1">KIỂM TRA LẠI ĐƠN HÀNG</h2>

                <div className="space-y-4">
                    {cart.cartItems && cart.cartItems.length > 0 ? (
                        cart.cartItems.map((ci, index) => (
                            <PaymentItem
                                key={`${ci.product.productId}-${index}`}
                                item={ci}
                            />
                        ))
                    ) : (
                        <p>Giỏ hàng trống</p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <input type="checkbox" required />
                    <label className="text-sm text-gray-600">Bằng việc tiến hành Mua hàng, bạn đã đồng ý với <a className="text-blue-500 underline" href="#">Điều khoản & Điều kiện</a></label>
                </div>

                <div className="sticky bottom-0 bg-white p-4 border-t">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Thành tiền</span>
                            <span>{cart.totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí vận chuyển (Giao hàng tiêu chuẩn)</span>
                            <span>32.000 ₫</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Tổng Số Tiền (gồm VAT)</span>
                            <span className="text-yellow-500">{cart.totalPrice} ₫</span>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-base font-semibold">
                        Xác nhận thanh toán
                    </Button>
                </div>
            </form>
        </Form>
    );
}