'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Mỗi lần đổi route thì scroll lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null; // Không render gì cả
}
