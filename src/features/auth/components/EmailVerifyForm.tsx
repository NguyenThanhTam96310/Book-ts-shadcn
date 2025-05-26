"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchEmailVerify } from "@/features/auth/services/auth.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailVerifyForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams?.get("token");

            // Đặt timeout mặc định 3 phút, sau đó set error
            const timeoutId = setTimeout(() => {
                setStatus("error");
                router.push("/login");
            }, 180000); // 3 phút

            if (!token) {
                // Không có token thì chờ 3 phút rồi tự động set error (đã được đặt ở trên)
                return;
            }

            try {
                const response = await fetchEmailVerify(token);
                clearTimeout(timeoutId); // Huỷ timeout nếu đã phản hồi

                if (response.result === true) {
                    setStatus("success");
                    setTimeout(() => router.push("/login"), 3000);
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        verifyEmail();
    }, [router, searchParams]);

    return (
        <div className="text-center break-words">
            {status === "verifying" && (
                <p className="text-blue-600 text-lg">Đang xác minh email...</p>
            )}
            {status === "success" && (
                <p className="text-green-600 text-lg">
                    ✅ Xác minh thành công! Đang chuyển hướng đến trang đăng nhập...
                </p>
            )}
            {status === "error" && (
                <p className="text-red-600 text-lg">
                    ❌ Xác minh thất bại. Liên kết có thể đã hết hạn hoặc không hợp lệ.
                </p>
            )}
            <Link href="/login">
                <Button className="my-4 bg-orange-500 hover:bg-orange-800">
                    Về trang đăng nhập
                </Button>
            </Link>
        </div>

    );
};

export default EmailVerifyForm;
