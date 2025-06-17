import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProductNewForm } from "@/features/product/components"
import ProductByCategoryForm from "@/features/product/components/ProductByCategoryForm"
import ProductDetail from "@/features/product/components/ProductDetail"
import ProductReview from "@/features/product/components/ProductReview"
import ProductSuggestForm from "@/features/product/components/ProductSuggestForm"
import { fetchProductBySlug } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface Props {
    params: { slug: string }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product: ProductItemProps = await fetchProductBySlug(slug)
    const getAuthorIds = (authors?: { authorId?: string | number | undefined }[]): number[] => {
        return (authors || [])
            .map((author) => typeof author.authorId === "string" ? Number(author.authorId) : author.authorId)
            .filter((id): id is number => typeof id === "number" && !isNaN(id));
    };

    return (
        <div className="bg-gray-100 py-4">
            <div className="container mx-auto">

                <ProductDetail product={product} />

                <div className="my-4">
                    <ProductReview productId={product.productId} />
                </div>
                <ProductByCategoryForm categoryId={product.categories?.[0]?.categoryId} currentProductId={product.productId} />

                <section className="py-5 relative">
                    <div className="container mx-auto ">
                        <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-3xl overflow-hidden">
                            <div className="p-8">
                                {/* Section Header */}
                                <div className="flex items-center justify-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 ">GỢI Ý CHO BẠN</h2>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative Line */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gradient-to-r from-green-200 to-emerald-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-1 rounded-full"></div>
                                    </div>
                                </div>

                                <ProductSuggestForm authorId={getAuthorIds(product?.authors)} publisherId={Number(product.publisher?.publisherId)} />
                            </div>
                        </Card>
                    </div>
                </section>
            </div>
        </div>
    )
}
