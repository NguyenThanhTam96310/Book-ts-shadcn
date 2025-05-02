"use client";
import Sidebar from "@/components/organisms/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams } from "@/features/product/services/type";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductPage = () => {
    // State để quản lý params
    const [params, setParams] = useState<FetchProductListParams>({
        status: true,
        pageNumber: 1,
        pageSize: 5,
        sortBy: "productId",
        sortOrder: "asc",
    });

    // State để lưu totalPages từ ProductList
    const [totalPages, setTotalPages] = useState<number>(0);

    // Hàm cập nhật params từ Sidebar
    const updateParams = (newParams: Partial<FetchProductListParams>) => {
        setParams((prev) => ({
            ...prev,
            ...newParams,
            pageNumber: 1, // Reset về trang 1 khi thay đổi bộ lọc
        }));
    };

    // Xử lý thay đổi pageSize từ select
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = Number(event.target.value);
        setParams((prev) => ({
            ...prev,
            pageSize: newPageSize,
            pageNumber: 1, // Reset về trang 1 khi thay đổi số lượng sản phẩm
        }));
    };

    // Xử lý thay đổi sắp xếp từ select
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const sortValue = event.target.value;
        let newSortBy = "productId"; // Giá trị mặc định
        let newSortOrder: "asc" | "desc" = "asc";

        if (sortValue === "Bán chạy tuần") {
            newSortBy = "weeklySales";
            newSortOrder = "desc";
        } else if (sortValue === "Bán chạy tháng") {
            newSortBy = "monthlySales";
            newSortOrder = "desc";
        }

        setParams((prev) => ({
            ...prev,
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            pageNumber: 1, // Reset về trang 1 khi thay đổi sắp xếp
        }));
    };

    // Xử lý reset bộ lọc
    const resetFilters = () => {
        setParams({
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "asc",
        });
    };

    // Xử lý chuyển trang
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setParams((prev) => ({
                ...prev,
                pageNumber: page,
            }));
        }
    };

    // Tính toán các trang hiển thị (giới hạn số lượng nút phân trang)
    const getPaginationRange = () => {
        const currentPage = params.pageNumber || 1;
        const maxPagesToShow = 5; // Số lượng nút phân trang tối đa hiển thị
        const half = Math.floor(maxPagesToShow / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxPagesToShow - 1);

        // Điều chỉnh start nếu end gần cuối
        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    return (
        <div className="container mx-auto py-8 bg-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <Sidebar onFilterChange={updateParams} />

                {/* Main content */}
                <main className="flex-1 bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
                            Danh sách sản phẩm
                        </h2>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 text-sm sm:text-base">Sắp xếp theo:</span>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    onChange={handleSortChange} // Đã bỏ comment để chức năng hoạt động
                                    defaultValue="Bán chạy tuần"
                                >
                                    <option>Bán chạy tuần</option>
                                    <option>Bán chạy tháng</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 text-sm sm:text-base">Hiển thị:</span>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                    onChange={handlePageSizeChange}
                                    defaultValue="5"
                                >
                                    <option value="5">5 sản phẩm</option>
                                    <option value="10">10 sản phẩm</option>
                                    <option value="24">24 sản phẩm</option>
                                    <option value="36">36 sản phẩm</option>
                                </select>
                            </div>
                            <button
                                onClick={resetFilters}
                                className="text-orange-600 hover:text-orange-700 text-sm sm:text-base font-medium transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div className="m-1">
                        <ProductList
                            fetchApi={fetchProductList}
                            params={params}
                            onTotalPagesChange={setTotalPages} // Truyền callback để nhận totalPages
                        />
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            {/* Nút Previous */}
                            <button
                                onClick={() => goToPage((params.pageNumber || 1) - 1)}
                                disabled={(params.pageNumber || 1) === 1}
                                className={`p-2 rounded-lg transition-colors ${(params.pageNumber || 1) === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Các nút trang */}
                            {getPaginationRange().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${(params.pageNumber || 1) === page
                                        ? "bg-orange-500 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Nút Next */}
                            <button
                                onClick={() => goToPage((params.pageNumber || 1) + 1)}
                                disabled={(params.pageNumber || 1) === totalPages}
                                className={`p-2 rounded-lg transition-colors ${(params.pageNumber || 1) === totalPages
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