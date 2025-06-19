"use client"

import type React from "react"
import Image from "next/image"
import { Package, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProductSearchRes } from "@/features/product"
import { AuthorSearchRes } from "@/features/author/services/type"
import { CategorySearchRes } from "@/features/category/services/type"
import { LanguagesSearchRes } from "@/features/language/services/type"

interface Props {
    authors: AuthorSearchRes[]
    categories: CategorySearchRes[]
    publisher: PublisherShowcaseProps[]
    languages: LanguagesSearchRes[]
    products: ProductSearchRes[]
    searchLoading: boolean
    setShowSuggestions: (show: boolean) => void
    keyword: string
    isMobile?: boolean // Optional prop to differentiate mobile vs desktop
}

const ShowSuggestions = ({
    authors,
    products,
    languages,
    categories,
    publisher,
    searchLoading,
    setShowSuggestions,
    keyword,
    isMobile = false,
}: Props) => {
    const router = useRouter()
    // Handle author link click
    const handleAuthorClick = (authorId: number) => {
        router.push(`/products?authorIds=${authorId}`)
        setShowSuggestions(false)

    }
    const handlePublisherClick = (publisherId: number) => {
        router.push(`/products?publisherId=${publisherId}`)
        setShowSuggestions(false)

    }
    const handleLangugeClick = (publisherId: number) => {
        router.push(`/products?languageIds=${publisherId}`)
        setShowSuggestions(false)

    }
    const handleCategoryClick = (slug: string) => {
        router.push(`/products?slugCategory=${slug}`)
        setShowSuggestions(false)

    }

    // Handle product link click
    const handleProductClick = (product: ProductSearchRes) => {
        setShowSuggestions(false)
        // Assuming you have a product detail page route
        router.push(`/products/${product.slug}`)
    }
    return (
        <div
            className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-${isMobile ? "80" : "96"
                } overflow-y-auto ${isMobile ? "" : "md:max-w-2xl md:mx-auto hidden md:block"} animate-fade-in`}
        >
            {searchLoading ? (
                <div className="p-4 text-center">
                    <div className="inline-flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 text-sm">Đang tìm kiếm...</span>
                    </div>
                </div>
            ) : authors.length > 0 || products.length > 0 ? (
                <div className="py-2">
                    {/* Author Suggestions */}
                    {authors.length > 0 && (
                        <>
                            <div className={`  flex flex-wrap ${isMobile ? "" : "md:grid-cols-2"} gap-2 px-2 py-2`}>
                                {authors.map((author) => (
                                    <div
                                        key={author.authorId}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleAuthorClick(author.authorId);
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-sm text-gray-800 hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        {author.authorName}
                                    </div>
                                ))}
                                {categories.map((category) => (
                                    <div
                                        key={category.categoryId}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleCategoryClick(String(category.slug));
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-sm text-gray-800 hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        {category.categoryName}
                                    </div>
                                ))}
                                {publisher.map((publisher) => (
                                    <div
                                        key={publisher.publisherId}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handlePublisherClick(Number(publisher.publisherId));
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-sm text-gray-800 hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        {publisher.publisherName}
                                    </div>
                                ))}
                                {languages.map((language) => (
                                    <div
                                        key={language.languageId}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleLangugeClick(Number(language.languageId));
                                        }}
                                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-sm text-gray-800 hover:bg-orange-100 transition cursor-pointer"
                                    >
                                        {language.name}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Product Suggestions */}
                    {products.length > 0 && (
                        <>
                            <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">
                                Sản phẩm
                            </div>
                            <div className={`grid grid-cols-1 ${isMobile ? "" : "md:grid-cols-2"} gap-2 px-2 py-2`}>
                                {products.map((product) => (
                                    <div
                                        key={product.productId}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleProductClick(product);
                                        }}
                                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-50 last:border-b-0 rounded-lg"
                                        role="option"
                                        aria-label={`Sản phẩm: ${product.productName}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {product.images ? (
                                                <div
                                                    className={`${isMobile ? "w-8 h-10" : "w-10 h-12"
                                                        } bg-gray-100 rounded overflow-hidden flex-shrink-0`}
                                                >
                                                    <Image
                                                        src={
                                                            product.images && product.images.length > 0 && process.env.NEXT_PUBLIC_FILE
                                                                ? `${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`
                                                                : "/placeholder.png"
                                                        }
                                                        alt={product.productName}
                                                        width={isMobile ? 32 : 40}
                                                        height={isMobile ? 40 : 48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`${isMobile ? "w-8 h-10" : "w-10 h-12"
                                                        } bg-gray-200 rounded flex items-center justify-center flex-shrink-0`}
                                                >
                                                    <Package className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} text-gray-400`} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.productName}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : keyword.trim() && !searchLoading ? (
                <div className="p-4 text-center text-gray-500">
                    <Package className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Không tìm thấy sản phẩm hoặc tác giả nào</p>
                </div>
            ) : null}
        </div>
    )
}

export default ShowSuggestions
//  {showSuggestions && (
//                             <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto md:max-w-2xl md:mx-auto hidden md:block">
//                                 {searchLoading ? (
//                                     <div className="p-4 text-center">
//                                         <div className="inline-flex items-center space-x-2">
//                                             <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//                                             <span className="text-gray-500">Đang tìm kiếm...</span>
//                                         </div>
//                                     </div>
//                                 ) : (searchResults.length > 0 || searchAuthors.length > 0) ? (
//                                     <div className="py-2">
//                                         {/* Author Suggestions */}
//                                         {searchAuthors.length > 0 && (
//                                             <>
//                                                 <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b border-gray-100 m-2">
//                                                     Tác giả
//                                                 </div>
//                                                 <div className="flex flex-wrap gap-2 px-2 py-1">
//                                                     {searchAuthors.map((author) => (
//                                                         <div
//                                                             key={author.authorId}
//                                                             onMouseDown={(e) => {
//                                                                 e.stopPropagation();
//                                                                 handleAuthorClick(author.authorId);
//                                                             }}
//                                                             className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-xl text-sm text-gray-800 hover:bg-orange-100 transition cursor-pointer"
//                                                         >
//                                                             {author.authorName || 'Tác giả không xác định'}
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             </>
//                                         )}
//                                         {/* Product Suggestions */}
//                                         {searchResults.length > 0 && (
//                                             <>
//                                                 <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">
//                                                     Sản phẩm
//                                                 </div>

//                                             </>
//                                         )}
//                                     </div>
//                                 ) : keyword.trim() && !searchLoading ? (
//                                     <div className="p-4 text-center text-gray-500">
//                                         <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//                                         <p className="text-sm">Không tìm thấy sản phẩm hoặc tác giả nào</p>
//                                     </div>
//                                 ) : null}
//                             </div>
//                         )}