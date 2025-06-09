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
import { Badge } from "@/components/ui/badge";
import { addProductIdToLocalStorage } from '@/lib/utils/localStorege'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
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
    const [isCheck, setIsCheck] = useState(false);

    useEffect(() => {
        if (product.quantity > 0 && product.status) {
            setIsCheck(true);
        }
    }, [product.quantity, product.status]);
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
                    addProductIdToLocalStorage(product.productId)
                })
                .catch((error) => {
                    toast.error('Sản phẩm đã có trong giỏ hàng.', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    })
                })
        } else {
            const storedCart = localStorage.getItem(CART_ITEM_KEY);
            const cart = storedCart ? JSON.parse(storedCart) : { cartItems: [], totalPrice: 0 };

            const existingIndex = cart.cartItems.findIndex(
                (item: any) => item.product.productId === product.productId
            );

            if (existingIndex !== -1) {
                const currentQty = cart.cartItems[existingIndex].quantity;
                const maxQty = product.quantity;

                if (currentQty + quantity > maxQty) {
                    cart.cartItems[existingIndex].quantity = maxQty;
                    toast.warning(`Số lượng vượt quá tồn kho! Đã giới hạn còn ${maxQty}.`, {
                        position: 'bottom-right',
                        autoClose: 2000,
                    });
                } else {
                    cart.cartItems[existingIndex].quantity += quantity;
                    toast.success('Đã cập nhật số lượng sản phẩm trong giỏ hàng.', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    });
                }
            } else {
                addProductIdToLocalStorage(product.productId);
                cart.cartItems.push({
                    product: {
                        productId: product.productId,
                        slug: product.slug,
                        price: product.price,
                        discount: product.discount,
                        quantity: product.quantity,
                    },
                    quantity,
                });

                toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
                    position: 'bottom-right',
                    autoClose: 2000,
                });
            }

            // Cập nhật tổng tiền
            cart.totalPrice = cart.cartItems.reduce((sum: number, item: any) => {
                const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
                return sum + discountedPrice * item.quantity;
            }, 0);
            localStorage.setItem(CART_ITEM_KEY, JSON.stringify(cart));
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
        localStorage.removeItem(PAYMENT_ITEM_KEY);
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
                            {
                                isCheck && (<div className={styles.buttonGroup}>
                                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                        Thêm vào giỏ hàng
                                    </button>
                                    <button className={styles.buyNowBtn} onClick={handleCheckout}>
                                        Mua ngay
                                    </button>
                                </div>)
                            }
                            <div className={styles.policySection}>
                                <h3 className="font-bold text-orange-800 mb-3">Chính sách ưu đãi</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Truck className="text-orange-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Thời gian giao hàng:</strong> Nhanh và uy tín
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Undo2 className="text-orange-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Chính sách đổi trả:</strong> Miễn phí toàn quốc
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Users className="text-orange-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Ưu đãi khách mua sỉ:</strong> Ưu đãi số lượng lớn
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Thông tin sản phẩm */}
                    <div className={styles.infoColumn}>
                        {/* Tiêu đề + giá */}
                        <div className={styles.infoBox}>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.productName}</h1>
                                {!isCheck && (<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">(Tạm hết hàng)</h1>)}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <div className="w-full sm:w-2/3 text-base  truncate max-w-[400px]">
                                    Nhà xuất bản: {product.publisher?.publisherName || 'Đang cập nhật'}
                                </div>
                                <div className="w-full sm:w-1/3 text-base sm:text-right">
                                    {(product.authors?.length || 0) > 1
                                        ? 'Tác giả: Nhiều tác giả'
                                        : `Tác giả: ${product.authors?.[0]?.authorName || 'Đang cập nhật'}`}
                                </div>
                            </div>


                            <div className="flex items-center gap-3 my-3">
                                <div className="w-2/3 text-base truncate max-w-[300px]">
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
                                <div className="inline-flex items-center justify-center  mt-2 gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold w-full">
                                    ⚡ FLASH SALE
                                </div>
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
                                    <strong>Trạng thái:</strong>  <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                                        {isCheck ? "Còn hàng" : "Hết hàng"}
                                    </Badge>
                                </li>
                                <li>
                                    <strong>Thời gian giao hàng:</strong> 2-3 ngày
                                </li>
                            </ul>
                            {isCheck ? (<div className="flex flex-wrap items-center gap-3 mt-4">
                                <div className="flex items-center gap-2">
                                    <h1 className="whitespace-nowrap">Số lượng:</h1>
                                    <div className="flex items-center border rounded overflow-hidden">
                                        <button
                                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                            className="px-3 py-1 bg-gray-100 hover:bg-orange-500 text-lg cursor-pointer"
                                            disabled={quantity <= 1 || (product.quantity ?? 0) === 0}
                                        >
                                            -
                                        </button>
                                        <input
                                            id="quantityInput"
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            max={product.quantity ?? 0}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                if (isNaN(value) || value < 1) {
                                                    setQuantity(1);
                                                    toast.error('Số lượng phải lớn hơn hoặc bằng 1!', {
                                                        position: 'bottom-right',
                                                        autoClose: 2000,
                                                    });
                                                } else if (value > (product.quantity ?? 0)) {
                                                    setQuantity(product.quantity ?? 0);
                                                    toast.error(`Số lượng không thể vượt quá ${product.quantity} sản phẩm có sẵn!`, {
                                                        position: 'bottom-right',
                                                        autoClose: 2000,
                                                    });
                                                } else {
                                                    setQuantity(value);
                                                }
                                            }}
                                            className={`w-16 text-center border-x outline-none ${styles.noSpinner}`}
                                            disabled={(product.quantity ?? 0) === 0}
                                        />
                                        <button
                                            onClick={() => {
                                                if (quantity < (product.quantity ?? 0)) {
                                                    setQuantity((prev) => prev + 1);
                                                } else {
                                                    toast.error(`Số lượng không thể vượt quá ${product.quantity} sản phẩm có sẵn!`, {
                                                        position: 'bottom-right',
                                                        autoClose: 2000,
                                                    });
                                                }
                                            }}
                                            className="px-3 py-1 bg-gray-100 hover:bg-orange-500 text-lg cursor-pointer"
                                            disabled={quantity >= (product.quantity ?? 0) || (product.quantity ?? 0) === 0}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-sm text-gray-600">Còn {product.quantity ?? 0} sản phẩm</span>
                                </div>

                                <div className={`${styles.buttonContainer} ${styles.mobileOnly}`}>
                                    <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                                        Thêm vào giỏ hàng
                                    </button>
                                    <button className={styles.buyNowBtn} onClick={handleCheckout}>
                                        Mua ngay
                                    </button>
                                </div>
                            </div>) : ("")}

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
                                            label: "Tác giả",
                                            value: product.authors && product.authors.length > 0 ? product.authors : null,
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
                                            label: 'Hình thức',
                                            value: product.format || 'Đang cập nhật',
                                        },
                                        { label: 'Kích thước', value: product.size },
                                    ].map((row, index) => (
                                        <div key={index} className="flex flex-wrap mb-1">
                                            <div className="w-40 font-medium text-gray-600">{row.label}:</div>
                                            <div className="text-gray-800">
                                                {row.label === "Tác giả" ? (
                                                    Array.isArray(row.value) && row.value.length > 0 ? (
                                                        (row.value as { authorId: string; authorName: string }[]).map((author, idx, arr) => (
                                                            <span key={author.authorId}>
                                                                <Link href={`/author/${author.authorId}`} className="text-blue-600 hover:underline">
                                                                    {author.authorName}
                                                                </Link>
                                                                {idx < arr.length - 1 && ", "}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        "Đang cập nhật"
                                                    )
                                                ) : typeof row.value === "string" || typeof row.value === "number" || typeof row.value === "undefined" ? (
                                                    row.value ?? "Đang cập nhật"
                                                ) : (
                                                    "Đang cập nhật"
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            💡 Giá sản phẩm trên BookStore đã bao gồm thuế theo luật hiện hành. Tùy vào loại sản phẩm, hình thức
                                            và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product Description */}
                        <Card className="shadow-lg border-0">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-900">Mô tả sách</h3>
                                <div
                                    ref={descriptionRef}
                                    className={`prose prose-gray max-w-none text-gray-700 leading-relaxed transition-all duration-300 ${!isExpanded ? "max-h-48 overflow-hidden" : ""
                                        }`}
                                >
                                    {product.description || "Đang cập nhật..."}
                                </div>
                                {showReadMore && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-4 text-orange-600 hover:text-orange-700 font-semibold"
                                    >
                                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Tabs Section */}
                {/* <div className="mt-4 rounded-xl bg-white">
                    <div className="flex flex-wrap border-b border-gray-200">
                        <div
                            className={`text-xl font-bold  px-4 py-2 transition `}
                        >
                            Mô tả sách
                        </div>
                    </div>

                    <div className="p-4">
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
                </div> */}
            </div>
        </div>
    )
}

export default ProductDetail