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


export interface Images {
    fileName: string
}

export interface Publisher {
    publisherId?: string | number
    publisherName?: string
    slug: string
    email?: string
}
export interface Author {
    authorId?: string | number,
    authorName?: string,
}

export interface Languages {
    languageId: string | number
    name: string
}
export interface Categories {
    categoryId: string | number
    categoryName: string
    slug: string
    parentId?: number
    size?: string
    status?: "active" | "inactive" | string
    image?: string
}