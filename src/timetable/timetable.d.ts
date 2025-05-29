export interface CreateTimetableDto {
    date: Date;
    time_start: string;
    time_end: string;
    cityId: string;
    pointId: string;
    managerId: string;
}