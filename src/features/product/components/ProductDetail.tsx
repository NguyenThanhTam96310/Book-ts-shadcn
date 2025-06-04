'use client'

import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './ProductDetail.module.css'
import { ProductItemProps } from '@/features/product/services/type'
import VoucherCard from '@/components/organisms/VoucherCard/VoucherCard'
import { Button } from '@/components/ui/button'
import { POST_ADD } from '@/lib/api/Service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { CART_ITEM_KEY } from '@/constants/cartConstants'
import { PAYMENT_ITEM_KEY } from '@/constants/orderConstants'
import { CartProps } from '@/features/cart'
import { Truck, Undo2, Users } from 'lucide-react';
interface ProductDetailProps {
    product: ProductItemProps
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState<string | null>(null) // State để quản lý hình ảnh chính
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState<number | null>(null)
    const [isExpanded, setIsExpanded] = useState(false) // Trạng thái mở rộng nội dung
    const [showReadMore, setShowReadMore] = useState(false) // Hiển thị nút "Xem thêm"
    const descriptionRef = useRef<HTMLDivElement>(null) // Ref để kiểm tra chiều cao nội dung
    const [cart, setCart] = useState<CartProps>({
        userId: undefined,
        cartItems: [],
        totalPrice: 0,
    });
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    // Theo dõi vị trí cuộn
    useEffect(() => {
        const handleScroll = () => {
            const infoColumn = document.querySelector(`.${styles.infoColumn}`);
            if (infoColumn) {
                const infoColumnHeight = infoColumn.scrollHeight; // Chiều cao thực của infoColumn
                const windowHeight = window.innerHeight; // Chiều cao viewport
                const scrollTop = window.scrollY; // Vị trí cuộn hiện tại

                // Khi cuộn gần hết infoColumn, cho phép cuộn toàn trang
                if (scrollTop + windowHeight >= infoColumnHeight) {
                    document.body.style.overflowY = 'auto'; // Cuộn toàn trang
                } else {
                    // Giới hạn cuộn trong vùng infoColumn (nếu muốn)
                    // Lưu ý: CSS hiện tại không hỗ trợ hoàn toàn điều này, cần thêm container cha
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // Kiểm tra chiều cao nội dung để hiển thị nút "Xem thêm"
    useEffect(() => {
        if (descriptionRef.current) {
            const contentHeight = descriptionRef.current.scrollHeight
            const maxHeight = 200 // Giới hạn chiều cao ban đầu (px)
            setShowReadMore(contentHeight > maxHeight) // Hiển thị nút nếu nội dung vượt quá chiều cao
        }
    }, [product.description])
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10))
        }
        // Đặt hình ảnh đầu tiên làm mặc định khi component tải
        if (product.images && product.images.length > 0) {
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`)
        }
    }, [product.images])

    const discountedPrice =
        product.discount && product.discount > 0
            ? Math.round(product.price - (product.price * product.discount) / 100)
            : product.price

    const handleAddToCart = () => {
        const quantityInput = document.getElementById('quantityInput') as HTMLInputElement
        const quantity = Number(quantityInput?.value || 1)

        if (userId) {
            const url = `/public/carts`
            POST_ADD(url, { userId: userId, productId: product.productId, quantity })
                .then(() => {
                    toast.success('Thêm vào giỏ hàng thành công', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    })
                    const currentLength = parseInt(localStorage.getItem('CartLength') || '0')
                    localStorage.setItem('CartLength', (currentLength + 1).toString())
                })
                .catch((error) => {
                    console.error('Add to cart error:', error)
                    toast.error('Sản phẩm đã có trong giỏ hàng.', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    })
                })
        } else {
            const storedCart = localStorage.getItem(CART_ITEM_KEY)
            const cart = storedCart ? JSON.parse(storedCart) : { cartItems: [], totalPrice: 0 }

            const existingIndex = cart.cartItems.findIndex((item: any) => item.product.productId === product.productId)

            if (existingIndex !== -1) {
                cart.cartItems[existingIndex].quantity += quantity
            } else {
                cart.cartItems.push({
                    product: {
                        productId: product.productId,
                        slug: product.slug,
                    },
                    quantity,
                })
            }

            cart.totalPrice = cart.cartItems.reduce((sum: number, item: any) => {
                const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100)
                return sum + discountedPrice * item.quantity
            }, 0)

            localStorage.setItem(CART_ITEM_KEY, JSON.stringify(cart))

            toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
                position: 'bottom-right',
                autoClose: 2000,
            })
        }
    }
    const handleAddCheckout = () => {
        const storedPayment = localStorage.getItem(PAYMENT_ITEM_KEY)
        const cart = storedPayment ? JSON.parse(storedPayment) : { cartItems: [], totalPrice: 0 }

        const existingIndex = cart.cartItems.findIndex((item: any) => item.product.productId === product.productId)

        if (existingIndex !== -1) {
            cart.cartItems[existingIndex].quantity += quantity
        } else {
            cart.cartItems.push({
                product: {
                    ...product
                },
                quantity,
            })
        }

        cart.totalPrice = cart.cartItems.reduce((sum: number, item: any) => {
            const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100)
            return sum + discountedPrice * item.quantity
        }, 0)

        // Lưu giỏ hàng đã cập nhật vào localStorage
        localStorage.setItem(PAYMENT_ITEM_KEY, JSON.stringify(cart));
        router.push("/payment");
    }
    const handleCheckout = () => {
        // Lưu giỏ hàng đã chọn vào localStorage
        const quantityInput = document.getElementById('quantityInput') as HTMLInputElement
        const quantity = Number(quantityInput?.value || 1)
        if (userId) {
            const url = `/public/carts`
            POST_ADD(url, { userId: userId, productId: product.productId, quantity })
                .then(() => {
                    const currentLength = parseInt(localStorage.getItem('CartLength') || '0')
                    localStorage.setItem('CartLength', (currentLength + 1).toString())
                })
                .catch((error) => {
                    console.error('Add to cart error:', error)
                    toast.error('Mua ngay thất bại', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    })
                })
            handleAddCheckout();

        } else {
            handleAddCheckout();
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl) // Cập nhật hình ảnh chính khi nhấp vào hình ảnh phụ
    }

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.flexRow}>
                    {/* Ảnh sản phẩm */}
                    <div className={styles.imageBox}>
                        <div className={styles.imageContainer}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={selectedImage || '/placeholder.png'}
                                    alt={product.productName}
                                    width={400}
                                    height={500}
                                    className={styles.imageStyle}
                                    priority={true}
                                />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className={styles.thumbnailListVertical}>
                                    {product.images.map((image: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`${styles.thumbnail} ${selectedImage === `${process.env.NEXT_PUBLIC_FILE}${image.fileName}`
                                                ? styles.thumbnailActive
                                                : ''
                                                }`}
                                            onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_FILE}${image.fileName}`)}
                                        >
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_FILE}${image.fileName}`}
                                                alt={`${product.productName} thumbnail ${index}`}
                                                width={60}
                                                height={80}
                                                className={styles.thumbnailImage}
                                            // priority={true}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`${styles.actionSection} ${styles.desktopOnly}`}>
                            <div className={styles.buttonGroup}>
                                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                    Thêm vào giỏ hàng
                                </button>
                                <button className={styles.buyNowBtn} onClick={handleCheckout}>
                                    Mua ngay
                                </button>
                            </div>
                            <div className={styles.policySection}>
                                <p>
                                    <strong>Chính sách ưu đãi của Bookstore</strong>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Truck className="text-orange-600 w-4 h-4" />
                                    <span>
                                        <strong>Thời gian giao hàng:</strong> Giao nhanh và uy tín
                                    </span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Undo2 className="text-orange-600 w-4 h-4" />
                                    <span>
                                        <strong>Chính sách đổi trả:</strong> Đổi trả miễn phí toàn quốc
                                    </span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Users className="text-orange-600 w-4 h-4 " />
                                    <span>
                                        <strong>Chính sách khách sỉ:</strong> Ưu đãi khi mua số lượng lớn
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Thông tin sản phẩm */}
                    <div className={styles.infoColumn}>
                        {/* Tiêu đề + giá */}
                        <div className={styles.infoBox}>
                            <div className="flex items-center gap-3">

                                <h1 className="text-3xl font-bold">{product.productName}</h1>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <div className="w-full sm:w-2/3 text-base font-semibold truncate max-w-[400px]">
                                    Nhà xuất bản: {product.publisher?.publisherName || 'Đang cập nhật'}
                                </div>
                                <div className="w-full sm:w-1/3 text-base font-semibold sm:text-right">
                                    {(product.authors?.length || 0) > 1
                                        ? 'Tác giả: Nhiều tác giả'
                                        : `Tác giả: ${product.authors?.[0]?.authorName || 'Đang cập nhật'}`}
                                </div>
                            </div>


                            <div className="flex items-center gap-3 my-3">
                                <div className="w-2/3 text-base font-semibold truncate max-w-[300px]">
                                    Ngôn ngữ:{' '}
                                    {(product.languages?.length || 0) > 1
                                        ? 'Nhiều ngôn ngữ'
                                        : product.languages?.[0]?.name || 'Đang cập nhật'}
                                </div>
                            </div>

                            <div className={`${styles.priceRow} mt-2`}>
                                <span className="text-3xl text-red-600 font-bold">{formatPrice(discountedPrice)}</span>
                                {product.discount && product.discount > 0 ? (
                                    <>
                                        <span className={styles.strikeThrough}>{formatPrice(product.price)}</span>
                                        <span className={styles.discountBadge}>-{product.discount}%</span>
                                    </>
                                ) : null}
                            </div>

                            {product.discount && product.discount > 0 ? (
                                <div className={`${styles.flashSale} mt-2`}>⚡ FLASH SALE</div>
                            ) : null}
                        </div>

                        {/* Ưu đãi + Số lượng */}
                        <div className={styles.infoBox}>
                            <ul className="text-base space-y-4">
                                {/* <li className="pt-2">
                                    <strong>Ưu đãi:</strong>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <VoucherCard label="Mã giảm 50k - toàn bộ sản phẩm" />
                                        <VoucherCard label="Mã giảm 100k - đơn từ 1 triệu" />
                                        <VoucherCard label="Home Credit: Giảm 200k" />
                                    </div>
                                </li> */}
                                <li>
                                    <strong>Trạng thái:</strong> {(product.quantity ?? 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
                                </li>
                                <li>
                                    <strong>Thời gian giao hàng:</strong> 2-3 ngày
                                </li>
                            </ul>

                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <h1 className="whitespace-nowrap">Số lượng:</h1>
                                    <div className="flex items-center border rounded overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="px-3 py-1 bg-gray-100 hover:bg-orange-500 text-lg cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <input
                                            id="quantityInput"
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setQuantity(isNaN(value) || value < 1 ? 1 : value);
                                            }}
                                            className={`w-16 text-center border-x outline-none ${styles.noSpinner}`}
                                        />
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-orange-500 text-lg cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className={`${styles.buttonContainer} ${styles.mobileOnly}`}>
                                    {/* <Button
                                        variant="outline"
                                        className="bg-white hover:text-white border-2 border-orange-600 hover:bg-orange-500 cursor-pointer"
                                        onClick={handleAddToCart}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                    <Button
                                        onClick={handleCheckout}
                                        variant="outline"
                                        className="bg-red-500 hover:bg-red-600 hover:text-white border-2 border-red-600 cursor-pointer"
                                    >
                                        Mua ngay
                                    </Button> */}
                                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                        Thêm vào giỏ hàng
                                    </button>
                                    <button className={styles.buyNowBtn} onClick={handleCheckout}>
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Thông số */}
                        <div className={styles.infoBox}>
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3">

                                        <h1 className="text-xl font-bold">Thông tin chi tiết</h1>
                                    </div>
                                    {[
                                        { label: 'Mã sách', value: product.isbn },
                                        { label: 'Nhà xuất bản', value: product.publisher?.publisherName },
                                        {
                                            label: 'Tác giả',
                                            value: product.authors?.map((a) => a.authorName).join(', ') || 'Đang cập nhật',
                                        },
                                        { label: 'Năm xuất bản', value: product.year },
                                        {
                                            label: 'Ngôn ngữ',
                                            value: product.languages?.map((l) => l.name).join(', ') || 'Đang cập nhật',
                                        },
                                        {
                                            label: 'Trọng lượng',
                                            value: product.weight ? `${product.weight}g` : 'Đang cập nhật',
                                        },
                                        {
                                            label: 'Trọng lượng',
                                            value: product.weight ? `${product.weight}g` : 'Đang cập nhật',
                                        },
                                        { label: 'Kích thước', value: product.size },
                                    ].map((row, index) => (
                                        <div key={index} className="flex">
                                            <div className="w-40 font-medium text-gray-600">{row.label}:</div>
                                            <div className="text-gray-800">{row.value || 'Đang cập nhật'}</div>
                                        </div>
                                    ))}
                                    <h5 className="text-gray-800">Giá sản phẩm trên BookStore đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...
                                    </h5>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-4 rounded-xl bg-white">
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap border-b border-gray-200">
                        <div
                            className={`text-xl font-bold  px-4 py-2 transition `}
                        >
                            Mô tả sách
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {/* Description */}
                        <div
                            ref={descriptionRef}
                            className={`${styles.descriptionContent} p-4 rounded-lg text-base leading-relaxed whitespace-pre-line ${!isExpanded ? styles.collapsed : ''
                                }`}
                        >
                            {product.description || 'Đang cập nhật...'}
                        </div>
                        {showReadMore && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={styles.readMoreButton}
                            >
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail