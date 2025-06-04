import Cart from "@/features/cart/components/Cart"
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Giỏ hàng - Bookstore",
    description: "Giỏ hàng của tôi.",
};


const CartPage = () => {
    return (
        <>
            <Cart />
        </>
    )
}

export default CartPage