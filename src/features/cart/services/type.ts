export interface CartProps {
    userId?: string | number
    cartItems?: CartItemType[]
    totalPrice?: string | number
}


export interface CartItemType {
    product: ProductCartProps;
    quantity: number;
}


export interface ProductCartProps {
    productId: string | number
    productName: string
    price: number
    weight: number
    quantity: number
    discount?: number
    slug: string
    status: boolean
    images?: Images[] // Not in schema but needed for display
}


export interface Images {
    fileName: string
}
