import { Author, Categories, Images, Languages, Publisher } from "@/types"

export interface ProductItemProps {
    productId: string | number
    productName: string
    description?: string
    price: number
    discount?: number
    isbn?: string
    categories: Categories[]
    pageNumber?: number
    quantity?: number
    size?: string
    slug: string
    status?: "active" | "inactive" | string
    weight?: number
    year?: number
    languages?: Languages[]
    publisher?: Publisher
    supplierId?: string | number
    images?: Images[] // Not in schema but needed for display
    authors?: Author[] // Not in schema but needed for display
    isAuthentic?: boolean // Not in schema but needed for display
}

export interface FetchProductListParams {
    keyword?: string
    isbn?: string
    minPrice?: number
    maxPrice?: number
    categoryId?: number
    authorIds?: number[]
    languageIds?: number[]
    supplierId?: number
    publisherId?: number
    isSale?: boolean
    status?: boolean
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}
export interface ProductListResponse {
    items: ProductItemProps[];
    totalPages: number;
    totalItems: number;
    pageNumber: number;
    pageSize: number;
}