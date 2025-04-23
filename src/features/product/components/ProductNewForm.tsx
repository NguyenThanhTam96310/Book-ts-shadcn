"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchProductFlashSaleForm, fetchProductNewForm } from "@/features/product/services/product.service"
import { useEffect, useState } from "react"

const ProductNewForm = () => {
    const [product, setProduct] = useState<ProductItemProps[]>([])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchProductNewForm()
                setProduct(data)
                console.log(data, "==============productnew");
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }

        loadCategories()
    }, [])
    return (
        <>
            <main className="py-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {product.map((product) => (
                        <ProductItem key={product.productId} {...product} />
                    ))}
                </div>
            </main>
        </>
    );
}

export default ProductNewForm;