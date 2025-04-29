"use client";

import { useState, useEffect, use } from "react";
import CartItem from "@/components/organisms/CartItem";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { CartItemType, CartProps } from "@/features/cart/services/type";
import { deleteCartItem, fetchCart, updateQuantityCart } from "@/features/cart";
import { CART_ITEM_KEY, USER_ID } from "@/constants/cartConstants";
import { toast } from "react-toastify";


export default function Cart() {
    const [cart, setCart] = useState<CartProps>({
        cartId: undefined,
        cartItems: [],
        totalPrice: 0,
    });
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [userId, setUserId] = useState<number | null>(null)
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10))
        }
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            if (typeof window === "undefined") return;

            const storedUserId = localStorage.getItem(USER_ID);
            if (storedUserId) {
                const cartId = parseInt(storedUserId, 10);
                try {
                    const data = await fetchCart(cartId);

                    // Giả sử fetchCart trả về CartProps
                    setCart(data)

                } catch (error) {
                    console.error('Failed to fetch cart from server:', error);
                }
            } else {
                const raw = localStorage.getItem(CART_ITEM_KEY);
                if (raw) {
                    try {
                        const data = JSON.parse(raw) as { cartItems: CartItemType[]; totalPrice: number };
                        setCart({
                            cartId: undefined,
                            cartItems: data.cartItems || [],
                            totalPrice: data.totalPrice || 0,
                        });
                    } catch (error) {
                        console.error('Failed to parse local cart data:', error);
                    }
                }
            }
        };

        fetchData();
    }, []);

    const updateQuantity = async (id: string | number, qty: number) => {
        try {
            if (userId) {
                // Kiểm tra tham số qty (giới hạn ít nhất là 1)
                if (qty < 1) {
                    console.error("Quantity must be at least 1");
                    return;
                }

                // Gọi API để cập nhật số lượng sản phẩm
                if (userId !== null) {
                    await updateQuantityCart(userId, id, qty);
                } else {
                    console.error("User ID is null. Cannot update cart quantity.");
                }

                // Sau khi cập nhật số lượng, gọi lại API để lấy giỏ hàng mới
                const updatedCart = await fetchCart(userId);
                setCart(updatedCart);  // Cập nhật lại state giỏ hàng
                // Cập nhật lại `selectedItems` nếu cần (xử lý nếu bạn có lựa chọn các sản phẩm)
                setSelectedItems(prev => prev.filter(itemId => itemId !== Number(id)));
                toast.success('Thay đổi thành công.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                });

            } else {
                setCart(prev => {
                    if (!prev) return prev; // fallback nếu prev là undefined/null

                    const updatedItems = prev?.cartItems?.map(ci => {
                        if (ci.product.productId === id) {
                            return { ...ci, quantity: Math.max(qty, 1) };
                        }
                        return ci;
                    });

                    const newCart = {
                        ...prev,
                        cartItems: updatedItems,
                        totalPrice: updatedItems?.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
                    };

                    // Cập nhật localStorage theo chuẩn mới
                    localStorage.setItem('cart_items', JSON.stringify(newCart));
                    toast.success('Thay đổi thành công.', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    });
                    return newCart;
                });
            }
        } catch (error) {
            console.error("Failed to update product quantity:", error);
            toast.error('Thêm vào giỏ hàng thất bại', {
                position: 'bottom-right',
                autoClose: 2000,
            })
        }
    };


    const removeFromCart = async (id: string | number) => {
        try {
            if (userId) {

                await deleteCartItem(userId, id);

                const updatedCart = await fetchCart(userId);
                setCart(updatedCart);

                setSelectedItems(prev => prev.filter(itemId => itemId !== Number(id)));
                toast.success('Xóa sản phẩm thành công.', {
                    position: 'bottom-right',
                    autoClose: 2000,
                });
            } else {
                // Không có userId => xóa local
                setCart(prev => {
                    const updatedCartItems = prev.cartItems?.filter(ci => ci.product.productId !== id) || [];
                    // Tính lại totalPrice
                    const updatedTotalPrice = updatedCartItems.reduce((sum, item) => {
                        return sum + ((item.product.price - (item.product.price * ((item.product.discount ?? 0) / 100))) * item.quantity);
                    }, 0);
                    const updatedCart = {
                        ...prev,
                        cartItems: updatedCartItems,
                        totalPrice: updatedTotalPrice,
                    };

                    localStorage.setItem(CART_ITEM_KEY, JSON.stringify(updatedCart));
                    toast.success('Xóa sản phẩm thành công.', {
                        position: 'bottom-right',
                        autoClose: 2000,
                    });
                    return updatedCart;
                });
            }
        } catch (error) {
            console.error('Failed to remove product from cart:', error);
            toast.error('Xóa sản phẩm thất bại', {
                position: 'bottom-right',
                autoClose: 2000,
            })
        }
    };


    const getTotal = () =>
        cart.cartItems
            ?.filter(ci => selectedItems.includes(Number(ci.product.productId)))
            .reduce((sum, ci) => sum + ((ci.product.price - (Math.round(ci.product.price * ((ci.product?.discount ?? 0) / 100)))) * ci.quantity), 0) || 0;

    const isAllSelected = cart.cartItems && cart.cartItems.length > 0 && selectedItems.length === cart.cartItems.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.cartItems ? cart.cartItems.map(ci => Number(ci.product.productId)) : []);
        }
    };

    const toggleSelectItem = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(itemId => itemId !== id));
        } else {
            setSelectedItems(prev => [...prev, id]);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-full mx-auto bg-gray-100">
            {/* Left: Items list */}
            <div className="w-full lg:w-3/4 bg-white p-4 rounded shadow-sm">
                <h2 className="text-xl font-semibold mb-4">GIỎ HÀNG ({cart.cartItems?.length || 0})</h2>

                {/* Select all */}
                <div className="flex items-center mb-4">
                    <Checkbox id="select-all" checked={isAllSelected} onCheckedChange={toggleSelectAll} />
                    <label htmlFor="select-all" className="ml-2 text-gray-700">
                        Chọn tất cả ({cart.cartItems?.length || 0} sản phẩm)
                    </label>
                </div>

                {/* Table Head */}
                <div className="hidden lg:grid grid-cols-12 gap-4 text-sm font-medium border-b pb-2 mb-4">
                    <div className="col-span-6">Sản phẩm</div>
                    <div className="col-span-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Số lượng</div>
                    <div className="col-span-3">Thành tiền</div>
                </div>

                {/* List Items */}
                <div className="space-y-4">
                    {cart.cartItems && cart.cartItems.length > 0 ? (
                        cart.cartItems.map((ci, index) => (
                            <CartItem
                                index={index}
                                key={`${ci.product.productId}-${index}`}
                                item={ci}
                                checked={selectedItems.includes(Number(ci.product.productId))}
                                onCheck={() => toggleSelectItem(Number(ci.product.productId))}
                                onDecrease={(id) => updateQuantity(id, ci.quantity - 1)}
                                onIncrease={(id) => updateQuantity(id, ci.quantity + 1)}
                                onRemove={removeFromCart}
                            />
                        ))
                    ) : (
                        <p>Giỏ hàng trống</p>
                    )}
                </div>
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-1/4 space-y-4">
                <div className="bg-white p-4 rounded shadow-sm">
                    <h3 className="text-md font-semibold mb-2">KHUYẾN MÃI</h3>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2">
                        Mua thêm
                    </Button>
                </div>
                <div className="bg-white p-4 rounded shadow-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Thành tiền</span>
                        <span className="text-sm text-gray-800 font-semibold">
                            {getTotal().toLocaleString()} ₫
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Khuyến mãi</span>
                        <span className="text-sm text-gray-800 font-semibold">
                            {getTotal().toLocaleString()} ₫
                        </span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Tổng Số Tiền (gồm VAT)</span>
                        <span className="text-orange-600">
                            {getTotal().toLocaleString()} ₫
                        </span>
                    </div>
                    <Button
                        disabled={getTotal() === 0}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
                    >
                        THANH TOÁN
                    </Button>
                </div>
            </div>
        </div>
    );
}
