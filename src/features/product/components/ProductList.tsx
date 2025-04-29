"use client";

import ProductItem from "@/components/organisms/ProductItem";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams, ProductItemProps, ProductListResponse } from "@/features/product/services/type";
import { useEffect, useState } from "react";

interface ProductListProps {
    fetchApi: (params: FetchProductListParams) => Promise<ProductListResponse>;
    params: FetchProductListParams;
}

const ProductList = ({ fetchApi, params }: ProductListProps) => {
    const [products, setProducts] = useState<ProductItemProps[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await fetchApi(params); // gọi API với params
                setProducts(data.items);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Lỗi khi load product:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [params, fetchApi]); // khi params thay đổi, gọi lại API

    return (
        <main className="py-8">
            {loading ? (
                <div>Loading...</div> // Hiển thị loading khi đang fetch dữ liệu
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductItem key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default ProductList;
