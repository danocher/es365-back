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
                pointId: pointId,
                managerId: data.managerId
            }
        })
        return timetable
    }
    async getTimetableByPoint(managerId: string, dateStart:Date | string, dateEnd:Date|string){
        console.log(dateStart, typeof dateStart)
        const point = await this.prisma.manager.findUnique({
            where:{
                id:managerId,
            },
            select:{
                pointId:true
            }
        })
        const timetable = await this.prisma.timetable.findMany({
            where:{
                date:{
                        ...(dateStart!='undefined' && { gt: dateStart }), // Добавляется только если startDate есть
                        ...(dateEnd!='undefined' && { lt: dateEnd }),     // Добавляется только если endDate есть
                },
                pointId:point.pointId
            },
            include:{
                manager:{
                    select:{
                        user:{
                            select:{
                                name:true
                            }
                        }
                        
                    }
                }
            }
        })
        console.log(timetable)
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
