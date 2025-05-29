import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTimetableDto } from './timetable';

@Injectable()
export class TimetableService {
    constructor(private readonly prisma:PrismaService){}
    async createTimetable(data: CreateTimetableDto, pointId: string){
        const timetable = await this.prisma.timetable.create({
            data: {
                date: data.date,
                time_start: data.time_start,
                time_end: data.time_end,
                cityId: data.cityId,
                pointId: pointId,
                managerId: data.managerId
            }
        })
        return timetable
    }
    async getTimetableByPoint(pointId: string){
        const timetable = await this.prisma.timetable.findMany({
            where:{
                pointId: pointId
            }
        })
        return timetable
    }
    async getTimetableByManagerId(managerId: string){
        const timetable = await this.prisma.timetable.findMany({
            where:{
                managerId: managerId
            }
        })
        return timetable
    }
    
}
