export interface CartProps {
    cartId?: string | number
    cartItems?: CartItemType[]
    totalPrice?: string | number
}


export interface CartItemType {
    cartItemId?: string | number
    product: ProductCartProps;
    quantity: number;
    totalPrice?: any
}


export interface ProductCartProps {
    productId: string | number
    productName: string
    price: number
    discount?: number
    slug: string
    images?: Images[] // Not in schema but needed for display
}


export interface Images {
    fileName: string
}
