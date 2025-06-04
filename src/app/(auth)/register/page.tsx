import RegisterForm from "@/features/auth/components/RegisterForm"
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Đăng kí - Bookstore",
    description: "Đăng kí tài khoản mới.",
};

const RegisterPage = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-5xl px-4">
                <RegisterForm />
            </div>
        </div>
    )
}
export default RegisterPage