"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, LayoutGrid, X, Package, Sparkles, ArrowRight, Grid3X3, Menu, ChevronDown } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { fetchAllCategories } from "@/features/category/services/category.service"
import { fetchMenus, MenuItem } from "@/features/menu"
import { CategoryItemProps } from "@/features/category/services/type"

const CategoryDrawer = () => {
    const [categories, setCategories] = useState<CategoryItemProps[]>([])
    const [menus, setMenus] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    // Thêm trạng thái để theo dõi danh mục cha nào đang mở
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const categoriesData = await fetchAllCategories()
                const menusData = await fetchMenus()
                const mainMenus = menusData.filter((menu: MenuItem) => menu.position === "MAINMENU")
                setCategories(categoriesData)
                setMenus(mainMenus)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Hàm toggle trạng thái đóng/mở của danh mục cha
    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }))
    }

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                        <div className="h-5 bg-gray-100 rounded-full w-12"></div>
                    </div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="flex items-center justify-between">
                                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-50 rounded-full w-8"></div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    )

    return (
        <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
                >
                    <LayoutGrid className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </Button>
            </DrawerTrigger>

            <DrawerContent className="w-full max-w-md h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 border-r border-gray-200 shadow-2xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <DrawerHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                                    <Grid3X3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DrawerTitle className="text-xl font-bold text-gray-900">Danh mục</DrawerTitle>
                                    <p className="text-sm text-gray-500 mt-0.5">Khám phá sản phẩm</p>
                                </div>
                            </div>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                {/* Quick Menu */}
                                {menus.length > 0 && (
                                    <div>
                                        <div className="flex items-center mb-4 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-lg">
                                            <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                                <Menu className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h2 className="text-lg font-bold text-white">Menu nhanh</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {menus.map((menu) => (
                                                <Link
                                                    key={menu.menuId}
                                                    href={menu.link || "#"}
                                                    onClick={() => setOpen(false)}
                                                    className="group"
                                                >
                                                    <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-white/80 backdrop-blur-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors text-sm">
                                                                {menu.name}
                                                            </span>
                                                            <div className="flex items-center space-x-1">
                                                                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Categories */}
                                <div>
                                    <div className="mb-4">
                                        <div className="flex items-center mb-4 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-lg">
                                            <div className="p-1.5 bg-orange-100 rounded-lg mr-3">
                                                <Package className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <h2 className="text-lg font-bold text-white">Danh mục sản phẩm</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {categories.map((category) => (
                                            <Card
                                                key={category.categoryId}
                                                className="group hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-orange-200 bg-white/90 backdrop-blur-sm overflow-hidden"
                                            >
                                                <div className="p-5">
                                                    {/* Parent Category */}
                                                    <div
                                                        className="flex items-center justify-between mb-4 group-hover:translate-x-1 transition-transform cursor-pointer"
                                                        onClick={() => toggleCategory(String(category.categoryId))}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Package className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                                    {category.categoryName}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <ChevronDown
                                                                className={`w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-transform duration-300 ${expandedCategories[category.categoryId]
                                                                    ? "rotate-180"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Subcategories */}
                                                    {category.childrens &&
                                                        category.childrens.length > 0 &&
                                                        expandedCategories[category.categoryId] && (
                                                            <div className="space-y-2 pl-2 border-l-2 border-gray-100 ml-5">
                                                                {category.childrens.map((child) => (
                                                                    <div key={child.categoryId}>
                                                                        <Link
                                                                            href={`/products?categoryId=${child.categoryId}`}
                                                                            onClick={() => setOpen(false)}
                                                                            className="group/child flex items-center justify-between p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                                                                        >
                                                                            <span className="text-sm font-medium text-gray-700 group-hover/child:text-orange-600 transition-colors">
                                                                                {child.categoryName}
                                                                            </span>
                                                                            <div className="flex items-center space-x-2">
                                                                                {child.childrens &&
                                                                                    child.childrens.length > 0 && (
                                                                                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover/child:text-orange-500 transition-colors" />
                                                                                    )}
                                                                            </div>
                                                                        </Link>

                                                                        {/* Danh sách con cấp 2 */}
                                                                        {child.childrens &&
                                                                            child.childrens.length > 0 && (
                                                                                <ul className="ml-2 pl-2 border-l border-gray-200">
                                                                                    {child.childrens.map((child2) => (
                                                                                        <li
                                                                                            key={child2.categoryId}
                                                                                            className="py-1"
                                                                                        >
                                                                                            <Link
                                                                                                href={`/products?categoryId=${child2.categoryId}`}
                                                                                                onClick={() => setOpen(false)}
                                                                                                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                                                                                            >
                                                                                                {child2.categoryName}
                                                                                            </Link>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-500"></p>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CategoryDrawer