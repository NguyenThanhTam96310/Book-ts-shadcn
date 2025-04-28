'use client'

import { FC } from 'react'
import Image from 'next/image'
import styles from './ProductDetail.module.css'
import { ProductItemProps } from '@/features/product/services/type'
import VoucherCard from '@/components/organisms/VoucherCard/VoucherCard'
import { Button } from '@/components/ui/button'
import { POST_ADD } from '@/lib/api/Service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { CART_ITEM_KEY } from '@/constants/cartConstants'

interface ProductDetailProps {
    product: ProductItemProps
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
    const router = useRouter()

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

    let userId: number | null = null
    if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) {
            userId = parseInt(storedUserId, 10)
        }
    }

    const discountedPrice =
        product.discount && product.discount > 0
            ? Math.round(product.price - (product.price * product.discount) / 100)
            : product.price

    const handleAddToCart = () => {
        const quantityInput = document.getElementById('quantityInput') as HTMLInputElement
        const quantity = Number(quantityInput?.value || 1)

        if (userId) {
            const url = `/public/carts`
            POST_ADD(url, { cartId: userId, productId: product.productId, quantity })
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
            // Xử lý localStorage khi chưa đăng nhập
            const storedCart = localStorage.getItem(CART_ITEM_KEY);
            const cart = storedCart ? JSON.parse(storedCart) : { cartItems: [], totalPrice: 0 };

            const existingIndex = cart.cartItems.findIndex((item: any) => item.product.productId === product.productId);

            if (existingIndex !== -1) {
                // Nếu sản phẩm đã có, cộng thêm số lượng
                cart.cartItems[existingIndex].quantity += quantity;
            } else {
                // Nếu chưa có, thêm mới
                cart.cartItems.push({
                    product: {
                        productId: product.productId,
                        productName: product.productName,
                        price: product.price,
                        discount: product.discount,
                        slug: product.slug,
                        images: product.images,
                    },
                    quantity,
                });
            }

            // Tính lại totalPrice
            cart.totalPrice = cart.cartItems.reduce((sum: number, item: any) => {
                const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
                return sum + discountedPrice * item.quantity;
            }, 0);

            // Lưu lại vào localStorage
            localStorage.setItem(CART_ITEM_KEY, JSON.stringify(cart));

            toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
                position: 'bottom-right',
                autoClose: 2000,
            });
        }
    }

    return (
        <div className={styles.container}>
            {/* Top section */}
            <div className={styles.flexRow}>
                {/* Ảnh sản phẩm */}
                <div className={styles.imageBox}>
                    <Image
                        src={product.images?.[0]?.fileName ? `/images/products/${product.images[0].fileName}` : '/placeholder.svg'}
                        alt={product.productName}
                        width={400}
                        height={500}
                        className={styles.imageStyle}
                    />
                </div>

                {/* Thông tin sản phẩm */}
                <div className={styles.infoColumn}>
                    {/* Tiêu đề + giá */}
                    <div className={styles.infoBox}>
                        <div className="flex items-center gap-3 my-3">
                            <div className="text-sm text-orange-400 font-semibold bg-red-600 inline-block px-2 py-1 rounded-full">
                                Xu hướng
                            </div>
                            <h1 className="text-2xl font-bold">{product.productName}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-2/3 text-sm font-semibold truncate max-w-[300px]">
                                Nhà xuất bản: {product.publisher?.publisherName || 'Đang cập nhật'}
                            </div>
                            <div className="w-1/3 text-sm font-semibold text-right">
                                {(product.authors?.length || 0) > 1
                                    ? 'Tác giả: Nhiều tác giả'
                                    : `Tác giả: ${product.authors?.[0]?.authorName || 'Đang cập nhật'}`}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 my-3">
                            <div className="w-2/3 text-sm font-semibold truncate max-w-[300px]">
                                Ngôn ngữ:{' '}
                                {(product.languages?.length || 0) > 1
                                    ? 'Nhiều ngôn ngữ'
                                    : product.languages?.[0]?.name || 'Đang cập nhật'}
                            </div>
                        </div>

                        <div className={`${styles.priceRow} mt-2`}>
                            <span className="text-3xl text-red-600 font-bold">{formatPrice(discountedPrice)}</span>
                            {product.discount && product.discount > 0 && (
                                <>
                                    <span className={styles.strikeThrough}>{formatPrice(product.price)}</span>
                                    <span className={styles.discountBadge}>-{product.discount}%</span>
                                </>
                            )}
                        </div>

                        {product.discount && product.discount > 0 && (
                            <div className={`${styles.flashSale} mt-2`}>⚡ FLASH SALE</div>
                        )}
                    </div>

                    {/* Ưu đãi + Số lượng */}
                    <div className={styles.infoBox}>
                        <ul className="text-sm space-y-2">
                            <li>
                                <strong>Ưu đãi:</strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <VoucherCard label="Mã giảm 50k - toàn bộ sản phẩm" />
                                    <VoucherCard label="Mã giảm 100k - đơn từ 1 triệu" />
                                    <VoucherCard label="Home Credit: Giảm 200k" />
                                </div>
                            </li>
                            <li>
                                <strong>Trạng thái:</strong> {product.status === 'active' ? 'Còn hàng' : 'Hết hàng'}
                            </li>
                            <li>
                                <strong>Thời gian giao hàng:</strong> 2-3 ngày
                            </li>
                        </ul>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <h1>Số lượng: </h1>
                            <input
                                id="quantityInput"
                                type="number"
                                defaultValue={1}
                                min={1}
                                className="w-20 border px-3 py-1 rounded"
                            />
                            <Button
                                variant="outline"
                                className="bg-white border-2 border-orange-600 hover:bg-orange-500"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Button variant="outline" className="bg-red-500 hover:bg-red-600 border-2 border-red-600">
                                Mua ngay
                            </Button>
                        </div>
                    </div>

                    {/* Thông số kỹ thuật */}
                    <div className={styles.infoBox}>
                        <div className="mt-6 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Thông số kỹ thuật</h2>
                                <div className="overflow-x-auto mt-2">
                                    <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
                                        <tbody className="divide-y divide-gray-200">
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
                                                { label: 'Trọng lượng', value: product.weight ? `${product.weight}g` : 'Đang cập nhật' },
                                                { label: 'Kích thước', value: product.size },
                                            ].map((row, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 font-medium text-gray-600 w-1/3">{row.label}</td>
                                                    <td className="px-4 py-2 text-gray-700">{row.value || 'Đang cập nhật'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mô tả sách */}
                    <div className={styles.infoBox}>
                        <div className="mt-6 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Mô tả sách</h2>
                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
                                    {product.description || 'Đang cập nhật...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
