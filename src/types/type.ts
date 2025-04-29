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
export interface Supplier {
    supplierId: string | number
    supplierName: string
    address?: string
    mobieNumber?: string
    slug?: string
    email?: string
}


export interface Category {
    categoryId: string | number
    categoryName: string
    slug: string
    parentId?: number
    size?: string
    status?: "active" | "inactive" | string
    image?: string
    childrens?: Category[]
}