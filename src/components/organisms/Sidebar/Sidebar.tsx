'use client';

import { fetchAllCategories } from "@/features/category";
import { fetchAllLanguages } from "@/features/language";
import { fetchAllPublishers } from "@/features/publisher";
import { FetchProductListParams } from "@/features/product/services/type";
import { Author, Category, Languages, Publisher, Supplier } from "@/types";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchAllAuthors, fetchAuthors } from "@/features/author/services/author.service";
import { CategoryItemProps } from "@/features/category/services/type";
import { AuthorLastPage, AuthorRes } from "@/features/author/services/type";

interface SidebarProps {
    onFilterChange: (newParams: Partial<FetchProductListParams>) => void;
}

const Sidebar = ({ onFilterChange }: SidebarProps) => {
    const [categories, setCategories] = useState<CategoryItemProps[]>([]);
    const [authors, setAuthors] = useState<AuthorRes[]>([]);
    const [languages, setLanguages] = useState<Languages[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isSale, setIsSale] = useState<boolean>();
    const [status, setStatus] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");
    const [isbn, setIsbn] = useState<number>();
    const [maxPrice, setMaxPrice] = useState<number>();
    const [minPrice, setMinPrice] = useState<number>();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
    const [selectedPublisherId, setSelectedPublisherId] = useState<number | null>(null);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
    const [selectedLanguageIds, setSelectedLanguageId] = useState<number[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

    // Thêm state cho load more authors
    const [displayedAuthorsCount, setDisplayedAuthorsCount] = useState<number>(10);
    const [isLoadingMoreAuthors, setIsLoadingMoreAuthors] = useState<boolean>(false);

    // Các useEffect giữ nguyên như cũ
    useEffect(() => {
        const loadSidebar = async () => {
            try {
                const dataPub = await fetchAllPublishers();
                setPublishers(dataPub);
            } catch (error) {
                console.error("Lỗi khi load dataPub:", error);
            }
        };
        loadSidebar();
    }, []);

    useEffect(() => {
        const loadSidebar = async () => {
            try {
                const dataCate = await fetchAllCategories();
                setCategories(dataCate)
            } catch (error) {
                console.error("Lỗi khi load cate:", error);
            }
        };
        loadSidebar();
    }, []);

    useEffect(() => {
        const loadSidebar = async () => {
            try {
                const dataLua = await fetchAllLanguages();
                setLanguages(dataLua);
            } catch (error) {
                console.error("Lỗi khi load dataLua:", error);
            }
        };
        loadSidebar();
    }, []);

    useEffect(() => {
        const loadSidebar = async () => {
            try {
                const dataAut = await fetchAuthors();
                setAuthors(dataAut);
            } catch (error) {
                console.error("Lỗi khi load dataAut:", error);
            }
        };
        loadSidebar();
    }, []);

    // Hàm load thêm tác giả
    const handleLoadMoreAuthors = () => {
        setIsLoadingMoreAuthors(true);

        // Simulate loading delay
        setTimeout(() => {
            setDisplayedAuthorsCount(prev => prev + 10);
            setIsLoadingMoreAuthors(false);
        }, 300);
    };

    // Reset displayed authors count khi reset filters
    const resetFilters = () => {
        setSelectedCategorySlug(null);
        setSelectedPublisherId(null);
        setSelectedAuthorIds([]);
        setSelectedLanguageId([]);
        setSelectedPriceRange(null);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setIsSale(undefined);
        setStatus(undefined);
        setKeyword("");
        setIsbn(undefined);
        setDisplayedAuthorsCount(10); // Reset về 5 tác giả ban đầu

        onFilterChange({
            slugCategory: undefined,
            publisherId: undefined,
            authorIds: undefined,
            languageIds: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            isSale: undefined,
            status: undefined,
            keyword: "",
            isbn: undefined,
            pageNumber: 1,
            pageSize: undefined,
            sortBy: "productId",
            sortOrder: "asc",
        });
    };

    // Các hàm handle khác giữ nguyên
    const handlePriceChange = (min: number, max: number | undefined, rangeKey: string) => {
        if (selectedPriceRange === rangeKey) {
            setSelectedPriceRange(null);
            setMinPrice(undefined);
            setMaxPrice(undefined);
            onFilterChange({ minPrice: undefined, maxPrice: undefined });
        } else {
            setSelectedPriceRange(rangeKey);
            setMinPrice(min);
            setMaxPrice(max);
            onFilterChange({ minPrice: min, maxPrice: max });
        }
    };

    const handleCategoryChange = (slugCategory: string) => {
        const newCategorySlug = slugCategory === selectedCategorySlug ? null : slugCategory;
        setSelectedCategorySlug(newCategorySlug);
        onFilterChange({ slugCategory: newCategorySlug ?? undefined });
    };

    const handlePublisherChange = (publisherId: number) => {
        const newPublisherId = publisherId === selectedPublisherId ? null : publisherId;
        setSelectedPublisherId(newPublisherId);
        onFilterChange({ publisherId: newPublisherId ?? undefined });
    };

    const handleAuthorChange = (authorId: number) => {
        setSelectedAuthorIds((prevSelected) => {
            if (prevSelected.includes(authorId)) {
                return prevSelected.filter((id) => id !== authorId);
            } else {
                return [...prevSelected, authorId];
            }
        });
    };

    useEffect(() => {
        onFilterChange({
            authorIds: selectedAuthorIds.length > 0 ? selectedAuthorIds : undefined,
        });
    }, [selectedAuthorIds]);

    const handleLanguageChange = (languageId: number) => {
        setSelectedLanguageId((prevSelected) => {
            if (prevSelected.includes(languageId)) {
                return prevSelected.filter((id) => id !== languageId);
            } else {
                return [...prevSelected, languageId];
            }
        });
    };

    useEffect(() => {
        onFilterChange({
            languageIds: selectedLanguageIds.length > 0 ? selectedLanguageIds : undefined,
        });
    }, [selectedLanguageIds]);

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleCategory = (categoryId: number) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // Lấy danh sách tác giả hiển thị
    const displayedAuthors = authors.slice(0, displayedAuthorsCount);
    const hasMoreAuthors = displayedAuthorsCount < authors.length;

    return (
        <aside className="w-full lg:w-1/4 bg-white border-r border-gray-200 p-4 lg:p-6">
            <div className="space-y-4">
                {/* Nhóm sản phẩm */}
                <div className="flex justify-end mb-4">
                    <button onClick={resetFilters} className="text-orange-600 hover:text-orange-700 cursor-pointer">
                        Xóa bộ lọc
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => toggleSection("categories")}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors cursor-pointer"
                    >
                        <span>Tất cả danh mục</span>
                        {openSections["categories"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections["categories"] ? "max-h-screen" : "max-h-0"}`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {categories.map((category) => (
                                <li key={`${category.categoryId}-${category.categoryName}`}>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`cursor-pointer transition-colors ${selectedCategorySlug === String(category.slug)
                                                ? "text-orange-500 font-bold font-semibold"
                                                : "text-gray-800 hover:text-orange-500"
                                                }`}
                                            onClick={() => handleCategoryChange(String(category?.slug))}
                                        >
                                            {category.categoryName}
                                        </span>
                                        {category.childrens && category.childrens.length > 0 && (
                                            <button onClick={() => toggleCategory(Number(category.categoryId))}>
                                                {openCategories[category.categoryId] ? (
                                                    <ChevronUp size={16} className="text-orange-500" />
                                                ) : (
                                                    <ChevronDown size={16} className="text-gray-500" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {category.childrens && category.childrens.length > 0 && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ${openCategories[category.categoryId] ? "max-h-screen" : "max-h-0"
                                                }`}
                                        >
                                            <ul className="ml-2 space-y-1 mt-1">
                                                {category.childrens.map((child) => (
                                                    <li key={`${child.categoryId}-${child.categoryName}`}>
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`cursor-pointer transition-colors ${selectedCategorySlug === String(child.categoryId)
                                                                    ? "text-orange-500 font-semibold"
                                                                    : "text-gray-600 hover:text-orange-500"
                                                                    }`}
                                                                onClick={() => handleCategoryChange(String(child.slug))}
                                                            >
                                                                {child.categoryName}
                                                            </span>
                                                            {child.childrens && child.childrens.length > 0 && (
                                                                <button onClick={() => toggleCategory(Number(child.categoryId))}>
                                                                    {openCategories[child.categoryId] ? (
                                                                        <ChevronUp size={16} className="text-orange-500" />
                                                                    ) : (
                                                                        <ChevronDown size={16} className="text-gray-500" />
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                        {child.childrens && child.childrens.length > 0 && (
                                                            <div
                                                                className={`overflow-hidden transition-all duration-300 ${openCategories[child.categoryId] ? "max-h-screen" : "max-h-0"
                                                                    }`}
                                                            >
                                                                <ul className="ml-4 space-y-1 mt-1">
                                                                    {child.childrens.map((child2) => (
                                                                        <li key={`${child2.categoryId}-${child2.categoryName}`}>
                                                                            <span
                                                                                className={`cursor-pointer transition-colors ${selectedCategorySlug === String(child2.slug)
                                                                                    ? "text-orange-500 font-semibold"
                                                                                    : "text-gray-600 hover:text-orange-500"
                                                                                    }`}
                                                                                onClick={() => handleCategoryChange(String(child2.slug))}
                                                                            >
                                                                                {child2.categoryName}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Giá */}
                <div>
                    <button
                        onClick={() => toggleSection('price')}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors cursor-pointer"
                    >
                        <span>Giá</span>
                        {openSections['price'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['price'] ? 'max-h-screen' : 'max-h-0'}`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            <li>
                                <span
                                    className={`cursor-pointer transition-colors ${selectedPriceRange === '0-150000' ? 'text-orange-500 font-semibold' : 'text-gray-700 hover:text-orange-500'
                                        }`}
                                    onClick={() => handlePriceChange(0, 150000, '0-150000')}
                                >
                                    0đ - 150,000đ
                                </span>
                            </li>
                            <li>
                                <span
                                    className={`cursor-pointer transition-colors ${selectedPriceRange === '150000-300000' ? 'text-orange-500 font-semibold' : 'text-gray-700 hover:text-orange-500'
                                        }`}
                                    onClick={() => handlePriceChange(150000, 300000, '150000-300000')}
                                >
                                    150,000đ - 300,000đ
                                </span>
                            </li>
                            <li>
                                <span
                                    className={`cursor-pointer transition-colors ${selectedPriceRange === '300000-500000' ? 'text-orange-500 font-semibold' : 'text-gray-700 hover:text-orange-500'
                                        }`}
                                    onClick={() => handlePriceChange(300000, 500000, '300000-500000')}
                                >
                                    300,000đ - 500,000đ
                                </span>
                            </li>
                            <li>
                                <span
                                    className={`cursor-pointer transition-colors ${selectedPriceRange === '500000-700000' ? 'text-orange-500 font-semibold' : 'text-gray-700 hover:text-orange-500'
                                        }`}
                                    onClick={() => handlePriceChange(500000, 700000, '500000-700000')}
                                >
                                    500,000đ - 700,000đ
                                </span>
                            </li>
                            <li>
                                <span
                                    className={`cursor-pointer transition-colors ${selectedPriceRange === '700000-Infinity' ? 'font-semibold text-orange-500' : 'text-gray-700 hover:text-orange-500'
                                        }`}
                                    onClick={() => handlePriceChange(700000, undefined, '700000-Infinity')}
                                >
                                    700,000đ - Trở lên
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Nhà xuất bản */}
                <div>
                    <button
                        onClick={() => toggleSection("publishers")}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors cursor-pointer"
                    >
                        <span>Nhà xuất bản</span>
                        {openSections["publishers"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections["publishers"] ? "max-h-screen" : "max-h-0"
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {publishers.map((publisher) => (
                                <li key={publisher.publisherId}>
                                    <label className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                                        <span
                                            className={` cursor-pointer transition-colors ${selectedPublisherId === Number(publisher.publisherId)
                                                ? "text-orange-500 font-semibold"
                                                : "text-gray-800 hover:text-orange-500 "
                                                }`}
                                            onClick={() => handlePublisherChange(Number(publisher.publisherId))}
                                        >
                                            {publisher.publisherName}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tác giả */}
                {/* Tác giả - với tính năng load more */}
                <div>
                    <button
                        onClick={() => toggleSection("authors")}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors cursor-pointer"
                    >
                        <span>Tác giả ({selectedAuthorIds.length > 0 ? selectedAuthorIds.length : 0})</span>
                        {openSections["authors"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections["authors"] ? "max-h-screen" : "max-h-0"
                            }`}
                    >
                        <div className="mt-2 text-gray-700">
                            {/* Hiển thị số tác giả đã chọn */}
                            {selectedAuthorIds.length > 0 && (
                                <div className="mb-3 p-2 bg-orange-50 rounded-md">
                                    <p className="text-sm text-orange-700">
                                        Đã chọn {selectedAuthorIds.length} tác giả
                                    </p>
                                </div>
                            )}

                            <ul className="space-y-2 max-h-128 overflow-y-auto pr-2">
                                {displayedAuthors.map((author) => (
                                    <li key={author.authorId}>
                                        <label className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer p-1 rounded hover:bg-orange-50">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded cursor-pointer"
                                                checked={selectedAuthorIds.includes(Number(author.authorId))}
                                                onChange={() => handleAuthorChange(Number(author.authorId))}
                                            />
                                            <span className="text-sm">{author.authorName}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>

                            {/* Nút Load More */}
                            {hasMoreAuthors && (
                                <div className="mt-3 text-center">
                                    <button
                                        onClick={handleLoadMoreAuthors}
                                        disabled={isLoadingMoreAuthors}
                                        className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoadingMoreAuthors ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                                Đang tải...
                                            </span>
                                        ) : (
                                            `Xem thêm ${Math.min(10, authors.length - displayedAuthorsCount)} tác giả`
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Hiển thị thông tin */}
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                Hiển thị {displayedAuthors.length} / {authors.length} tác giả
                            </div>
                        </div>
                    </div>
                </div>


                {/* Ngôn ngữ */}
                <div>
                    <button
                        onClick={() => toggleSection("languages")}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors cursor-pointer"
                    >
                        <span>Ngôn ngữ</span>
                        {openSections["languages"] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections["languages"] ? "max-h-screen" : "max-h-0"
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {languages.map((language) => (
                                <li key={language.languageId}>
                                    <label className="flex items-center gap-2 hover:text-orange-500 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded cursor-pointer"
                                            checked={selectedLanguageIds.includes(Number(language.languageId))}
                                            onChange={() => handleLanguageChange(Number(language.languageId))}
                                        />
                                        <span>{language.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    )
};

export default Sidebar;