export interface CreateShiftDto {
    date_start: Date
    date_end: Date
    pointId: string
}
export interface CloseShiftDto {
    shiftId: string
    date_end: Date
}
