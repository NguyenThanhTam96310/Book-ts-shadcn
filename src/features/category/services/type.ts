export interface CategoryItemProps {
    categoryId: string | number
    categoryName: string
    slug: string
    parentId?: number
    size?: string
    status?: "active" | "inactive" | string
    image?: string
    childrens?: CategoryItemProps[]
}
