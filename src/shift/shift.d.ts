export interface CreateShiftDto {
    date: Date
    time_start: string
    pointId: string
}
export interface CloseShiftDto {
    time_end: string
}
