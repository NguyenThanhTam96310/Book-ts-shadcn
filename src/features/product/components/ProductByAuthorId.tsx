"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchProductByAuthor, fetchProductByCategory } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
import { useEffect, useState } from "react"

type Props = {
    authorId: string | number
}

const ProductByAuthorId = ({ authorId }: Props) => {
    const [products, setProducts] = useState<ProductItemProps[]>([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductByAuthor(Number(authorId))
                console.log(data)
                setProducts(data)
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }

        loadProducts()
    }, [authorId])
    return (
        <main className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <ProductItem key={product.productId} product={product} />
                ))}
            </div>
        </main>
    )
}

export default ProductByAuthorId