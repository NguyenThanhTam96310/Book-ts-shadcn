import type { FC } from "react"

interface VoucherCardProps {
    label: string
}

const VoucherCard: FC<VoucherCardProps> = ({ label }) => {
    return (
        <div className="flex items-center border rounded-md overflow-hidden shadow-sm w-fit bg-white">
            {/* Icon răng cưa + dấu % */}
            <div className="bg-yellow-400 px-2 py-1 flex items-center justify-center">
                <div className="text-white text-xs font-bold">%</div>
            </div>

            {/* Nội dung mã giảm */}
            <div className="px-2 py-1 text-sm font-medium truncate max-w-[140px]">
                {label}
            </div>
        </div>
    )
}

export default VoucherCard
