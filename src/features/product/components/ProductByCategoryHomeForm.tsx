"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductItem from "@/components/organisms/ProductItem"
import { fetchCategories } from "@/features/category"
import { fetchProductByCategory } from "@/features/product/services/product.service"
import type { CategoryItemProps } from "@/features/category/services/type"
import type { ProductItemProps } from "@/features/product/services/type"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Package, Sparkles, Eye, Loader2 } from "lucide-react"

interface ProductByCategoryHomeFormProps {
    categoryId?: number
}

const ProductByCategoryHomeForm = ({ categoryId }: ProductByCategoryHomeFormProps) => {
    const [activeTab, setActiveTab] = useState<string>(categoryId ? categoryId.toString() : "1")
    const [categories, setCategories] = useState<CategoryItemProps[]>([])
    const [productsByCategory, setProductsByCategory] = useState<Record<string, ProductItemProps[]>>({})
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const allCategories = await fetchCategories()
                setCategories(allCategories)

                // Set initial active tab
                if (categoryId) {
                    setActiveTab(categoryId.toString())
                } else if (allCategories.length > 0) {
                    setActiveTab(allCategories[0].categoryId.toString())
                }
            } catch (error) {
                console.error("Error loading categories:", error)
            }
        }

        loadCategories()
    }, [categoryId])

    useEffect(() => {
        const loadProductsForCategories = async () => {
            setLoading(true)
            try {
                const productsData: Record<string, ProductItemProps[]> = {}

                for (const category of categories) {
                    const idStr = category.categoryId.toString()
                    if (!productsByCategory[idStr]) {
                        const products = await fetchProductByCategory(Number(category.categoryId))
                        productsData[idStr] = products
                    }
                }

                setProductsByCategory((prev) => ({ ...prev, ...productsData }))
            } catch (error) {
                console.error("Error loading products:", error)
            } finally {
                setLoading(false)
            }
        }

        if (categories.length > 0) {
            loadProductsForCategories()
        }
    }, [categories])

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                    <div className="animate-pulse">
                        <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )

    const EmptyState = () => (
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có sản phẩm</h3>
            <p className="text-gray-600 mb-6">Danh mục này hiện chưa có sản phẩm nào.</p>
            <Button
                variant="outline"
                className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300"
            >
                Khám phá danh mục khác
            </Button>
        </div>
    )

    return (
        <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Enhanced Tabs List */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                    <TabsList className="relative w-full  h-15 justify-start bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-2 shadow-lg overflow-x-auto overflow-y-hidden  custom-scrollbar">
                        {categories.map((category) => {
                            const isActive = activeTab === category.categoryId.toString()
                            const products = productsByCategory[category.categoryId.toString()] || []

                            return (
                                <TabsTrigger
                                    key={category.categoryId}
                                    value={category.categoryId.toString()}
                                    className={`
                                        relative px-6 py-6 font-medium text-sm rounded-xl transition-all duration-300 whitespace-nowrap group cursor-pointer
                                        ${isActive
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 scale-105"
                                            : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/80 hover:scale-102"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="relative text-xl">
                                            {category.categoryName}
                                            {isActive && (
                                                <div className="absolute-bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"></div>
                                            )}
                                        </span>
                                        {products.length > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs transition-all duration-300 ${isActive
                                                    ? "bg-white/20 text-white border-white/30"
                                                    : "bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700"
                                                    }`}
                                            >
                                                {products.length}
                                            </Badge>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
                                    )}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                </div>

                {/* Tab Contents */}
                {categories.map((category) => {
                    const idStr = category.categoryId.toString()
                    const products = productsByCategory[idStr] || []

                    return (
                        <TabsContent key={idStr} value={idStr} className="mt-0">
                            <Card className="border-none shadow-none ring-0 bg-gradient-to-br from-white via-gray-50/30 to-orange-50/20 overflow-hidden backdrop-blur-sm">

                                <div className="p-6 lg:p-8">

                                    {/* Products Grid */}
                                    {loading ? (
                                        <div className="space-y-6">
                                            <div className="flex justify-center py-8">
                                                <div className="flex items-center gap-3 text-orange-600">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span className="font-medium">Đang tải sản phẩm...</span>
                                                </div>
                                            </div>
                                            <LoadingSkeleton />
                                        </div>
                                    ) : products.length === 0 ? (
                                        <EmptyState />
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                                                {products.map((product) => (
                                                    <div
                                                        key={product.productId}
                                                        className="group transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                                                    >
                                                        <div className="relative">
                                                            <ProductItem product={product} />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Enhanced View More Section */}
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t-2 border-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
                                                </div>
                                                <div className="relative flex justify-center">
                                                    <div className="h-15 bg-white/80 backdrop-blur-sm px-8 py-2 rounded-full shadow-lg">
                                                        <Link href={`products?categoryId=${category.categoryId}`}>
                                                            <Button className="h-full group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 px-8 py-4 rounded-2xl text-lg font-semibold transform hover:scale-110 cursor-pointer">
                                                                <Eye className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform duration-300" />
                                                                Xem tất cả {category.categoryName}
                                                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}

export default ProductByCategoryHomeForm
