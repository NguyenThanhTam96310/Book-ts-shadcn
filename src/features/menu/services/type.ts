export interface MenuItem {
    menuId: number
    parent?: MenuItem
    name: string
    link: string
    position?: string

    childrens?: MenuItem[]
}