import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDeliverDto } from './deliver.d';

@Injectable()
export class DeliverService {
    constructor(private readonly prisma: PrismaService){}
    async createDeliver(data: CreateDeliverDto){
    const productsWithAmount = await Promise.all(
    data.products.map(async product => {
      const productData = await this.prisma.product.findUnique({
        where: { id: product.productId },
        select: { amount: true }
      });
      
      return {
        ...product,
        amount: productData?.amount || 0 // Используем currentAmount как amount
      };
    })
  );
    const results = await this.prisma.$transaction(
        productsWithAmount.flatMap(product => [
            this.prisma.deliver.create({
            data: {
                date: data.date,
                productId: product.productId,
                pointId: product.pointId,
                buy: product.buy,
                sell: product.sell,
                receive: product.receive,
                summ: product.summ,
                amount: product.receive + product.amount
            }
            }),
            this.prisma.product.update({
            where: { id: product.productId },
            data: { amount: { increment: product.receive } }
            })
        ])
        );
    return results;
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
