"use client"
import CheckoutForm from "@/features/order/components/CheckoutForm"
// import { useSearchParams } from "next/navigation";

const CheckoutPage = () => {
    // const searchParams = useSearchParams();
    // const vnp_TxnRef = searchParams?.get("vnp_TxnRef");
    return (
        <>
            <CheckoutForm />
        </>
    )
}
export default CheckoutPage