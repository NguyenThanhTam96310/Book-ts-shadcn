'use client';

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { fetchMenuFooter, MenuItem } from "@/features/menu";
import { CategoryItemProps } from "@/features/category/services/type";
import { fetchCategoriesFooter } from "@/features/category";

export default function MenuFooter() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<CategoryItemProps[]>([])

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetchMenuFooter();
        const data = await fetchCategoriesFooter();
        // Lọc menu có position === "FOOTERMENU"
        // const footerMenus = response.filter((menu: MenuItem) => menu.position === "FOOTERMENU");
        setCategories(data)
        setMenus(response);
      } catch (error) {
        console.error("Lỗi khi load Menu:", error);
      }
    };

    loadMenus();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {menus.map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-orange-600 text-xl " >{section.name}</h3>
          </div>
          <ul className="space-y-3">
            {section.childrens?.map((child, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={child.link}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group text-sm"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{child.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-orange-600 text-xl">Danh mục sách</h3>
        </div>
        <ul className="space-y-3">
          {categories.map((cate, linkIndex) => (
            <li key={linkIndex}>
              <a
                href={`/products?categoryId=${cate.categoryId}`}
                className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group text-sm"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">{cate.categoryName}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
