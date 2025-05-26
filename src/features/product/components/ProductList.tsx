'use client';

import ProductItem from "@/components/organisms/ProductItem";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams, ProductItemProps, ProductListResponse } from "@/features/product/services/type";
import { useEffect, useState } from "react";

interface ProductListProps {
    fetchApi: (params: FetchProductListParams) => Promise<ProductListResponse>;
    params: FetchProductListParams;
    onTotalPagesChange?: (totalPages: number) => void; // Thêm prop để truyền totalPages lên cha
}

const ProductList = ({ fetchApi, params, onTotalPagesChange }: ProductListProps) => {
    const [products, setProducts] = useState<ProductItemProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchApi(params);
                setProducts(data.items);
                setTotalPages(data.totalPages);
                if (onTotalPagesChange) {
                    onTotalPagesChange(data.totalPages); // Gửi totalPages lên cha
                }
            } catch (error) {
                console.error("Lỗi khi load product:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [params, fetchApi, onTotalPagesChange]);

    return (
        <main className="py-4">
            {products.length === 0 ? (
                <div className="text-center text-gray-500">Không có sản phẩm nào</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <ProductItem key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default ProductList;