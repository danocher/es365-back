import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePointDto } from './point';

@Injectable()
export class PointService {
    constructor(private prisma: PrismaService){}
    async createPoint(data: CreatePointDto, cityId: string){
        const point = await this.prisma.point.create({
            data:{
                name: data.name,
                address: data.address,
                cityId: cityId
            }
        })
        return point
    }
    async getAllPoints(cityId: string){
        return await this.prisma.point.findMany({
            where:{
                cityId: cityId
            }
        })
    }
    async getPointById(pointId: string){
        const point = await this.prisma.point.findUnique({
            where:{
                id: pointId
            },
            include:{
                city:true,
                shifts:true,
                clients:true,
                realizations:true,
                delivers:true,
                Timetable:true
            }
        })
        if(!point){
            throw new NotFoundException('Точка не найдена')
        }
        return point
    }
}
