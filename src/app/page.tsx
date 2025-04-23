import Banner from "@/features/banner/components";
import CategoryHomeForm from "@/features/category/components";
import { ProductFlashSaleForm, ProductNewForm } from "@/features/product/components";

import PublisherShowForm from "@/features/publisher/components";

export default function Home() {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto pt-6">
        <Banner />
        <CategoryHomeForm />
      </div>
      <div className="bg-red-400 my-6">
        <div className="container mx-auto pt-5">
          <div className="bg-gradient-to-r from-red-50 to-orange-400 py-6 text-center rounded-lg">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-widest uppercase drop-shadow-lg">
              FLASH SALE
            </h1>
          </div>
          <ProductFlashSaleForm />
        </div>
      </div>
      <div className="my-6 mx-6  bg-white  rounded-lg">
        <div className="container mx-auto pt-5">
          <div className="bg-red-500 py-6 text-center  rounded-lg">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-widest uppercase drop-shadow-lg">
              SẢN PHẨM MỚI NHẤT
            </h1>
          </div>
          <ProductNewForm />
        </div>
      </div>
      <div className="my-6 mx-6">
        <PublisherShowForm />
      </div>
    </div>
  );
}
