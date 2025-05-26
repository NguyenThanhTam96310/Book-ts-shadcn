'use client'

import { FC, useEffect, useState } from 'react'
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
interface ProductDetailProps {
    product: ProductItemProps
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('technical')
    const [selectedImage, setSelectedImage] = useState<string | null>(null) // State để quản lý hình ảnh chính
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState<number | null>(null)
    const [cart, setCart] = useState<CartProps>({
        userId: undefined,
        cartItems: [],
        totalPrice: 0,
    });
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

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
                        <div className={styles.imageWrapper}>
                            <Image
                                src={selectedImage || '/placeholder.png'}
                                alt={product.productName}
                                width={400}
                                height={500}
                                className={styles.imageStyle}
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
                                        onClick={() =>
                                            handleImageClick(`${process.env.NEXT_PUBLIC_FILE}${image.fileName}`)
                                        }
                                    >
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_FILE}${image.fileName}`}
                                            alt={`${product.productName} thumbnail ${index}`}
                                            width={60} // Điều chỉnh chiều rộng ảnh phụ
                                            height={80} // Điều chỉnh chiều cao ảnh phụ
                                            className={styles.thumbnailImage}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Thông tin sản phẩm */}
                    <div className={styles.infoColumn}>
                        {/* Tiêu đề + giá */}
                        <div className={styles.infoBox}>
                            <div className="flex items-center gap-3">
                                {/* <div className="text-base text-orange-400 font-semibold bg-red-600 inline-block px-2 py-1 rounded-full">
                                    Xu hướng
                                </div> */}
                                <h1 className="text-3xl font-bold">{product.productName}</h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-2/3 text-base font-semibold truncate max-w-[400px]">
                                    Nhà xuất bản: {product.publisher?.publisherName || 'Đang cập nhật'}
                                </div>
                                <div className="w-1/3 text-base font-semibold text-right">
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
                                            className="w-16 text-center border-x outline-none no-spinner"
                                        />
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="px-3 py-1 bg-gray-100 hover:bg-orange-500 text-lg cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="bg-white hover:text-white border-2 border-orange-600 hover:bg-orange-500 cursor-pointer"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button onClick={handleCheckout} variant="outline" className="bg-red-500 hover:bg-red-600 hover:text-white border-2 border-red-600 cursor-pointer">
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-4 rounded-xl bg-white">
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap border-b border-gray-200">
                        <button
                            onClick={() => handleTabChange('technical')}
                            className={`px-4 py-2 text-base font-semibold transition  ${activeTab === 'technical'
                                ? 'text-orange-600 border-b-2 border-orange-600 '
                                : 'text-gray-500 hover:text-orange-500 cursor-pointer'
                                }`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            onClick={() => handleTabChange('description')}
                            className={`ml-4 px-4 py-2 text-base font-semibold transition  ${activeTab === 'description'
                                ? 'text-orange-600 border-b-2 border-orange-600 '
                                : 'text-gray-500 hover:text-orange-500 cursor-pointer'
                                }`}
                        >
                            Mô tả sách
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4">
                        {/* Technical Specs */}
                        {activeTab === 'technical' && (
                            <div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
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
                                        { label: 'Kích thước', value: product.size },
                                    ].map((row, index) => (
                                        <div key={index} className="flex">
                                            <div className="w-40 font-medium text-gray-600">{row.label}:</div>
                                            <div className="text-gray-800">{row.value || 'Đang cập nhật'}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {activeTab === 'description' && (
                            <div>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description || 'Đang cập nhật...'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail