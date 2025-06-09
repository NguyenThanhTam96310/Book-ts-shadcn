"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchProductFlashSaleForm } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
import { useEffect, useState } from "react"

const ProductFlashSaleForm = () => {
    const [product, setProduct] = useState<ProductItemProps[]>([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProductFlashSaleForm()
                console.log(data)
                setProduct(data)
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }

        loadProducts()
    }, [])
    return (
        <>
            <main className="py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {product.map((product) => (
                        <ProductItem key={product.productId} product={product} />
                    ))}
                </div>
            </main>
        </>
    );
}

export default ProductFlashSaleForm;