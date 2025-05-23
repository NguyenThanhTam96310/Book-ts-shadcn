import EmailVerifyForm from "@/features/auth/components/EmailVerifyForm";
import type { Metadata } from "next";

// Export metadata cho trang /verifyEmail
export const metadata: Metadata = {
    title: "Verify Email - Bookstore",
    description: "Verify your email to complete your registration.",
};

const EmailVerifyPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Xác minh Email</h2>
                <EmailVerifyForm />
            </div>
        </div>
    );
};

export default EmailVerifyPage;