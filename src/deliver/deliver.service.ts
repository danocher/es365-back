import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDeliverDto } from './deliver.d';

@Injectable()
export class DeliverService {
    constructor(private readonly prisma: PrismaService){}
    async createDeliver(data: CreateDeliverDto[]){
        const deliver = await this.prisma.deliver.createMany({
            data: data,
        })
        return deliver
    }
    async getDeliverByPoint(pointId: string){
        const deliver = await this.prisma.deliver.findMany({
            where:{
                pointId: pointId
            }
        })
        return deliver
    }
    async getDeliverById(deliverId: string){
        const deliver = await this.prisma.deliver.findUnique({
            where:{
                id: deliverId
            }
        })
        return deliver
    }
    async getDeliverByProductId(productId: string){
        const deliver = await this.prisma.deliver.findMany({
            where:{
                productId: productId
            }
        })
        return deliver
    }
}
