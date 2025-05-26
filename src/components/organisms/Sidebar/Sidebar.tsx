'use client';

import { fetchAllCategories } from "@/features/category";
import { fetchAllLanguages } from "@/features/language";
import { fetchAllPublishers } from "@/features/publisher";
import { FetchProductListParams } from "@/features/product/services/type";
import { Author, Category, Languages, Publisher, Supplier } from "@/types";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchAllAuthors } from "@/features/author/services/author.service";

interface SidebarProps {
    onFilterChange: (newParams: Partial<FetchProductListParams>) => void;
}

const Sidebar = ({ onFilterChange }: SidebarProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [languages, setLanguages] = useState<Languages[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [isSale, setIsSale] = useState<boolean>();
    const [status, setStatus] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");
    const [isbn, setIsbn] = useState<number>(); // Sửa Number thành number
    const [maxPrice, setMaxPrice] = useState<number>(); // Sửa Number thành number
    const [minPrice, setMinPrice] = useState<number>(); // Sửa Number thành number
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedPublisherId, setSelectedPublisherId] = useState<number | null>(null);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]); // Thay đổi thành mảng
    const [selectedLanguageIds, setSelectedLanguageId] = useState<number[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

    useEffect(() => {
        const loadSidebar = async () => {
            try {
                const dataCate = await fetchAllCategories();
                const dataPub = await fetchAllPublishers();
                const dataLua = await fetchAllLanguages();
                const dataAut = await fetchAllAuthors();
                setCategories(dataCate);
                setPublishers(dataPub);
                setLanguages(dataLua);
                setAuthors(dataAut);
            } catch (error) {
                console.error("Lỗi khi load data:", error);
            }
        };
        loadSidebar();
    }, []);

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

    const handleCategoryChange = (categoryId: number) => {
        const newCategoryId = categoryId === selectedCategoryId ? null : categoryId;
        setSelectedCategoryId(newCategoryId);
        onFilterChange({ categoryId: newCategoryId ?? undefined });
    };

    const handlePublisherChange = (publisherId: number) => {
        const newPublisherId = publisherId === selectedPublisherId ? null : publisherId;
        setSelectedPublisherId(newPublisherId);
        onFilterChange({ publisherId: newPublisherId ?? undefined });
    };

    const handleAuthorChange = (authorId: number) => {
        setSelectedAuthorIds((prevSelected) => {
            if (prevSelected.includes(authorId)) {
                return prevSelected.filter((id) => id !== authorId); // Bỏ chọn
            } else {
                return [...prevSelected, authorId]; // Chọn
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
                return prevSelected.filter((id) => id !== languageId); // Bỏ chọn
            } else {
                return [...prevSelected, languageId]; // Chọn
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

    const resetFilters = () => {
        setSelectedCategoryId(null);
        setSelectedPublisherId(null);
        setSelectedAuthorIds([]); // Đặt lại thành mảng rỗng
        setSelectedLanguageId([]);
        setSelectedPriceRange(null);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setIsSale(undefined);
        setStatus(undefined);
        setKeyword("");
        setIsbn(undefined);

        onFilterChange({
            categoryId: undefined,
            publisherId: undefined,
            authorIds: undefined, // Đặt lại authorIds
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

    return (
        <aside className="w-full lg:w-1/4 bg-white border-r border-gray-200 p-4 lg:p-6">
            <div className="space-y-4">
                {/* Nhóm sản phẩm */}
                <div className="flex justify-end mb-4">
                    <button onClick={resetFilters} className="text-orange-600 hover:text-orange-700">
                        Xóa bộ lọc
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => toggleSection('categories')}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors"
                    >
                        <span>TẤT CẢ DANH MỤC</span>
                        {openSections['categories'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['categories'] ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {categories.map((category) => (
                                <li key={category.categoryId}>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                                checked={selectedCategoryId === category.categoryId}
                                                onChange={() => handleCategoryChange(Number(category.categoryId))}
                                            />
                                            <span className="font-semibold text-gray-800">{category.categoryName}</span>
                                        </label>
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
                                            className={`overflow-hidden transition-all duration-300 ${openCategories[category.categoryId] ? 'max-h-screen' : 'max-h-0'
                                                }`}
                                        >
                                            <ul className="ml-6 space-y-1 mt-1">
                                                {category.childrens.map((child) => (
                                                    <li key={child.categoryId}>
                                                        <label className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                                                checked={selectedCategoryId === child.categoryId}
                                                                onChange={() => handleCategoryChange(Number(child.categoryId))}
                                                            />
                                                            <span>{child.categoryName}</span>
                                                        </label>
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
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors"
                    >
                        <span>Giá</span>
                        {openSections['price'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['price'] ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            <li>
                                <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        checked={selectedPriceRange === '0-150000'}
                                        onChange={() => handlePriceChange(0, 150000, '0-150000')}
                                    />
                                    <span>0đ - 150,000đ</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        checked={selectedPriceRange === '150000-300000'}
                                        onChange={() => handlePriceChange(150000, 300000, '150000-300000')}
                                    />
                                    <span>150,000đ - 300,000đ</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        checked={selectedPriceRange === '300000-500000'}
                                        onChange={() => handlePriceChange(300000, 500000, '300000-500000')}
                                    />
                                    <span>300,000đ - 500,000đ</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        checked={selectedPriceRange === '500000-700000'}
                                        onChange={() => handlePriceChange(500000, 700000, '500000-700000')}
                                    />
                                    <span>500,000đ - 700,000đ</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                        checked={selectedPriceRange === '700000-Infinity'}
                                        onChange={() => handlePriceChange(700000, undefined, '700000-Infinity')}
                                    />
                                    <span>700,000đ - Trở lên</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Nhà xuất bản */}
                <div>
                    <button
                        onClick={() => toggleSection('publishers')}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors"
                    >
                        <span>Nhà xuất bản</span>
                        {openSections['publishers'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['publishers'] ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {publishers.map((publisher) => (
                                <li key={publisher.publisherId}>
                                    <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                            checked={selectedPublisherId === publisher.publisherId}
                                            onChange={() => handlePublisherChange(Number(publisher.publisherId))}
                                        />
                                        <span>{publisher.publisherName}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tác giả */}
                <div>
                    <button
                        onClick={() => toggleSection('authors')}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors"
                    >
                        <span>Tác giả </span>
                        {openSections['authors'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['authors'] ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {authors.map((author) => (
                                <li key={author.authorId}>
                                    <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                            checked={selectedAuthorIds.includes(Number(author.authorId))}
                                            onChange={() => handleAuthorChange(Number(author.authorId))}
                                        />
                                        <span>{author.authorName}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Ngôn ngữ */}
                <div>
                    <button
                        onClick={() => toggleSection('languages')}
                        className="w-full flex items-center justify-between py-2 text-orange-600 text-lg font-semibold hover:text-orange-700 transition-colors"
                    >
                        <span>Ngôn ngữ</span>
                        {openSections['languages'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openSections['languages'] ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <ul className="space-y-2 mt-2 text-gray-700">
                            {languages.map((language) => (
                                <li key={language.languageId}>
                                    <label className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
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
    );
};

export default Sidebar;