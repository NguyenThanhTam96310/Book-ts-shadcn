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
import { fetchPromotions, PromotionItemRes } from "@/features/promotion";
import { paymentCustomer, paymentUser } from "@/features/order/services/order.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { USER_ID } from "@/constants/cartConstants";
import { orderSchema } from "@/features/order/services/order.Schema";
import { fetchUserByToken } from "@/features/auth/services/auth.service";
import { calculateShippingFee, getDistricts, getProvinces, getWards } from "@/features/order/services/ghn.service";
import { OtpForm } from "@/features/order/components/otpForm";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import PromotionForm from "@/features/promotion/components/PromotionForm";
import { UserRes } from "@/features/profile/services/type";
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

export default function PaymentForm() {
    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            order: {
                userId: undefined,
                email: "",
                deliveryName: "",
                deliveryPhone: "",
                address: {
                    ward: "",
                    buildingName: "",
                    city: "",
                    district: "",
                    country: "Việt Nam",
                    cityCode: "",
                    districtCode: "",
                    wardCode: "",
                },
                payment: {
                    paymentMethod: "COD",
                },
                coupon: undefined,
                freeship: undefined,
            },
            productIds: [],
            productQuantities: [],
        },
    });

    const [userId, setUserId] = useState<number | null>(null);
    const [user, setUser] = useState<UserRes | null>(null);
    const [showCouponOptions, setShowCouponOptions] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
    const [otpOpen, setOtpOpen] = useState(false)
    const [cart, setCart] = useState<CartProps>({
        userId: undefined,
        cartItems: [],
        totalPrice: 0,
    });
    const [promotions, setPromotions] = useState<PromotionItemRes[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [shippingFee, setShippingFee] = useState<number>(0); // Giá trị mặc định từ PaymentForm
    const [couponFee, setCouponFee] = useState<number>(0); // Giá trị mặc định từ PaymentForm

    const selectedProvince = form.watch("order.address.city");
    const selectedDistrict = form.watch("order.address.district");
    const selectedWard = form.watch("order.address.ward");
    const router = useRouter();
    const [otpInfo, setOtpInfo] = useState<{
        orderId: number
        email: string
        deliveryPhone: string
        orderCode: string
    } | null>(null)
    const [voucherOpen, setVoucherOpen] = useState(false);
    // Fetch user info
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUserId = localStorage.getItem(USER_ID);
                if (storedUserId) {
                    form.setValue("order.userId", Number(storedUserId));
                    setUserId(parseInt(storedUserId, 10));
                    const token = localStorage.getItem("authToken");
                    if (!token) {
                        throw new Error("Không nhận được token từ server");
                    }

                    const user = await fetchUserByToken(token);
                    if (user?.userId && user?.email) {
                        localStorage.setItem("userId", user.userId.toString());
                        localStorage.setItem("username", user.email);
                    }
                    setUser(user);
                    form.setValue("order.deliveryName", user.fullName || "");
                    form.setValue("order.email", user.email || "");
                    form.setValue("order.deliveryPhone", user.mobileNumber || "");

                    // Tự động điền địa chỉ nếu có
                    if (user?.address) {
                        form.setValue("order.address.buildingName", user.address.buildingName || "");
                        form.setValue("order.address.country", user.address.country || "Việt Nam");

                        // Lấy danh sách tỉnh/thành
                        const provincesData = await getProvinces();
                        setProvinces(provincesData);
                        const matchedProvince = provincesData.find(
                            (p: any) => p.ProvinceName === user.address.city
                        );
                        if (matchedProvince) {
                            form.setValue("order.address.city", String(matchedProvince.ProvinceID));
                            form.setValue("order.address.cityCode", String(matchedProvince.ProvinceID));

                            // Lấy danh sách quận/huyện
                            const districtsData = await getDistricts(matchedProvince.ProvinceID);
                            setDistricts(districtsData);
                            const matchedDistrict = districtsData.find(
                                (d: any) => d.DistrictName === user.address.district
                            );
                            if (matchedDistrict) {
                                form.setValue("order.address.district", String(matchedDistrict.DistrictID));
                                form.setValue("order.address.districtCode", String(matchedDistrict.DistrictID));
                                console.log(form.getValues("order.address.district"))

                                // Lấy danh sách phường/xã
                                const wardsData = await getWards(matchedDistrict.DistrictID);
                                const matchedWard = wardsData.find(
                                    (w: any) => w.WardName === user.address.ward
                                );
                                if (matchedWard) {
                                    form.setValue("order.address.ward", matchedWard.WardCode);
                                    form.setValue("order.address.wardCode", matchedWard.WardCode);
                                    console.log(form.getValues("order.address.ward"))

                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                toast.error("Không thể lấy thông tin người dùng. Vui lòng thử lại.");
            }
        };

        fetchData();
    }, [form]);
    // Fetch cart and promotions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const raw = localStorage.getItem(PAYMENT_ITEM_KEY);
                if (!raw) {
                    toast.error(
                        `Truy cập thất bại. Vui lòng thử lại sau`,
                        {
                            position: "top-right",
                            autoClose: 2000,
                        }
                    )
                    router.push("/")
                }
                const dataPromo = await fetchPromotions();
                setPromotions(dataPromo);
                if (raw) {
                    const data = JSON.parse(raw) as {
                        cartItems: CartItemType[];
                        totalPrice: number;
                    };
                    const validated = cartSchema.safeParse(data);
                    if (validated.success) {
                        setCart({
                            userId: undefined,
                            cartItems: data.cartItems || [],
                            totalPrice: data.totalPrice || 0,
                        });

                        const productQuantities = data.cartItems.map((item) => ({
                            productId: Number(item.product.productId),
                            quantity: item.quantity,
                        }));
                        const productIds = data.cartItems.map((item) => Number(item.product.productId));
                        form.reset({
                            ...form.getValues(),
                            productQuantities,
                            productIds,
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

    // Fetch provinces
    useEffect(() => {
        getProvinces().then(setProvinces);
    }, []);

    // Fetch districts based on selected province
    useEffect(() => {
        const provinceId = parseInt(selectedProvince);
        if (provinceId) {
            getDistricts(provinceId).then(setDistricts);
            form.setValue("order.address.district", ""); // Reset district
            form.setValue("order.address.ward", ""); // Reset ward
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince, form]);
    const ChecktoWardCode = form.getValues("order.address.ward");
    const calculateFee = async () => {
        const toDistrict = parseInt(selectedDistrict);
        const toWardCode = form.getValues("order.address.ward");
        if (toDistrict && toWardCode) {
            try {
                const fee = await calculateShippingFee({
                    fromDistrict: 1451, // District ID of the shop
                    toDistrict,
                    toWardCode,
                    weight: totalWeight, // gram
                    insurance_value: totalWithShipping,
                });
                setShippingFee(fee);
            } catch (error) {
                console.error("Lỗi tính phí GHN:", error);
                setShippingFee(32000); // Fallback to default
            }
        }
    };
    useEffect(() => {
        calculateFee();
    }, [selectedDistrict, form.watch("order.address.ward")]); // Dependency array
    const handleSelectPromotion = (promotionCode: string) => {
        handleApplyCoupon(promotionCode); // Áp dụng mã khuyến mãi
        setVoucherOpen(false); // Đóng VoucherForm
    };
    useEffect(() => {
        const districtId = parseInt(selectedDistrict);
        if (districtId) {
            getWards(districtId).then((wardsData) => {
                setWards(wardsData);
                // Chỉ reset ward nếu chưa có giá trị từ dữ liệu người dùng
                const currentWard = form.getValues("order.address.ward");
                if (!currentWard) {
                    form.setValue("order.address.ward", "");
                    form.setValue("order.address.wardCode", "");
                }
            });
        }
    }, [selectedDistrict, form]);
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

        // Kiểm tra nếu đã có mã cùng loại
        if (coupon.promotionType === "FREESHIP" && form.getValues("order.freeship")) {
            toast.error("Chỉ được áp dụng một mã miễn phí vận chuyển!");
            return;
        }
        if (coupon.promotionType === "VOUCHER" && form.getValues("order.coupon")) {
            toast.error("Chỉ được áp dụng một mã giảm giá!");
            return;
        }

        if (!appliedCoupons.includes(coupon.promotionCode)) {
            setAppliedCoupons([...appliedCoupons, coupon.promotionCode]);
            setCouponInput("");
        }

        if (coupon.promotionType === "FREESHIP") {
            form.setValue("order.freeship", { promotionCode: coupon.promotionCode });
        }
        if (coupon.promotionType === "VOUCHER") {
            form.setValue("order.coupon", { promotionCode: coupon.promotionCode });
        }
    };
    const appliedFreeship = appliedCoupons
        .map((code) => promotions.find((p) => p.promotionCode === code))
        .find((p) => p?.promotionType === "FREESHIP");
    const appliedCoupon = appliedCoupons
        .map((code) => promotions.find((p) => p.promotionCode === code))
        .find((p) => p?.promotionType === "VOUCHER");
    // Tính phí vận chuyển cuối cùng
    const finalShippingFee = (() => {
        if (!appliedFreeship) return shippingFee;
        const { value, valueType } = appliedFreeship;
        const numericValue = Number(value);

        if (valueType == 1) {
            // Giảm theo % phí vận chuyển
            const discount = (numericValue / 100) * shippingFee;
            return Math.max(0, shippingFee - discount);
        } else if (valueType == 0) {
            // Giảm số tiền cố định
            return Math.max(0, shippingFee - numericValue);
        }
        return shippingFee;
    })();
    const finalCouponFee =
        appliedCoupon && Number(appliedCoupon.valueType) === 1
            ? Number(cart.totalPrice) * (appliedCoupon.value / 100)
            : appliedCoupon?.value;
    const totalWithShipping = Number(cart.totalPrice) + finalShippingFee - (finalCouponFee ?? 0);
    const totalWeight = (cart.cartItems ?? []).reduce(
        (sum, item) => sum + item.product.weight * item.quantity,
        0
    );
    const handleRemoveCoupon = (coupon: string) => {
        setAppliedCoupons(appliedCoupons.filter((c) => c !== coupon));
        if (form.getValues("order.freeship")?.promotionCode === coupon) {
            form.setValue("order.freeship", undefined);
        }
        if (form.getValues("order.coupon")?.promotionCode === coupon) {
            form.setValue("order.coupon", undefined);
        }
    };

    const onSubmit = async (values: z.infer<typeof orderSchema>) => {
        try {
            let orderData = { ...values.order }; // Bắt đầu với bản sao của values.order

            // Lấy tên Tỉnh/Thành phố và gán vào orderData
            const selectedProvinceObject = provinces.find((p) => String(p.ProvinceID) === values.order.address.city);
            orderData.address.city = selectedProvinceObject?.ProvinceName || "";
            // Đảm bảo gán cả cityCode nếu cần cho API


            // Lấy tên Quận/Huyện và gán vào orderData
            const selectedDistrictObject = districts.find((d) => String(d.DistrictID) === values.order.address.district);
            orderData.address.district = selectedDistrictObject?.DistrictName || "";
            // Đảm bảo gán cả districtCode nếu cần cho API

            // Lấy tên Phường/Xã và gán vào orderData
            const selectedWardObject = wards.find((w) => w.WardCode === values.order.address.ward);
            orderData.address.ward = selectedWardObject?.WardName || "";
            // Đảm bảo gán cả wardCode nếu cần cho API


            // Tạo đối tượng finalOrderData để gửi đi, chứa các tên đã được chuyển đổi
            const finalOrderData = { ...values, order: orderData };

            // **QUAN TRỌNG: Console.log finalOrderData để xác nhận dữ liệu trước khi gửi**
            console.log("Final order data to send:", finalOrderData);
            if (userId) {
                if (values.order.payment.paymentMethod === "VNPAY") {
                    try {
                        const result = await paymentUser(values) as { url: string };
                        router.push(result.url);
                    } catch (error: any) {
                        // Xử lý lỗi từ Zod hoặc API
                        if (typeof error === "object" && error !== null) {
                            // Hiển thị từng lỗi cụ thể
                            Object.entries(error).forEach(([key, message]) => {
                                toast.error(`${message}`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            });
                        } else {
                            // Lỗi chung nếu không có chi tiết
                            toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                                position: "bottom-right",
                                autoClose: 3000,
                            });
                        }
                    }

                } else {
                    try {
                        const result = await paymentUser(values) as { orderCode: string };
                        toast.success("Đặt hàng thành công!", {
                            position: "bottom-right",
                            autoClose: 2000,
                        });
                        localStorage.removeItem(PAYMENT_ITEM_KEY);
                        router.push(`/payment/checkout?vnp_TxnRef=${result.orderCode}`);
                    } catch (error: any) {
                        // Xử lý lỗi từ Zod hoặc API
                        if (typeof error === "object" && error !== null) {
                            // Hiển thị từng lỗi cụ thể
                            Object.entries(error).forEach(([key, message]) => {
                                toast.error(`${message}`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            });
                        } else {
                            // Lỗi chung nếu không có chi tiết
                            toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                                position: "bottom-right",
                                autoClose: 3000,
                            });
                        }
                    }
                }
            } else {
                if (values.order.payment.paymentMethod === "VNPAY") {
                    try {
                        const result: { status: string; message: string; url: string } = await paymentCustomer(values);
                        localStorage.removeItem(PAYMENT_ITEM_KEY);
                        router.push(result.url);
                    } catch (error: any) {
                        // Xử lý lỗi từ Zod hoặc API
                        if (typeof error === "object" && error !== null) {
                            // Hiển thị từng lỗi cụ thể
                            Object.entries(error).forEach(([key, message]) => {
                                toast.error(`${message}`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            });
                        } else {
                            // Lỗi chung nếu không có chi tiết
                            toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                                position: "bottom-right",
                                autoClose: 3000,
                            });
                        }
                    }
                } else {
                    try {
                        const result: { orderId: number; email: string; deliveryPhone: string, orderCode: string } = await paymentCustomer(values);
                        console.log(result)
                        toast.success('Đặt hàng thành công! Vui lòng nhập OTP để xác nhận.');
                        setOtpInfo({
                            orderId: result.orderId,
                            email: result.email,
                            deliveryPhone: result.deliveryPhone,
                            orderCode: result.orderCode
                        })
                        setOtpOpen(true)
                    } catch (error: any) {
                        // Xử lý lỗi từ Zod hoặc API
                        if (typeof error === "object" && error !== null) {
                            // Hiển thị từng lỗi cụ thể
                            Object.entries(error).forEach(([key, message]) => {
                                toast.error(`${message}`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });
                            });
                        } else {
                            // Lỗi chung nếu không có chi tiết
                            toast.error("Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", {
                                position: "bottom-right",
                                autoClose: 3000,
                            });
                        }
                    }

                }
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


    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className=" mx-auto space-y-6 p-4 bg-white"
                >
                    {/* ĐỊA CHỈ */}
                    <h2 className="text-xl font-semibold">ĐỊA CHỈ GIAO HÀNG</h2>

                    <FormField
                        control={form.control}
                        name="order.deliveryName"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-4 w-full">
                                <FormLabel className="w-[150px] min-w-[50px] text-sm font-medium">
                                    Họ và tên người nhận
                                </FormLabel>
                                <FormControl className="flex-1">
                                    <Input
                                        {...field}
                                        placeholder="Nhập họ và tên người nhận"
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="order.email"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-4 w-full">
                                <FormLabel className="w-[150px] min-w-[50px] text-sm font-medium">
                                    Email
                                </FormLabel>
                                <FormControl className="flex-1">
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
                            <FormItem className="flex items-center gap-4 w-full">
                                <FormLabel className="w-[150px] min-w-[50px] text-sm font-medium">Số điện thoại</FormLabel>
                                <FormControl className="flex-1">
                                    <Input placeholder="Ví dụ: 0979123xxx (10 ký tự số)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Địa chỉ chi tiết với GHN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="order.address.city" // Tên trường trong form state
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thành phố</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value} // Giá trị hiện tại của trường trong form state
                                            onValueChange={(value) => {
                                                field.onChange(value); // Cập nhật giá trị vào form state
                                                // Cập nhật các state cục bộ và reset các trường con
                                                const selected = provinces.find((p) => String(p.ProvinceID) === value);
                                                form.setValue("order.address.cityCode", selected?.ProvinceID?.toString() || ""); // Lưu ID nếu cần
                                                // Reset các trường con
                                                const currentDistrict = form.getValues("order.address.city");
                                                if (currentDistrict !== value) {
                                                    form.setValue("order.address.district", "");
                                                    form.setValue("order.address.ward", "");
                                                    setDistricts([]);
                                                    setWards([]);
                                                }

                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tỉnh" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    provinces.map((p) => (
                                                        <SelectItem key={p.ProvinceID} value={String(p.ProvinceID)}>
                                                            {p.ProvinceName}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select Quận/Huyện */}
                        <FormField
                            control={form.control}
                            name="order.address.district" // Tên trường trong form state
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quận/huyện</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value} // Giá trị hiện tại của trường trong form state
                                            onValueChange={(value) => {
                                                // Chỉ reset nếu thay đổi thực sự
                                                const currentDistrict = form.getValues("order.address.district");
                                                if (value && value !== field.value) {
                                                    field.onChange(value);
                                                    const selected = districts.find((d) => String(d.DistrictID) === value);
                                                    form.setValue("order.address.districtCode", selected?.DistrictID?.toString() || "");
                                                    form.setValue("order.address.ward", "");
                                                    setWards([]);
                                                }
                                            }}
                                            disabled={!selectedProvince || districts.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn quận" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    districts.map((d) => (
                                                        <SelectItem key={d.DistrictID} value={String(d.DistrictID)}>
                                                            {d.DistrictName}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Select Phường/Xã */}
                        <FormField
                            control={form.control}
                            name="order.address.ward" // Tên trường trong form state
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phường/xã</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value} // Giá trị hiện tại của trường trong form state
                                            onValueChange={(value) => {
                                                if (value && value !== field.value) {
                                                    field.onChange(value); // Cập nhật giá trị vào form state
                                                    form.setValue("order.address.wardCode", value); // Lưu ID nếu cần
                                                }

                                            }}
                                            disabled={!selectedDistrict || wards.length === 0}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn phường" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    wards.map((w) => (
                                                        <SelectItem key={w.WardCode} value={w.WardCode}>
                                                            {w.WardName}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="order.address.buildingName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập số nhà, tên đường" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="order.address.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quốc gia </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập quốc gia" {...field} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    {/* THANH TOÁN */}
                    <h2 className="text-xl font-semibold border-b-2 pb-1">PHƯƠNG THỨC THANH TOÁN</h2>

                    <FormField
                        control={form.control}
                        name="order.payment.paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-3">
                                        {/* VNPAY */}
                                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                            <RadioGroupItem value="VNPAY" id="vnpay" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="vnpay" className="flex items-center space-x-2 cursor-pointer">
                                                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                                        VN
                                                    </div>
                                                    <span className="font-medium">Thanh toán bằng VNPAY</span>
                                                </Label>
                                            </div>
                                        </div>
                                        {/* Cash on Delivery */}
                                        <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                            <RadioGroupItem value="COD" id="cod" className="mt-1" />
                                            <div className="flex-1">
                                                <Label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer">
                                                    <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-xs font-bold">
                                                        COD
                                                    </div>
                                                    <span className="font-medium">Thanh toán bằng tiền mặt khi nhận hàng</span>
                                                </Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* KHUYẾN MÃI */}
                    <h2 className="text-xl font-semibold border-b-2 pb-1">MÃ KHUYẾN MÃI</h2>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap text-sm font-medium text-gray-700">
                            Mã KM/Quà tặng
                        </label>
                        <Input
                            className="border border-gray-300 rounded-md px-4 py-2 w-72 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            onClick={() => {
                                console.log(promotions)
                                setVoucherOpen(true);
                            }}
                        >
                            Chọn mã
                        </Button>
                    </div>

                    {appliedCoupons.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold">Đã áp dụng</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {appliedCoupons.map((coupon) => (
                                    <div
                                        key={coupon}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-xl text-sm"
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
                        {ChecktoWardCode && (
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Thành tiền</span>
                                    <span>{formatCurrency(Number(cart.totalPrice))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển</span>
                                    <span>{formatCurrency(shippingFee)}</span>
                                </div>
                                {finalShippingFee !== shippingFee && (
                                    <div className="flex justify-between">
                                        <span>Giảm giá vận chuyển</span>
                                        <span className="text-green-500">-{formatCurrency(shippingFee - finalShippingFee)}</span>
                                    </div>
                                )}
                                {
                                    finalCouponFee && (
                                        <div className="flex justify-between">
                                            <span>Giảm giá</span>
                                            <span className="text-green-500">-{formatCurrency(finalCouponFee)}</span>
                                        </div>
                                    )
                                }
                                <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Tổng cộng</span>
                                    <span className="text-yellow-500">{formatCurrency(totalWithShipping)}</span>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-500 hover:bg-red-600 text-white text-base font-semibold p-5"
                            disabled={(cart.cartItems ?? []).length === 0}
                        >
                            Xác nhận thanh toán
                        </Button>
                    </div>
                </form>
            </Form>
            <PromotionForm
                open={voucherOpen}
                totalPrice={Number(cart.totalPrice)}
                onClose={() => setVoucherOpen(false)}
                onSelectPromotion={handleSelectPromotion}
                appliedCoupons={appliedCoupons}
                promotions={promotions} // Truyền promotions
            />
            {otpInfo && (
                <OtpForm
                    email={otpInfo.email}
                    orderId={otpInfo.orderId}
                    deliveryPhone={otpInfo.deliveryPhone}
                    orderCode={otpInfo.orderCode}
                    open={otpOpen}
                    onClose={() => setOtpOpen(false)}
                />
            )}
        </>
    );
}