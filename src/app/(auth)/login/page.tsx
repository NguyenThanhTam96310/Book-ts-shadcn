import LoginForm from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";

// Export metadata cho trang /login
export const metadata: Metadata = {
    title: "Login - Bookstore",
    description: "Login to your Bookstore account.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <LoginForm />
            </div>
        </div>
    );
}