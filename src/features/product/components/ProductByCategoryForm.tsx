"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchProductByCategory } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
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
        <main className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                    <ProductItem key={product.productId} product={product} />
                ))}
            </div>
        </main>
    )
}

export default ProductByCategoryForm