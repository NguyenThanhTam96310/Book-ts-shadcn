export interface CategoryItemProps {
    categoryId: string | number
    categoryName: string
    slug: string
    parentId?: number
    size?: string
    status?: boolean
    image?: string
    childrens?: CategoryItemProps[]
}
export interface CategoriesRes {
    content: CategoryItemProps[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}
export interface CategorySearchRes {
    categoryId?: string | number
    categoryName: string
    slug?: string
}