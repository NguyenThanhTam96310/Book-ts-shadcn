"use client";
import Sidebar from "@/components/organisms/Sidebar";
import ProductList from "@/features/product/components/ProductList";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams } from "@/features/product/services/type";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCategoryIdFromSlug, getSlugFromCategoryId } from "@/features/category";

const ProductPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Lấy các tham số từ query string
    const initialSortBy = searchParams?.get("sortBy") || "productId";
    const initialSortOrder = searchParams?.get("sortOrder") || "asc";
    const initialPageSize = searchParams?.get("pageSize") ? Number(searchParams?.get("pageSize")) : 12;
    const initialPageNumber = searchParams?.get("pageNumber") ? Number(searchParams?.get("pageNumber")) : 1;
    const initialAuthorIds = searchParams?.getAll("authorIds").length
        ? searchParams.getAll("authorIds").map(Number) : undefined;
    const initialMinPrice = searchParams?.get("minPrice") ? Number(searchParams?.get("minPrice")) : undefined;
    const initialMaxPrice = searchParams?.get("maxPrice") ? Number(searchParams?.get("maxPrice")) : undefined;
    const initialLanguageIds = searchParams?.getAll("languageIds").length
        ? searchParams.getAll("languageIds").map(Number) : undefined;
    const initialPublisherId = searchParams?.get("publisherId") ? Number(searchParams?.get("publisherId")) : undefined;
    const initialIsSale = searchParams?.get("isSale") ? Boolean(searchParams?.get("isSale")) : undefined;
    const initialKeyWord = searchParams?.get("keyword") ? String(searchParams?.get("keyword")) : undefined;

    // Lấy initialCategoryId từ slug trong URL
    const [initialCategoryId, setInitialCategoryId] = useState<number | undefined>(undefined);
    const [totalPages, setTotalPages] = useState<number>(0);
    useEffect(() => {
        const slug = searchParams?.get("slug");
        if (slug) {
            getCategoryIdFromSlug(slug).then((categoryId) => {
                setInitialCategoryId(categoryId);
            });
        } else {
            setInitialCategoryId(undefined);
        }
    }, [searchParams]);

    // State để quản lý params, loại bỏ slug khỏi filterParams
    const [filterParams, setFilterParams] = useState<FetchProductListParams>({
        status: true,
        pageNumber: initialPageNumber,
        isSale: initialIsSale,
        pageSize: initialPageSize,
        sortBy: initialSortBy,
        sortOrder: initialSortOrder as "asc" | "desc",
        categoryId: initialCategoryId,
        authorIds: initialAuthorIds,
        minPrice: initialMinPrice,
        maxPrice: initialMaxPrice,
        languageIds: initialLanguageIds,
        publisherId: initialPublisherId,
        keyword: initialKeyWord,
    });



    // Đồng bộ params với searchParams khi URL thay đổi
    useEffect(() => {
        const slug = searchParams?.get("slug");
        const fetchParams = async () => {
            const categoryId = slug ? await getCategoryIdFromSlug(slug) : undefined;
            const newParams: Partial<FetchProductListParams> = {
                sortBy: searchParams?.get("sortBy") || "productId",
                sortOrder: (searchParams?.get("sortOrder") as "asc" | "desc") || "asc",
                pageSize: searchParams?.get("pageSize") ? Number(searchParams?.get("pageSize")) : 12,
                pageNumber: searchParams?.get("pageNumber") ? Number(searchParams?.get("pageNumber")) : 1,
                categoryId,
                authorIds: searchParams?.getAll("authorIds").length
                    ? searchParams.getAll("authorIds").map(Number)
                    : undefined,
                minPrice: searchParams?.get("minPrice") ? Number(searchParams?.get("minPrice")) : undefined,
                maxPrice: searchParams?.get("maxPrice") ? Number(searchParams?.get("maxPrice")) : undefined,
                languageIds: searchParams?.getAll("languageIds").length
                    ? searchParams.getAll("languageIds").map(Number)
                    : undefined,
                publisherId: searchParams?.get("publisherId") ? Number(searchParams?.get("publisherId")) : undefined,
                isSale: searchParams?.get("isSale") ? Boolean(searchParams?.get("isSale")) : undefined,
                keyword: searchParams?.get("keyword") ? String(searchParams?.get("keyword")) : undefined,
            };
            setFilterParams((prev) => ({
                ...prev,
                ...newParams,
            }));
        };
        fetchParams();
    }, [searchParams]);

    // Đồng bộ URL với filterParams, sử dụng slug thay vì categoryId
    useEffect(() => {
        const syncUrl = async () => {
            const query = new URLSearchParams();
            const currentQuery = new URLSearchParams(window.location.search);

            if (filterParams.sortBy && filterParams.sortBy !== "productId") query.set("sortBy", filterParams.sortBy);
            if (filterParams.sortOrder && filterParams.sortOrder !== "asc") query.set("sortOrder", filterParams.sortOrder);
            if (filterParams.pageSize && filterParams.pageSize !== 12) query.set("pageSize", filterParams.pageSize.toString());
            if (filterParams.pageNumber && filterParams.pageNumber !== 1) query.set("pageNumber", filterParams.pageNumber.toString());
            if (filterParams.categoryId !== undefined) {
                const slug = await getSlugFromCategoryId(filterParams.categoryId);
                if (slug) query.set("slug", slug);
            }
            if (filterParams.authorIds !== undefined && filterParams.authorIds.length > 0) {
                query.delete("authorIds");
                filterParams.authorIds.forEach((id) => query.append("authorIds", id.toString()));
            }
            if (filterParams.languageIds !== undefined && filterParams.languageIds.length > 0) {
                query.delete("languageIds");
                filterParams.languageIds.forEach((id) => query.append("languageIds", id.toString()));
            }
            if (filterParams.minPrice !== undefined) query.set("minPrice", filterParams.minPrice.toString());
            if (filterParams.maxPrice !== undefined) query.set("maxPrice", filterParams.maxPrice.toString());
            if (filterParams.publisherId !== undefined) query.set("publisherId", filterParams.publisherId.toString());
            if (filterParams.isSale !== undefined) query.set("isSale", filterParams.isSale.toString());
            if (filterParams.keyword !== undefined) query.set("keyword", filterParams.keyword.toString());

            const queryString = query.toString();
            const currentQueryString = currentQuery.toString();

            if (queryString !== currentQueryString) {
                router.push(`/products?${queryString}`, { scroll: false });
            }
        };
        syncUrl();
    }, [filterParams, router]);

    // Cập nhật params khi bộ lọc thay đổi, xử lý slug từ Sidebar
    const updateParams = async (newParams: Partial<FetchProductListParams>) => {
        let categoryId = newParams.categoryId;
        if (newParams.slug) {
            categoryId = await getCategoryIdFromSlug(newParams.slug);
        }
        setFilterParams((prev) => ({
            ...prev,
            ...newParams,
            categoryId: categoryId ?? newParams.categoryId, // Ưu tiên categoryId từ slug
            slug: undefined, // Xóa slug khỏi filterParams
            pageNumber: newParams.pageNumber ?? 1, // Reset về trang 1 khi thay đổi bộ lọc
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
        let newIsSale: boolean | undefined = undefined;

        switch (sortValue) {
            case "price_asc":
                newSortBy = "price";
                newSortOrder = "asc";
                break;
            case "price_desc":
                newSortBy = "price";
                newSortOrder = "desc";
                break;
            case "productName_asc":
                newSortBy = "productName";
                newSortOrder = "asc";
                break;
            case "productName_desc":
                newSortBy = "productName";
                newSortOrder = "desc";
                break;
            case "discount_asc":
                newIsSale = true;
                newSortBy = "discount";
                newSortOrder = "asc";
                break;
            case "discount_desc":
                newIsSale = true;
                newSortBy = "discount";
                newSortOrder = "desc";
                break;
            case "sale":
                newIsSale = true;
                break;
            default:
                break;
        }

        updateParams({
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            isSale: newIsSale,
        });
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            updateParams({ pageNumber: page });
            scrollToTop();
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
        <div className="bg-gray-100">
            <div className="container mx-auto py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <Sidebar onFilterChange={updateParams} />
                    <main className="flex-1 bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
                                Danh sách sản phẩm
                            </h2>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filterParams.isSale || false}
                                            onChange={(e) => updateParams({ isSale: e.target.checked || undefined })}
                                            className="rounded border-gray-300 focus:ring-orange-500"
                                        />
                                        Giảm giá
                                    </label>
                                </div>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                    onChange={handleSortChange}
                                    value={
                                        filterParams.isSale && (!filterParams.sortBy || filterParams.sortBy === "productId" || filterParams.sortBy === "productName")
                                            ? "sale"
                                            : `${filterParams.sortBy}_${filterParams.sortOrder}`
                                    }
                                >
                                    <option value="">-- Chọn sắp xếp --</option>
                                    <option value="productName_asc">Sắp xếp từ A-Z</option>
                                    <option value="productName_desc">Sắp xếp từ Z-A</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                    <option value="discount_asc">Giảm giá tăng dần</option>
                                    <option value="discount_desc">Giảm giá giảm dần</option>
                                    <option value="sale">Sản phẩm giảm giá</option>
                                </select>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 text-sm sm:text-base">Hiển thị:</span>
                                        <select
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm sm:text-base bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                                            onChange={handlePageSizeChange}
                                            value={filterParams.pageSize}
                                        >
                                            <option value="12">12 sản phẩm</option>
                                            <option value="24">24 sản phẩm</option>
                                            <option value="36">36 sản phẩm</option>
                                        </select>
                                    </div>
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

                        {totalPages > 0 && (
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
        </div>
    );
};

export default ProductPage;