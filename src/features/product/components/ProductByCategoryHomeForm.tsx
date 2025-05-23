"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductItem from "@/components/organisms/ProductItem"
import { fetchCategories } from "@/features/category"
import { fetchProductByCategory } from "@/features/product/services/product.service"
import type { CategoryItemProps } from "@/features/category/services/type"
import type { ProductItemProps } from "@/features/product/services/type"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

    return (
        <div className="bg-white rounded-xl shadow-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className=" border-b w-full justify-start rounded-none bg-transparent p-0 h-auto">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                            className="px-4 py-2 font-medium text-sm border-0 border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 bg-transparent rounded-none"
                        >
                            {category.categoryName}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map((category) => {
                    const idStr = category.categoryId.toString()
                    const products = productsByCategory[idStr] || []

                    return (
                        <TabsContent key={idStr} value={idStr} className="mt-0">
                            <main className="py-4">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {products.map((product) => (
                                                <ProductItem key={product.productId} product={product} />
                                            ))}
                                        </div>

                                        {/* Nút "Xem tất cả" đặt bên dưới, căn giữa */}
                                        <div className="flex justify-center mt-6">
                                            <Link href={`products?categoryId=${category.categoryId}`}>
                                                <button className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors">
                                                    Xem thêm
                                                </button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </main>
                        </TabsContent>

                    )
                })}
            </Tabs>
        </div>
    )
}

export default ProductByCategoryHomeForm
