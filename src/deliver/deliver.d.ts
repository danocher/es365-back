export interface CreateDeliverDto {
    date: Date
    products:{
        productId: string
        buy: number
        sell: number
        receive: number
        pointId: string 
        summ: number
    }[]
}