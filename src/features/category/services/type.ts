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
