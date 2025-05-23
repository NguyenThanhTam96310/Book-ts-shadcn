"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CategoryItemProps } from "@/features/category/services/type"
import { fetchAllCategories } from "@/features/category/services/category.service"
import { fetchMenus, type MenuItem } from "@/features/menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, LayoutGrid } from "lucide-react"

const MegaMenu = () => {
    const [categories, setCategories] = useState<CategoryItemProps[]>([])
    const [menus, setMenus] = useState<MenuItem[]>([])
    const [open, setOpen] = React.useState(false)

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const data = await fetchMenus()
                setMenus(data)
            } catch (err: any) {
                console.error("Error loading menus:", err)
            }
        }
        loadMenus()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllCategories()
                if (Array.isArray(data)) {
                    setCategories(data)
                } else {
                    console.error("Invalid category data:", data)
                }
            } catch (err: any) {
                console.error("Error fetching categories:", err)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="relative">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                    <Button variant="outline" className="w-auto flex items-center gap-1">
                        <LayoutGrid className="w-5 h-5" />
                        <span className="ml-1">Danh mục sản phẩm</span>
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    sideOffset={4}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    className="w-56 bg-white border border-gray-200 rounded-md shadow-md z-50"
                >
                    <DropdownMenuGroup>
                        {menus.map((menu) => (
                            <DropdownMenuItem
                                key={menu.menuId}
                                className="flex items-center gap-2 px-3 py-2 text-black hover:bg-gray-100 cursor-pointer"
                            >
                                <span>{menu.name}</span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuGroup>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 text-black hover:bg-gray-100 cursor-pointer">
                                <span>Danh mục</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent
                                    className="w-screen max-w-screen-xl h-auto absolute left-0 top-0 bg-white shadow-md rounded-md border p-6"
                                    sideOffset={40}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {categories.map((cate) => (
                                            <div key={cate.categoryId} className="mb-6">
                                                <Link
                                                    href={`/products?categoryId=${cate.categoryId}`}
                                                    className="block text-base font-semibold text-black hover:text-orange-600 mb-3 transition-colors"
                                                >
                                                    {cate.categoryName}
                                                </Link>

                                                {cate.childrens && cate.childrens.length > 0 && (
                                                    <ul className="space-y-2">
                                                        {cate.childrens.map((child) => (
                                                            <li key={child.categoryId}>
                                                                <Link
                                                                    href={`/products?categoryId=${child.categoryId}`}
                                                                    className="block text-sm text-gray-700 hover:text-orange-600 transition-colors"
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
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <h3 className="font-semibold text-red-500 mb-2">SÁCH MỚI ♥</h3>
                                                <Link href="#" className="text-sm text-gray-700 hover:text-orange-600">
                                                    Xem tất cả
                                                </Link>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-red-500 mb-2">SÁCH BÁN CHẠY ♥</h3>
                                                <Link href="#" className="text-sm text-gray-700 hover:text-orange-600">
                                                    Xem tất cả
                                                </Link>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-red-500 mb-2">MANGA MỚI ♥</h3>
                                                <Link href="#" className="text-sm text-gray-700 hover:text-orange-600">
                                                    Xem tất cả
                                                </Link>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-red-500 mb-2">LIGHT NOVEL MỚI ♥</h3>
                                                <Link href="#" className="text-sm text-gray-700 hover:text-orange-600">
                                                    Xem tất cả
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-200" />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default MegaMenu
