export interface PromotionItemProps {
    promotionId?: number
    promotionCode: string
    endDate?: Date
    startDate?: Date
    promotionName?: string
    promotionType?: string
    valueType?: string
    value?: number
    valueApply?: number
    status?: boolean
}
