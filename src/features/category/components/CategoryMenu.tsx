'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, LayoutGrid, ChevronUp } from 'lucide-react';
import {
    Menubar,
    MenubarContent,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { CategoryItemProps } from '@/features/category/services/type';
import { fetchAllCategories } from '@/features/category/services/category.service';

export default function CategoryMenu() {
    const [categories, setCategories] = useState<CategoryItemProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllCategories();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Invalid category data:', data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="relative">
            {/* Desktop Dropdown Menu - Mega Menu */}

            <Menubar className="border-none p-0">
                <MenubarMenu>
                    <MenubarTrigger className="flex items-center gap-2 text-gray-800 font-semibold hover:text-orange-600 transition-colors bg-gray-100 rounded px-4 py-2">
                        <LayoutGrid className="w-5 h-5" />
                        <ChevronDown className="w-4 h-4" />
                    </MenubarTrigger>
                    <MenubarContent className="w-[calc(100vw-2rem)] max-w-6xl bg-white shadow-xl rounded-lg border-t border-gray-200 p-6 z-50 mt-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((cate) => (
                                <div key={cate.categoryId}>
                                    <Link
                                        href={`/products?categoryId=${cate.categoryId}`}
                                        className="text-base font-bold text-black hover:text-orange-600 transition-colors"
                                    >
                                        {cate.categoryName}
                                    </Link>
                                    {cate.childrens && cate.childrens.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {cate.childrens.map((child) => (
                                                <li key={child.categoryId}>
                                                    <Link
                                                        href={`/products?categoryId=${child.categoryId}`}
                                                        className="text-sm text-gray-700 hover:text-orange-600 transition-colors"
                                                    >
                                                        {child.categoryName}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>



    );
}