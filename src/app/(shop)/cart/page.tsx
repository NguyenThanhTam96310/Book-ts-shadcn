import Cart from "@/features/cart/components/Cart"
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Giỏ hàng - Bookstore",
    description: "Giỏ hàng của tôi.",
};


const CartPage = () => {
    return (
        <div className="min-h-[400px] bg-gray-100">
            <Cart />
        </div>
    )
}

export default CartPage