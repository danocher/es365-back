import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRealizationDto } from './realization.d';

@Injectable()
export class RealizationService {
    constructor(private readonly prisma: PrismaService) {}

    async createRealization(data: CreateRealizationDto){
        const realization = await this.prisma.realization.create({
            data: {
                ...data,
            }
        })
        return realization
    }
    async getAllRealizations(pointId: string){
        return await this.prisma.realization.findMany({
            where:{
                pointId: pointId
            },
            select:{
                id:true,
                date:true,
                clientId:true,
                shiftId:true,
                summ:true,
                pointId:true
            }
        })
    }
    async getRealizationById(realizationId: string){
        return await this.prisma.realization.findUnique({
            where:{
                id: realizationId
            },
            include:{
                shift:true,
                client:true,
                point:true
            }
        })
    }
}
