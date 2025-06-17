"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Loader2 } from "lucide-react"
import { fetchMenuFooter, type MenuItem } from "@/features/menu"

export default function MenuFooter() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchMenuFooter()
        const footerMenus = response.filter(
          (menu: MenuItem) => menu.position === "FOOTERMENU" && menu.type === "CUSTOMER",
        )

        setMenus(footerMenus)
      } catch (error) {
        console.error("Lỗi khi load Menu:", error)
        setError("Không thể tải menu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    loadMenus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-300">Đang tải menu...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    )
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Không có menu nào để hiển thị.</p>
      </div>
    )
  }

  return (
    <div className="via-blue-950  px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menus.map((section, index) => (
            <div key={`menu-section-${index}`} className="space-y-6">
              {/* Section Header */}
              <div className="border-b border-slate-700 pb-3">
                <h3 className="font-bold text-orange-500 text-lg uppercase tracking-wide">{section.name}</h3>
              </div>

              {/* Section Links */}
              <nav>
                <ul className="space-y-3">
                  {section.childrens?.map((child, linkIndex) => (
                    <li key={`menu-item-${linkIndex}`}>
                      <a
                        href={`/page/${child.link}`}
                        className="group flex items-center gap-2 text-gray-300 hover:text-orange-700 transition-all duration-300 text-sm py-1"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {child.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Empty state for sections without children */}
              {(!section.childrens || section.childrens.length === 0) && (
                <p className="text-gray-500 text-sm italic">Chưa có mục con nào</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
