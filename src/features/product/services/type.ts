interface ProductItemProps {
    productId: string | number
    productName: string
    description?: string
    price: number
    discount?: number
    isbn?: string
    pageNumber?: number
    quantity?: number
    size?: string
    slug: string
    status?: "active" | "inactive" | string
    weight?: number
    year?: number
    publisherId?: string | number
    publisherName?: string // Added for display purposes
    supplierId?: string | number
    images?: Images[] // Not in schema but needed for display
    author?: string // Not in schema but needed for display
    isAuthentic?: boolean // Not in schema but needed for display
}

interface Images {
    fileName: string
}