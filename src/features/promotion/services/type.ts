export interface PromotionItemRes {
    promotionId?: number
    promotionCode: string
    description: string
    endDate: string
    startDate: string
    promotionName: string
    promotionType: string
    valueType: number
    value: number
    valueApply: number
    status?: boolean
}
