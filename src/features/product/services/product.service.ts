import { FetchProductListParams, ProductItemProps, ProductListResponse } from "@/features/product/services/type"
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
            categoryId: categoryId,
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


export const fetchProductByAuthor = async (): Promise<ProductItemProps[]> => {
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

export const fetchProductList = async (params: FetchProductListParams): Promise<ProductListResponse> => {
    const response = await axiosInstance.get(`${API}/public/products`, {
        params: params // truyền thẳng params từ ngoài vào
    });

    const data = response.data as {
        content: ProductItemProps[],
        totalElements: number,
        totalPages: number,
        pageNumber: number,
        pageSize: number
    };

    return {
        items: data.content,
        totalPages: data.totalPages,
        totalItems: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}
export const fetchProductsByIds = async (productIds: number[]): Promise<ProductItemProps[]> => {
    if (productIds.length === 0) return []

    const queryString = productIds.map((id) => `id=${id}`).join("&")
    const response = await axiosInstance.get(`${API}/public/products/ids?${queryString}`)

    const data = response.data as ProductItemProps[] // hoặc kiểm tra nếu backend trả thêm `content`

    return data
}
