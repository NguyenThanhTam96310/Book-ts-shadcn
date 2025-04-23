'use client'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { MenuIcon, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useMenu } from "@/features/menu/hooks/useMenu"

export default function Menu() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { data: menus = [], isLoading } = useMenu()
  if (isLoading) return null
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <div className="relative" >
      {/* ---------- Desktop Menu ---------- */}
      <div className="border-b border-orange-500">
        <div className="container mx-auto px-4 lg:px-6">
          <Menubar className="hidden md:flex rounded-none px-0 gap-8 " >
            <Menubar className="gap-6 border-b border-gray-100 px-4 lg:px-6">
              {menus.map((menu) => (
                <MenubarMenu key={menu.menuId}>
                  {menu.childrens && menu.childrens.length > 0 ? (
                    <>
                      <MenubarTrigger className="flex items-center gap-1 hover:text-orange-500">
                        {menu.name}
                        <ChevronDown size={14} />
                      </MenubarTrigger>
                      <MenubarContent className="min-w-[160px]">
                        {menu.childrens.map((child) => (
                          <MenubarItem key={child.menuId}>
                            <Link href={child.link}>{child.name}</Link>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    </>
                  ) : (
                    <MenubarTrigger className="hover:text-orange-500">
                      <Link href={menu.link}>{menu.name}</Link>
                    </MenubarTrigger>
                  )}
                </MenubarMenu>
              ))}
            </Menubar>


          </Menubar>
        </div>
      </div>

      {/* ---------- Mobile Toggle ---------- */}
      <div className="md:hidden px-4 py-2">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* ---------- Mobile Menu ---------- */}
      {showMobileMenu && (
        <div className="md:hidden absolute left-0 right-0 bg-white shadow-md z-50 px-4 py-2 space-y-2 text-sm">
          <Link href="/" onClick={() => setShowMobileMenu(false)} className="block">
            Trang chủ
          </Link>

          {/* Dropdown: Thể loại */}
          <div>
            <button
              onClick={() => toggleDropdown('theloai')}
              className="w-full flex items-center justify-between"
            >
              <span>Thể loại</span>
              {openDropdown === 'theloai' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openDropdown === 'theloai' && (
              <div className="pl-4 mt-1 space-y-1">
                <Link
                  href="/category/van-hoc"
                  onClick={() => setShowMobileMenu(false)}
                  className="block"
                >
                  Văn học
                </Link>
                <Link
                  href="/category/kinh-te"
                  onClick={() => setShowMobileMenu(false)}
                  className="block"
                >
                  Kinh tế
                </Link>
                <Link
                  href="/category/thieu-nhi"
                  onClick={() => setShowMobileMenu(false)}
                  className="block"
                >
                  Thiếu nhi
                </Link>
              </div>

            )}
          </div>

          {/* Dropdown: Tác giả */}
          <div>
            <button
              onClick={() => toggleDropdown('tacgia')}
              className="w-full flex items-center justify-between"
            >
              <span>Tác giả</span>
              {openDropdown === 'tacgia' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openDropdown === 'tacgia' && (
              <div className="pl-4 mt-1 space-y-1">
                <Link href="/authors/nguyen-nhat-anh" className="block" onClick={() => setShowMobileMenu(false)}>Nguyễn Nhật Ánh</Link>
                <Link href="/authors/tony-buoi-sang" className="block" onClick={() => setShowMobileMenu(false)}>Tony Buổi Sáng</Link>
              </div>
            )}
          </div>

          {/* Link đơn */}
          <Link href="/khuyen-mai" onClick={() => setShowMobileMenu(false)} className="block">
            Khuyến mãi
          </Link>
          <Link href="/lien-he" onClick={() => setShowMobileMenu(false)} className="block">
            Liên hệ
          </Link>
        </div>
      )}
    </div>
  )
}

