import Banner from "@/features/banner/components";
import CategoryHomeForm from "@/features/category/components";
import PostHome from "@/features/post/components";
import { ProductFlashSaleForm, ProductNewForm } from "@/features/product/components";
import ProductByCategoryForm from "@/features/product/components/ProductByCategoryForm";
import ProductByCategoryHomeForm from "@/features/product/components/ProductByCategoryHomeForm";
import PublisherShowForm from "@/features/publisher/components";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Section 1: Banner và Category */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <Banner />

        <div className="mt-6">
          <CategoryHomeForm />
        </div>
      </div>

      {/* Section 2: Flash Sale */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-95 backdrop-blur-lg py-5 rounded-xl shadow-xl text-center">
            <h1 className="text-red-600 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-lg">
              ⚡ Flash Sale
            </h1>
          </div>
          <div className="mt-8">
            <ProductFlashSaleForm />
          </div>
        </div>
      </div>

      {/* Section 3: Product By Category */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ProductByCategoryHomeForm categoryId={1} />
          </div>
        </div>
      </div>
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ProductByCategoryHomeForm categoryId={2} />
          </div>
        </div>
      </div>

      {/* Section 4: Sản phẩm mới nhất */}
      <div className="py-10 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 py-5 rounded-xl shadow-xl text-center">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-lg">
              Sản Phẩm Mới Nhất
            </h1>
          </div>
          <div className="mt-8">
            <ProductNewForm />
          </div>
        </div>
      </div>

      {/* Section 5: Publisher */}
      <div className="py-10">
        <PublisherShowForm />
      </div>

      {/* Section 6: Post (khôi phục và cải thiện) */}
      <div className="py-10 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 py-5 rounded-xl shadow-xl text-center">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-lg">
              Bài Viết Nổi Bật
            </h1>
          </div>
          <div className="mt-8">
            <PostHome />
          </div>
        </div>
      </div>
    </div>
  );
}