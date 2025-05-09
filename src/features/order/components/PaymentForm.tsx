"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { CartItemType, CartProps } from "@/features/cart";
import { PAYMENT_ITEM_KEY } from "@/constants/orderConstants";
import PaymentItem from "@/components/organisms/PaymentItem";
import { fetchPromotions, PromotionItemProps } from "@/features/promotion";

import { paymentCustomer, paymentUser } from "@/features/order/services/order.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { USER_ID } from "@/constants/cartConstants";
import { orderSchema } from "@/features/order/services/order.Schema";
import { fetchUserByToken } from "@/features/auth/services/auth.service";
import { UserProps } from "@/features/auth/services/type";


const cartSchema = z.object({
    cartItems: z.array(
        z.object({
            product: z.object({
                productId: z.number().min(1),
            }),
            quantity: z.number().min(1),
        })
    ),
    totalPrice: z.number().min(0),
});

const addressFields: Array<keyof z.infer<typeof orderSchema>['order']['address']> = [
    'ward',
    'buildingName',
    'city',
    'district',
    'country',
    'pincode',
];

const addressFieldLabels: Record<keyof z.infer<typeof orderSchema>['order']['address'], string> = {
    ward: "Phường/Xã",
    buildingName: "Tên tòa nhà/Số nhà",
    city: "Thành phố",
    district: "Quận/Huyện",
    country: "Quốc gia",
    pincode: "Mã bưu điện",
};

export default function PaymentForm() {
    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            order: {
                email: "",
                deliveryName: "",
                deliveryPhone: "",
                address: {
                    ward: "",
                    buildingName: "",
                    city: "",
                    district: "",
                    country: "Việt Nam",
                    pincode: "",
                },
                payment: {
                    paymentMethod: "COD",
                },
                freeship: undefined,
            },
            productIds: [
                1
            ],
            productQuantities: []

        },
    });
    const [userId, setUserId] = useState<number | null>(null)
    const [user, setUser] = useState<UserProps | null>(null)
    const [showCouponOptions, setShowCouponOptions] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
    const [cart, setCart] = useState<CartProps>({
        cartId: undefined,
        cartItems: [],
        totalPrice: 0,
    });
    const [promotions, setPromotions] = useState<PromotionItemProps[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const storedUserId = localStorage.getItem(USER_ID);
            if (storedUserId) {
                form.setValue("productIds", [Number(storedUserId)]);
                setUserId(parseInt(storedUserId, 10));
                const token = localStorage.getItem("authToken");
                if (!token) {
                    throw new Error("Không nhận được token từ server");
                }

                // Fetch user info from token
                const user = await fetchUserByToken();
                if (user?.userId && user?.email) {
                    localStorage.setItem("userId", user.userId.toString());
                    localStorage.setItem("username", user.email);
                }
                setUser(user)
                form.setValue("order.deliveryName", user.fullName || "");
                form.setValue("order.email", user.email || "");
                form.setValue("order.deliveryPhone", user.mobileNumber || "");
            }
        };

        fetchData(); // Call the async function
    }, []); // Chạy một lần khi component mount

    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = localStorage.getItem(PAYMENT_ITEM_KEY);
                const dataPromo = await fetchPromotions();
                setPromotions(dataPromo);

                if (raw) {
                    const data = JSON.parse(raw) as {
                        cartItems: CartItemType[];
                        totalPrice: number;
                    };
                    const validated = cartSchema.safeParse(data);
                    if (raw) {
                        const data = JSON.parse(raw) as {
                            cartItems: CartItemType[];
                            totalPrice: number;
                        };
                        setCart({
                            cartId: undefined,
                            cartItems: data.cartItems || [],
                            totalPrice: data.totalPrice || 0,
                        });

                        const productQuantities = data.cartItems.map((item) => ({
                            productId: Number(item.product.productId),
                            quantity: item.quantity,
                        }));

                        form.reset({
                            ...form.getValues(),
                            productQuantities,
                        });
                    } else {
                        console.error("Invalid cart data:", validated.error);
                        localStorage.removeItem(PAYMENT_ITEM_KEY);
                    }
                }
            } catch (error) {
                console.error("Failed to load cart data:", error);
                localStorage.removeItem(PAYMENT_ITEM_KEY);
            }
        };

        fetchData();
    }, [form]);

    const handleApplyCoupon = (promotion_code?: string) => {
        const coupon = promotions.find(
            (c) => c.promotionCode === (promotion_code || couponInput.toUpperCase())
        );

        if (!coupon) {
            toast.error("Mã không hợp lệ");
            return;
        }

        const expired = coupon.endDate
            ? new Date(coupon.endDate) < new Date()
            : true;

        if (expired) {
            toast.error("Mã đã hết hạn");
            return;
        }

        if (!appliedCoupons.includes(coupon.promotionCode)) {
            setAppliedCoupons([...appliedCoupons, coupon.promotionCode]);
            setCouponInput("");
        }

        if (coupon.promotionType === "FREESHIP") {
            form.setValue("order.freeship", { promotionCode: coupon.promotionCode });
        }
    };

    const handleRemoveCoupon = (coupon: string) => {
        setAppliedCoupons(appliedCoupons.filter((c) => c !== coupon));
        if (form.getValues("order.freeship")?.promotionCode === coupon) {
            form.setValue("order.freeship", undefined);
        }
    };
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof orderSchema>) => {
        try {
            if (userId) {
                console.log("Form data:", values); // Log dữ liệu gửi đi
                const result = await paymentUser(values);
                toast.success("Đặt hàng thành công!");
                localStorage.removeItem(PAYMENT_ITEM_KEY);
                router.push("/")
            } else {
                console.log("Form data:", values); // Log dữ liệu gửi đi
                const result = await paymentCustomer(values);
                toast.success("Đặt hàng thành công!");
                localStorage.removeItem(PAYMENT_ITEM_KEY);
                router.push("/")
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred.");
            }
            console.error(error);
        }
    };

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    const baseShippingFee = 32000;
    const appliedFreeship = appliedCoupons
        .map((code) => promotions.find((p) => p.promotionCode === code))
        .find((p) => p?.promotionType === "FREESHIP");
    const shippingFee =
        appliedFreeship && Number(appliedFreeship.value) === 100 && Number(appliedFreeship.valueType) === 1
            ? 0
            : baseShippingFee;
    const totalWithShipping = Number(cart.totalPrice) + shippingFee;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="max-w-3xl mx-auto space-y-6 p-4 bg-white"
            >
                {/* ĐỊA CHỈ */}
                <h2 className="text-xl font-semibold">ĐỊA CHỈ GIAO HÀNG</h2>

                <FormField
                    control={form.control}
                    name="order.deliveryName"
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
                    name="order.email"
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
                    name="order.deliveryPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ví dụ: 0979123xxx (10 ký tự số)"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Địa chỉ chi tiết */}
                <div className="grid grid-cols-2 gap-4">
                    {addressFields.map((fieldName) => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={`order.address.${fieldName}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{addressFieldLabels[fieldName]}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Nhập ${addressFieldLabels[fieldName].toLowerCase()}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>

                {/* THANH TOÁN */}
                <h2 className="text-xl font-semibold border-b-2 pb-1">PHƯƠNG THỨC THANH TOÁN</h2>
                <FormField
                    control={form.control}
                    name="order.payment.paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phương thức</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="COD">Thanh toán khi nhận hàng</SelectItem>
                                        <SelectItem value="PAYPAL">Thanh toán Paypal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* KHUYẾN MÃI */}
                <h2 className="text-xl font-semibold border-b-2 pb-1">MÃ KHUYẾN MÃI</h2>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập mã khuyến mãi (không phân biệt hoa thường)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    />
                    <Button type="button" onClick={() => handleApplyCoupon()}>
                        Áp dụng
                    </Button>
                    <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowCouponOptions(!showCouponOptions)}
                    >
                        {showCouponOptions ? "Ẩn mã" : "Chọn mã"}
                    </Button>
                </div>

                {appliedCoupons.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Đã áp dụng</h4>
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

                {showCouponOptions && (
                    <div className="mt-2 border p-3 rounded-md bg-gray-50 space-y-2">
                        {promotions.map((coupon) => (
                            <div
                                key={coupon.promotionId}
                                className="flex justify-between items-center"
                            >
                                <span>{coupon.promotionName}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleApplyCoupon(coupon.promotionCode)}
                                    disabled={appliedCoupons.includes(coupon.promotionCode)}
                                >
                                    {appliedCoupons.includes(coupon.promotionCode) ? "Đã áp dụng" : "Áp dụng"}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* DANH SÁCH SẢN PHẨM */}
                <h2 className="text-xl font-semibold border-b-2 pb-1">ĐƠN HÀNG</h2>
                <div className="space-y-4">
                    {(cart.cartItems ?? []).length > 0 ? (
                        (cart.cartItems ?? []).map((ci, index) => (
                            <PaymentItem key={`${ci.product.productId}-${index}`} item={ci} />
                        ))
                    ) : (
                        <p>Giỏ hàng trống</p>
                    )}
                </div>

                {/* TỔNG TIỀN */}
                <div className="sticky bottom-0 bg-white p-4 border-t mt-4">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Thành tiền</span>
                            <span>{formatCurrency(Number(cart.totalPrice))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phí vận chuyển</span>
                            <span>{formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Tổng cộng</span>
                            <span className="text-yellow-500">{formatCurrency(totalWithShipping)}</span>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-600 text-white text-base font-semibold"
                        disabled={(cart.cartItems ?? []).length === 0}
                    >
                        Xác nhận thanh toán
                    </Button>
                </div>
            </form>
        </Form>
    );
}