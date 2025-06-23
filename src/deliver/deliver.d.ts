export interface CreateDeliverDto {
    date: Date
    pointId: string
    products:{
        productId: string
        buy: number
        sell: number
        receive: number
        summ: number
    }[]
}