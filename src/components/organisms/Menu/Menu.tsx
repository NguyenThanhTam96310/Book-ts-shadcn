'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenuIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useMenu } from "@/features/menu/hooks/useMenu";

export default function Menu() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: menus = [], isLoading } = useMenu();

  if (isLoading) return null;

  const toggleDropdown = (menuId: string) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  return (
    <div className="relative bg-white shadow-md">
      {/* ---------- Desktop Menu ---------- */}
      <div className="border-b-2 border-orange-500">
        <div className="container mx-auto px-4 lg:px-6">
          <Menubar className="hidden md:flex rounded-none px-0 py-4 gap-8 border-0">
            {menus.map((menu) => (
              <MenubarMenu key={menu.menuId}>
                {menu.childrens && menu.childrens.length > 0 ? (
                  <>
                    <MenubarTrigger className="flex items-center gap-2 text-gray-800 text-base font-semibold hover:text-orange-600 transition-colors group">
                      {menu.name}
                      <ChevronDown
                        size={16}
                        className="group-hover:rotate-180 transition-transform duration-300"
                      />
                    </MenubarTrigger>
                    <MenubarContent className="min-w-[200px] bg-white shadow-lg rounded-lg border border-gray-100 mt-2 p-2">
                      {menu.childrens.map((child) => (
                        <MenubarItem key={child.menuId} className="rounded-md hover:bg-orange-50 transition-colors">
                          <Link href={child.link} className="block w-full py-2 px-3 text-gray-700 hover:text-orange-600">
                            {child.name}
                          </Link>
                        </MenubarItem>
                      ))}
                    </MenubarContent>
                  </>
                ) : (
                  <MenubarTrigger className="text-gray-800 text-base font-semibold hover:text-orange-600 transition-colors">
                    <Link href={menu.link}>{menu.name}</Link>
                  </MenubarTrigger>
                )}
              </MenubarMenu>
            ))}
          </Menubar>
        </div>
      </div>

      {/* ---------- Mobile Toggle ---------- */}
      <div className="md:hidden px-4 py-3 flex items-center">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="focus:outline-none">
          <MenuIcon className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* ---------- Mobile Menu ---------- */}
      {showMobileMenu && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50 px-4 py-4 space-y-3 text-sm">
          {menus.map((menu) => (
            <div key={menu.menuId} className="border-t border-gray-200 pt-2 first:border-t-0 first:pt-0">
              {menu.childrens && menu.childrens.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleDropdown(String(menu.menuId))}
                    className="w-full flex items-center justify-between py-2 text-gray-800 font-medium"
                  >
                    <span>{menu.name}</span>
                    {openDropdown === String(menu.menuId) ? (
                      <ChevronUp size={16} className="text-orange-600" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-600" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openDropdown === String(menu.menuId) ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <div className="pl-4 space-y-2">
                      {menu.childrens.map((child) => (
                        <Link
                          key={child.menuId}
                          href={child.link}
                          onClick={() => setShowMobileMenu(false)}
                          className="block text-gray-700 hover:text-orange-600 transition-colors py-1"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={menu.link}
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-800 font-medium hover:text-orange-600 transition-colors py-2"
                >
                  {menu.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}