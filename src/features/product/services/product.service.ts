import { ProductItemProps } from "@/features/product/services/type"
import axiosInstance from "@/lib/api/Config"


const API = process.env.NEXT_PUBLIC_API

export const fetchProductFlashSaleForm = async (): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${API}/public/products`, {
        params: {
            isSale: true,
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "productId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}
export const fetchProductNewForm = async (): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${API}/public/products`, {
        params: {

            status: true,
            pageNumber: 0,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "desc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}
export const fetchProductByCategory = async (categoryId: number): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${API}/public/products`, {
        params: {
            categoryId, // dùng tham số truyền vào
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "productId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}


export const fetchProductAuthor = async (): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${API}/public/products`, {
        params: {
            authorId: 6,
            status: true,
            pageNumber: 0,
            pageSize: 5,
            sortBy: "productId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}
// src/features/product/services/product.service.ts
export const fetchProductBySlug = async (slug: string): Promise<ProductItemProps> => {
    const response = await axiosInstance.get(`${API}/public/products/slug/${slug}`)
    return response.data as ProductItemProps

}