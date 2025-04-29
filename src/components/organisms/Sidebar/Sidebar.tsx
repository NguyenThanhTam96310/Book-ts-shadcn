
import { fetchAllCategories } from "@/features/category";
import { fetchAllLanguages } from "@/features/language";
import { fetchAllPublishers } from "@/features/publisher";
import { Author, Category, Languages, Publisher, Supplier } from "@/types";
import { useEffect, useState } from "react"

const Sidebar = () => {
    const [categores, setCategories] = useState<Category[]>([])
    const [authors, setAuthors] = useState<Author[]>([])
    const [languages, setLanguages] = useState<Languages[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [publishers, setPublishers] = useState<Publisher[]>([])
    const [isSale, setIsSale] = useState<boolean>();
    const [status, setStatus] = useState<boolean>();
    const [keyword, setKeyword] = useState<string>("");
    const [isbn, setIsbn] = useState<Number>();
    const [maxPrice, setMaxPrice] = useState<Number>();
    const [minPrice, setMinPrice] = useState<Number>();
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const dataCate = await fetchAllCategories()
                const dataPub = await fetchAllPublishers()
                const dataLua = await fetchAllLanguages()
                setCategories(dataCate)
                setPublishers(dataPub)
                setLanguages(dataLua)
                console.log(dataPub)
            } catch (error) {
                console.error("Lỗi khi load categories:", error)
            }
        }

        loadCategories()
    }, [])
    const handlePriceChange = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    return (
        <aside className="w-full lg:w-1/4 border-r bg-red-500 ">
            <div className="space-y-6">
                {/* Nhóm sản phẩm */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">All Categories</h3>
                    <ul className="space-y-1 text-gray-700">
                        {categores.map((category) => (
                            <li key={category.categoryId}>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="font-semibold">{category.categoryName}</span>
                                </label>
                                {category.childrens && category.childrens.length > 0 && (
                                    <ul className="ml-6 space-y-1">
                                        {category.childrens.map((child) => (
                                            <li key={child.categoryId}>
                                                <label className="flex items-center gap-2 text-orange-500">
                                                    <input type="checkbox" className="mr-2" />
                                                    <span>{child.categoryName}</span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Giá */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">GIÁ</h3>
                    <ul className="space-y-1 text-gray-700">
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handlePriceChange(0, 150000)}
                                />
                                0đ - 150,000đ
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handlePriceChange(150000, 300000)}
                                />
                                150,000đ - 300,000đ
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handlePriceChange(300000, 500000)}
                                />
                                300,000đ - 500,000đ
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handlePriceChange(500000, 700000)}
                                />
                                500,000đ - 700,000đ
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={() => handlePriceChange(700000, Infinity)}
                                />
                                700,000đ - Trở lên
                            </label>
                        </li>
                    </ul>
                </div>

                {/* Nhà Cung Cấp */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">NHÀ XUẤT BẢN</h3>
                    <ul className="space-y-1 text-gray-700">
                        {publishers.map((publisher) => (
                            <li key={publisher.publisherId}>
                                <label><input type="checkbox" className="mr-2" />{publisher.publisherName}  </label>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Ngôm ngữ*/}
                <div>
                    <h3 className="text-lg font-semibold mb-2">NGÔN NGỮ</h3>
                    <ul className="space-y-1 text-gray-700">
                        {languages.map((language) => (
                            <li key={language.languageId}>
                                <label><input type="checkbox" className="mr-2" />{language.name}  </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar