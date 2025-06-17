export interface MenuItem {
    menuId: number
    parent?: MenuItem
    name: string
    link: string
    type?: string
    sortOrder: number
    position?: string
    childrens?: MenuItem[]
}
export interface MenuRes {
    content: MenuItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    lastPage: boolean;
}