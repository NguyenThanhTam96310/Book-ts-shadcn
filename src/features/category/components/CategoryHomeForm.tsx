"use client"

import { useEffect, useState } from "react"
import CategoryItem from "@/components/organisms/CategoryItem"
import { fetchCategories } from "@/features/category/services/category.service"
import { CategoryItemProps } from "@/features/category/services/type"

const CategoryHomeForm = () => {
    const [categories, setCategories] = useState<CategoryItemProps[]>([])

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories()
                setCategories(data)
            } catch (error) {
                console.error("Lỗi khi load categories:", error)
            }
        }

        loadCategories()
    }, [])
    return (
        <section className="container mx-auto rounded-lg">

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"> */}

                {categories.map((category) => (
                    <CategoryItem
                        key={category.categoryId}
                        categoryId={category.categoryId}
                        categoryName={category.categoryName}
                        image={category.image}
                        slug={category.slug} />
                ))}
            </div>
        </section>
    )
}

export default CategoryHomeForm
