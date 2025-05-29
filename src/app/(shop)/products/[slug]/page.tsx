import { ProductNewForm } from "@/features/product/components"
import ProductByCategoryForm from "@/features/product/components/ProductByCategoryForm"
import ProductDetail from "@/features/product/components/ProductDetail"
import ProductReview from "@/features/product/components/ProductReview"
import { fetchProductBySlug } from "@/features/product/services/product.service"
import { ProductItemProps } from "@/features/product/services/type"

interface Props {
    params: { slug: string }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product: ProductItemProps = await fetchProductBySlug(slug)

    return (
        <div className="bg-gray-100 py-4">
            <div className="container mx-auto">
                <div className="mb-4">
                    <ProductDetail product={product} />
                </div>
                {/* <div className="mb-4">
                    <ProductReview />
                </div> */}
                <div className="p-4 bg-white rounded-lg mb-4">
                    <div className="container mx-auto pt-5">
                        <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
                            Sản phẩm liên quan
                        </h1>
                        <ProductByCategoryForm categoryId={product.categories?.[0]?.categoryId} currentProductId={product.productId} />
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-b from-orange-400 to-white rounded-lg">
                    <div className="container mx-auto pt-5">
                        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-widest uppercase drop-shadow-lg text-center">
                            Gợi ý cho bạn
                        </h1>
                        <ProductNewForm />
                    </div>
                </div>
            </div>
        </div>

    )
}
