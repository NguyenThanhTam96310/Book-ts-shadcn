export interface MenuItem {
    menuId: number
    name: string
    link: string
    childrens?: MenuItem[]
}