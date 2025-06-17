"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ChevronRight,
    LayoutGrid,
    X,
    Package,
    Sparkles,
    ArrowRight,
    Grid3X3,
    Menu,
    ChevronDown,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fetchMenus, MenuItem } from "@/features/menu";
import { CategoryItemProps } from "@/features/category/services/type";
import { fetchAllCategoriesByName } from "@/features/category/services/category.service";

const CategoryDrawer = () => {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: CategoryItemProps[] }>({});
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [menuCategory, setMenuCategory] = useState<MenuItem[]>([]);
    const [menuAuthor, setMenuAuthor] = useState<MenuItem[]>([]);
    const [menuTopic, setMenuTopic] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // États pour le hover
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [hoveredChild, setHoveredChild] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const menusData = await fetchMenus();
                const mainMenus = menusData.filter((menu: MenuItem) => menu.position === "MAINMENU" && menu.type === "CUSTOMER");
                const mainMenuCategory = menusData.filter((menu: MenuItem) =>
                    menu.position === "MAINMENU" && menu.type === "CATEGORY"
                );
                const mainMenuAuthor = menusData.filter((menu: MenuItem) =>
                    menu.position === "MAINMENU" && menu.type === "AUTHOR"
                );
                const mainMenuTopic = menusData.filter((menu: MenuItem) =>
                    menu.position === "MAINMENU" && menu.type === "TOPIC"
                );
                setMenuTopic(mainMenuTopic);
                setMenuAuthor(mainMenuAuthor);
                setMenuCategory(mainMenuCategory);
                setMenus(mainMenus);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Gestion du hover sur les catégories principales
    const handleCategoryHover = async (menuId: string) => {
        setHoveredCategory(menuId);
    };

    const LoadingSkeleton = () => (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
                        <div className="h-5 bg-gray-100 rounded-full w-12"></div>
                    </div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="flex items-center justify-between">
                                <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-50 rounded-full w-8"></div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border-gray-200 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
                >
                    <LayoutGrid className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </Button>
            </DrawerTrigger>

            <DrawerContent className="w-full max-w-md h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 border-r border-gray-200 shadow-2xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <DrawerHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                                    <Grid3X3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DrawerTitle className="text-xl font-bold text-gray-900">Danh mục</DrawerTitle>
                                    <p className="text-sm text-gray-500 mt-0.5">Khám phá sản phẩm</p>
                                </div>
                            </div>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                        {loading ? (
                            <LoadingSkeleton />
                        ) : (
                            <>
                                {/* Quick Menu */}
                                {menus.length > 0 && (
                                    <div>
                                        <div className="flex items-center mb-4 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-lg">
                                            <div className="p-1.5 bg-blue-100 rounded-lg mr-3">
                                                <Menu className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <h2 className="text-lg font-bold text-white">Menu nhanh</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {menus.map((menu) => (
                                                <Link
                                                    key={menu.menuId}
                                                    href={menu.link || "#"}
                                                    onClick={() => setOpen(false)}
                                                    className="group"
                                                >
                                                    <Card className="p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-white/80 backdrop-blur-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-sm">
                                                                {menu.name}
                                                            </span>
                                                            <div className="flex items-center space-x-1">
                                                                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                {/* Categories */}
                                <div>
                                    <div className="mb-4">
                                        <div className="flex items-center mb-4 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-gray-100 hover:border-orange-200 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-lg">
                                            <div className="p-1.5 bg-orange-100 rounded-lg mr-3">
                                                <Package className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <h2 className="text-lg font-bold text-white">Danh mục sản phẩm</h2>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {menuCategory.map((menu) => (
                                            <Card
                                                key={menu.menuId}
                                                className="group hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-orange-200 bg-white/90 backdrop-blur-sm overflow-hidden"
                                                onMouseEnter={() => handleCategoryHover(String(menu.menuId))}
                                                onMouseLeave={() => setHoveredCategory(null)}
                                            >
                                                <div className="px-5 py-4">
                                                    {/* Parent Category */}
                                                    <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                                                <Package className="w-5 h-5 text-white" />
                                                            </div>
                                                            <Link href={`/products?slug=${menu.link}`}>
                                                                <h3
                                                                    onClick={() => setOpen(false)}
                                                                    className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors"
                                                                >
                                                                    {menu.name}
                                                                </h3>
                                                            </Link>
                                                        </div>
                                                        <ChevronDown
                                                            className={`w-5 h-5 text-gray-500 transition-transform ${hoveredCategory === String(menu.menuId) ? "rotate-180" : ""
                                                                }`}
                                                        />
                                                    </div>

                                                    {/* Child Categories - Affichage au hover */}
                                                    {hoveredCategory === String(menu.menuId) && (
                                                        <div className="ml-10 mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                            {menu.childrens && menu.childrens.length > 0 ? (
                                                                menu.childrens.map((child) => (
                                                                    <div
                                                                        key={child.menuId}
                                                                        onMouseEnter={() => setHoveredChild(String(child.menuId))}
                                                                        onMouseLeave={() => setHoveredChild(null)}
                                                                        className="relative"
                                                                    >
                                                                        <div className="flex items-center justify-between py-1 hover:text-orange-600 transition-colors">
                                                                            <Link
                                                                                href={`/products?slug=${child.link}`}
                                                                                onClick={() => setOpen(false)}
                                                                                className="flex-1"
                                                                            >
                                                                                <span className="text-sm text-gray-700 hover:text-orange-600">
                                                                                    {child.name}
                                                                                </span>
                                                                            </Link>
                                                                            {child.childrens && child.childrens.length > 0 && (
                                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                                            )}
                                                                        </div>

                                                                        {/* Grandchild Categories - Affichage au hover */}
                                                                        {hoveredChild === String(child.menuId) && child.childrens && (
                                                                            <div className="ml-4 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                                                                {child.childrens.map((grandchild) => (
                                                                                    <Link
                                                                                        key={grandchild.menuId}
                                                                                        href={`/products?slug=${grandchild.link}`}
                                                                                        onClick={() => setOpen(false)}
                                                                                        className="block text-sm text-gray-600 hover:text-orange-600 transition-colors py-1 pl-2 border-l border-gray-200 hover:border-orange-300"
                                                                                    >
                                                                                        {grandchild.name}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-sm text-gray-500">Không có danh mục con</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-500"></p>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CategoryDrawer;