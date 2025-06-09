import React from "react";

const tabs = [
    "Tất cả",
    "Chờ giao hàng",
    "Đã hoàn thành",
    "Đã giao hàng",
    "Đã thanh toán",
    "Đã hủy",
    "Thất bại",
];

interface MenuOrderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const MenuOrder = ({ activeTab, setActiveTab }: MenuOrderProps) => {
    return (
        <>
            {/* Inject styles using a <style> tag */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none; 
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none; 
                }
            `}</style>
            <div className="bg-white px-2 sm:px-3 md:px-4 py-2">
                <div className="flex gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 border-b border-red-500 overflow-x-auto whitespace-nowrap snap-x snap-mandatory scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            aria-selected={activeTab === tab}
                            className={`snap-start pb-2 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium transition-all min-w-[70px] sm:min-w-[80px] md:min-w-[100px] ${activeTab === tab
                                ? "text-red-500 border-b-2 border-red-500"
                                : "text-gray-700 hover:text-red-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MenuOrder;