// app/products/page.tsx
"use client";
import Sidebar from "@/components/organisms/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import { fetchProductList } from "@/features/product/services/product.service";
import React, { useState } from "react";

const ProductPage = () => {
    const [categories, setCategories] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("desc");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const numItems = 10;

    const params = {
        status: true,
        pageNumber: 1,
        pageSize: numItems,
        sortBy: "productId",
        sortOrder: "asc" as "asc",
    };

    return (
        <div className="container mx-auto py-8 bg-gray-100">
            {/* CHỈ CẦN THÊM flex-col lg:flex-row */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 bg-red-500 ">
                    {/* Sắp xếp */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Sắp xếp theo:</span>
                            <select className="border rounded px-3 py-1">
                                <option>Bán chạy tuần</option>
                                <option>Bán chạy tháng</option>
                            </select>
                        </div>
                        <div>
                            <select className="border rounded px-3 py-1">
                                <option>24 sản phẩm</option>
                                <option>36 sản phẩm</option>
                            </select>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="m-1">
                        <ProductList fetchApi={fetchProductList} params={params} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductPage;
