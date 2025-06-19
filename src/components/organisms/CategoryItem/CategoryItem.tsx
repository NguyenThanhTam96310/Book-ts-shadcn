import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import type { CategoryItemProps } from "@/features/category/services/type"
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react"

const CategoryItem: FC<CategoryItemProps> = ({ categoryId, categoryName, slug, image, status = "active" }) => {
    if (status !== "active") return null

    return (
        <div className="group relative w-full h-48 md:h-52 lg:h-56 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <Link href={`products?slugCategory=${slug}`} className="block w-full h-full">
                {/* Background Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={image ? `${process.env.NEXT_PUBLIC_FILE}${image}` : "/Image.jpg"}
                        alt={categoryName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500"></div>

                    {/* Decorative Elements
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div> */}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        {/* Top Section - Category Badge */}
                        <div className="flex justify-start">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                <span className="text-white text-xs font-medium">Danh mục</span>
                            </div>
                        </div>

                        {/* Bottom Section - Title and Button */}
                        <div className="space-y-4">
                            {/* Category Title */}
                            <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <h3 className="text-white text-lg md:text-2xl font-bold leading-tight drop-shadow-lg">
                                    {categoryName}
                                </h3>
                                <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
                            </div>

                            {/* Action Button */}
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/button">
                                    <div className="flex items-center justify-center gap-2 px-6 py-3">
                                        <ShoppingBag className="w-4 h-4 group-hover/button:scale-110 transition-transform duration-300" />
                                        <span className="font-semibold text-sm uppercase tracking-wide">Khám phá ngay</span>
                                        <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                                    </div>

                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Bottom Border Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-300"></div>
                </div>
            </Link>
        </div>
    )
}

export default CategoryItem
