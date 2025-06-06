export interface MenuItem {
    menuId: number
    parent?: MenuItem
    name: string
    link: string
    sortOrder: number
    position?: string
    childrens?: MenuItem[]
}