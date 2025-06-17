"use client"

import ProductItem from "@/components/organisms/ProductItem"
import { fetchProductByAuthorIds, fetchProductByPublisherId, fetchProductFlashSaleForm, fetchProductList, fetchProductNewForm } from "@/features/product/services/product.service"
import { FetchProductListParams, ProductItemProps } from "@/features/product/services/type"
import { useEffect, useState } from "react"

type Props = {
    authorId: number[]
    publisherId: number
}

const ProductSuggestForm = ({ publisherId, authorId }: Props) => {
    const [product, setProduct] = useState<ProductItemProps[]>([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Gọi song song 2 API
                const [authorProducts, publisherProducts] = await Promise.all([
                    fetchProductByAuthorIds(authorId),
                    fetchProductByPublisherId(publisherId),
                ]);
                // Gộp, loại sản phẩm trùng ID (nếu cần)
                const combinedProducts = [...authorProducts, ...publisherProducts];
                // Loại bỏ sản phẩm trùng productId (nếu muốn)
                const uniqueProducts = Array.from(new Map(combinedProducts.map(item => [item.productId, item])).values());
                // Giới hạn 20 sản phẩm đầu tiên
                setProduct(uniqueProducts.slice(0, 20));
            } catch (error) {
                console.error("Lỗi khi load products:", error);
            }
        };

        loadProducts();
    }, [authorId, publisherId]);

    return (
        <>
            <main className="py-5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {product.map((product) => (
                        <ProductItem key={product.productId} product={product} />
                    ))}
                </div>
            </main>
        </>
    );
}

export default ProductSuggestForm;