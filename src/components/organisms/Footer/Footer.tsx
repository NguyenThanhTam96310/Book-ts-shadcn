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

                    {/* Column 2: Services, Support, Account, Contact in a single row */}
                    <div className="md:col-span-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Dịch vụ */}
                            <div className="text-left">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <ShoppingBag className="h-5 w-5 mr-2 text-orange-500" />
                                    Dịch vụ
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="/services" className="hover:text-orange-500 flex items-center">
                                            <ShoppingBag className="h-4 w-4 mr-2 text-orange-500" />
                                            Sản phẩm
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/faq" className="hover:text-orange-500 flex items-center">
                                            <HelpCircle className="h-4 w-4 mr-2 text-orange-500" />
                                            Câu hỏi thường gặp
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/support" className="hover:text-orange-500 flex items-center">
                                            <HeadphonesIcon className="h-4 w-4 mr-2 text-orange-500" />
                                            Hỗ trợ khách hàng
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Hỗ trợ */}
                            <div className="text-left">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <HeadphonesIcon className="h-5 w-5 mr-2 text-orange-500" />
                                    Hỗ trợ
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="/shipping" className="hover:text-orange-500 flex items-center">
                                            <TruckIcon className="h-4 w-4 mr-2 text-orange-500" />
                                            Vận chuyển
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/return" className="hover:text-orange-500 flex items-center">
                                            <RefreshCw className="h-4 w-4 mr-2 text-orange-500" />
                                            Chính sách đổi trả
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/track-order" className="hover:text-orange-500 flex items-center">
                                            <PackageSearch className="h-4 w-4 mr-2 text-orange-500" />
                                            Theo dõi đơn hàng
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Tài khoản */}
                            <div className="text-left">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-orange-500" />
                                    Tài khoản
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="/login" className="hover:text-orange-500 flex items-center">
                                            <LogIn className="h-4 w-4 mr-2 text-orange-500" />
                                            Đăng nhập
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/register" className="hover:text-orange-500 flex items-center">
                                            <UserPlus className="h-4 w-4 mr-2 text-orange-500" />
                                            Đăng ký
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/profile" className="hover:text-orange-500 flex items-center">
                                            <User className="h-4 w-4 mr-2 text-orange-500" />
                                            Tài khoản của tôi
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Liên hệ */}
                            <div className="text-left">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                    <Phone className="h-5 w-5 mr-2 text-orange-500" />
                                    Liên hệ
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li>
                                        <a href="mailto:contact@nhasach.com" className="hover:text-orange-500 flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-orange-500" />
                                            Email: contact@nhasach.com
                                        </a>
                                    </li>
                                    <li>
                                        <a href="tel:+123456789" className="hover:text-orange-500 flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-orange-500" />
                                            SĐT: +123 456 789
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/store-locator" className="hover:text-orange-500 flex items-center">
                                            <Store className="h-4 w-4 mr-2 text-orange-500" />
                                            Tìm cửa hàng
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
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
