'use client'

import * as Dialog from "@radix-ui/react-dialog";
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
import { Truck, Undo2, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { addProductIdToLocalStorage } from '@/lib/utils/localStorege'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { DialogTitle } from "@/components/ui/dialog";
import { fetchAverageStarByProductId } from "@/features/review/services/review.service";
import { StarRes } from "@/features/review/services/type";

interface ProductDetailProps {
    product: ProductItemProps
}

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
    const router = useRouter()
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0) // Thêm state cho chỉ số hình ảnh
    const [quantity, setQuantity] = useState(1);
    const [userId, setUserId] = useState<number | null>(null)
    const [star, setStar] = useState<StarRes>()
    const [isExpanded, setIsExpanded] = useState(false)
    const [showReadMore, setShowReadMore] = useState(false)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const [imageZoomOpen, setImageZoomOpen] = useState(false);
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

    useEffect(() => {
        const handleScroll = () => {
            const infoColumn = document.querySelector(`.${styles.infoColumn}`);
            if (infoColumn) {
                const infoColumnHeight = infoColumn.scrollHeight;
                const windowHeight = window.innerHeight;
                const scrollTop = window.scrollY;

                if (scrollTop + windowHeight >= infoColumnHeight) {
                    document.body.style.overflowY = 'auto';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const loadStar = async () => {
            try {
                const data = await fetchAverageStarByProductId(Number(product.productId))
                setStar(data)
            } catch (error) {
                console.error("Lỗi khi load product:", error)
            }
        }
        loadStar()
    }, [])
    useEffect(() => {
        if (descriptionRef.current) {
            const contentHeight = descriptionRef.current.scrollHeight
            const maxHeight = 200
            setShowReadMore(contentHeight > maxHeight)
        }
    }, [product.description])

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10))
        }
        if (product.images && product.images.length > 0) {
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${product.images[0].fileName}`)
            setSelectedImageIndex(0) // Khởi tạo chỉ số hình ảnh
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

        localStorage.setItem(PAYMENT_ITEM_KEY, JSON.stringify(cart));
        router.push("/payment");
    }

    const handleCheckout = () => {
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

    const handleImageClick = (imageUrl: string, index: number) => {
        setSelectedImage(imageUrl)
        setSelectedImageIndex(index) // Cập nhật chỉ số hình ảnh
    }

    // Hàm chuyển hình ảnh tiếp theo
    const nextImage = () => {
        if (product.images && product.images.length > 1) {
            const nextIndex = (selectedImageIndex + 1) % product.images.length;
            setSelectedImageIndex(nextIndex);
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${product.images[nextIndex].fileName}`);
        }
    }

    // Hàm chuyển hình ảnh trước đó
    const prevImage = () => {
        if (product.images && product.images.length > 1) {
            const prevIndex = selectedImageIndex === 0 ? product.images.length - 1 : selectedImageIndex - 1;
            setSelectedImageIndex(prevIndex);
            setSelectedImage(`${process.env.NEXT_PUBLIC_FILE}${product.images[prevIndex].fileName}`);
        }
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
                                    onClick={() => setImageZoomOpen(true)}
                                />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div>
                                    <div className={styles.thumbnailListVertical}>
                                        {product.images.map((img: any, index: number) => (
                                            <div
                                                key={index}
                                                className={`${styles.thumbnail} ${selectedImage === `${process.env.NEXT_PUBLIC_FILE}${img.fileName}` ? styles.thumbnailActive : ''}`}
                                                onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_FILE}${img.fileName}`, index)}
                                            >
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_FILE}${img.fileName}`}
                                                    alt={`${product.productName} thumbnail ${index}`}
                                                    width={60}
                                                    height={80}
                                                    className={styles.thumbnailImage}
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {imageZoomOpen && (
                                        <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="relative mb-4">
                                                    <Dialog.Root open={imageZoomOpen} onOpenChange={setImageZoomOpen}>
                                                        <Dialog.Portal>
                                                            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                                                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[550px] h-[650px] max-w-[90%] max-h-[90%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                                                                <DialogTitle>
                                                                    <span className="sr-only">Ảnh đại diện phóng to</span>
                                                                </DialogTitle>
                                                                <button
                                                                    onClick={() => setImageZoomOpen(false)}
                                                                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-3xl"
                                                                    aria-label="Đóng"
                                                                >
                                                                    ×
                                                                </button>
                                                                {/* Nút chuyển hình trước */}
                                                                {product.images && product.images.length > 1 && (
                                                                    <button
                                                                        onClick={prevImage}
                                                                        className="absolute left-1 top-1/2 transform -translate-y-1/2 text-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-10"
                                                                        aria-label="Hình ảnh trước"
                                                                    >
                                                                        <ChevronLeft className="w-15 h-15" />
                                                                    </button>
                                                                )}
                                                                {/* Hình ảnh chính */}
                                                                <img
                                                                    src={selectedImage || '/placeholder.png'}
                                                                    alt="Zoomed Avatar"
                                                                    className="w-full h-full object-contain"
                                                                />
                                                                {/* Nút chuyển hình sau */}
                                                                {product.images && product.images.length > 1 && (
                                                                    <button
                                                                        onClick={nextImage}
                                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 v bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 z-10"
                                                                        aria-label="Hình ảnh tiếp theo"
                                                                    >
                                                                        <ChevronRight className="w-15 h-15" />
                                                                    </button>
                                                                )}
                                                            </Dialog.Content>
                                                        </Dialog.Portal>
                                                    </Dialog.Root>
                                                </div>
                                            </div>
                                        </Card>)}
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
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.productName}{!isCheck && ("(Tạm hết hàng)")}</h1>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <div className="w-full sm:w-2/3 text-base truncate max-w-[400px]">
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
                            <div className="flex items-center gap-1 text-sm">
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const averageStar = star?.averageStar ?? 0;
                                    const isFullStar = averageStar >= i;
                                    const isHalfStar = averageStar >= i - 0.5 && averageStar < i;

                                    return (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${isFullStar
                                                ? "text-orange-400 fill-orange-400"
                                                : isHalfStar
                                                    ? "text-orange-400 fill-orange-400/50"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    );
                                })}
                                <span className="text-orange-500 ml-1">({star?.totalReviews} đánh giá)</span>
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
                                <div className="inline-flex items-center justify-center mt-2 gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold w-full">
                                    ⚡ FLASH SALE
                                </div>
                            ) : null}
                        </div>

                        {/* Ưu đãi + Số lượng */}
                        <div className={styles.infoBox}>
                            <ul className="text-base space-y-4">
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
                                    <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm text-orange-700">
                                            Giá sản phẩm trên BookStore đã bao gồm thuế theo luật hiện hành. Tùy vào loại sản phẩm, hình thức
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
                                    className={`prose prose-gray max-w-none text-gray-700 leading-relaxed transition-all duration-300 ${!isExpanded ? "max-h-48 overflow-hidden" : ""}`}
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
            </div>
        </div>
    )
}

export default ProductDetail