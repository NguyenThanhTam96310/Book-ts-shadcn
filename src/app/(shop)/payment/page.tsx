import PaymentForm from "@/features/order/components/PaymentForm"
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Thanh toán - Bookstore",
    description: "Thông tin thanh toán.",
};


const Payment = () => {
    return (
        <div className="bg-gray-400 p-4">
            < PaymentForm />

        </div>
    )
}
export default Payment