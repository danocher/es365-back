import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRealizationDto } from './realization.d';

@Injectable()
export class RealizationService {
    constructor(private readonly prisma: PrismaService) {}

    async createRealization(data: CreateRealizationDto){
        
        const summary = data.items.reduce(
            (sum, item) => sum + item.summ, 
            0 // Начальное значение
            );
        const realization = await this.prisma.realization.create({
            data: {
                shiftId: data.shiftId,
                pointId: data.pointId,
                clientId: data.clientId,
                date: data.date,
                summ: summary
            }
        })
        const items = await this.prisma.realizationItem.createMany({
            data: data.items.map(item => ({
                realizationId: realization.id,
                productId: item.productId,
                buy: item.buy,
                sell: item.sell,
                amount: item.amount,
                summ: item.summ
            }))
        });
        await Promise.all(
            data.items.map(item => 
                this.prisma.product.update({
                where: { id: item.productId },
                data: { 
                    amount: { decrement: item.amount } // Уменьшаем количество
                }
                })
      )
    );
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
                client:{
                    select:{
                        id:true,
                        name:true
                    }
                },
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
                shift:{
                    select:{
                        id:true,
                        manager:{
                            select:{
                                id:true,
                                user:{
                                    select:{
                                        name:true
                                    }
                                }
                            }
                        }
                    }
                },
                client:{
                    select:{
                        id:true,
                        name:true
                    }
                },
                point:true,
                items:{
                    select:{
                        id:true,
                        product:true,
                        amount:true,
                        sell:true,
                        buy:true,
                        summ:true
                    }
                    
                }
            }
        })
    }
}
