import MenuFooter from "@/components/organisms/Menu/MenuFooter"
import {
    BookOpen,
    MapPin,
    Truck,
    ShoppingBag,
    HelpCircle,
    HeadphonesIcon,
    TruckIcon,
    RefreshCw,
    PackageSearch,
    LogIn,
    UserPlus,
    User,
    Mail,
    Phone,
    Store,
    Shield,
    Info,
} from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-blue-950 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Column 1: BOOKSTORE */}
                    <div className="md:col-span-4 text-left border-r border-orange-500 pr-4">
                        <div className="flex items-center gap-2 text-orange-500 text-2xl font-bold w-full md:w-auto mb-4">
                            <BookOpen className="sm:inline" />
                            BOOKSTORE
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/about" className="block flex items-start">
                                    <MapPin className="h-4 w-4 mr-2 mt-1 text-orange-500 shrink-0" />
                                    <span>
                                        Lầu 5, 387-389 Hai Bà Trưng, Quận 3, TP.HCM
                                        <br />
                                        Công ty CP Phát Hành Sách TP HCM – FAHASA
                                        <br />
                                        60–62 Lê Lợi, Quận 1, TP.HCM, Việt Nam
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="block flex items-start">
                                    <Truck className="h-4 w-4 mr-2 mt-1 text-orange-500 shrink-0" />
                                    <span>
                                        Fahasa.com nhận đặt hàng trực tuyến và giao hàng tận nơi.
                                        <br />
                                        KHÔNG hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng.
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <MenuFooter />
                </div>

            </div>

            {/* Footer bottom */}
            <div className="mt-8 border-t border-orange-500 pt-4 text-center text-sm space-y-1">
                <p className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span>© Chính sách bảo mật – Điều khoản sử dụng – Thông tin người dùng – Hướng dẫn yêu cầu pháp lý</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                    <Info className="h-4 w-4 text-orange-500" />
                    <span>© 2025 Công ty XYZ. All Rights Reserved.</span>
                </p>
            </div>
        </footer>
    )
}
