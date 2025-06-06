// src/components/PageTransition.tsx
"use client"; // Đánh dấu đây là Client Component

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation"; // Thay next/router bằng next/navigation

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // Lấy đường dẫn hiện tại

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname} // Dùng pathname thay router.asPath
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}