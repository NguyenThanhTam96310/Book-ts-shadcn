'use client';

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { fetchMenuFooter, MenuItem } from "@/features/menu";

export default function MenuFooter() {
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetchMenuFooter();
        const allMenus = response;
        // Lọc menu có position === "FOOTERMENU"
        const footerMenus = allMenus.filter((menu: MenuItem) => menu.position === "FOOTERMENU");
        setMenus(footerMenus);
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
            <h3 className="font-bold text-white text-lg">{section.name}</h3>
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
    </div>
  );
}
