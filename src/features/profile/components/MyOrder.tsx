"use client"

import { useEffect, useState } from "react";
import MenuOrder from "@/features/profile/components/MenuOrder";
import { OrderRes, PaginatedOrderResponse } from "@/features/order/services/type";
import { USER_ID } from "@/constants/cartConstants";
import OrderItem from "@/components/organisms/OrderItem/OrderItem";
import { fetchOrdersbyId } from "@/features/profile/services/profile.service";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MyOrder = () => {
    const [activeTab, setActiveTab] = useState<string>("Tất cả");
    const [orders, setOrders] = useState<PaginatedOrderResponse | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allOrders, setAllOrders] = useState<OrderRes[]>([]);

    // Map tabs to order statuses
    const statusMap: { [key: string]: string[] } = {
        "Tất cả": ["PAID", "PENDING", "FALSED"],
        "Chờ giao hàng": ["PENDING"],
        "Hoàn thành": ["PAID"],
        "Đã hủy": ["FALSED"],
    };

    // Fetch userId from localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem(USER_ID);
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Fetch orders based on userId and accumulate all pages
    useEffect(() => {
        const loadOrders = async () => {
            if (!userId) return;
            setLoading(true);
            setError(null);
            try {
                let allData: OrderRes[] = [];
                let page = 0;
                let response: PaginatedOrderResponse;

                do {
                    response = await fetchOrdersbyId(Number(userId), page);
                    // Loại bỏ trùng lặp orderId trong trang hiện tại
                    const newOrders = response.content.filter(
                        (order) => !allData.some((existing) => existing.orderId === order.orderId)
                    );
                    allData = [...allData, ...newOrders];
                    page++;
                } while (!response.lastPage);

                setAllOrders(allData);
                setOrders(response);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error("Lỗi khi load orders:", error);
                setError("Không thể tải đơn hàng. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, [userId]);

    // Reset currentPage and recalculate totalPages when activeTab changes
    useEffect(() => {
        setCurrentPage(1);
        const filtered = allOrders.filter((order) =>
            statusMap[activeTab]?.includes(order.orderStatus)
        );
        const pageSize = orders?.pageSize || 3;
        setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
    }, [activeTab, allOrders, orders]);

    // Function to scroll to top smoothly
    const scrollToTop = () => {
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Function to navigate to a specific page
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            scrollToTop();
        }
    };

    // Function to calculate pagination range (e.g., show 5 pages at a time)
    const getPaginationRange = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);
        return Array.from(
            { length: endPage - adjustedStartPage + 1 },
            (_, i) => adjustedStartPage + i
        );
    };

    // Filter orders based on activeTab and paginate
    const filteredOrders = allOrders.filter((order) =>
        statusMap[activeTab]?.includes(order.orderStatus)
    );
    const startIndex = (currentPage - 1) * (orders?.pageSize || 3);
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + (orders?.pageSize || 3));

    return (
        <div className="w-full">
            {/* MenuOrder */}
            <div className="py-2 sm:py-3">
                <MenuOrder activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Order Items */}
            <div className="space-y-3 sm:space-y-4">
                {error ? (
                    <div className="text-center py-6 sm:py-8 bg-white text-red-600">
                        {error}
                    </div>
                ) : loading ? (
                    <div className="text-center py-6 sm:py-8 bg-white rounded-lg">
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                            Đang tải đơn hàng...
                        </p>
                    </div>
                ) : paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order, index) => (
                        // Sử dụng index làm hậu tố để đảm bảo key duy nhất
                        <OrderItem key={`${order.orderId}-${index}`} order={order} />
                    ))
                ) : (
                    <div className="text-center py-6 sm:py-8 bg-white rounded-lg">
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                            Không có đơn hàng nào trong danh mục này.
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg transition-colors ${currentPage === 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {getPaginationRange().map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                    ? "bg-orange-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg transition-colors ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrder;