import LoginForm from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Login - Bookstore",
    description: "Login to your Bookstore account.",
};

export default function LoginPage() {
    return (
        <div className="min-h-[70vh] flex py-8 justify-center bg-gray-100">
            <div className="max-w-md w-full ">
                <LoginForm />
            </div>
        </div>
    );
}