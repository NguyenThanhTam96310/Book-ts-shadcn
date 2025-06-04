// Mock MenuFooter component for demo
import { HelpCircle, User, BookOpen, Award, ChevronRight } from "lucide-react"

export default function MenuFooter() {
  const footerSections = [
    {
      title: "Dịch vụ khách hàng",
      icon: HelpCircle,
      links: [
        { name: "Hướng dẫn mua hàng", href: "/guide" },
        { name: "Chính sách đổi trả", href: "/return-policy" },
        { name: "Phương thức thanh toán", href: "/payment" },
        { name: "Vận chuyển & Giao hàng", href: "/shipping" },
        { name: "Câu hỏi thường gặp", href: "/faq" },
      ],
    },
    {
      title: "Về chúng tôi",
      icon: BookOpen,
      links: [
        { name: "Giới thiệu BOOKSTORE", href: "/about" },
        { name: "Tuyển dụng", href: "/careers" },
        { name: "Chương trình đối tác", href: "/partners" },
        { name: "Tin tức & Sự kiện", href: "/news" },
        { name: "Liên hệ", href: "/contact" },
      ],
    },
    {
      title: "Tài khoản",
      icon: User,
      links: [
        { name: "Đăng nhập", href: "/login" },
        { name: "Đăng ký", href: "/register" },
        { name: "Quên mật khẩu", href: "/forgot-password" },
        { name: "Tài khoản của tôi", href: "/profile" },
        { name: "Lịch sử đơn hàng", href: "/orders" },
      ],
    },
    {
      title: "Danh mục sách",
      icon: Award,
      links: [
        { name: "Sách văn học", href: "/category/literature" },
        { name: "Sách kinh tế", href: "/category/business" },
        { name: "Sách thiếu nhi", href: "/category/children" },
        { name: "Sách học ngoại ngữ", href: "/category/language" },
        { name: "Sách kỹ năng sống", href: "/category/self-help" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {footerSections.map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <section.icon className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-white text-lg">{section.title}</h3>
          </div>
          <ul className="space-y-3">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a
                  href={link.href}
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-200 flex items-center gap-2 group text-sm"
                >
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
