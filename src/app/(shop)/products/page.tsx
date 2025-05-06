"use client";
import Sidebar from "@/components/organisms/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams } from "@/features/product/services/type";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const ProductPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Lấy các tham số từ query string, nếu không có thì sử dụng giá trị mặc định
    const initialSortBy = searchParams.get("sortBy") || "productId";
    const initialSortOrder = searchParams.get("sortOrder") || "asc";
    const initialPageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 5;
    const initialPageNumber = searchParams.get("pageNumber") ? Number(searchParams.get("pageNumber")) : 1;
    const initialCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined;
    const initialMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const initialLanguageIds = searchParams.get("languageIds") ? Number(searchParams.get("languageIds")) : undefined;
    const initialPublisherId = searchParams.get("publisherId") ? Number(searchParams.get("publisherId")) : undefined;

    // State để quản lý params
    const [filterParams, setFilterParams] = useState<FetchProductListParams>({
        status: true,
        pageNumber: initialPageNumber,
        pageSize: initialPageSize,
        sortBy: initialSortBy,
        sortOrder: initialSortOrder as "asc" | "desc",
        categoryId: initialCategoryId,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
        languageIds: initialLanguageIds,
        publisherId: initialPublisherId,
    });

    const [totalPages, setTotalPages] = useState<number>(0);

    // Đồng bộ params với searchParams khi URL thay đổi
    useEffect(() => {
        const newParams: Partial<FetchProductListParams> = {
            sortBy: searchParams.get("sortBy") || "productId",
            sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
            pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 5,
            pageNumber: searchParams.get("pageNumber") ? Number(searchParams.get("pageNumber")) : 1,
            categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
            minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
            languageIds: searchParams.get("languageIds") ? Number(searchParams.get("languageIds")) : undefined,
            publisherId: searchParams.get("publisherId") ? Number(searchParams.get("publisherId")) : undefined,
        };
        setFilterParams((prev) => {
            const updatedParams = { ...prev, ...newParams };
            return updatedParams;
        });
    }, [searchParams]);

    // Đồng bộ URL với filterParams sau khi filterParams thay đổi
    useEffect(() => {
        const query = new URLSearchParams();

        // Chỉ thêm các tham số nếu chúng có giá trị và không phải giá trị mặc định
        if (filterParams.sortBy && filterParams.sortBy !== "productId") query.set("sortBy", filterParams.sortBy);
        if (filterParams.sortOrder && filterParams.sortOrder !== "asc") query.set("sortOrder", filterParams.sortOrder);
        if (filterParams.pageSize && filterParams.pageSize !== 5) query.set("pageSize", filterParams.pageSize.toString());
        if (filterParams.pageNumber && filterParams.pageNumber !== 1) query.set("pageNumber", filterParams.pageNumber.toString());
        if (filterParams.categoryId !== undefined) query.set("categoryId", filterParams.categoryId.toString());
        if (filterParams.minPrice !== undefined) query.set("minPrice", filterParams.minPrice.toString());
        if (filterParams.maxPrice !== undefined) query.set("maxPrice", filterParams.maxPrice.toString());
        if (filterParams.languageIds !== undefined) query.set("languageIds", filterParams.languageIds.toString());
        if (filterParams.publisherId !== undefined) query.set("publisherId", filterParams.publisherId.toString());

        // Cập nhật URL mà không tải lại trang
        router.push(`/products?${query.toString()}`, { scroll: false });
    }, [filterParams, router]);

    // Cập nhật params khi bộ lọc thay đổi
    const updateParams = (newParams: Partial<FetchProductListParams>) => {
        setFilterParams((prev) => ({
            ...prev,
            ...newParams,
            pageNumber: newParams.pageNumber ?? 1, // Reset về trang 1 khi thay đổi bộ lọc, trừ khi pageNumber được chỉ định
        }));
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = Number(event.target.value);
        updateParams({ pageSize: newPageSize });
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sortValue = event.target.value;
        let newSortBy = "productId";
        let newSortOrder: "asc" | "desc" = "asc";

        if (sortValue === "Bán chạy tuần") {
            newSortBy = "weeklySales";
            newSortOrder = "desc";
        } else if (sortValue === "Bán chạy tháng") {
            newSortBy = "monthlySales";
            newSortOrder = "desc";
        }

        updateParams({ sortBy: newSortBy, sortOrder: newSortOrder });
    };

    const resetFilters = () => {
        const resetParams: FetchProductListParams = {
            status: true,
            pageNumber: 1,
            pageSize: 5,
            sortBy: "productId",
            sortOrder: "asc",
            categoryId: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            languageIds: undefined,
            publisherId: undefined,
        };
        setFilterParams(resetParams);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            updateParams({ pageNumber: page });
        }
    };

    const getPaginationRange = () => {
        const currentPage = filterParams.pageNumber || 1;
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxPagesToShow - 1);

        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="container mx-auto py-8 bg-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
                <Sidebar onFilterChange={updateParams} />
                <main className="flex-1 bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
                            Danh sách sản phẩm
                        </h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 text-sm sm:text-base">Sắp xếp theo:</span>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    onChange={handleSortChange}
                                    value={
                                        filterParams.sortBy === "weeklySales" ? "Bán chạy tuần" :
                                            filterParams.sortBy === "monthlySales" ? "Bán chạy tháng" :
                                                "Bán chạy tuần"
                                    }
                                >
                                    <option value="Bán chạy tuần">Bán chạy tuần</option>
                                    <option value="Bán chạy tháng">Bán chạy tháng</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 text-sm sm:text-base">Hiển thị:</span>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    onChange={handlePageSizeChange}
                                    value={filterParams.pageSize}
                                >
                                    <option value="5">5 sản phẩm</option>
                                    <option value="10">10 sản phẩm</option>
                                    <option value="24">24 sản phẩm</option>
                                    <option value="36">36 sản phẩm</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="m-1">
                        <ProductList
                            fetchApi={fetchProductList}
                            params={filterParams}
                            onTotalPagesChange={setTotalPages}
                        />
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button
                                onClick={() => goToPage((filterParams.pageNumber || 1) - 1)}
                                disabled={(filterParams.pageNumber || 1) === 1}
                                className={`p-2 rounded-lg transition-colors ${(filterParams.pageNumber || 1) === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {getPaginationRange().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${(filterParams.pageNumber || 1) === page
                                        ? "bg-orange-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => goToPage((filterParams.pageNumber || 1) + 1)}
                                disabled={(filterParams.pageNumber || 1) === totalPages}
                                className={`p-2 rounded-lg transition-colors ${(filterParams.pageNumber || 1) === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductPage;