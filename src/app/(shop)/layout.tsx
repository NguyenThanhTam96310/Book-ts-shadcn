'use client';

import ScrollToTop from '@/components/atoms/ScrollToTop';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollToTop />
            {children}
        </>
    );
}
