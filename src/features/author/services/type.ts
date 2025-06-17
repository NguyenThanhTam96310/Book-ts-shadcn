export type AuthorRes = {
    authorId: number
    authorName?: string
    image?: string
    description?: string
    status?: boolean
}
export interface AuthorLastPage {
    content: AuthorRes[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}
export type AuthorSearchRes = {
    authorId: number
    authorName?: string
}