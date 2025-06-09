import { ProductItemProps } from "@/features/product"
import { AddressRes } from "@/features/profile/services/type"
import { PromotionItemRes } from "@/features/promotion"

export interface OrderOTPRes {
    orderId: number
    email: string
    deliveryPhone: string
}
export interface OrderRes {
    orderId: number
    orderCode: string
    email: string
    deliveryPhone: string
    deliveryName: string
    orderItems:
    {
        discount: number
        orderItemId: number
        price: number
        product: ProductItemProps
        quantity: number
    }[]
    address: AddressRes
    orderDateTime: string
    payment: {
        paymentMethod: string
        paymentCode?: string
        bankCpde?: string
    }
    coupon: PromotionItemRes | null
    freeship: PromotionItemRes | null
    subTotal: number
    priceShip: number
    totalAmount: number
    orderType: string
    orderStatus: string
}
export interface OrderVnPayRes {
    orderId: number
    orderCode: string
    orderStatus: string
}
export interface PaginatedOrderResponse {
    content: OrderRes[];
    pageNumber: 1;
    pageSize: 5;
    totalElements: number;
    totalPages: 1;
    lastPage: boolean;
}