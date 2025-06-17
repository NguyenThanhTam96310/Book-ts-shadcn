"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { Card } from "@/components/ui/card"
import { fetchProductByCategory } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
    categoryId: string | number
    currentProductId: string | number
}

const ProductByCategoryForm = ({ categoryId, currentProductId }: Props) => {
    const [product, setProduct] = useState<ProductItemProps[]>([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductByCategory(Number(categoryId))
                setProduct(data)
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }

        loadProducts()
    }, [categoryId])
    // Lọc bỏ sản phẩm đang được xem
    const filteredProducts = product.filter(
        (p) => p.productId !== currentProductId
    )
    return (
        <>
            {filteredProducts.length > 0 && (
                <section className="pt-5 relative">
                    <div className="container mx-auto ">
                        <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <div className="p-8">
                                {/* Section Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">SÁCH LIÊN QUAN</h2>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Line */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gradient-to-r from-green-200 to-emerald-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-1 rounded-full"></div>
                                    </div>
                                </div>
                                <main className="py-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {filteredProducts.map((product) => (
                                            <ProductItem key={product.productId} product={product} />
                                        ))}
                                    </div>
                                </main>
                            </div>
                        </Card>
                    </div>
                </section>
            )}
        </>
    )
}

export default ProductByCategoryForm