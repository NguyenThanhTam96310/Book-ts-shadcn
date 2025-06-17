import MenuFooter from "@/components/organisms/Menu/MenuFooter"
import {
    BookOpen,
    MapPin,
    HeadphonesIcon,
    TruckIcon,
    RefreshCw,
    Mail,
    Phone,
    Shield,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Heart,
    Award,
    Clock,
    CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import RegisterPromotionForm from "@/features/contact/components/RegisterPromotionForm"

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            {/* Top Section - Features */}
            <div className="relative border-b border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <TruckIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Giao hàng nhanh</h3>
                                <p className="text-gray-300 text-sm">Miễn phí vận chuyển đơn từ 200k</p>
                            </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <RefreshCw className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Đổi trả dễ dàng</h3>
                                <p className="text-gray-300 text-sm">30 ngày đổi trả miễn phí</p>
                            </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <HeadphonesIcon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Hỗ trợ 24/7</h3>
                                <p className="text-gray-300 text-sm">Tư vấn nhiệt tình, chu đáo</p>
                            </div>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-white mb-2">Chất lượng đảm bảo</h3>
                                <p className="text-gray-300 text-sm">Sách chính hãng 100%</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-4">
                            <div className="space-y-6">
                                {/* Logo */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                            BOOKSTORE
                                        </h2>
                                        <p className="text-gray-400 text-sm">Tri thức là sức mạnh</p>
                                    </div>
                                </div>

                                {/* Company Description */}
                                <p className="text-gray-300 leading-relaxed">
                                    Hệ thống nhà sách hàng đầu Việt Nam với hơn 10 năm kinh nghiệm phục vụ độc giả.
                                    Chúng tôi cam kết mang đến những cuốn sách chất lượng cao với giá cả hợp lý.
                                </p>

                                {/* Social Media */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Kết nối với chúng tôi</h3>
                                    <div className="flex gap-3">
                                        {[
                                            { icon: Facebook, color: "hover:bg-blue-600", label: "Facebook" },
                                            { icon: Instagram, color: "hover:bg-pink-600", label: "Instagram" },
                                            { icon: Twitter, color: "hover:bg-sky-600", label: "Twitter" },
                                            { icon: Youtube, color: "hover:bg-red-600", label: "Youtube" },
                                        ].map((social, index) => (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                size="icon"
                                                className={`bg-white/10 hover:bg-white/20 ${social.color} transition-all duration-300 hover:scale-110`}
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5" />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Footer */}
                        <div className="lg:col-span-8">
                            <MenuFooter />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section - Horizontal Layout */}
            <div className="relative border-t border-white/10 bg-black/10">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 mb-6">
                        <h3 className="font-bold text-orange-600 text-xl">Liên hệ</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3 group">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                                <MapPin className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="text-sm text-gray-300">
                                <p className="font-medium text-white mb-1">Địa chỉ chính:</p>
                                <p>Số 20 Tăng Nhơn Phú - Phường Phước Long B - Thành phố Thủ Đức - TP. Hồ Chí Minh</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 group">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                                <Phone className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="text-sm text-gray-300">
                                <p className="font-medium text-white mb-1">Hotline:</p>
                                <p>1111-1111 (24/7)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 group">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                                <Mail className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-sm text-gray-300">
                                <p className="font-medium text-white mb-1">Email:</p>
                                <p>support@bookstore.vn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            {/* <RegisterPromotionForm /> */}

            {/* Bottom Footer */}
            <div className="relative border-t border-white/10 bg-black/20">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                <span>Bảo mật thông tin 100%</span>
                            </div>
                            <Separator orientation="vertical" className="hidden md:block h-4 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-blue-400" />
                                <span>Chính hãng đảm bảo</span>
                            </div>
                        </div>

                        <div className="text-center text-gray-400">
                            <p>© 2025 BOOKSTORE. Tất cả quyền được bảo lưu.</p>
                        </div>
                    </div>

                    <Separator className="my-4 bg-white/10" />

                    <div className="text-center text-xs text-gray-500 space-y-1">
                        <p>
                            <a href="/privacy" className="hover:text-orange-400 transition-colors">Chính sách bảo mật</a>
                            {" • "}
                            <a href="/terms" className="hover:text-orange-400 transition-colors">Điều khoản sử dụng</a>
                            {" • "}
                            <a href="/user-info" className="hover:text-orange-400 transition-colors">Thông tin người dùng</a>
                            {" • "}
                            <a href="/legal" className="hover:text-orange-400 transition-colors">Hướng dẫn pháp lý</a>
                        </p>
                        <p className="flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}