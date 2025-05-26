"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ChevronRight, LayoutGrid, X } from "lucide-react"
import type { CategoryItemProps } from "@/features/category/services/type"
import { fetchAllCategories } from "@/features/category/services/category.service"
import { fetchMenus, type MenuItem } from "@/features/menu"
import { Separator } from "@/components/ui/separator"

const CategoryDrawer = () => {
    const [categories, setCategories] = useState<CategoryItemProps[]>([])
    const [menus, setMenus] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [categoriesData, menusData] = await Promise.all([fetchAllCategories(), fetchMenus()])

                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData)
                }

                if (Array.isArray(menusData)) {
                    setMenus(menusData)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="font-medium">Danh mục</span>
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className="w-full h-screen overflow-y-auto bg-white border-r shadow-xl"
                style={{
                    left: 0,
                    transform: open ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >

                <div className="flex flex-col h-full">
                    <DrawerHeader className="border-b sticky top-0 bg-white z-10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold text-gray-900">Danh mục sản phẩm</DrawerTitle>
                            <DrawerDescription className="text-sm text-gray-500">
                                Duyệt qua các danh mục và menu chính của cửa hàng.
                            </DrawerDescription>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <X className="h-5 w-5" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    <div className="flex-1 px-6 py-6">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10">
                                    {categories.map((cate) => (
                                        <div key={cate.categoryId} className="group">
                                            <Link
                                                href={`/products?categoryId=${cate.categoryId}`}
                                                className="block text-base font-semibold text-gray-800 hover:text-orange-600 mb-3 transition group-hover:translate-x-1 duration-200"
                                            >
                                                {cate.categoryName}
                                                <ChevronRight className="inline-block ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                            {(cate.childrens?.length ?? 0) > 0 && (
                                                <ul className="space-y-2 ml-1 border-l-2 border-gray-100 pl-3">
                                                    {cate.childrens?.map((child) => (
                                                        <li key={child.categoryId}>
                                                            <Link
                                                                href={`/products?categoryId=${child.categoryId}`}
                                                                className="block text-sm text-gray-600 hover:text-orange-500 transition hover:translate-x-1 duration-200"
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

                                {menus.length > 0 && (
                                    <div className="mt-12">
                                        <Separator className="my-6" />
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <span className="bg-orange-100 text-orange-600 p-1 rounded-md mr-2">
                                                <LayoutGrid className="w-4 h-4" />
                                            </span>
                                            Menu chính
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {menus.map((menu) => (
                                                <Link
                                                    key={menu.menuId}
                                                    href={menu.link || "#"}
                                                    className="block text-sm font-medium text-gray-700 hover:text-orange-600 transition hover:translate-x-1 duration-200 py-2"
                                                >
                                                    {menu.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* <div className="mt-12 bg-orange-50 rounded-lg p-6">
                                    <h3 className="font-semibold text-red-500 mb-2 flex items-center">
                                        <span className="mr-2">♥</span>SÁCH MỚI
                                    </h3>
                                    <Link href="#" className="text-sm text-gray-700 hover:text-orange-600 underline underline-offset-4">
                                        Xem tất cả
                                    </Link>
                                </div> */}
                            </>
                        )}
                    </div>

                    {/* <div className="border-t p-6 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">Tổng danh mục: {categories.length}</div>
                            <DrawerClose asChild>
                                <Button variant="outline" className="hover:bg-gray-100">
                                    Đóng
                                </Button>
                            </DrawerClose>
                        </div>
                    </div> */}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CategoryDrawer
