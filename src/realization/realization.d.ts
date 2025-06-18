export interface CreateRealizationDto {
    date: Date
    clientId: string
    shiftId: string
    pointId: string
    items:{
        productId: string
        buy: number
        sell: number
        amount: number
        summ: number
    }[]
}
