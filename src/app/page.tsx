import Banner from "@/features/banner/components";
import CategoryHomeForm from "@/features/category/components";
import PostNewHomeForm from "@/features/post/components";
import { ProductByCategoryHomeForm, ProductFlashSaleForm, ProductNewForm } from "@/features/product/components";
import PublisherShowForm from "@/features/publisher/components";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Section 1: Banner và Category */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Banner />
        <div className="mt-6">
          <CategoryHomeForm />
        </div>
      </div>

      {/* Section 2: Flash Sale */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 pt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white bg-opacity-95 backdrop-blur-lg py-5 rounded-xl shadow-xl text-center">
            <h1 className="text-red-600 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase drop-shadow-lg">
              ⚡ Giảm giá sốc
            </h1>
          </div>
          <ProductFlashSaleForm />
        </div>
      </div>

      {/* Section 3: Product By Category */}
      <div className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg ">
          <ProductByCategoryHomeForm />
        </div>
      </div>

      {/* Section 4: Sản phẩm mới nhất */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg ">
        <div className="flex items-center gap-4 pt-6">
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold whitespace-nowrap">
            SẢN PHẨM MỚI NHẤT
          </h1>
          <div className=" flex-1 h-1 bg-gray-300"></div>
        </div>
        <div>
          <ProductNewForm />
        </div>
      </div>


      {/* Section 5: Publisher */}
      <div className="container mx-auto mt-8">
        <PublisherShowForm />
      </div>

      {/* Section 6: Post (khôi phục và cải thiện) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-lg pb-6">
        <div className="flex items-center gap-4 py-6">
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-semibold whitespace-nowrap">
            BÀI VIẾT NỔI BẬT
          </h1>
          <div className=" flex-1 h-1 bg-gray-300"></div>
        </div>
        <div>
          <PostNewHomeForm />
        </div>
      </div>
    </div>
  );
}