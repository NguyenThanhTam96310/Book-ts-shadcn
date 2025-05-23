export interface CartProps {
    userId?: string | number
    cartItems?: CartItemType[]
    totalPrice?: string | number
}


export interface CartItemType {
    userId?: string | number
    product: ProductCartProps;
    quantity: number;
    totalPrice?: any
}


export interface ProductCartProps {
    productId: string | number
    productName: string
    price: number
    weight: number
    discount?: number
    slug: string
    images?: Images[] // Not in schema but needed for display
}


export interface Images {
    fileName: string
}
