"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchCategoryById } from "@/features/category"
import { CategoryItemProps } from "@/features/category/services/type"
import { fetchProductByCategory } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
import { useEffect, useState } from "react"
import Link from "next/link"

interface ProductByCategoryFormProps {
    categoryId: number
}

const ProductByCategoryForm = ({ categoryId }: ProductByCategoryFormProps) => {
    const [product, setProduct] = useState<ProductItemProps[]>([])
    const [category, setCategory] = useState<CategoryItemProps | null>(null)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const cate = await fetchCategoryById(categoryId)
                const data = await fetchProductByCategory(categoryId)
                setCategory(cate)
                setProduct(data)
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }

        loadProducts()
    }, [categoryId])

    return (
        <div>
            {/* Title + Button */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
                    {category?.categoryName || "Category Name"}
                </h1>
                <Link
                    href={`products/?categoryId=${category?.categoryId}`}
                    className="text-sm text-orange-600 hover:underline font-medium"
                >
                    Xem tất cả →
                </Link>
            </div>

            {/* Product Grid */}
            <main className="py-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {product.map((product) => (
                        <ProductItem key={product.productId} product={product} />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ProductByCategoryForm
