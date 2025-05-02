import Banner from "@/features/banner/components";
import CategoryHomeForm from "@/features/category/components";
import PostHome from "@/features/post/components";
import { ProductFlashSaleForm, ProductNewForm } from "@/features/product/components";
import PublisherShowForm from "@/features/publisher/components";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Section 1: Banner và Category */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner />
        <CategoryHomeForm />
      </div>

      {/* Section 2: Flash Sale */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-90 backdrop-blur-md py-4 rounded-lg shadow-lg text-center">
            <h1 className="text-red-600 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-md">
              Flash Sale
            </h1>
          </div>
          <div className="mt-6">
            <ProductFlashSaleForm />
          </div>
        </div>
      </div>

      {/* Section 3: Sản phẩm mới nhất */}
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 py-4 rounded-lg shadow-lg text-center">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-md">
              Sản Phẩm Mới Nhất
            </h1>
          </div>
          <div className="mt-6">
            <ProductNewForm />
          </div>
        </div>
      </div>

      {/* Section 4: Publisher */}
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PublisherShowForm />
        </div>
      </div>

      {/* Section 5: Post (hiện bị comment) */}
      {/* <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PostHome />
        </div>
      </div> */}
    </div>
  );
}