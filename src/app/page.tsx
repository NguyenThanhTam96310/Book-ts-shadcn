import Banner from "@/features/banner/components"
import CategoryHomeForm from "@/features/category/components"
import PostNewHomeForm from "@/features/post/components"
import { ProductByCategoryHomeForm, ProductFlashSaleForm, ProductNewForm } from "@/features/product/components"
import PublisherShowForm from "@/features/publisher/components"
import type { Metadata } from "next"
import { Zap, Sparkles, Clock, TrendingUp, BookOpen, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Export metadata cho trang /login
export const metadata: Metadata = {
  title: "Trang chủ - Bookstore",
  description: "Trang chủ Bookstore - Khám phá thế giới tri thức với hàng ngàn đầu sách chất lượng.",
}

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-screen">
      {/* Hero Section: Banner và Category */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="space-y-8">
            <Banner />
            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <CategoryHomeForm />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Flash Sale Header */}
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl mb-8 overflow-hidden">
            <div className="relative p-8 text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  FLASH SALE
                </h1>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-red-600 font-semibold">
                <Clock className="w-5 h-5" />
                <span className="text-lg">Thời gian có hạn - Nhanh tay kẻo lỡ!</span>
              </div>

              {/* <div className="mt-4 flex justify-center">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 text-lg font-bold animate-bounce">
                  Giảm đến 70%
                </Badge>
              </div> */}
            </div>
          </Card>

          {/* Flash Sale Products */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <ProductFlashSaleForm />
          </div>
        </div>
      </section>

      {/* Product By Category Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">Danh mục nổi bật</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Khám phá theo danh mục</h2>
                <p className="text-gray-600">Tìm kiếm sách theo sở thích và nhu cầu của bạn</p>
              </div>
              <ProductByCategoryHomeForm />
            </div>
          </Card>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="p-8">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">SẢN PHẨM MỚI NHẤT</h2>
                    <p className="text-gray-600 mt-1">Cập nhật những đầu sách mới nhất</p>
                  </div>
                </div>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300 cursor-pointer"
                  >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                  </Button></Link>
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

              <ProductNewForm />
            </div>
          </Card>
        </div>
      </section>

      {/* Publisher Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full mb-4">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Đối tác tin cậy</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Nhà xuất bản uy tín</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hợp tác với các nhà xuất bản hàng đầu để mang đến những cuốn sách chất lượng cao
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <PublisherShowForm />
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-xl rounded-3xl overflow-hidden">
            <div className="p-8">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">BÀI VIẾT NỔI BẬT</h2>
                    <p className="text-gray-600 mt-1">Khám phá những bài viết thú vị về sách và đọc</p>
                  </div>
                </div>
                <Link href="/post?topicId=newPost">
                  <Button
                    variant="outline"
                    className="hidden sm:flex items-center gap-2 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-300 cursor-pointer"
                  >
                    Đọc thêm
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Decorative Line */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-orange-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 w-16 h-1 rounded-full"></div>
                </div>
              </div>

              <PostNewHomeForm />
            </div>
          </Card>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Đăng ký nhận tin từ BOOKSTORE
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Nhận thông báo về sách mới, ưu đãi đặc biệt và những bài viết hay về thế giới sách
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Đăng ký ngay
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section> */}
    </div>
  )
}
